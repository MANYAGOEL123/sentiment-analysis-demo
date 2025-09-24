"use client"

import { useState, useMemo } from "react" // Import useMemo
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  // Import Recharts components
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

export default function SentimentAnalyzer() {
  const [review, setReview] = useState("")
  const [sentiment, setSentiment] = useState(null)
  const [error, setError] = useState("")
  const [history, setHistory] = useState([])
  const [sentimentScores, setSentimentScores] = useState([])

  const analyzeSentiment = () => {
    if (!review.trim()) {
      setError("Please enter a review first.")
      setSentiment(null)
      return
    }

    setError("")
    const positiveWords = ["good", "great", "excellent", "love", "amazing"]
    const negativeWords = ["worst", "bad", "disappointed", "terrible"]
    const lowerCaseReview = review.toLowerCase()

    let currentSentiment = "not satisfied"
    let sentimentScore = 0

    if (positiveWords.some((word) => lowerCaseReview.includes(word))) {
      currentSentiment = "satisfied"
      sentimentScore = 1
    } else if (negativeWords.some((word) => lowerCaseReview.includes(word))) {
      currentSentiment = "not satisfied"
      sentimentScore = -1
    } else {
      currentSentiment = "not satisfied"
      sentimentScore = 0
    }

    setSentiment(currentSentiment)
    setHistory((prevHistory) => {
      const newHistory = [{ review, sentiment: currentSentiment }, ...prevHistory]
      return newHistory.slice(0, 5)
    })
    setSentimentScores((prevScores) => {
      const newScores = [...prevScores, sentimentScore]
      return newScores.slice(-5)
    })
  }

  const handleExampleReview = (exampleReview) => {
    setReview(exampleReview)
    setSentiment(null)
    setError("")
  }

  const clearHistory = () => {
    setHistory([])
    setSentimentScores([])
  }

  const { totalReviews, satisfiedCount, notSatisfiedCount, percentSatisfied, percentNotSatisfied } = useMemo(() => {
    const total = history.length
    const satisfied = history.filter((item) => item.sentiment === "satisfied").length
    const notSatisfied = total - satisfied
    const percentS = total > 0 ? ((satisfied / total) * 100).toFixed(1) : 0
    const percentNS = total > 0 ? ((notSatisfied / total) * 100).toFixed(1) : 0
    return {
      totalReviews: total,
      satisfiedCount: satisfied,
      notSatisfiedCount: notSatisfied,
      percentSatisfied: percentS,
      percentNotSatisfied: percentNS,
    }
  }, [history])

  const pieChartData = [
    { name: "Satisfied", value: satisfiedCount, color: "#22c55e" }, // green-500
    { name: "Not Satisfied", value: notSatisfiedCount, color: "#ef4444" }, // red-500
  ]

  const barChartData = sentimentScores.map((score, index) => ({
    name: `Review ${index + 1}`,
    score: score,
  }))

  const COLORS = ["#22c55e", "#ef4444"] // Colors for pie chart

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 dark:bg-gray-900">
      <header className="py-6 text-center">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">E-Commerce Review Sentiment Analyzer</h1>
      </header>

      <main className="container mx-auto flex-1 p-4">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analyze Review</CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  className="mb-4 h-40 w-full resize-none rounded-md border border-gray-300 p-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter your product review here..."
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                />
                <button
                  onClick={analyzeSentiment}
                  className="w-full rounded-md bg-blue-600 px-4 py-3 text-lg text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  Predict Sentiment
                </button>

                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <button
                    onClick={() => handleExampleReview("This product is amazing! I love it.")}
                    className="rounded-md bg-gray-200 px-3 py-1 text-sm text-gray-800 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                  >
                    Try Positive Example
                  </button>
                  <button
                    onClick={() => handleExampleReview("Worst purchase ever, very disappointed.")}
                    className="rounded-md bg-gray-200 px-3 py-1 text-sm text-gray-800 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                  >
                    Try Negative Example
                  </button>
                  <button
                    onClick={() => handleExampleReview("Decent quality, but could be better.")}
                    className="rounded-md bg-gray-200 px-3 py-1 text-sm text-gray-800 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                  >
                    Try Neutral Example
                  </button>
                </div>

                {error && <div className="mt-4 text-center text-red-500">{error}</div>}

                {sentiment && (
                  <div className="mt-6 animate-fade-in text-center text-xl font-semibold">
                    {sentiment === "satisfied" ? (
                      <span className="text-green-600 dark:text-green-400">Satisfied 😀</span>
                    ) : (
                      <span className="text-red-600 dark:text-red-400">Not Satisfied ☹️</span>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {history.length > 0 && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Recent Reviews</CardTitle>
                  <button
                    onClick={clearHistory}
                    className="rounded-md bg-red-500 px-3 py-1 text-sm text-white transition-colors hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Clear History
                  </button>
                </CardHeader>
                <CardContent className="space-y-3">
                  {history.map((item, index) => (
                    <div key={index} className="rounded-md bg-gray-50 p-3 shadow-sm dark:bg-gray-700">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-semibold">Review:</span> {item.review}
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold">Sentiment:</span>{" "}
                        {item.sentiment === "satisfied" ? (
                          <span className="text-green-600 dark:text-green-400">Satisfied 😀</span>
                        ) : (
                          <span className="text-red-600 dark:text-red-400">Not Satisfied ☹️</span>
                        )}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sentiment Statistics</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">{totalReviews}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Reviews</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{percentSatisfied}%</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Satisfied</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">{percentNotSatisfied}%</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Not Satisfied</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Overall Sentiment Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                {totalReviews > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center text-gray-600 dark:text-gray-400">No data to display yet.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Last 5 Predictions</CardTitle>
              </CardHeader>
              <CardContent>
                {sentimentScores.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={barChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[-1, 1]} />
                      <Tooltip />
                      <Bar dataKey="score" fill="#8884d8">
                        {barChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.score === 1 ? "#22c55e" : "#ef4444"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center text-gray-600 dark:text-gray-400">No data to display yet.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
