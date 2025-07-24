"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, RotateCcw, Play, BookOpen, Clock, Star, Target, Zap, Hand } from "lucide-react"

// Données des définitions
const originalDefinitions = [
  {
    word: "Santé",
    definition: "État de complet bien-être physique, mental et social (OMS)",
  },
  {
    word: "Prévention",
    definition: "Mesures pour supprimer ou réduire les risques professionnels",
  },
  {
    word: "Hygiène",
    definition: "Mesures pour éviter les maladies",
  },
  {
    word: "Sécurité",
    definition: "Ensemble des actions pour éliminer un danger ou réduire ses effets",
  },
  {
    word: "Conditions de travail",
    definition: "Organisation, moyens, environnement de travail",
  },
  {
    word: "Protection",
    definition: "Moyens de lutte contre les effets d'un danger (ex : EPI, filets, etc.)",
  },
  {
    word: "Danger",
    definition: "Source potentielle de dommage",
  },
  {
    word: "Risque",
    definition: "Effet prévisible d'un accident lié à un danger",
  },
  {
    word: "Accident du travail",
    definition: "Fait accidentel causant une lésion, sur lieu ou temps de travail",
  },
  {
    word: "Accident du trajet",
    definition: "Survient pendant un aller-retour domicile-travail",
  },
  {
    word: "Maladie professionnelle",
    definition: "Résulte d'une exposition prolongée à un risque au travail",
  },
]

// Questions étendues pour le quiz
const quizQuestions = [
  {
    question: "Selon l'OMS, la santé est un état de complet bien-être physique, mental et social.",
    type: "boolean",
    answer: true,
  },
  {
    question: "Quelle est la définition de la prévention ?",
    type: "multiple",
    options: [
      "Mesures pour supprimer ou réduire les risques professionnels",
      "Moyens de lutte contre les effets d'un danger",
      "Ensemble des actions pour éliminer un danger",
    ],
    answer: 0,
  },
  {
    question: "Un danger est :",
    type: "multiple",
    options: ["L'effet prévisible d'un accident", "Une source potentielle de dommage", "Une mesure de protection"],
    answer: 1,
  },
  {
    question: "L'hygiène concerne uniquement la propreté corporelle.",
    type: "boolean",
    answer: false,
  },
  {
    question: "Un accident du trajet survient :",
    type: "multiple",
    options: [
      "Uniquement sur le lieu de travail",
      "Pendant un aller-retour domicile-travail",
      "Seulement pendant les heures de travail",
    ],
    answer: 1,
  },
  {
    question: "Les EPI sont des moyens de protection.",
    type: "boolean",
    answer: true,
  },
  {
    question: "Une maladie professionnelle résulte :",
    type: "multiple",
    options: ["D'un accident ponctuel", "D'une exposition prolongée à un risque au travail", "D'un problème personnel"],
    answer: 1,
  },
  {
    question: "Le risque et le danger sont la même chose.",
    type: "boolean",
    answer: false,
  },
  {
    question: "Les conditions de travail incluent :",
    type: "multiple",
    options: [
      "Seulement l'environnement physique",
      "Organisation, moyens, environnement de travail",
      "Uniquement les horaires",
    ],
    answer: 1,
  },
  {
    question: "La sécurité vise à éliminer un danger ou réduire ses effets.",
    type: "boolean",
    answer: true,
  },
  {
    question: "Associe le mot 'Prévention' à sa définition :",
    type: "drag",
    word: "Prévention",
    options: [
      "Mesures pour supprimer ou réduire les risques professionnels",
      "Source potentielle de dommage",
      "État de complet bien-être",
    ],
    answer: 0,
  },
  {
    question: "Associe le mot 'Danger' à sa définition :",
    type: "drag",
    word: "Danger",
    options: ["Effet prévisible d'un accident", "Source potentielle de dommage", "Mesures pour éviter les maladies"],
    answer: 1,
  },
  {
    question: "Un accident du travail peut survenir en dehors du lieu de travail.",
    type: "boolean",
    answer: true,
  },
  {
    question: "La protection individuelle est plus efficace que la protection collective.",
    type: "boolean",
    answer: false,
  },
  {
    question: "Quelle est la différence entre risque et danger ?",
    type: "multiple",
    options: [
      "Il n'y en a pas, c'est identique",
      "Le danger est la source, le risque est l'effet prévisible",
      "Le risque est plus grave que le danger",
    ],
    answer: 1,
  },
]

