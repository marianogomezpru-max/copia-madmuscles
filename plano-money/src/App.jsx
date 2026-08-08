import { useEffect, useMemo, useState } from 'react'
import { CATEGORIES, CATEGORY_IDS } from './constants.js'
import { TRANSLATIONS } from './i18n.js'
import { formatMoney, parseNonNegativeNumber } from './utils/format.js'
import { enumerateMonthKeys, getPeriodMonthKeys, getPeriodRange, inRange, isCurrentMonth, monthKey, toISODate } from './utils/periods.js'
import { supabase } from './lib/supabaseClient.js'
import { dbApi, fetchHousehold, joinHousehold } from './lib/db.js'
import { PENDING_JOIN_KEY } from './lib/pendingJoin.js'
import LoginScreen from './components/LoginScreen.jsx'
import ResetPasswordScreen from './components/ResetPasswordScreen.jsx'
import Header from './components/Header.jsx'
import BottomNav from './components/BottomNav.jsx'
import CoachAlert from './components/CoachAlert.jsx'
import DashboardView from './components/DashboardView.jsx'
import ExpensesView from './components/ExpensesView.jsx'
import IncomeView from './components/IncomeView.jsx'
import ProfilesView from './components/ProfilesView.jsx'
import GoalsView from './components/GoalsView.jsx'
import SavingsInvestmentsView from './components/SavingsInvestmentsView.jsx'
import VacationControlView from './components/VacationControlView.jsx'
import Footer from './components/Footer.jsx'
import RecursosView from './components/resources/RecursosView.jsx'

const CATEGORY_GROUP = Object.fromEntries(CATEGORIES.map(c => [c.id, c.group]))

