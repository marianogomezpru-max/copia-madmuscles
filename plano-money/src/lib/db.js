import { supabase } from './supabaseClient.js'

// Fetches everything the current auth user can see under RLS and assembles
// it into the same shape the rest of the app already expects (the old
// localStorage `db` object) — DashboardView, ExpensesView, etc. don't need
// to change.
//
// Two very different sessions land here: the household OWNER (their own
// admin account — user_id columns equal their own auth id), and a linked
// MEMBER (someone who joined via an invite code — their auth id shows up
// as profiles.auth_user_id on a profile row that belongs to someone else's
// household). Everything downstream keys off `householdOwnerId`, which is
// the owner's id either way, not necessarily `userId` itself.
export async function fetchHousehold(userId, email) {
  const { data: allProfiles, error: profilesError } = await supabase.from('profiles').select('*').order('created_at')
  if (profilesError) throw profilesError

  const myMembership = allProfiles.find(p => p.auth_user_id === userId)
  const householdOwnerId = myMembership ? myMembership.user_id : userId
  const householdProfiles = allProfiles.filter(p => p.user_id === householdOwnerId)
  const myProfile =
    myMembership || householdProfiles.find(p => p.role === 'admin') || householdProfiles[0] || null

  const [fixedIncomes, variableIncome, expenses, budgetsRows, goals, savings, investments, settingsRow] =
    await Promise.all([
      supabase.from('fixed_incomes').select('*').eq('user_id', householdOwnerId),
      supabase.from('variable_income_transactions').select('*').eq('user_id', householdOwnerId),
      supabase.from('expense_transactions').select('*').eq('user_id', householdOwnerId),
      supabase.from('budgets').select('*').eq('user_id', householdOwnerId),
      supabase.from('goals').select('*').eq('user_id', householdOwnerId),
      supabase.from('savings').select('*').eq('user_id', householdOwnerId),
      supabase.from('investments').select('*').eq('user_id', householdOwnerId),
      supabase.from('settings').select('*').eq('user_id', householdOwnerId).maybeSingle(),
    ])

  for (const r of [fixedIncomes, variableIncome, expenses, budgetsRows, goals, savings, investments, settingsRow]) {
    if (r.error) throw r.error
  }

  const budgets = Object.fromEntries((budgetsRows.data || []).map(b => [b.category_id, Number(b.amount)]))

  return {
    householdOwnerId,
    isMember: !!myMembership,
    userProfile: { name: myProfile?.name || '', email },
    language: settingsRow.data?.language || 'es',
    inviteCode: settingsRow.data?.invite_code || null,
    accessSuspended: !!settingsRow.data?.access_suspended,
    activeProfileId: myProfile?.id || null,
    profiles: householdProfiles.map(p => ({
      id: p.id,
      name: p.name,
      role: p.role,
      visibleCategories: p.visible_categories,
      fullAccess: p.full_access,
    })),
    fixedIncomes: (fixedIncomes.data || []).map(i => ({ id: i.id, name: i.name, amount: Number(i.amount) })),
    variableIncomeTransactions: (variableIncome.data || []).map(i => ({
      id: i.id, name: i.name, amount: Number(i.amount), date: i.date, profileId: i.profile_id, isPersonal: i.is_personal,
    })),
    expenseTransactions: (expenses.data || []).map(tx => ({
      id: tx.id, amount: Number(tx.amount), categoryId: tx.category_id, date: tx.date,
      note: tx.note || '', photo: tx.photo || null, profileId: tx.profile_id, isPersonal: tx.is_personal,
    })),
    budgets,
    goals: (goals.data || []).map(g => ({
      id: g.id, name: g.name, target: Number(g.target), saved: Number(g.saved), profileId: g.profile_id,
    })),
    savings: (savings.data || []).map(s => ({ id: s.id, name: s.name, amount: Number(s.amount), date: s.date })),
    investments: (investments.data || []).map(i => ({
      id: i.id, type: i.type, name: i.name, amount: Number(i.amount), date: i.date,
    })),
    monthlySavingsGoal: Number(settingsRow.data?.monthly_savings_goal || 0),
    lastSeenMonth: settingsRow.data?.last_seen_month || null,
    monthlySnapshots: settingsRow.data?.monthly_snapshots || {},
  }
}

// Links the current auth user to someone else's household as a
// zero-visibility member (the admin opts categories in afterwards from
// Perfiles). Throws 'invalid_invite_code' or 'already_in_a_household'.
export async function joinHousehold(inviteCode, displayName) {
  const { data, error } = await supabase.rpc('join_household', {
    p_invite_code: inviteCode.trim().toLowerCase(),
    p_display_name: displayName.trim(),
  })
  if (error) throw error
  return data
}

