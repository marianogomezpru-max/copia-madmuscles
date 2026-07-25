import { useEffect, useMemo, useState } from 'react'
import { CATEGORIES, CATEGORY_IDS, DB_KEY, DEFAULT_DB } from './constants.js'
import { TRANSLATIONS } from './i18n.js'
import { parseNonNegativeNumber, uid } from './utils/format.js'
import { getPeriodMonthCount, getPeriodRange, inRange, isCurrentMonth, toISODate } from './utils/periods.js'
import LoginScreen from './components/LoginScreen.jsx'
import Header from './components/Header.jsx'
import CoachAlert from './components/CoachAlert.jsx'
import DashboardView from './components/DashboardView.jsx'
import ExpensesView from './components/ExpensesView.jsx'
import IncomeView from './components/IncomeView.jsx'
import ProfilesView from './components/ProfilesView.jsx'
import GoalsView from './components/GoalsView.jsx'
import SavingsInvestmentsView from './components/SavingsInvestmentsView.jsx'

const CATEGORY_GROUP = Object.fromEntries(CATEGORIES.map(c => [c.id, c.group]))

function loadDb() {
  try {
    const saved = localStorage.getItem(DB_KEY)
    if (!saved) return DEFAULT_DB
    const parsed = JSON.parse(saved)
    return { ...DEFAULT_DB, ...parsed, budgets: { ...DEFAULT_DB.budgets, ...parsed.budgets } }
  } catch {
    return DEFAULT_DB
  }
}

