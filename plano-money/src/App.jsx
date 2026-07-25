import { useEffect, useMemo, useState } from 'react'
import { CATEGORIES, CATEGORY_IDS, DB_KEY, DEFAULT_DB } from './constants.js'
import { TRANSLATIONS } from './i18n.js'
import { parseNonNegativeNumber, uid } from './utils/format.js'
import { enumerateMonthKeys, getPeriodMonthKeys, getPeriodRange, inRange, isCurrentMonth, monthKey, toISODate } from './utils/periods.js'
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

// Shallow-merges saved/imported data over DEFAULT_DB so new fields added in
// later versions (e.g. monthlySnapshots) don't break data saved by an older
// version of the app, or a backup file exported before that field existed.
function mergeWithDefaults(parsed) {
  return { ...DEFAULT_DB, ...parsed, budgets: { ...DEFAULT_DB.budgets, ...parsed.budgets } }
}

function loadDb() {
  try {
    const saved = localStorage.getItem(DB_KEY)
    if (!saved) return DEFAULT_DB
    return mergeWithDefaults(JSON.parse(saved))
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

  // Freeze the outgoing month's plan (fixed income / budgets / savings
  // goal) into monthlySnapshots the first time the app is opened in a new
  // month, so editing those values later never rewrites how past months
  // are reported. Runs once on load; if the app wasn't opened for several
  // months, every skipped month gets the same (best-available) snapshot.
  useEffect(() => {
    const currentKey = monthKey(toISODate(new Date()))
    setDb(prev => {
      if (!prev.lastSeenMonth) return { ...prev, lastSeenMonth: currentKey }
      if (prev.lastSeenMonth === currentKey) return prev

      const closedKeys = enumerateMonthKeys(prev.lastSeenMonth, currentKey).slice(0, -1)
      if (closedKeys.length === 0) return { ...prev, lastSeenMonth: currentKey }

      const snapshot = {
        fixedIncomes: prev.fixedIncomes.reduce((a, i) => a + i.amount, 0),
        budgets: { ...prev.budgets },
        monthlySavingsGoal: prev.monthlySavingsGoal || 0,
      }
      const monthlySnapshots = { ...prev.monthlySnapshots }
      closedKeys.forEach(key => {
        if (!monthlySnapshots[key]) monthlySnapshots[key] = snapshot
      })
      return { ...prev, monthlySnapshots, lastSeenMonth: currentKey }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  // Expenses. profileId lets an admin log an expense on behalf of another
  // household member (regular members can only log their own — the form
  // only offers the picker to admins) — defaults to whoever's logged in.
  const addExpense = ({ amount, categoryId, date, note, photo, profileId }) => {
    setDb(prev => ({
      ...prev,
      expenseTransactions: [
        ...prev.expenseTransactions,
        { id: uid(), amount, categoryId, date, note, photo: photo || null, profileId: profileId || prev.activeProfileId },
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

  // Manual JSON backup: a safety net against data loss (device change,
  // browser data cleared, etc.) and the mechanism for "download my data and
  // start fresh next year" — not a substitute for real backend-backed
  // durability, which needs the Supabase backend that isn't built yet.
  const exportData = () => {
    const blob = new Blob([JSON.stringify(db, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `plano-money-backup-${toISODate(new Date())}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Human-readable spreadsheet of the user's own data (opens in Excel/Sheets)
  // — separate from the JSON backup above, which is a full app-state dump
  // meant only for restoring into Plano.Money itself.
  const exportCSV = () => {
    const profileName = id => db.profiles.find(p => p.id === id)?.name || ''
    const esc = v => `"${String(v ?? '').replace(/"/g, '""')}"`
    const row = cells => cells.map(esc).join(',')
    const lines = []

    lines.push(row([t.csvSectionExpenses]))
    lines.push(row([t.datePlaceholder, t.categoryPlaceholder, t.csvAmount, t.csvNote, t.csvProfile]))
    db.expenseTransactions.forEach(tx => {
      lines.push(row([tx.date, t.categories[tx.categoryId] || tx.categoryId, tx.amount, tx.note || '', profileName(tx.profileId)]))
    })

    lines.push('')
    lines.push(row([t.csvSectionFixedIncome]))
    lines.push(row([t.csvName, t.csvAmount]))
    db.fixedIncomes.forEach(i => lines.push(row([i.name, i.amount])))

    lines.push('')
    lines.push(row([t.csvSectionVariableIncome]))
    lines.push(row([t.datePlaceholder, t.csvName, t.csvAmount]))
    db.variableIncomeTransactions.forEach(i => lines.push(row([i.date, i.name, i.amount])))

    lines.push('')
    lines.push(row([t.csvSectionSavings]))
    lines.push(row([t.csvName, t.csvAmount]))
    db.savings.forEach(s => lines.push(row([s.name, s.amount])))

    lines.push('')
    lines.push(row([t.csvSectionInvestments]))
    lines.push(row([t.csvType, t.csvName, t.csvAmount]))
    db.investments.forEach(i => lines.push(row([t.investmentTypes[i.type] || i.type, i.name, i.amount])))

    lines.push('')
    lines.push(row([t.csvSectionGoals]))
    lines.push(row([t.csvName, t.csvTarget, t.csvSaved]))
    db.goals.forEach(g => lines.push(row([g.name, g.target, g.saved])))

    const blob = new Blob(['﻿' + lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `plano-money-datos-${toISODate(new Date())}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importData = file => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result)
        if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.expenseTransactions)) {
          throw new Error('invalid backup shape')
        }
        if (!window.confirm(t.importConfirm)) return
        setDb(mergeWithDefaults(parsed))
        alert(t.importSuccess)
      } catch {
        alert(t.importError)
      }
    }
    reader.readAsText(file)
  }

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

    // Income can change month to month, so a multi-month period must sum
    // what was actually in effect for each of its months, not today's
    // current value × month count. Closed months (before the current one)
    // pull from their frozen monthlySnapshots entry when one exists; the
    // current month, and any future months still inside the same calendar
    // block, use the live value since they haven't closed yet.
    const currentKey = monthKey(toISODate(new Date()))
    const periodMonthKeys = getPeriodMonthKeys(period)
    const liveFixedTotal = db.fixedIncomes.reduce((a, i) => a + i.amount, 0)

    let fixedSum = 0
    let savingsGoalSum = 0
    const budgetSumByCategory = {}
    periodMonthKeys.forEach(key => {
      const snap = key < currentKey ? db.monthlySnapshots[key] : null
      fixedSum += snap ? snap.fixedIncomes : liveFixedTotal
      savingsGoalSum += snap ? snap.monthlySavingsGoal : (db.monthlySavingsGoal || 0)
      const monthBudgets = snap ? snap.budgets : db.budgets
      Object.entries(monthBudgets).forEach(([catId, amount]) => {
        budgetSumByCategory[catId] = (budgetSumByCategory[catId] || 0) + amount
      })
    })

    const variableSum = db.variableIncomeTransactions
      .filter(i => inRange(i.date, start, end))
      .reduce((a, i) => a + i.amount, 0)
    const incomeSum = fixedSum + variableSum

    // Savings progress = actual money set aside this period (savings +
    // investments contributions) vs. the monthly savings goal scaled to the
    // selected period — not the Metas goals, which have their own per-goal
    // progress bars in the Metas tab.
    const periodSavingsGoal = savingsGoalSum
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
      .filter(cat => db.budgets[cat.id] != null || (periodCategoryTotals[cat.id] || 0) > 0)
      .map(cat => ({
        categoryId: cat.id,
        spent: periodCategoryTotals[cat.id] || 0,
        budget: budgetSumByCategory[cat.id] || 0,
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
        onExportData={exportData}
        onImportData={importData}
        onExportCSV={exportCSV}
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
          <ExpensesView
            t={t}
            db={db}
            lang={db.language}
            isAdmin={isAdmin}
            activeProfileId={db.activeProfileId}
            addExpense={addExpense}
            removeExpense={removeExpense}
            updateBudget={updateBudget}
          />
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