const withOwner = (householdOwnerId, obj) => ({ ...obj, user_id: householdOwnerId })

// Control Vacaciones lives entirely outside fetchHousehold — it's a
// separate budget that never feeds into the household's regular totals,
// so it's only fetched when that screen is actually opened.
export async function fetchVacationTrips(householdOwnerId) {
  const [trips, expenses] = await Promise.all([
    supabase.from('vacation_trips').select('*').eq('user_id', householdOwnerId).order('created_at', { ascending: false }),
    supabase.from('vacation_expenses').select('*').eq('user_id', householdOwnerId),
  ])
  if (trips.error) throw trips.error
  if (expenses.error) throw expenses.error

  return (trips.data || []).map(trip => ({
    id: trip.id,
    name: trip.name,
    days: trip.days,
    budget: Number(trip.budget),
    expenses: (expenses.data || [])
      .filter(e => e.trip_id === trip.id)
      .map(e => ({
        id: e.id, categoryId: e.category_id, amount: Number(e.amount), date: e.date,
        note: e.note || '', profileId: e.profile_id,
      })),
  }))
}

export const vacationApi = {
  addTrip: (householdOwnerId, { name, days, budget }) =>
    supabase.from('vacation_trips').insert(withOwner(householdOwnerId, { name, days, budget })).select().single(),
  removeTrip: id => supabase.from('vacation_trips').delete().eq('id', id),

  addExpense: (householdOwnerId, { tripId, categoryId, amount, date, note, profileId }) =>
    supabase.from('vacation_expenses').insert(withOwner(householdOwnerId, {
      trip_id: tripId, category_id: categoryId, amount, date, note, profile_id: profileId,
    })).select().single(),
  removeExpense: id => supabase.from('vacation_expenses').delete().eq('id', id),
}

export const dbApi = {
  addExpense: (householdOwnerId, { amount, categoryId, date, note, photo, profileId, isPersonal }) =>
    supabase.from('expense_transactions').insert(withOwner(householdOwnerId, {
      amount, category_id: categoryId, date, note, photo, profile_id: profileId, is_personal: !!isPersonal,
    })).select().single(),
  removeExpense: id => supabase.from('expense_transactions').delete().eq('id', id),

  upsertBudget: (householdOwnerId, categoryId, amount) =>
    supabase.from('budgets').upsert(withOwner(householdOwnerId, { category_id: categoryId, amount })),
  deleteBudget: (householdOwnerId, categoryId) =>
    supabase.from('budgets').delete().eq('user_id', householdOwnerId).eq('category_id', categoryId),

  addFixedIncome: (householdOwnerId, { name, amount }) =>
    supabase.from('fixed_incomes').insert(withOwner(householdOwnerId, { name, amount })).select().single(),
  removeFixedIncome: id => supabase.from('fixed_incomes').delete().eq('id', id),

  addVariableIncome: (householdOwnerId, { name, amount, date, profileId, isPersonal }) =>
    supabase.from('variable_income_transactions').insert(withOwner(householdOwnerId, {
      name, amount, date, profile_id: profileId, is_personal: !!isPersonal,
    })).select().single(),
  removeVariableIncome: id => supabase.from('variable_income_transactions').delete().eq('id', id),

  addProfile: (householdOwnerId, name) =>
    supabase.from('profiles').insert(withOwner(householdOwnerId, { name, role: 'member', visible_categories: null })).select().single(),
  removeProfile: id => supabase.from('profiles').delete().eq('id', id),
  setProfileVisibleCategories: (id, visibleCategories) =>
    supabase.from('profiles').update({ visible_categories: visibleCategories }).eq('id', id),
  setProfileFullAccess: (id, fullAccess) =>
    supabase.from('profiles').update({ full_access: fullAccess }).eq('id', id),

  addGoal: (householdOwnerId, { name, target, saved, profileId }) =>
    supabase.from('goals').insert(withOwner(householdOwnerId, {
      name, target, saved: saved || 0, profile_id: profileId || null,
    })).select().single(),
  removeGoal: id => supabase.from('goals').delete().eq('id', id),
  setGoalSaved: (id, saved) => supabase.from('goals').update({ saved }).eq('id', id),

  addSaving: (householdOwnerId, { name, amount, date }) =>
    supabase.from('savings').insert(withOwner(householdOwnerId, { name, amount, date })).select().single(),
  removeSaving: id => supabase.from('savings').delete().eq('id', id),

  addInvestment: (householdOwnerId, { type, name, amount, date }) =>
    supabase.from('investments').insert(withOwner(householdOwnerId, { type, name, amount, date })).select().single(),
  removeInvestment: id => supabase.from('investments').delete().eq('id', id),

  upsertSettings: (householdOwnerId, patch) => supabase.from('settings').upsert(withOwner(householdOwnerId, patch)),
}
