import { useEffect, useState } from 'react'
import { DB_KEY, DEFAULT_DB } from './constants.js'
import { TRANSLATIONS } from './i18n.js'
import { parseNonNegativeNumber, uid } from './utils/format.js'
import LoginScreen from './components/LoginScreen.jsx'
import Header from './components/Header.jsx'
import CoachAlert from './components/CoachAlert.jsx'
import DashboardView from './components/DashboardView.jsx'
import ExpensesView from './components/ExpensesView.jsx'
import FamilyView from './components/FamilyView.jsx'
import GoalsView from './components/GoalsView.jsx'

function loadDb() {
  try {
    const saved = localStorage.getItem(DB_KEY)
    if (!saved) return DEFAULT_DB
    const parsed = JSON.parse(saved)
    return {
      ...DEFAULT_DB,
      ...parsed,
      expenses: { ...DEFAULT_DB.expenses, ...parsed.expenses },
      budgets: { ...DEFAULT_DB.budgets, ...parsed.budgets },
    }
  } catch {
    return DEFAULT_DB
  }
}

export default function App() {
  const [db, setDb] = useState(loadDb)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [loginName, setLoginName] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [newFamilyMemberName, setNewFamilyMemberName] = useState('')
  const [newGoal, setNewGoal] = useState({ name: '', target: '', saved: '' })

  useEffect(() => {
    localStorage.setItem(DB_KEY, JSON.stringify(db))
  }, [db])

  const isLoggedIn = !!db.userProfile
  const t = TRANSLATIONS[db.language] || TRANSLATIONS.es

  const handleLogin = e => {
    e.preventDefault()
    const name = loginName.trim()
    if (name) {
      setDb(prev => ({ ...prev, userProfile: { name } }))
      setLoginName('')
    }
  }

  const handleLogout = () => {
    setDb(prev => ({ ...prev, userProfile: null }))
  }

  const setLanguage = language => setDb(prev => ({ ...prev, language }))

  const updateExpense = (key, value) => {
    setDb(prev => ({ ...prev, expenses: { ...prev.expenses, [key]: parseNonNegativeNumber(value) } }))
  }

  const updateIncome = value => {
    setDb(prev => ({ ...prev, income: parseNonNegativeNumber(value) }))
  }

  // An empty budget means "no budget set" rather than a budget of $0 — otherwise
  // clearing the field would make the coach flag every category with any spend.
  const updateBudget = (key, value) => {
    setDb(prev => {
      const budgets = { ...prev.budgets }
      if (value === '') {
        delete budgets[key]
      } else {
        budgets[key] = parseNonNegativeNumber(value)
      }
      return { ...prev, budgets }
    })
  }

  const addFamilyMember = e => {
    e.preventDefault()
    const name = newFamilyMemberName.trim()
    if (name) {
      setDb(prev => ({ ...prev, familyMembers: [...prev.familyMembers, { id: uid(), name }] }))
      setNewFamilyMemberName('')
    }
  }

  const removeFamilyMember = id => {
    setDb(prev => ({ ...prev, familyMembers: prev.familyMembers.filter(m => m.id !== id) }))
  }

  const addGoal = e => {
    e.preventDefault()
    const name = newGoal.name.trim()
    const target = parseNonNegativeNumber(newGoal.target)
    const saved = parseNonNegativeNumber(newGoal.saved)
    if (name && target > 0) {
      setDb(prev => ({ ...prev, goals: [...prev.goals, { id: uid(), name, target, saved }] }))
      setNewGoal({ name: '', target: '', saved: '' })
    }
  }

  const removeGoal = id => {
    setDb(prev => ({ ...prev, goals: prev.goals.filter(g => g.id !== id) }))
  }

  const totalExpenses = Object.values(db.expenses).reduce((a, b) => a + (Number(b) || 0), 0)
  const netBalance = db.income - totalExpenses

  const totalGoalTarget = db.goals.reduce((a, g) => a + (Number(g.target) || 0), 0)
  const totalGoalSaved = db.goals.reduce((a, g) => a + (Number(g.saved) || 0), 0)
  const savingsProgress = totalGoalTarget > 0 ? Math.round((totalGoalSaved / totalGoalTarget) * 100) : 0

  // Only flags a category when the user set an explicit budget for it and
  // actual spend exceeds it — no synthetic threshold that would always fire.
  const getCoachAnalysis = () => {
    return Object.entries(db.budgets)
      .filter(([cat, budget]) => (db.expenses[cat] || 0) > budget)
      .map(([cat, budget]) => ({
        category: t.categories[cat] || cat,
        diff: Math.round(db.expenses[cat] - budget),
      }))
  }

  const coachAlerts = getCoachAnalysis()

  if (!isLoggedIn) {
    return <LoginScreen t={t} loginName={loginName} setLoginName={setLoginName} onSubmit={handleLogin} />
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
            db={db}
            totalExpenses={totalExpenses}
            netBalance={netBalance}
            savingsProgress={savingsProgress}
            lang={db.language}
          />
        )}

        {activeTab === 'gastos' && (
          <ExpensesView t={t} db={db} updateExpense={updateExpense} updateBudget={updateBudget} updateIncome={updateIncome} />
        )}

        {activeTab === 'familia' && (
          <FamilyView
            t={t}
            db={db}
            newFamilyMemberName={newFamilyMemberName}
            setNewFamilyMemberName={setNewFamilyMemberName}
            addFamilyMember={addFamilyMember}
            removeFamilyMember={removeFamilyMember}
          />
        )}

        {activeTab === 'metas' && (
          <GoalsView
            t={t}
            db={db}
            newGoal={newGoal}
            setNewGoal={setNewGoal}
            addGoal={addGoal}
            removeGoal={removeGoal}
            lang={db.language}
          />
        )}
      </div>
    </div>
  )
}