export default function App() {
  const [db, setDb] = useState(loadDb)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [period, setPeriod] = useState('mensual')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [newGoal, setNewGoal] = useState({ name: '', target: '', saved: '' })

  useEffect(() => {
    localStorage.setItem(DB_KEY, JSON.stringify(db))
  }, [db])

  const isLoggedIn = !!db.userProfile
  const t = TRANSLATIONS[db.language] || TRANSLATIONS.es
  const activeProfile = db.profiles.find(p => p.id === db.activeProfileId) || null
  const isAdmin = activeProfile?.role === 'admin'
  const visibleCategoryIds = !activeProfile || isAdmin || activeProfile.visibleCategories === null
    ? CATEGORY_IDS
    : activeProfile.visibleCategories

  // Real password verification + reset-by-email need the Supabase backend
  // (not wired up yet) — for now this only matches/creates a local profile
  // by email, the same trust model as the previous name-only login.
  const handleLogin = ({ fullName, email }) => {
    setDb(prev => {
      const existing = prev.profiles.find(p => (p.email || '').toLowerCase() === email.toLowerCase())
      if (existing) {
        return { ...prev, userProfile: { name: existing.name, email }, activeProfileId: existing.id }
      }
      const role = prev.profiles.length === 0 ? 'admin' : 'member'
      const newProfile = { id: uid(), name: fullName, email, role, visibleCategories: null }
      return { ...prev, userProfile: { name: fullName, email }, profiles: [...prev.profiles, newProfile], activeProfileId: newProfile.id }
    })
  }

  const handleLogout = () => setDb(prev => ({ ...prev, userProfile: null, activeProfileId: null }))
  const setLanguage = language => setDb(prev => ({ ...prev, language }))

  // Expenses
  const addExpense = ({ amount, categoryId, date, note, photo }) => {
    setDb(prev => ({
      ...prev,
      expenseTransactions: [
        ...prev.expenseTransactions,
        { id: uid(), amount, categoryId, date, note, photo: photo || null, profileId: prev.activeProfileId },
      ],
    }))
  }
  const removeExpense = id => setDb(prev => ({ ...prev, expenseTransactions: prev.expenseTransactions.filter(tx => tx.id !== id) }))

  const updateBudget = (categoryId, value) => {
    setDb(prev => {
      const budgets = { ...prev.budgets }
      if (value === '') delete budgets[categoryId]
      else budgets[categoryId] = parseNonNegativeNumber(value)
      return { ...prev, budgets }
    })
  }

  // Income
  const addFixedIncome = ({ name, amount }) =>
    setDb(prev => ({ ...prev, fixedIncomes: [...prev.fixedIncomes, { id: uid(), name, amount }] }))
  const removeFixedIncome = id =>
    setDb(prev => ({ ...prev, fixedIncomes: prev.fixedIncomes.filter(i => i.id !== id) }))
  const addVariableIncome = ({ name, amount, date }) =>
    setDb(prev => ({ ...prev, variableIncomeTransactions: [...prev.variableIncomeTransactions, { id: uid(), name, amount, date }] }))
  const removeVariableIncome = id =>
    setDb(prev => ({ ...prev, variableIncomeTransactions: prev.variableIncomeTransactions.filter(i => i.id !== id) }))

  // Profiles
  const addProfile = name => {
    setDb(prev => {
      if (prev.profiles.some(p => p.name.toLowerCase() === name.toLowerCase())) return prev
      return { ...prev, profiles: [...prev.profiles, { id: uid(), name, role: 'member', visibleCategories: null }] }
    })
  }
  const removeProfile = id => setDb(prev => ({ ...prev, profiles: prev.profiles.filter(p => p.id !== id) }))
  const toggleProfileCategory = (profileId, categoryId) => {
    setDb(prev => ({
      ...prev,
      profiles: prev.profiles.map(p => {
        if (p.id !== profileId) return p
        const current = p.visibleCategories === null ? [...CATEGORY_IDS] : [...p.visibleCategories]
        const next = current.includes(categoryId) ? current.filter(id => id !== categoryId) : [...current, categoryId]
        return { ...p, visibleCategories: next }
      }),
    }))
  }

  // Goals
  const addGoalDirect = ({ name, target, saved }) => {
    setDb(prev => ({ ...prev, goals: [...prev.goals, { id: uid(), name, target, saved: saved || 0 }] }))
  }
  const addGoal = e => {
    e.preventDefault()
    const name = newGoal.name.trim()
    const target = parseNonNegativeNumber(newGoal.target)
    const saved = parseNonNegativeNumber(newGoal.saved)
    if (name && target > 0) {
      addGoalDirect({ name, target, saved })
      setNewGoal({ name: '', target: '', saved: '' })
    }
  }
  const removeGoal = id => setDb(prev => ({ ...prev, goals: prev.goals.filter(g => g.id !== id) }))

  // Savings & Investments — each entry is dated so contributions can be
  // aggregated per period (mensual/bimestral/trimestral/semestral/anual),
  // the same pattern as expenses and variable income.
  const addSaving = ({ name, amount }) =>
    setDb(prev => ({ ...prev, savings: [...prev.savings, { id: uid(), name, amount, date: toISODate(new Date()) }] }))
  const removeSaving = id => setDb(prev => ({ ...prev, savings: prev.savings.filter(s => s.id !== id) }))
  const addInvestment = ({ type, name, amount }) =>
    setDb(prev => ({
      ...prev,
      investments: [...prev.investments, { id: uid(), type, name, amount, date: toISODate(new Date()) }],
    }))
  const removeInvestment = id => setDb(prev => ({ ...prev, investments: prev.investments.filter(i => i.id !== id) }))
  const setMonthlySavingsGoal = value => setDb(prev => ({ ...prev, monthlySavingsGoal: parseNonNegativeNumber(value) }))

  const {
    totalExpenses,
    totalIncome,
    netBalance,
    totalsByGroup,
    savingsProgress,
    savedInPeriod,
    periodSavingsGoal,
    coachAlerts,
    budgetProgress,
  } = useMemo(() => {
    const [start, end] = getPeriodRange(period)
    const visibleTx = db.expenseTransactions.filter(tx => visibleCategoryIds.includes(tx.categoryId))
    const periodTx = visibleTx.filter(tx => inRange(tx.date, start, end))

    const groupTotals = {}
    let expensesSum = 0
    periodTx.forEach(tx => {
      const group = CATEGORY_GROUP[tx.categoryId] || 'otros'
      groupTotals[group] = (groupTotals[group] || 0) + tx.amount
      expensesSum += tx.amount
    })

    const months = getPeriodMonthCount(period)
    const fixedSum = db.fixedIncomes.reduce((a, i) => a + i.amount, 0) * months
    const variableSum = db.variableIncomeTransactions
      .filter(i => inRange(i.date, start, end))
      .reduce((a, i) => a + i.amount, 0)
    const incomeSum = fixedSum + variableSum

    // Savings progress = actual money set aside this period (savings +
    // investments contributions) vs. the monthly savings goal scaled to the
    // selected period — not the Metas goals, which have their own per-goal
    // progress bars in the Metas tab.
    const periodSavingsGoal = (db.monthlySavingsGoal || 0) * months
    const savedInPeriod =
      db.savings.filter(s => inRange(s.date, start, end)).reduce((a, s) => a + s.amount, 0) +
      db.investments.filter(i => inRange(i.date, start, end)).reduce((a, i) => a + i.amount, 0)
    const savings = periodSavingsGoal > 0 ? Math.round((savedInPeriod / periodSavingsGoal) * 100) : 0

    const monthTotals = {}
    db.expenseTransactions.forEach(tx => {
      if (!isCurrentMonth(tx.date)) return
      monthTotals[tx.categoryId] = (monthTotals[tx.categoryId] || 0) + tx.amount
    })
    const alerts = Object.entries(db.budgets)
      .filter(([cat, budget]) => (monthTotals[cat] || 0) > budget)
      .map(([cat, budget]) => ({ category: t.categories[cat] || cat, diff: Math.round(monthTotals[cat] - budget) }))

    // Presupuesto vs. Real follows the selected period too: the plan (a
    // monthly budget per category) is summed across the period's months and
    // compared against what was actually spent in that same period —
    // matching mensual/bimestral/trimestral/semestral/anual like the rest
    // of the dashboard, instead of always being pinned to the current month.
    const periodCategoryTotals = {}
    periodTx.forEach(tx => {
      periodCategoryTotals[tx.categoryId] = (periodCategoryTotals[tx.categoryId] || 0) + tx.amount
    })
    const progress = CATEGORIES
      .filter(cat => db.budgets[cat.id] != null)
      .map(cat => ({
        categoryId: cat.id,
        spent: periodCategoryTotals[cat.id] || 0,
        budget: db.budgets[cat.id] * months,
      }))

    return {
      totalExpenses: expensesSum,
      totalIncome: incomeSum,
      netBalance: incomeSum - expensesSum,
      totalsByGroup: groupTotals,
      savingsProgress: savings,
      savedInPeriod,
      periodSavingsGoal,
      coachAlerts: alerts,
      budgetProgress: progress,
    }
  }, [db, period, visibleCategoryIds, t])

  if (!isLoggedIn) {
    return <LoginScreen t={t} onLogin={handleLogin} />
  }

  return (
    <div className="w-full max-w-6xl mx-auto bg-slate-50 border border-slate-200 rounded-2xl shadow-2xl overflow-hidden font-sans text-slate-800 my-2 sm:my-4">
      <Header
        t={t}
        userName={db.userProfile.name}
        language={db.language}
        onLanguageChange={setLanguage}
        onLogout={handleLogout}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      <div className="p-4 sm:p-6 space-y-6">
        <CoachAlert t={t} alerts={coachAlerts} lang={db.language} />

        {activeTab === 'dashboard' && (
          <DashboardView
            t={t}
            period={period}
            setPeriod={setPeriod}
            totalIncome={totalIncome}
            totalExpenses={totalExpenses}
            netBalance={netBalance}
            savingsProgress={savingsProgress}
            savedInPeriod={savedInPeriod}
            periodSavingsGoal={periodSavingsGoal}
            totalsByGroup={totalsByGroup}
            budgetProgress={budgetProgress}
            lang={db.language}
          />
        )}

        {activeTab === 'gastos' && (
          <ExpensesView t={t} db={db} lang={db.language} addExpense={addExpense} removeExpense={removeExpense} updateBudget={updateBudget} />
        )}

        {activeTab === 'ingresos' && (
          <IncomeView
            t={t}
            db={db}
            lang={db.language}
            addFixedIncome={addFixedIncome}
            removeFixedIncome={removeFixedIncome}
            addVariableIncome={addVariableIncome}
            removeVariableIncome={removeVariableIncome}
          />
        )}

        {activeTab === 'perfiles' && (
          <ProfilesView
            t={t}
            db={db}
            lang={db.language}
            isAdmin={isAdmin}
            addProfile={addProfile}
            removeProfile={removeProfile}
            toggleProfileCategory={toggleProfileCategory}
          />
        )}

        {activeTab === 'metas' && (
          <div className="space-y-8">
            <GoalsView
              t={t}
              db={db}
              newGoal={newGoal}
              setNewGoal={setNewGoal}
              addGoal={addGoal}
              addGoalDirect={addGoalDirect}
              removeGoal={removeGoal}
              lang={db.language}
            />
            <SavingsInvestmentsView
              t={t}
              db={db}
              lang={db.language}
              addSaving={addSaving}
              removeSaving={removeSaving}
              addInvestment={addInvestment}
              removeInvestment={removeInvestment}
              setMonthlySavingsGoal={setMonthlySavingsGoal}
            />
          </div>
        )}
      </div>
    </div>
  )
}
