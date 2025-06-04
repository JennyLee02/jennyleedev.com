"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, RotateCcw } from "lucide-react"

export interface PracticeQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
}

interface InteractivePracticeQuestionsProps {
  questions: PracticeQuestion[]
}

export function InteractivePracticeQuestions({ questions }: InteractivePracticeQuestionsProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: number | null }>({})
  const [showResults, setShowResults] = useState<{ [key: string]: boolean }>({})

  if (!questions || questions.length === 0) {
    return null
  }

  const selectAnswer = (questionId: string, optionIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }))
  }

  const submitAnswer = (questionId: string) => {
    setShowResults(prev => ({
      ...prev,
      [questionId]: true
    }))
  }

  const resetQuestion = (questionId: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: null
    }))
    setShowResults(prev => ({
      ...prev,
      [questionId]: false
    }))
  }

  const getOptionClass = (questionId: string, optionIndex: number, isCorrect: boolean) => {
    const selected = selectedAnswers[questionId] === optionIndex
    const showResult = showResults[questionId]
    
    if (!showResult) {
      return selected 
        ? "border-primary bg-primary/10" 
        : "border-muted hover:border-primary/50 hover:bg-muted/50"
    }
    
    if (isCorrect) {
      return "border-green-500 bg-green-50 text-green-700"
    }
    
    if (selected && !isCorrect) {
      return "border-red-500 bg-red-50 text-red-700"
    }
    
    return "border-muted bg-muted/20"
  }

  const getResultIcon = (questionId: string, optionIndex: number, isCorrect: boolean) => {
    const selected = selectedAnswers[questionId] === optionIndex
    const showResult = showResults[questionId]
    
    if (!showResult) return null
    
    if (isCorrect) {
      return <CheckCircle className="h-4 w-4 text-green-600" />
    }
    
    if (selected && !isCorrect) {
      return <XCircle className="h-4 w-4 text-red-600" />
    }
    
    return null
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🧠 Practice Questions
          <Badge variant="secondary">{questions.length} question{questions.length !== 1 ? 's' : ''}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {questions.map((question, questionIndex) => {
          const questionId = question.id
          const selectedAnswer = selectedAnswers[questionId]
          const showResult = showResults[questionId]
          const isCorrect = selectedAnswer === question.correctAnswer
          
          return (
            <div key={questionId} className="space-y-4 p-4 border rounded-lg bg-background">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-lg">
                  Question {questionIndex + 1}: {question.question}
                </h3>
                {showResult && (
                  <Button
                    onClick={() => resetQuestion(questionId)}
                    variant="outline"
                    size="sm"
                    type="button"
                    className="ml-2"
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Reset
                  </Button>
                )}
              </div>
              
              <div className="space-y-2">
                {question.options.map((option, optionIndex) => {
                  const isCorrectOption = optionIndex === question.correctAnswer
                  const isSelected = selectedAnswer === optionIndex
                  
                  return (
                    <button
                      key={optionIndex}
                      onClick={() => !showResult && selectAnswer(questionId, optionIndex)}
                      disabled={showResult}
                      className={`w-full p-3 text-left border rounded-lg transition-all duration-200 flex items-center justify-between ${getOptionClass(questionId, optionIndex, isCorrectOption)}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm w-8 h-8 rounded-full border-2 border-current flex items-center justify-center">
                          {String.fromCharCode(65 + optionIndex)}
                        </span>
                        <span>{option}</span>
                      </div>
                      {getResultIcon(questionId, optionIndex, isCorrectOption)}
                    </button>
                  )
                })}
              </div>

              {!showResult && selectedAnswer !== null && (
                <div className="flex justify-end">
                  <Button onClick={() => submitAnswer(questionId)} type="button">
                    Submit Answer
                  </Button>
                </div>
              )}

              {showResult && (
                <div className="mt-4 p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    {isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    <span className="font-semibold">
                      {isCorrect ? "Correct!" : "Incorrect"}
                    </span>
                  </div>
                  
                  {!isCorrect && (
                    <p className="text-sm text-muted-foreground mb-2">
                      The correct answer is: <strong>{String.fromCharCode(65 + question.correctAnswer)}. {question.options[question.correctAnswer]}</strong>
                    </p>
                  )}
                  
                  {question.explanation && (
                    <div>
                      <p className="text-sm font-medium mb-1">Explanation:</p>
                      <p className="text-sm text-muted-foreground">{question.explanation}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
} 