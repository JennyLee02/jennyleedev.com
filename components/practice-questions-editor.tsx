"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Plus } from "lucide-react"

export interface PracticeQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
}

interface PracticeQuestionsEditorProps {
  questions: PracticeQuestion[]
  onChange: (questions: PracticeQuestion[]) => void
}

export function PracticeQuestionsEditor({ questions, onChange }: PracticeQuestionsEditorProps) {
  const addQuestion = () => {
    const newQuestion: PracticeQuestion = {
      id: Date.now().toString(),
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      explanation: ""
    }
    onChange([...questions, newQuestion])
  }

  const updateQuestion = (index: number, field: keyof PracticeQuestion, value: any) => {
    const updatedQuestions = [...questions]
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value }
    onChange(updatedQuestions)
  }

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...questions]
    updatedQuestions[questionIndex].options[optionIndex] = value
    onChange(updatedQuestions)
  }

  const removeQuestion = (index: number) => {
    const updatedQuestions = questions.filter((_, i) => i !== index)
    onChange(updatedQuestions)
  }

  const addOption = (questionIndex: number) => {
    const updatedQuestions = [...questions]
    updatedQuestions[questionIndex].options.push("")
    onChange(updatedQuestions)
  }

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...questions]
    if (updatedQuestions[questionIndex].options.length > 2) {
      updatedQuestions[questionIndex].options.splice(optionIndex, 1)
      // Adjust correct answer if needed
      if (updatedQuestions[questionIndex].correctAnswer >= optionIndex) {
        updatedQuestions[questionIndex].correctAnswer = Math.max(0, updatedQuestions[questionIndex].correctAnswer - 1)
      }
      onChange(updatedQuestions)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Practice Questions
          <Button onClick={addQuestion} size="sm" type="button">
            <Plus className="h-4 w-4 mr-2" />
            Add Question
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {questions.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No practice questions yet. Click "Add Question" to get started.
          </p>
        ) : (
          questions.map((question, questionIndex) => (
            <Card key={question.id} className="border-2">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Question {questionIndex + 1}</Label>
                  <Button
                    onClick={() => removeQuestion(questionIndex)}
                    variant="outline"
                    size="sm"
                    type="button"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor={`question-${questionIndex}`}>Question</Label>
                  <Input
                    id={`question-${questionIndex}`}
                    value={question.question}
                    onChange={(e) => updateQuestion(questionIndex, 'question', e.target.value)}
                    placeholder="Enter your question here..."
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Answer Options</Label>
                    <Button
                      onClick={() => addOption(questionIndex)}
                      variant="outline"
                      size="sm"
                      type="button"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Option
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center gap-2">
                        <span className="w-8 text-sm text-muted-foreground">
                          {String.fromCharCode(65 + optionIndex)}.
                        </span>
                        <Input
                          value={option}
                          onChange={(e) => updateOption(questionIndex, optionIndex, e.target.value)}
                          placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                          className="flex-1"
                        />
                        {question.options.length > 2 && (
                          <Button
                            onClick={() => removeOption(questionIndex, optionIndex)}
                            variant="outline"
                            size="sm"
                            type="button"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor={`correct-answer-${questionIndex}`}>Correct Answer</Label>
                  <Select
                    value={question.correctAnswer.toString()}
                    onValueChange={(value) => updateQuestion(questionIndex, 'correctAnswer', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select correct answer" />
                    </SelectTrigger>
                    <SelectContent>
                      {question.options.map((option, optionIndex) => (
                        <SelectItem key={optionIndex} value={optionIndex.toString()}>
                          {String.fromCharCode(65 + optionIndex)}. {option || `Option ${String.fromCharCode(65 + optionIndex)}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor={`explanation-${questionIndex}`}>Explanation (Optional)</Label>
                  <Input
                    id={`explanation-${questionIndex}`}
                    value={question.explanation || ""}
                    onChange={(e) => updateQuestion(questionIndex, 'explanation', e.target.value)}
                    placeholder="Explain why this answer is correct..."
                  />
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </CardContent>
    </Card>
  )
} 