export default function App() {
  const [session, setSession] = useState(undefined) // undefined = still checking, null = signed out
  const [passwordRecovery, setPasswordRecovery] = useState(false)
  const [db, setDb] = useState(null)
  const [loadError, setLoadError] = useState('')
  const [activeTab, setActiveTab] = useState('dashboard')
  const [vacationMode, setVacationMode] = useState(false)
  const [period, setPeriod] = useState('mensual')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [newGoal, setNewGoal] = useState({ name: '', target: '', saved: '', isFamily: true })

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (event === 'PASSWORD_RECOVERY') setPasswordRecovery(true)
      setSession(newSession)
      if (event === 'SIGNED_OUT') setDb(null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session?.user) return
    let cancelled = false
    setLoadError('')

    const load = async () => {
      // If this account signed up with an invite code but had to confirm
      // its email first, it still only has its own (empty, unused) solo
      // household at this point — finish linking it into the real one now
      // that there's an authenticated session to run the join under.
      const pending = localStorage.getItem(PENDING_JOIN_KEY)
      if (pending) {
        try {
          const { inviteCode, displayName } = JSON.parse(pending)
          await joinHousehold(inviteCode, displayName)
        } catch (err) {
          console.error('Pending household join failed:', err)
        } finally {
          localStorage.removeItem(PENDING_JOIN_KEY)
        }
      }
      const household = await fetchHousehold(session.user.id, session.user.email)
      if (!cancelled) setDb(household)
    }
    load().catch(err => {
      console.error(err)
      if (!cancelled) setLoadError(err.message || String(err))
    })

    return () => {
      cancelled = true
    }
  }, [session?.user?.id])

  // Freeze the outgoing month's plan (fixed income / budgets / savings
  // goal) into monthlySnapshots the first time the app is opened in a new
  // month, so editing those values later never rewrites how past months
  // are reported.
  useEffect(() => {
    if (!db || !session?.user || db.isMember) return
    const currentKey = monthKey(toISODate(new Date()))
    if (db.lastSeenMonth === currentKey) return

    const patch = { last_seen_month: currentKey }
    let monthlySnapshots = db.monthlySnapshots
    if (db.lastSeenMonth) {
      const closedKeys = enumerateMonthKeys(db.lastSeenMonth, currentKey).slice(0, -1)
      if (closedKeys.length > 0) {
        const snapshot = {
          fixedIncomes: db.fixedIncomes.reduce((a, i) => a + i.amount, 0),
          budgets: { ...db.budgets },
          monthlySavingsGoal: db.monthlySavingsGoal || 0,
        }
        monthlySnapshots = { ...db.monthlySnapshots }
        closedKeys.forEach(key => {
          if (!monthlySnapshots[key]) monthlySnapshots[key] = snapshot
        })
        patch.monthly_snapshots = monthlySnapshots
      }
    }
    dbApi.upsertSettings(db.householdOwnerId, patch).then(({ error }) => {
      if (error) return console.error(error)
      setDb(prev => ({ ...prev, lastSeenMonth: currentKey, monthlySnapshots }))
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db?.lastSeenMonth, session?.user?.id])

  const t = TRANSLATIONS[db?.language] || TRANSLATIONS.es
  const activeProfile = db?.profiles.find(p => p.id === db.activeProfileId) || null
  const isAdmin = activeProfile?.role === 'admin'
  // A full-access member (e.g. a spouse) sees the same household financials
  // as the admin — fixed income, budgets, savings, every category — without
  // being able to manage OTHER people's permissions the way the admin can.
  const isFullAccess = isAdmin || !!activeProfile?.fullAccess
  const visibleCategoryIds = !activeProfile || isFullAccess || activeProfile.visibleCategories === null
    ? CATEGORY_IDS
    : activeProfile.visibleCategories

  const handleLogout = () => supabase.auth.signOut()
  const setLanguage = language => {
    setDb(prev => ({ ...prev, language }))
    // Members have no write access to the household's settings row — the
    // language choice just stays a local display preference for them.
    if (isAdmin) {
      dbApi.upsertSettings(db.householdOwnerId, { language }).then(({ error }) => error && console.error(error))
    }
  }

  // Expenses. profileId lets an admin/full-access member log an expense on
  // behalf of another household member — defaults to whoever's logged in.
  // isPersonal marks it as that person's own private tracking, excluded
  // from every shared/family total.
  const addExpense = async ({ amount, categoryId, date, note, photo, profileId, isPersonal }) => {
    const { data, error } = await dbApi.addExpense(db.householdOwnerId, {
      amount, categoryId, date, note, photo, profileId: profileId || db.activeProfileId, isPersonal,
    })
    if (error) return console.error(error)
    setDb(prev => ({
      ...prev,
      expenseTransactions: [
        ...prev.expenseTransactions,
        { id: data.id, amount, categoryId, date, note, photo: photo || null, profileId: profileId || prev.activeProfileId, isPersonal: !!isPersonal },
      ],
    }))
  }
  const removeExpense = id => {
    setDb(prev => ({ ...prev, expenseTransactions: prev.expenseTransactions.filter(tx => tx.id !== id) }))
    dbApi.removeExpense(id).then(({ error }) => error && console.error(error))
  }

  const updateBudget = (categoryId, value) => {
    setDb(prev => {
      const budgets = { ...prev.budgets }
      if (value === '') delete budgets[categoryId]
      else budgets[categoryId] = parseNonNegativeNumber(value)
      return { ...prev, budgets }
    })
    if (value === '') {
      dbApi.deleteBudget(db.householdOwnerId, categoryId).then(({ error }) => error && console.error(error))
    } else {
      dbApi.upsertBudget(db.householdOwnerId, categoryId, parseNonNegativeNumber(value)).then(({ error }) => error && console.error(error))
    }
  }

  // Income
  const addFixedIncome = async ({ name, amount }) => {
    const { data, error } = await dbApi.addFixedIncome(db.householdOwnerId, { name, amount })
    if (error) return console.error(error)
    setDb(prev => ({ ...prev, fixedIncomes: [...prev.fixedIncomes, { id: data.id, name, amount }] }))
  }
  const removeFixedIncome = id => {
    setDb(prev => ({ ...prev, fixedIncomes: prev.fixedIncomes.filter(i => i.id !== id) }))
    dbApi.removeFixedIncome(id).then(({ error }) => error && console.error(error))
  }
  // Anyone in the household can log variable income under their own name
  // (allowance, a gift, a side job) — family-scoped ones count toward the
  // shared total, personal ones stay private to whoever logged them.
  const addVariableIncome = async ({ name, amount, date, isPersonal }) => {
    const profileId = db.activeProfileId
    const { data, error } = await dbApi.addVariableIncome(db.householdOwnerId, { name, amount, date, profileId, isPersonal })
    if (error) return console.error(error)
    setDb(prev => ({
      ...prev,
      variableIncomeTransactions: [...prev.variableIncomeTransactions, { id: data.id, name, amount, date, profileId, isPersonal: !!isPersonal }],
    }))
  }
  const removeVariableIncome = id => {
    setDb(prev => ({ ...prev, variableIncomeTransactions: prev.variableIncomeTransactions.filter(i => i.id !== id) }))
    dbApi.removeVariableIncome(id).then(({ error }) => error && console.error(error))
  }

  // Profiles
  const addProfile = async name => {
    if (db.profiles.some(p => p.name.toLowerCase() === name.toLowerCase())) return
    const { data, error } = await dbApi.addProfile(db.householdOwnerId, name)
    if (error) return console.error(error)
    setDb(prev => ({ ...prev, profiles: [...prev.profiles, { id: data.id, name, role: 'member', visibleCategories: null }] }))
  }
  const removeProfile = id => {
    setDb(prev => ({ ...prev, profiles: prev.profiles.filter(p => p.id !== id) }))
    dbApi.removeProfile(id).then(({ error }) => error && console.error(error))
  }
  const toggleProfileCategory = (profileId, categoryId) => {
    setDb(prev => {
      let nextVisible = null
      const profiles = prev.profiles.map(p => {
        if (p.id !== profileId) return p
        const current = p.visibleCategories === null ? [...CATEGORY_IDS] : [...p.visibleCategories]
        nextVisible = current.includes(categoryId) ? current.filter(id => id !== categoryId) : [...current, categoryId]
        return { ...p, visibleCategories: nextVisible }
      })
      dbApi.setProfileVisibleCategories(profileId, nextVisible).then(({ error }) => error && console.error(error))
      return { ...prev, profiles }
    })
  }
  const toggleProfileFullAccess = profileId => {
    setDb(prev => {
      let nextValue = false
      const profiles = prev.profiles.map(p => {
        if (p.id !== profileId) return p
        nextValue = !p.fullAccess
        return { ...p, fullAccess: nextValue }
      })
      dbApi.setProfileFullAccess(profileId, nextValue).then(({ error }) => error && console.error(error))
      return { ...prev, profiles }
    })
  }

  // Goals. profileId null = a shared "family" goal everyone in the
  // household can see and contribute to; set = a personal goal private to
  // that one profile (and the admin, who sees everything regardless).
  const addGoalDirect = async ({ name, target, saved, profileId }) => {
    const { data, error } = await dbApi.addGoal(db.householdOwnerId, { name, target, saved, profileId })
    if (error) return console.error(error)
    setDb(prev => ({ ...prev, goals: [...prev.goals, { id: data.id, name, target, saved: saved || 0, profileId: profileId || null }] }))
  }
  const addGoal = e => {
    e.preventDefault()
    const name = newGoal.name.trim()
    const target = parseNonNegativeNumber(newGoal.target)
    const saved = parseNonNegativeNumber(newGoal.saved)
    if (name && target > 0) {
      addGoalDirect({ name, target, saved, profileId: newGoal.isFamily ? null : db.activeProfileId })
      setNewGoal({ name: '', target: '', saved: '', isFamily: true })
    }
  }
  const removeGoal = id => {
    setDb(prev => ({ ...prev, goals: prev.goals.filter(g => g.id !== id) }))
    dbApi.removeGoal(id).then(({ error }) => error && console.error(error))
  }
  const addGoalContribution = (id, amount) => {
    setDb(prev => {
      const goals = prev.goals.map(g => (g.id === id ? { ...g, saved: (g.saved || 0) + amount } : g))
      const updated = goals.find(g => g.id === id)
      dbApi.setGoalSaved(id, updated.saved).then(({ error }) => error && console.error(error))
      return { ...prev, goals }
    })
  }

  // Savings & Investments — each entry is dated so contributions can be
  // aggregated per period (mensual/bimestral/trimestral/semestral/anual),
  // the same pattern as expenses and variable income.
  const addSaving = async ({ name, amount }) => {
    const date = toISODate(new Date())
    const { data, error } = await dbApi.addSaving(db.householdOwnerId, { name, amount, date })
    if (error) return console.error(error)
    setDb(prev => ({ ...prev, savings: [...prev.savings, { id: data.id, name, amount, date }] }))
  }
  const removeSaving = id => {
    setDb(prev => ({ ...prev, savings: prev.savings.filter(s => s.id !== id) }))
    dbApi.removeSaving(id).then(({ error }) => error && console.error(error))
  }
  const addInvestment = async ({ type, name, amount }) => {
    const date = toISODate(new Date())
    const { data, error } = await dbApi.addInvestment(db.householdOwnerId, { type, name, amount, date })
    if (error) return console.error(error)
    setDb(prev => ({ ...prev, investments: [...prev.investments, { id: data.id, type, name, amount, date }] }))
  }
  const removeInvestment = id => {
    setDb(prev => ({ ...prev, investments: prev.investments.filter(i => i.id !== id) }))
    dbApi.removeInvestment(id).then(({ error }) => error && console.error(error))
  }
  const setMonthlySavingsGoal = value => {
    const amount = parseNonNegativeNumber(value)
    setDb(prev => ({ ...prev, monthlySavingsGoal: amount }))
    dbApi.upsertSettings(db.householdOwnerId, { monthly_savings_goal: amount }).then(({ error }) => error && console.error(error))
  }

  // Human-readable spreadsheet of the user's own data (opens in Excel/Sheets).
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

  // Printable PDF-style report — built as an HTML page and handed to the
  // browser's own print dialog ("Save as PDF"), no PDF library needed.
  const exportPDF = () => {
    const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
    const profileName = id => db.profiles.find(p => p.id === id)?.name || ''
    const section = (title, headers, rows) => rows.length === 0 ? '' : `
      <h2>${esc(title)}</h2>
      <table>
        <thead><tr>${headers.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead>
        <tbody>${rows.map(r => `<tr>${r.map(c => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody>
      </table>`

    const html = `<!doctype html>
      <html><head><meta charset="utf-8"><title>Plano.Money — ${esc(db.userProfile?.name || '')}</title>
      <style>
        body { font-family: Arial, sans-serif; color: #1e1b4b; padding: 24px; }
        h1 { margin-bottom: 0; } .subtitle { color: #64748b; margin-top: 4px; }
        h2 { margin-top: 28px; border-bottom: 2px solid #312e81; padding-bottom: 4px; }
        table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 13px; }
        th, td { text-align: left; padding: 6px 8px; border-bottom: 1px solid #e2e8f0; }
        th { background: #f1f5f9; }
      </style></head>
      <body>
        <h1>Plano.Money</h1>
        <p class="subtitle">${esc(db.userProfile?.name || '')} · ${esc(toISODate(new Date()))}</p>
        ${section(t.csvSectionExpenses, [t.datePlaceholder, t.categoryPlaceholder, t.csvAmount, t.csvNote, t.csvProfile],
          db.expenseTransactions.map(tx => [tx.date, t.categories[tx.categoryId] || tx.categoryId, formatMoney(tx.amount, db.language), tx.note || '', profileName(tx.profileId)]))}
        ${section(t.csvSectionFixedIncome, [t.csvName, t.csvAmount], db.fixedIncomes.map(i => [i.name, formatMoney(i.amount, db.language)]))}
        ${section(t.csvSectionVariableIncome, [t.datePlaceholder, t.csvName, t.csvAmount], db.variableIncomeTransactions.map(i => [i.date, i.name, formatMoney(i.amount, db.language)]))}
        ${section(t.csvSectionSavings, [t.csvName, t.csvAmount], db.savings.map(s => [s.name, formatMoney(s.amount, db.language)]))}
        ${section(t.csvSectionInvestments, [t.csvType, t.csvName, t.csvAmount], db.investments.map(i => [t.investmentTypes[i.type] || i.type, i.name, formatMoney(i.amount, db.language)]))}
        ${section(t.csvSectionGoals, [t.csvName, t.csvTarget, t.csvSaved], db.goals.map(g => [g.name, formatMoney(g.target, db.language), formatMoney(g.saved, db.language)]))}
      </body></html>`

    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(html)
    win.document.close()
    win.focus()
    win.print()
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
    if (!db) return {}
    const [start, end] = getPeriodRange(period)
    // Personal expenses/income are that one person's own private tracking —
    // never counted in the shared family totals below, only in their own
    // "Movimientos" list (still visible there, just excluded from the math).
    const visibleTx = db.expenseTransactions.filter(tx => !tx.isPersonal && visibleCategoryIds.includes(tx.categoryId))
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
      .filter(i => !i.isPersonal && inRange(i.date, start, end))
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
      if (tx.isPersonal || !isCurrentMonth(tx.date)) return
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

  if (passwordRecovery) {
    return <ResetPasswordScreen t={t} onDone={() => setPasswordRecovery(false)} />
  }

  if (session === undefined) {
    return <div className="w-full min-h-[300px]" />
  }

  // A "Crear mi cuenta" link from a purchase email carries ?access_code=
  // and ?email= for the account it's meant to open — but if this browser
  // already has an unrelated session logged in (e.g. testing on a device
  // that's normally signed in as someone else), the checks below would
  // silently show that other account instead, since they never look at
  // the URL. Catch that mismatch here and let the person choose, instead
  // of landing them in the wrong household with no explanation.
  if (session?.user?.email) {
    const params = new URLSearchParams(window.location.search)
    const urlEmail = params.get('email')
    const urlAccessCode = params.get('access_code')
    if (urlAccessCode && urlEmail && urlEmail.toLowerCase() !== session.user.email.toLowerCase()) {
      return (
        <div className="w-full min-h-[300px] flex items-center justify-center p-6">
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-amber-200 max-w-md w-full text-center space-y-3">
            <p className="text-sm font-semibold text-navy-900">Estás conectado como {session.user.email}</p>
            <p className="text-xs text-slate-500">Este acceso es para {urlEmail}. Cerrá la sesión actual para crear o entrar a esa cuenta.</p>
            <button
              onClick={() => supabase.auth.signOut()}
              className="text-sm font-bold text-brand-600 hover:text-brand-700"
            >
              Cerrar sesión y continuar
            </button>
          </div>
        </div>
      )
    }
  }

  if (session && loadError) {
    return (
      <div className="w-full min-h-[300px] flex items-center justify-center p-6">
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-red-200 max-w-md w-full text-center space-y-3">
          <p className="text-sm font-semibold text-red-600">{t.loadErrorTitle}</p>
          <p className="text-xs text-slate-500">{loadError}</p>
          <button
            onClick={() => supabase.auth.signOut()}
            className="text-sm font-bold text-brand-600 hover:text-brand-700"
          >
            {t.loadErrorLogoutBtn}
          </button>
        </div>
      </div>
    )
  }

  if (!session || !db) {
    return <LoginScreen t={t} lang={db?.language || 'es'} />
  }

  if (db.accessSuspended) {
    return (
      <div className="w-full min-h-[300px] flex items-center justify-center p-6">
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-amber-200 max-w-md w-full text-center space-y-3">
          <p className="text-sm font-semibold text-amber-600">{t.accessSuspendedTitle}</p>
          <p className="text-xs text-slate-500">{t.accessSuspendedMessage}</p>
          <button
            onClick={() => supabase.auth.signOut()}
            className="text-sm font-bold text-brand-600 hover:text-brand-700"
          >
            {t.accessSuspendedLogoutBtn}
          </button>
        </div>
      </div>
    )
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
        onExportCSV={exportCSV}
        onExportPDF={exportPDF}
        onOpenVacationControl={isFullAccess ? () => setVacationMode(true) : undefined}
        isAdmin={isAdmin}
      />

      {vacationMode ? (
        <VacationControlView
          t={t}
          lang={db.language}
          householdOwnerId={db.householdOwnerId}
          profiles={db.profiles}
          activeProfileId={db.activeProfileId}
          onClose={() => setVacationMode(false)}
        />
      ) : (
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
            isFullAccess={isFullAccess}
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
            isFullAccess={isFullAccess}
            addFixedIncome={addFixedIncome}
            removeFixedIncome={removeFixedIncome}
            addVariableIncome={addVariableIncome}
            removeVariableIncome={removeVariableIncome}
          />
        )}

        {activeTab === 'perfiles' && isAdmin && (
          <ProfilesView
            t={t}
            db={db}
            lang={db.language}
            isAdmin={isAdmin}
            addProfile={addProfile}
            removeProfile={removeProfile}
            toggleProfileCategory={toggleProfileCategory}
            toggleProfileFullAccess={toggleProfileFullAccess}
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
              addGoalContribution={addGoalContribution}
              lang={db.language}
            />
            {isFullAccess && (
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
            )}
          </div>
        )}

        {activeTab === 'recursos' && <RecursosView />}

        <BottomNav t={t} activeTab={activeTab} setActiveTab={setActiveTab} isAdmin={isAdmin} />
        <Footer t={t} lang={db.language} />
      </div>
      )}
    </div>
  )
}
