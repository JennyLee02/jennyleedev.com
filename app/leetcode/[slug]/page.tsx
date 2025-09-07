"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, ExternalLink, Code, Target, Tag, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Chatbot from "@/components/chatbot"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface LeetcodeSolution {
  id: string;
  title: string;
  number: number;
  difficulty: string;
  category: string;
  description: string;
  examples?: {input: string; output: string; explanation?: string}[];
  constraints?: string;
  followUp?: string;
  solution?: string;
  pythonCode?: string;
  cppCode?: string;
  approach: string;
  timeComplexity: string;
  timeComplexityExplanation?: string;
  spaceComplexity: string;
  spaceComplexityExplanation?: string;
  tags: string[];
  leetcodeUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export default function LeetCodeSolutionPage() {
  const params = useParams()
  const [solution, setSolution] = useState<LeetcodeSolution | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'python' | 'cpp'>('python')

  // Set default active tab based on available code
  useEffect(() => {
    if (solution) {
      const hasPython = solution.pythonCode || solution.solution;
      const hasCpp = solution.cppCode;
      
      if (hasPython && hasCpp) {
        setActiveTab('python'); // Prefer Python when both are available
      } else if (hasCpp && !hasPython) {
        setActiveTab('cpp'); // Show C++ if only C++ is available
      } else if (hasPython) {
        setActiveTab('python'); // Show Python if only Python is available
      }
    }
  }, [solution]);

  useEffect(() => {
    const fetchSolution = async () => {
      try {
        const response = await fetch(`/api/leetcode/${params.slug}`)
        if (response.ok) {
          const data = await response.json()
          setSolution(data)
        } else {
          setError("Solution not found")
        }
      } catch (err) {
        setError("Failed to load solution")
        console.error("Error fetching solution:", err)
      } finally {
      setLoading(false)
      }
    }

    if (params.slug) {
      fetchSolution()
    }
  }, [params.slug])

  const difficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "hard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return ""
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !solution) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Solution Not Found</h1>
            <p className="text-muted-foreground mb-4">{error || "The requested solution could not be found."}</p>
            <Button asChild>
              <Link href="/leetcode">Back to Solutions</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <Button variant="ghost" className="mb-6 hover:bg-white/20" asChild>
            <Link href="/leetcode">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Solutions
            </Link>
          </Button>

            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <ExternalLink className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {solution.title}
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-300">
                    LeetCode Problem #{solution.number} • {solution.category}
                  </p>
                </div>
                </div>

              <div className="flex flex-wrap items-center gap-4 mb-6">
                <Badge className={`${difficultyColor(solution.difficulty)} text-sm py-1 px-3`}>
                  {solution.difficulty}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="h-4 w-4" />
                  {new Date(solution.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
                {solution.leetcodeUrl && (
                  <a 
                    href={solution.leetcodeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View on LeetCode
                  </a>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {solution.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-white/60 dark:bg-gray-800/60">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
            {/* Problem Description */}
          <Card className="mb-8 overflow-hidden">
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle className="text-xl flex items-center gap-3">
                <div className="p-2 bg-muted rounded-lg">
                  <Target className="h-5 w-5 text-muted-foreground" />
                    </div>
                <span>Problem Statement</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Main Description */}
                <div className="bg-muted/20 p-6 rounded-lg border">
                  <p className="text-lg leading-relaxed whitespace-pre-wrap">
                    {solution.description}
                  </p>
                </div>

                {/* Examples Section */}
                {solution.examples && solution.examples.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Examples
                    </h3>
                    
                    {solution.examples.map((example, index) => (
                      <div key={index} className="space-y-3">
                        <h4 className="font-medium text-foreground">
                          Example {index + 1}:
                        </h4>
                        <div className="bg-muted/50 border rounded-lg p-4 space-y-3">
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Input:</div>
                            <code className="block bg-background border rounded px-3 py-2 text-sm font-mono">
                              {example.input}
                            </code>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Output:</div>
                            <code className="block bg-background border rounded px-3 py-2 text-sm font-mono">
                              {example.output}
                            </code>
                          </div>
                          {example.explanation && (
                            <div>
                              <div className="text-sm text-muted-foreground mb-1">Explanation:</div>
                              <p className="text-sm text-muted-foreground">
                                {example.explanation}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Constraints */}
                {solution.constraints && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <span className="w-2 h-2 bg-foreground rounded-full"></span>
                      Constraints
                    </h3>
                    <div className="bg-muted/10 border rounded-lg p-4">
                      <div className="space-y-2 text-sm">
                        {solution.constraints.split('\n').filter(line => line.trim()).map((constraint, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full flex-shrink-0 mt-2"></span>
                            <span className="text-muted-foreground">
                              {constraint.trim().replace(/^[•\-\*]\s*/, '')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Follow-up */}
                {solution.followUp && (
                  <div className="bg-muted/20 border rounded-lg p-5">
                    <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
                      <span className="p-1 bg-muted rounded">💡</span>
                      Follow-up
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                      {solution.followUp}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Approach & Strategy */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <span>🎯</span>
                Approach & Strategy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap font-sans leading-relaxed">
                {solution.approach}
              </pre>
            </CardContent>
          </Card>

          {/* Complexity Analysis */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <span>📊</span>
                Complexity Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Time Complexity */}
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="p-4 border rounded-lg cursor-pointer hover:bg-muted/20 transition-colors group">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-red-500" />
                          <h4 className="font-semibold">Time Complexity</h4>
                        </div>
                        <Info className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                      </div>
                      <p className="text-xl font-mono font-bold text-red-600 dark:text-red-400">
                        {solution.timeComplexity}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Click to see explanation</p>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader className="pb-4">
                      <DialogTitle className="flex items-start gap-3 text-lg">
                        <Clock className="h-5 w-5 text-red-500 mt-0.5" />
                        Time Complexity: {solution.timeComplexity}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="bg-muted/20 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Why {solution.timeComplexity}?</h4>
                        <div className="text-sm text-muted-foreground space-y-2">
                          {solution.timeComplexityExplanation ? (
                            <div className="whitespace-pre-wrap">{solution.timeComplexityExplanation}</div>
                          ) : (
                            <>
                              {solution.timeComplexity === "O(n)" && (
                                <>
                                  <p>• We iterate through the array once using a hash table</p>
                                  <p>• Each hash table lookup and insertion is O(1)</p>
                                  <p>• Total: n iterations × O(1) = O(n)</p>
                                </>
                              )}
                              {solution.timeComplexity === "O(n²)" && (
                                <>
                                  <p>• Nested loops iterate through the array</p>
                                  <p>• Outer loop: n iterations</p>
                                  <p>• Inner loop: n-1, n-2, ... iterations</p>
                                  <p>• Total: n × (n-1)/2 ≈ O(n²)</p>
                                </>
                              )}
                              {solution.timeComplexity === "O(log n)" && (
                                <>
                                  <p>• Binary search divides the search space by half each time</p>
                                  <p>• Maximum comparisons: log₂(n)</p>
                                  <p>• Each comparison is O(1)</p>
                                </>
                              )}
                              {solution.timeComplexity === "O(n log n)" && (
                                <>
                                  <p>• Sorting algorithms like mergesort/heapsort</p>
                                  <p>• Divide and conquer: log n levels</p>
                                  <p>• Each level processes n elements</p>
                                  <p>• Total: n × log n = O(n log n)</p>
                                </>
                              )}
                              {!["O(n)", "O(n²)", "O(log n)", "O(n log n)"].includes(solution.timeComplexity) && (
                                <p>This complexity depends on the specific algorithm used in this solution. Check the approach section for detailed analysis.</p>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Space Complexity */}
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="p-4 border rounded-lg cursor-pointer hover:bg-muted/20 transition-colors group">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <svg className="h-4 w-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                          </svg>
                          <h4 className="font-semibold">Space Complexity</h4>
                        </div>
                        <Info className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                      </div>
                      <p className="text-xl font-mono font-bold text-purple-600 dark:text-purple-400">
                        {solution.spaceComplexity}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Click to see explanation</p>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader className="pb-4">
                      <DialogTitle className="flex items-start gap-3 text-lg">
                        <svg className="h-5 w-5 text-purple-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                        </svg>
                        Space Complexity: {solution.spaceComplexity}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="bg-muted/20 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Why {solution.spaceComplexity}?</h4>
                        <div className="text-sm text-muted-foreground space-y-2">
                          {solution.spaceComplexityExplanation ? (
                            <div className="whitespace-pre-wrap">{solution.spaceComplexityExplanation}</div>
                          ) : (
                            <>
                              {solution.spaceComplexity === "O(n)" && (
                                <>
                                  <p>• Hash table stores up to n key-value pairs</p>
                                  <p>• In worst case, we store all n elements</p>
                                  <p>• Additional variables use O(1) space</p>
                                  <p>• Total: O(n) + O(1) = O(n)</p>
                                </>
                              )}
                              {solution.spaceComplexity === "O(1)" && (
                                <>
                                  <p>• Only using a constant amount of extra variables</p>
                                  <p>• No additional data structures that grow with input</p>
                                  <p>• Space usage remains constant regardless of input size</p>
                                </>
                              )}
                              {solution.spaceComplexity === "O(log n)" && (
                                <>
                                  <p>• Recursive algorithm with log n depth</p>
                                  <p>• Each recursive call uses O(1) space</p>
                                  <p>• Call stack height: log n</p>
                                  <p>• Total: log n × O(1) = O(log n)</p>
                                </>
                              )}
                              {solution.spaceComplexity === "O(n log n)" && (
                                <>
                                  <p>• Sorting algorithm that uses additional space</p>
                                  <p>• Merge sort uses O(n) auxiliary space</p>
                                  <p>• With recursion depth of log n</p>
                                </>
                              )}
                              {!["O(n)", "O(1)", "O(log n)", "O(n log n)"].includes(solution.spaceComplexity) && (
                                <p>This space complexity depends on the specific data structures used in this solution. Check the approach section for detailed analysis.</p>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          {/* Solution Code */}
          <Card className="mb-8 overflow-hidden">
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle className="text-xl flex items-center gap-3">
                <div className="p-2 bg-muted rounded-lg">
                  <Code className="h-5 w-5 text-muted-foreground" />
                </div>
                <span>Solution Code</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {/* Only show tabs if there are multiple code options */}
              {((solution.pythonCode || solution.solution) && solution.cppCode) && (
                <div className="border-b bg-muted/10">
                  <div className="flex">
                    <button
                      onClick={() => setActiveTab('python')}
                      className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === 'python'
                          ? 'border-primary text-primary bg-background/50'
                          : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-background/20'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        🐍 Python
                      </span>
                    </button>
                    <button
                      onClick={() => setActiveTab('cpp')}
                      className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === 'cpp'
                          ? 'border-primary text-primary bg-background/50'
                          : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-background/20'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        ⚡ C++
                      </span>
                    </button>
                  </div>
                </div>
              )}

              <div className="relative">
                {/* Language badge */}
                <div className="absolute top-3 right-3 z-10">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    activeTab === 'python' 
                      ? 'bg-blue-600 text-white'
                      : 'bg-orange-600 text-white'
                  }`}>
                    {activeTab === 'python' ? '🐍 Python' : '⚡ C++'}
                  </span>
                </div>

                {/* Python Code */}
                {activeTab === 'python' && (solution.pythonCode || solution.solution) && (
                  <div className="relative">
                    <SyntaxHighlighter
                      language="python"
                      style={vscDarkPlus}
                      customStyle={{
                        margin: 0,
                        borderRadius: 0,
                        background: '#1e1e1e',
                        padding: '1.5rem',
                        fontSize: '14px',
                        lineHeight: '1.6'
                      }}
                      showLineNumbers={true}
                      lineNumberStyle={{
                        color: '#6e7681',
                        backgroundColor: '#161b22',
                        paddingRight: '1em',
                        marginRight: '1em',
                        borderRight: '1px solid #30363d'
                      }}
                    >
                      {solution.pythonCode || solution.solution || ''}
                    </SyntaxHighlighter>
                  </div>
                )}

                {/* C++ Code */}
                {activeTab === 'cpp' && solution.cppCode && (
                  <div className="relative">
                    <SyntaxHighlighter
                      language="cpp"
                      style={vscDarkPlus}
                      customStyle={{
                        margin: 0,
                        borderRadius: 0,
                        background: '#1e1e1e',
                        padding: '1.5rem',
                        fontSize: '14px',
                        lineHeight: '1.6'
                      }}
                      showLineNumbers={true}
                      lineNumberStyle={{
                        color: '#6e7681',
                        backgroundColor: '#161b22',
                        paddingRight: '1em',
                        marginRight: '1em',
                        borderRight: '1px solid #30363d'
                      }}
                    >
                      {solution.cppCode}
                    </SyntaxHighlighter>
                  </div>
                )}

                {/* Show message if no code is available at all */}
                {!solution.pythonCode && !solution.solution && !solution.cppCode && (
                  <div className="p-8 text-center text-muted-foreground bg-muted/10">
                    <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No code solution available yet</h3>
                    <p className="text-sm">The solution code will be added soon.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <div className="text-center bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 p-8 rounded-xl border border-indigo-200 dark:border-gray-600">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Ready to explore more solutions?
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
                <Link href="/leetcode">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  View All Solutions
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a 
                  href={`https://leetcode.com/problems/problem-${solution.number}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Try on LeetCode
                </a>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Study Assistant Chatbot */}
      <Chatbot 
        problemContext={{
          title: solution.title,
          difficulty: solution.difficulty,
          category: solution.category
        }}
      />
    </div>
  )
}

