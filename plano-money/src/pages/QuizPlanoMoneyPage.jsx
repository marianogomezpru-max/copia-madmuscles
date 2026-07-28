import QuizEngine from '../components/quiz/QuizEngine.jsx'
import { PLANO_MONEY_QUIZ } from '../quizzes/planoMoneyQuiz.js'

export default function QuizPlanoMoneyPage() {
  return <QuizEngine data={PLANO_MONEY_QUIZ} />
}
