import { supabase } from './supabaseClient.js'

// Fetches every table for the logged-in household and assembles it into the
// same shape the rest of the app already expects (the old localStorage `db`
// object) — DashboardView, ExpensesView, etc. don't need to change.
export async function fetchHousehold(userId, email) {
  const [profiles, fixedIncomes, variableIncome, expenses, budgetsRows, goals, savings, investments, settingsRow] =
    await Promise.all([
      supabase.from('profiles').select('*').order('created_at'),
      supabase.from('fixed_incomes').select('*'),
      supabase.from('variable_income_transactions').select('*'),
      supabase.from('expense_transactions').select('*'),
      supabase.from('budgets').select('*'),
      supabase.from('goals').select('*'),
      supabase.from('savings').select('*'),
      supabase.from('investments').select('*'),
      supabase.from('settings').select('*').maybeSingle(),
    ])

  for (const r of [profiles, fixedIncomes, variableIncome, expenses, budgetsRows, goals, savings, investments, settingsRow]) {
    if (r.error) throw r.error
  }

  const adminProfile = profiles.data.find(p => p.role === 'admin') || profiles.data[0] || null
  const budgets = Object.fromEntries((budgetsRows.data || []).map(b => [b.category_id, Number(b.amount)]))

  return {
    userProfile: { name: adminProfile?.name || '', email },
    language: settingsRow.data?.language || 'es',
    activeProfileId: adminProfile?.id || null,
    profiles: (profiles.data || []).map(p => ({
      id: p.id,
      name: p.name,
      role: p.role,
      visibleCategories: p.visible_categories,
    })),
    fixedIncomes: (fixedIncomes.data || []).map(i => ({ id: i.id, name: i.name, amount: Number(i.amount) })),
    variableIncomeTransactions: (variableIncome.data || []).map(i => ({
      id: i.id, name: i.name, amount: Number(i.amount), date: i.date,
    })),
    expenseTransactions: (expenses.data || []).map(tx => ({
      id: tx.id, amount: Number(tx.amount), categoryId: tx.category_id, date: tx.date,
      note: tx.note || '', photo: tx.photo || null, profileId: tx.profile_id,
    })),
    budgets,
    goals: (goals.data || []).map(g => ({ id: g.id, name: g.name, target: Number(g.target), saved: Number(g.saved) })),
    savings: (savings.data || []).map(s => ({ id: s.id, name: s.name, amount: Number(s.amount), date: s.date })),
    investments: (investments.data || []).map(i => ({
      id: i.id, type: i.type, name: i.name, amount: Number(i.amount), date: i.date,
    })),
    monthlySavingsGoal: Number(settingsRow.data?.monthly_savings_goal || 0),
    lastSeenMonth: settingsRow.data?.last_seen_month || null,
    monthlySnapshots: settingsRow.data?.monthly_snapshots || {},
  }
}

const withUser = (userId, obj) => ({ ...obj, user_id: userId })

export const dbApi = {
  addExpense: (userId, { amount, categoryId, date, note, photo, profileId }) =>
    supabase.from('expense_transactions').insert(withUser(userId, {
      amount, category_id: categoryId, date, note, photo, profile_id: profileId,
    })).select().single(),
  removeExpense: id => supabase.from('expense_transactions').delete().eq('id', id),

  upsertBudget: (userId, categoryId, amount) =>
    supabase.from('budgets').upsert(withUser(userId, { category_id: categoryId, amount })),
  deleteBudget: (userId, categoryId) =>
    supabase.from('budgets').delete().eq('user_id', userId).eq('category_id', categoryId),

  addFixedIncome: (userId, { name, amount }) =>
    supabase.from('fixed_incomes').insert(withUser(userId, { name, amount })).select().single(),
  removeFixedIncome: id => supabase.from('fixed_incomes').delete().eq('id', id),

  addVariableIncome: (userId, { name, amount, date }) =>
    supabase.from('variable_income_transactions').insert(withUser(userId, { name, amount, date })).select().single(),
  removeVariableIncome: id => supabase.from('variable_income_transactions').delete().eq('id', id),

  addProfile: (userId, name) =>
    supabase.from('profiles').insert(withUser(userId, { name, role: 'member', visible_categories: null })).select().single(),
  removeProfile: id => supabase.from('profiles').delete().eq('id', id),
  setProfileVisibleCategories: (id, visibleCategories) =>
    supabase.from('profiles').update({ visible_categories: visibleCategories }).eq('id', id),

  addGoal: (userId, { name, target, saved }) =>
    supabase.from('goals').insert(withUser(userId, { name, target, saved: saved || 0 })).select().single(),
  removeGoal: id => supabase.from('goals').delete().eq('id', id),
  setGoalSaved: (id, saved) => supabase.from('goals').update({ saved }).eq('id', id),

  addSaving: (userId, { name, amount, date }) =>
    supabase.from('savings').insert(withUser(userId, { name, amount, date })).select().single(),
  removeSaving: id => supabase.from('savings').delete().eq('id', id),

  addInvestment: (userId, { type, name, amount, date }) =>
    supabase.from('investments').insert(withUser(userId, { type, name, amount, date })).select().single(),
  removeInvestment: id => supabase.from('investments').delete().eq('id', id),

  upsertSettings: (userId, patch) => supabase.from('settings').upsert(withUser(userId, patch)),
}