// Fonction pour mélanger un tableau
const shuffleArray = (array) => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default function Component() {
  const [currentPage, setCurrentPage] = useState("home")
  const [globalScore, setGlobalScore] = useState(0)
  const [globalProgress, setGlobalProgress] = useState(0)
  const [definitions, setDefinitions] = useState([])
  const [selectedWord, setSelectedWord] = useState(null) // Pour le système de clic
  const [gameState, setGameState] = useState({
    matched: new Set(),
    feedback: {},
    completed: false,
    attempts: 0,
    score: 0,
    showAnimation: null,
  })
  const [quizState, setQuizState] = useState({
    currentQuestion: 0,
    answers: [],
    score: 0,
    completed: false,
    questions: [],
    timeLeft: 180, // 3 minutes pour 9 questions
    startTime: null,
  })
  const [finalResults, setFinalResults] = useState(null)
  const timerRef = useRef(null)
  const [shuffledWords, setShuffledWords] = useState([])
  const [showExportMenu, setShowExportMenu] = useState(false)

  // Initialiser les définitions mélangées au chargement
  useEffect(() => {
    setDefinitions(shuffleArray(originalDefinitions))
  }, [])

  useEffect(() => {
    if (definitions.length > 0 && shuffledWords.length === 0) {
      setShuffledWords(shuffleArray([...definitions]))
    }
  }, [definitions, shuffledWords.length])

  // Timer pour le quiz
  useEffect(() => {
    if (currentPage === "quiz" && !quizState.completed && quizState.questions.length > 0) {
      timerRef.current = setInterval(() => {
        setQuizState((prev) => {
          if (prev.timeLeft <= 1) {
            // Temps écoulé, terminer le quiz
            const finalScore = Math.round((prev.score / prev.questions.length) * 10)
            setFinalResults({
              score: finalScore,
              totalQuestions: prev.questions.length,
              correctAnswers: prev.score,
              timeSpent: 180 - prev.timeLeft,
              answers: prev.answers,
              questions: prev.questions,
            })
            return { ...prev, timeLeft: 0, completed: true }
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 }
        })
      }, 1000)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [currentPage, quizState.completed, quizState.questions.length])

  // Calculer le progress global
  useEffect(() => {
    const gameProgress = (gameState.matched.size / definitions.length) * 50
    const quizProgress = quizState.completed
      ? 50
      : (quizState.currentQuestion / Math.max(quizState.questions.length, 1)) * 50
    setGlobalProgress(gameProgress + quizProgress)
    setGlobalScore(gameState.score + quizState.score * 2)
  }, [
    gameState.matched.size,
    gameState.score,
    quizState.currentQuestion,
    quizState.score,
    quizState.completed,
    definitions.length,
  ])

  // Initialiser le quiz avec 6 questions aléatoires
  const startQuiz = () => {
    const shuffled = [...quizQuestions].sort(() => 0.5 - Math.random())
    const selected = shuffled.slice(0, 9) // 9 questions au lieu de 6
    setQuizState({
      currentQuestion: 0,
      answers: [],
      score: 0,
      completed: false,
      questions: selected,
      timeLeft: 180, // 3 minutes pour 9 questions
      startTime: Date.now(),
    })
    setCurrentPage("quiz")
  }

  // Système de clic pour sélectionner un mot
  const handleWordClick = (word) => {
    setSelectedWord(selectedWord === word ? null : word)
  }

  // Système de clic pour associer à une définition
  const handleDefinitionClick = (targetDefinition) => {
    if (!selectedWord) return

    const isCorrect = definitions.find((d) => d.word === selectedWord && d.definition === targetDefinition)

    if (isCorrect) {
      setGameState((prev) => ({
        ...prev,
        matched: new Set([...prev.matched, selectedWord]),
        feedback: { ...prev.feedback, [targetDefinition]: "correct" },
        score: prev.score + 1,
        showAnimation: { type: "success", target: targetDefinition },
      }))

      setSelectedWord(null) // Désélectionner le mot

      // Animation de succès
      setTimeout(() => {
        setGameState((prev) => ({ ...prev, showAnimation: null }))
      }, 1000)

      // Vérifier si le jeu est terminé
      if (gameState.matched.size + 1 === definitions.length) {
        setTimeout(() => {
          setGameState((prev) => ({ ...prev, completed: true }))
        }, 1500)
      }
    } else {
      setGameState((prev) => ({
        ...prev,
        feedback: { ...prev.feedback, [targetDefinition]: "incorrect" },
        attempts: prev.attempts + 1,
        showAnimation: { type: "error", target: targetDefinition },
      }))

      // Animation d'erreur
      setTimeout(() => {
        setGameState((prev) => ({
          ...prev,
          feedback: { ...prev.feedback, [targetDefinition]: null },
          showAnimation: null,
        }))
      }, 1000)
    }
  }

  // Réinitialiser le jeu avec nouveau mélange
  const resetGame = () => {
    const newDefinitions = shuffleArray(originalDefinitions)
    setDefinitions(newDefinitions)
    setShuffledWords(shuffleArray([...newDefinitions]))
    setSelectedWord(null)
    setGameState({
      matched: new Set(),
      feedback: {},
      completed: false,
      attempts: 0,
      score: 0,
      showAnimation: null,
    })
  }

  // Gestion du quiz avec drag & drop
  const handleQuizAnswer = (answer) => {
    const currentQ = quizState.questions[quizState.currentQuestion]
    const isCorrect = answer === currentQ.answer
    const newScore = isCorrect ? quizState.score + 1 : quizState.score

    const newAnswers = [
      ...quizState.answers,
      {
        question: currentQ.question,
        answer,
        correct: isCorrect,
        correctAnswer: currentQ.answer,
        type: currentQ.type,
      },
    ]

    if (quizState.currentQuestion + 1 < quizState.questions.length) {
      setQuizState((prev) => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
        answers: newAnswers,
        score: newScore,
      }))
    } else {
      const finalScore = Math.round((newScore / quizState.questions.length) * 10)
      setFinalResults({
        score: finalScore,
        totalQuestions: quizState.questions.length,
        correctAnswers: newScore,
        timeSpent: 300 - quizState.timeLeft,
        answers: newAnswers,
        questions: quizState.questions,
      })
      setQuizState((prev) => ({
        ...prev,
        answers: newAnswers,
        score: newScore,
        completed: true,
      }))
    }
  }

  const getScoreMessage = (score) => {
    if (score >= 8) return "🏆 Expert en prévention !"
    if (score >= 6) return "✏️ En bonne voie !"
    return "🔁 Reprends la mission !"
  }

  const shareResults = async (type = "share") => {
    const gameScore = gameState.score
    const quizScore = finalResults ? finalResults.correctAnswers : 0
    const globalScore = gameScore + quizScore
    const date = new Date().toLocaleDateString("fr-FR")
    const time = new Date().toLocaleTimeString("fr-FR")

    if (type === "share") {
      // Partage natif via réseaux sociaux/apps
      const shareText = `🛡️ Mission Santé - Sécurité - Mes résultats !

📊 Scores obtenus :
• Défi'nitions : ${gameScore}/11 (${Math.round((gameScore / 11) * 100)}%)
• Quiz Expert : ${quizScore}/9 (${Math.round((quizScore / 9) * 100)}%)
• Score Global : ${globalScore}/20 (${Math.round((globalScore / 20) * 100)}%)

${getScoreMessage(finalResults?.score || 0)}

#SantéSécurité #Formation #SST`

      if (navigator.share) {
        try {
          await navigator.share({
            title: "Mission Sécurité - Mes résultats",
            text: shareText,
            url: window.location.href,
          })
        } catch (err) {
          console.log("Partage annulé")
        }
      } else {
        // Fallback pour navigateurs sans Web Share API
        const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`
        window.open(shareUrl, "_blank")
      }
    } else if (type === "copy") {
      // Copier dans le presse-papiers
      const copyText = `🛡️ MISSION SÉCURITÉ - RÉSULTATS
═══════════════════════════════════════

📊 SCORES DÉTAILLÉS
Défi'nitions: ${gameScore}/11 (${Math.round((gameScore / 11) * 100)}%)
Quiz Expert: ${quizScore}/9 (${Math.round((quizScore / 9) * 100)}%)
Score Global: ${globalScore}/20 (${Math.round((globalScore / 20) * 100)}%)

📅 Session du ${date} à ${time}
🎯 Tentatives: ${gameState.attempts}
⏱️ Temps quiz: ${finalResults ? formatTime(finalResults.timeSpent) : "0:00"}

${getScoreMessage(finalResults?.score || 0)}`

      try {
        await navigator.clipboard.writeText(copyText)
        // Afficher une notification de succès
        const notification = document.createElement("div")
        notification.textContent = "✅ Résultats copiés dans le presse-papiers !"
        notification.style.cssText = `
        position: fixed; top: 20px; right: 20px; z-index: 1000;
        background: #10B981; color: white; padding: 12px 20px;
        border-radius: 8px; font-weight: 500; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      `
        document.body.appendChild(notification)
        setTimeout(() => document.body.removeChild(notification), 3000)
      } catch (err) {
        console.error("Erreur lors de la copie:", err)
      }
    } else if (type === "csv") {
      // Export CSV pour Excel/Sheets
      const csvContent = [
        "Catégorie,Score,Total,Pourcentage,Détails",
        `Défi'nitions,${gameScore},11,${Math.round((gameScore / 11) * 100)}%,Mots associés correctement`,
        `Quiz Expert,${quizScore},9,${Math.round((quizScore / 9) * 100)}%,Bonnes réponses au quiz`,
        `Score Global,${globalScore},20,${Math.round((globalScore / 20) * 100)}%,Total des deux épreuves`,
        "",
        "Information,Valeur,,,",
        `Date,${date},,,`,
        `Heure,${time},,,`,
        `Tentatives Défi'nitions,${gameState.attempts},,,`,
        `Temps Quiz,${finalResults ? formatTime(finalResults.timeSpent) : "0:00"},,,`,
        "",
        ...(finalResults
          ? [
              "Question,Réponse Donnée,Réponse Correcte,Résultat,Type",
              ...finalResults.answers.map((answer, index) => {
                const userAnswer =
                  answer.type === "boolean"
                    ? answer.answer
                      ? "Vrai"
                      : "Faux"
                    : answer.type === "multiple"
                      ? finalResults.questions[index].options[answer.answer]
                      : answer.answer

                const correctAnswer =
                  answer.type === "boolean"
                    ? answer.correctAnswer
                      ? "Vrai"
                      : "Faux"
                    : answer.type === "multiple"
                      ? finalResults.questions[index].options[answer.correctAnswer]
                      : answer.correctAnswer

                return `"${answer.question.replace(/"/g, '""')}","${userAnswer}","${correctAnswer}",${answer.correct ? "Correct" : "Incorrect"},${answer.type}`
              }),
            ]
          : []),
      ].join("\n")

      const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `mission-securite-${new Date().toISOString().split("T")[0]}.csv`
      link.click()
      URL.revokeObjectURL(url)
    } else if (type === "report") {
      // Rapport détaillé en fichier texte
      const reportContent = `🛡️ MISSION SÉCURITÉ - RAPPORT DÉTAILLÉ
═══════════════════════════════════════════════════════════════

📋 INFORMATIONS GÉNÉRALES
Date de la session : ${date}
Heure de fin : ${time}
Durée totale estimée : ${Math.floor((gameState.attempts * 10 + (finalResults?.timeSpent || 0)) / 60)}min ${(gameState.attempts * 10 + (finalResults?.timeSpent || 0)) % 60}s

═══════════════════════════════════════════════════════════════

📊 RÉSULTATS PAR ÉPREUVE

🎯 DÉFI'NITIONS
Score obtenu : ${gameScore}/11 points
Pourcentage : ${Math.round((gameScore / 11) * 100)}%
Nombre de tentatives : ${gameState.attempts}
Statut : ${gameState.completed ? "✅ Terminé avec succès" : "⏰ Arrêté avant la fin"}

⚡ QUIZ EXPERT
Score obtenu : ${quizScore}/9 points
Pourcentage : ${Math.round((quizScore / 9) * 100)}%
Temps utilisé : ${finalResults ? formatTime(finalResults.timeSpent) : "0:00"} / 4:30
Questions réussies : ${quizScore} bonnes réponses

🏆 SCORE GLOBAL
Total : ${globalScore}/20 points
Moyenne générale : ${Math.round((globalScore / 20) * 100)}%
Évaluation : ${getScoreMessage(finalResults?.score || 0)}

═══════════════════════════════════════════════════════════════

📝 ANALYSE DÉTAILLÉE DES RÉPONSES DU QUIZ

${
  finalResults
    ? finalResults.answers
        .map((answer, index) => {
          const userAnswer =
            answer.type === "boolean"
              ? answer.answer
                ? "Vrai"
                : "Faux"
              : answer.type === "multiple"
                ? finalResults.questions[index].options[answer.answer]
                : answer.answer

          const correctAnswer =
            answer.type === "boolean"
              ? answer.correctAnswer
                ? "Vrai"
                : "Faux"
              : answer.type === "multiple"
                ? finalResults.questions[index].options[answer.correctAnswer]
                : answer.correctAnswer

          return `Question ${index + 1} : ${answer.correct ? "✅ CORRECT" : "❌ INCORRECT"}
${answer.question}

${answer.correct ? `✓ Bonne réponse : ${correctAnswer}` : `✗ Ta réponse : ${userAnswer}\n✓ Bonne réponse : ${correctAnswer}`}

${"─".repeat(60)}`
        })
        .join("\n")
    : "Aucune donnée de quiz disponible."
}

═══════════════════════════════════════════════════════════════

📈 RECOMMANDATIONS

${
  globalScore >= 16
    ? "🏆 EXCELLENT ! Tu maîtrises parfaitement les concepts de santé et sécurité au travail. Continue à maintenir ce niveau d'expertise."
    : globalScore >= 12
      ? "✏️ BIEN ! Tu as de bonnes bases. Révise les points où tu as eu des difficultés pour atteindre l'excellence."
      : "🔁 À AMÉLIORER ! Il est recommandé de revoir les concepts fondamentaux et de refaire les exercices pour consolider tes connaissances."
}

Points forts identifiés :
${gameScore >= 8 ? "• Excellente maîtrise des définitions" : "• Définitions à retravailler"}
${quizScore >= 7 ? "• Bonne application des connaissances" : "• Application pratique à améliorer"}

═══════════════════════════════════════════════════════════════

📚 RESSOURCES POUR APPROFONDIR

• Code du travail - Partie 4 : Santé et sécurité au travail
• INRS (Institut National de Recherche et de Sécurité)
• Guides de prévention par secteur d'activité
• Formation continue en SST

═══════════════════════════════════════════════════════════════

Rapport généré automatiquement par Mission Sécurité
© ${new Date().getFullYear()} - Formation Santé et Sécurité au Travail`

      const blob = new Blob([reportContent], { type: "text/plain;charset=utf-8" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `rapport-mission-securite-${new Date().toISOString().split("T")[0]}.txt`
      link.click()
      URL.revokeObjectURL(url)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Page d'accueil
  if (currentPage === "home") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-2 sm:p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header avec score global - Responsive */}
          <div className="bg-white rounded-lg shadow-lg p-3 sm:p-4 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0 mb-2">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800">Progression Globale</h2>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
                <span className="font-bold text-lg sm:text-xl text-purple-600">{globalScore} pts</span>
              </div>
            </div>
            <Progress value={globalProgress} className="h-2 sm:h-3" />
            <p className="text-xs sm:text-sm text-gray-600 mt-1">{Math.round(globalProgress)}% complété</p>
          </div>

          <div className="text-center py-4 sm:py-8">
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-2 sm:mb-4">🛡️ Mission Santé-Sécurité</h1>
            <p className="text-base sm:text-xl text-gray-600 mb-4 sm:mb-8 max-w-2xl mx-auto px-2">
              Deviens un expert en santé et sécurité au travail !
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto px-2 sm:px-0">
            <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-blue-200">
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Target className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  Défi'nitions
                </CardTitle>
                <CardDescription className="text-sm">Associe 11 mots-clés à leurs définitions</CardDescription>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <Badge variant="secondary" className="text-xs">
                    +11 points
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Button onClick={() => setCurrentPage("game")} className="w-full" size="lg">
                  <Play className="h-4 w-4 mr-2" />
                  Commencer le défi
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-purple-200">
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                  Quiz Expert
                </CardTitle>
                <CardDescription className="text-sm">9 questions chronométrées pour valider tes acquis</CardDescription>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <Badge variant="secondary" className="text-xs">
                    +9 points max
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    3 min
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Button
                  onClick={startQuiz}
                  variant="outline"
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 hover:from-purple-600 hover:to-pink-600"
                  size="lg"
                  disabled={gameState.matched.size < definitions.length && gameState.attempts < 5}
                >
                  {gameState.matched.size < definitions.length && gameState.attempts < 5 ? (
                    <>🔒 Termine d'abord le défi</>
                  ) : (
                    <>⚡ Lancer le quiz</>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // Page du jeu - Mobile responsive avec système de clic uniquement
  if (currentPage === "game") {
    const availableWords = shuffledWords.filter((d) => !gameState.matched.has(d.word))
    const canProceed = gameState.matched.size === definitions.length || gameState.attempts >= 5

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-2 sm:p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header avec stats - Mobile responsive */}
          <div className="bg-white rounded-lg shadow-lg p-3 sm:p-4 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
              <Button variant="outline" onClick={() => setCurrentPage("home")} size="sm" className="w-full sm:w-auto">
                ← Retour
              </Button>
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
                  <span className="font-bold text-lg sm:text-xl">{gameState.score} pts</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                  <span className="text-sm sm:text-base">
                    {gameState.matched.size}/{definitions.length}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                  <span className="text-sm sm:text-base">{gameState.attempts} essais</span>
                </div>
              </div>
              <Button variant="outline" onClick={resetGame} size="sm" className="w-full sm:w-auto bg-transparent">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
            <Progress value={(gameState.matched.size / definitions.length) * 100} className="mt-3 h-2" />
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 sm:mb-6">
            <div className="flex items-center gap-2 text-blue-800">
              <Hand className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-base font-medium">
                {selectedWord
                  ? `"${selectedWord}" sélectionné - Clique sur sa définition !`
                  : "Clique sur un mot puis sur sa définition"}
              </span>
            </div>
          </div>

          {gameState.completed || canProceed ? (
            <Card className="max-w-md mx-auto text-center">
              <CardHeader>
                <CardTitle className="text-green-600 text-lg sm:text-xl">
                  {gameState.completed ? "🎉 Parfait !" : "⏰ Défi terminé !"}
                </CardTitle>
                <CardDescription className="text-sm">
                  {gameState.completed
                    ? `Tu as trouvé toutes les associations ! Score: ${gameState.score}/${definitions.length}`
                    : `Tu peux maintenant passer au quiz. Score: ${gameState.score}/${definitions.length}`}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={startQuiz}
                  size="lg"
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  ⚡ Passer au quiz
                </Button>
                <Button variant="outline" onClick={resetGame} className="w-full bg-transparent">
                  🔄 Rejouer
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
              {/* Mots à sélectionner - Mobile optimized */}
              <div>
                <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-700 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />
                  Mots-clés à associer
                </h2>
                <div className="grid gap-3 sm:gap-3">
                  {availableWords.map((item) => (
                    <button
                      key={item.word}
                      onClick={() => handleWordClick(item.word)}
                      className={`bg-white p-4 sm:p-4 rounded-lg shadow-md cursor-pointer hover:shadow-xl transition-all duration-200 border-l-4 text-left w-full min-h-[60px] flex items-center ${
                        selectedWord === item.word
                          ? "border-blue-600 bg-blue-50 scale-105 shadow-lg"
                          : "border-blue-500 hover:border-blue-600 hover:scale-102"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-medium text-gray-800 text-base sm:text-base">{item.word}</span>
                        {selectedWord === item.word && (
                          <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                            ✓
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Définitions cibles - Mobile optimized */}
              <div>
                <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-700 flex items-center gap-2">
                  <Target className="h-4 w-4 sm:h-5 sm:w-5" />
                  Zones de définition
                </h2>
                <div className="grid gap-3 sm:gap-3">
                  {definitions.map((item) => {
                    const isMatched = gameState.matched.has(item.word)
                    const feedback = gameState.feedback[item.definition]
                    const showAnimation = gameState.showAnimation?.target === item.definition

                    return (
                      <button
                        key={item.definition}
                        onClick={() => handleDefinitionClick(item.definition)}
                        disabled={isMatched}
                        className={`p-4 sm:p-4 rounded-lg border-2 border-dashed transition-all duration-300 text-left w-full min-h-[80px] flex items-center ${
                          isMatched
                            ? "bg-green-50 border-green-300 shadow-lg cursor-default"
                            : feedback === "correct" || showAnimation?.type === "success"
                              ? "bg-green-50 border-green-300 animate-pulse"
                              : feedback === "incorrect" || showAnimation?.type === "error"
                                ? "bg-red-50 border-red-300 animate-bounce"
                                : selectedWord
                                  ? "bg-yellow-50 border-yellow-300 hover:border-yellow-400 hover:bg-yellow-100 cursor-pointer"
                                  : "bg-gray-50 border-gray-300 cursor-not-allowed opacity-60"
                        }`}
                      >
                        {isMatched ? (
                          <div className="flex items-start gap-3 animate-fadeIn w-full">
                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-green-800 text-base">{item.word}</div>
                              <div className="text-sm text-gray-600 break-words">{item.definition}</div>
                            </div>
                            <div className="flex-shrink-0">
                              <Badge className="bg-green-100 text-green-800 text-xs">+1 pt</Badge>
                            </div>
                          </div>
                        ) : feedback === "incorrect" || showAnimation?.type === "error" ? (
                          <div className="flex items-start gap-3 w-full">
                            <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600 text-sm break-words">{item.definition}</span>
                          </div>
                        ) : (
                          <div className="flex items-start justify-between gap-3 w-full">
                            <span className="text-gray-600 text-sm break-words flex-1">{item.definition}</span>
                            <div className="w-8 h-8 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-gray-400 text-xs">?</span>
                            </div>
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Page du quiz - Mobile responsive
  if (currentPage === "quiz") {
    if (quizState.completed && finalResults) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-2 sm:p-4">
          <div className="max-w-4xl mx-auto">
            <Card className="text-center mb-4 sm:mb-6">
              <CardHeader>
                <CardTitle className="text-2xl sm:text-3xl">🏆 Mission Accomplie !</CardTitle>
                <CardDescription>Voici ton bilan de performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div className="bg-gradient-to-br from-green-100 to-green-200 p-3 sm:p-4 rounded-lg">
                    <div className="text-2xl sm:text-3xl font-bold text-green-600">{gameState.score}/11</div>
                    <div className="text-xs sm:text-sm text-green-700">Défi'nitions</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-3 sm:p-4 rounded-lg">
                    <div className="text-2xl sm:text-3xl font-bold text-purple-600">
                      {finalResults.correctAnswers}/9
                    </div>
                    <div className="text-xs sm:text-sm text-purple-700">Quiz Expert</div>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 p-3 sm:p-4 rounded-lg">
                    <div className="text-2xl sm:text-3xl font-bold text-yellow-600">
                      {gameState.score + finalResults.correctAnswers}/20
                    </div>
                    <div className="text-xs sm:text-sm text-yellow-700">Score Global</div>
                  </div>
                </div>

                <div className="text-lg sm:text-2xl font-semibold">{getScoreMessage(finalResults.score)}</div>
              </CardContent>
            </Card>

            {/* Détail des réponses - Mobile responsive */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">📊 Détail de tes réponses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {finalResults.answers.map((answer, index) => (
                    <div
                      key={index}
                      className={`p-3 sm:p-4 rounded-lg border-l-4 ${
                        answer.correct ? "bg-green-50 border-green-400" : "bg-red-50 border-red-400"
                      }`}
                    >
                      <div className="flex items-start gap-2 sm:gap-3">
                        {answer.correct ? (
                          <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 mt-0.5 flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-800 text-sm sm:text-base break-words">
                            {answer.question}
                          </p>
                          {!answer.correct && (
                            <p className="text-xs sm:text-sm text-gray-600 mt-1 break-words">
                              <span className="text-red-600">Ta réponse:</span>{" "}
                              {answer.type === "boolean"
                                ? answer.answer
                                  ? "Vrai"
                                  : "Faux"
                                : answer.type === "multiple"
                                  ? finalResults.questions[index].options[answer.answer]
                                  : answer.answer}
                              <br />
                              <span className="text-green-600">Bonne réponse:</span>{" "}
                              {answer.type === "boolean"
                                ? answer.correctAnswer
                                  ? "Vrai"
                                  : "Faux"
                                : answer.type === "multiple"
                                  ? finalResults.questions[index].options[answer.correctAnswer]
                                  : answer.correctAnswer}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-4 sm:mt-6">
              <Button onClick={() => setCurrentPage("home")} size="lg" className="w-full sm:w-auto">
                🏠 Retour à l'accueil
              </Button>
              <Button variant="outline" onClick={startQuiz} className="w-full sm:w-auto bg-transparent">
                🔄 Refaire le quiz
              </Button>

              {/* Nouveau système de partage */}
              <div className="relative">
                <Button
                  variant="outline"
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="w-full sm:w-auto bg-transparent"
                >
                  📤 Partager mes résultats ▼
                </Button>

                {showExportMenu && (
                  <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[220px]">
                    <div className="p-2">
                      <button
                        onClick={() => {
                          shareResults("share")
                          setShowExportMenu(false)
                        }}
                        className="w-full text-left px-3 py-3 hover:bg-blue-50 rounded flex items-center gap-3 border-b border-gray-100"
                      >
                        <span className="text-lg">🚀</span>
                        <div>
                          <div className="font-medium text-sm">Partager</div>
                          <div className="text-xs text-gray-500">Via réseaux sociaux ou apps</div>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          shareResults("copy")
                          setShowExportMenu(false)
                        }}
                        className="w-full text-left px-3 py-3 hover:bg-green-50 rounded flex items-center gap-3 border-b border-gray-100"
                      >
                        <span className="text-lg">📋</span>
                        <div>
                          <div className="font-medium text-sm">Copier</div>
                          <div className="text-xs text-gray-500">Dans le presse-papiers</div>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          shareResults("csv")
                          setShowExportMenu(false)
                        }}
                        className="w-full text-left px-3 py-3 hover:bg-purple-50 rounded flex items-center gap-3 border-b border-gray-100"
                      >
                        <span className="text-lg">📊</span>
                        <div>
                          <div className="font-medium text-sm">CSV</div>
                          <div className="text-xs text-gray-500">Données pour Excel/Sheets</div>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          shareResults("report")
                          setShowExportMenu(false)
                        }}
                        className="w-full text-left px-3 py-3 hover:bg-orange-50 rounded flex items-center gap-3"
                      >
                        <span className="text-lg">📄</span>
                        <div>
                          <div className="font-medium text-sm">Rapport</div>
                          <div className="text-xs text-gray-500">Fichier texte détaillé</div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )
    }

    const currentQ = quizState.questions[quizState.currentQuestion]
    const progress = ((quizState.currentQuestion + 1) / quizState.questions.length) * 100

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-2 sm:p-4">
        <div className="max-w-2xl mx-auto">
          {/* Header avec timer et progress - Mobile responsive */}
          <div className="bg-white rounded-lg shadow-lg p-3 sm:p-4 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0 mb-3">
              <Button variant="outline" onClick={() => setCurrentPage("home")} size="sm" className="w-full sm:w-auto">
                ← Retour
              </Button>
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
                  <span
                    className={`font-mono text-base sm:text-lg ${quizState.timeLeft < 60 ? "text-red-600 animate-pulse" : "text-gray-700"}`}
                  >
                    {formatTime(quizState.timeLeft)}
                  </span>
                </div>
                <Badge variant="secondary" className="text-xs sm:text-sm">
                  Question {quizState.currentQuestion + 1}/{quizState.questions.length}
                </Badge>
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-base sm:text-xl flex items-start gap-2 sm:gap-3">
                <span className="bg-purple-100 text-purple-600 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0 mt-0.5">
                  {quizState.currentQuestion + 1}
                </span>
                <span className="break-words">{currentQ.question}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              {currentQ.type === "boolean" ? (
                <div className="space-y-3 sm:space-y-3">
                  <Button
                    onClick={() => handleQuizAnswer(true)}
                    variant="outline"
                    className="w-full justify-start hover:bg-green-50 hover:border-green-300 transition-all duration-200 min-h-[60px]"
                    size="lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        ✅
                      </div>
                      <span className="text-base">Vrai</span>
                    </div>
                  </Button>
                  <Button
                    onClick={() => handleQuizAnswer(false)}
                    variant="outline"
                    className="w-full justify-start hover:bg-red-50 hover:border-red-300 transition-all duration-200 min-h-[60px]"
                    size="lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                        ❌
                      </div>
                      <span className="text-base">Faux</span>
                    </div>
                  </Button>
                </div>
              ) : currentQ.type === "drag" ? (
                <div className="space-y-3 sm:space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg border-2 border-dashed border-blue-300">
                    <div className="text-center">
                      <div className="bg-blue-500 text-white px-4 py-2 rounded-lg inline-block font-medium text-base">
                        {currentQ.word}
                      </div>
                    </div>
                  </div>
                  <p className="text-center text-gray-600 text-base">Clique sur la bonne définition :</p>
                  <div className="space-y-3">
                    {currentQ.options.map((option, index) => (
                      <Button
                        key={index}
                        onClick={() => handleQuizAnswer(index)}
                        variant="outline"
                        className="w-full justify-start text-left h-auto p-4 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 min-h-[60px]"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span className="text-sm break-words">{option}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {currentQ.options.map((option, index) => (
                    <Button
                      key={index}
                      onClick={() => handleQuizAnswer(index)}
                      variant="outline"
                      className="w-full justify-start text-left h-auto p-4 hover:bg-purple-50 hover:border-purple-300 transition-all duration-200 min-h-[60px]"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-sm font-bold text-purple-600 flex-shrink-0 mt-0.5">
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="text-sm break-words">{option}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return null
}
