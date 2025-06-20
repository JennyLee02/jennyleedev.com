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

interface LeetcodeSolution {
  id: string;
  title: string;
  number: number;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  description: string;
  approach: string;
  solution: string;
  timeComplexity: string;
  timeComplexityExplanation?: string;
  spaceComplexity: string;
  spaceComplexityExplanation?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  leetcodeUrl?: string;
}

export default function LeetCodeSolutionPage() {
  const params = useParams()
  const [solution, setSolution] = useState<LeetcodeSolution | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'python' | 'cpp'>('python')

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
                {(() => {
                  const sections = solution.description.split('\n\n');
                  const mainDescription = sections[0];
                  const examples = sections.filter(section => section.toLowerCase().includes('example'));
                  const constraints = sections.find(section => section.toLowerCase().includes('constraint'));
                  const followUp = sections.find(section => section.toLowerCase().includes('follow'));

                  return (
                    <>
                      {/* Main Description */}
                      <div className="bg-muted/20 p-6 rounded-lg border">
                        <p className="text-lg leading-relaxed">
                          {mainDescription}
                        </p>
                      </div>

                      {/* Examples Section */}
                      {examples.length > 0 && (
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold">
                            Examples
                          </h3>
                          
                          {examples.map((example, index) => {
                            // Parse example content
                            const lines = example.split('\n').filter(line => line.trim());
                            const exampleNum = index + 1;
                            
                            return (
                              <div key={index} className="space-y-3">
                                <h4 className="font-medium text-foreground">
                                  Example {exampleNum}:
                                </h4>
                                <div className="bg-muted/50 border rounded-lg p-4 space-y-2">
                                  {lines.map((line, lineIndex) => {
                                    if (line.toLowerCase().includes('input:')) {
                                      const input = line.split('Input:')[1]?.trim() || line.split('input:')[1]?.trim();
                                      return (
                                        <div key={lineIndex}>
                                          <div className="text-sm text-muted-foreground mb-1">Input:</div>
                                          <code className="block bg-background border rounded px-3 py-2 text-sm font-mono">
                                            {input}
                                          </code>
                                        </div>
                                      );
                                    } else if (line.toLowerCase().includes('output:')) {
                                      const output = line.split('Output:')[1]?.trim() || line.split('output:')[1]?.trim();
                                      return (
                                        <div key={lineIndex}>
                                          <div className="text-sm text-muted-foreground mb-1">Output:</div>
                                          <code className="block bg-background border rounded px-3 py-2 text-sm font-mono">
                                            {output}
                                          </code>
                                        </div>
                                      );
                                    }
                                    return null;
                                  }).filter(Boolean)}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    )}

                      {/* Constraints */}
                      {constraints && (
                        <div className="space-y-3">
                          <h3 className="text-lg font-semibold flex items-center gap-2">
                            <span className="w-2 h-2 bg-foreground rounded-full"></span>
                            Constraints
                          </h3>
                          <div className="bg-muted/10 border rounded-lg p-4">
                            <div className="space-y-2 text-sm">
                              {constraints.split('\n').filter(line => line.trim() && !line.toLowerCase().includes('constraint')).map((constraint, index) => (
                                <div key={index} className="flex items-center gap-3">
                                  <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full flex-shrink-0"></span>
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
                      {followUp && (
                        <div className="bg-muted/20 border rounded-lg p-5">
                          <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
                            <span className="p-1 bg-muted rounded">💡</span>
                            Follow-up
                          </h3>
                          <p className="text-sm leading-relaxed text-muted-foreground">
                            {followUp.replace(/follow.{0,5}up:?\s*/i, '').trim()}
                          </p>
            </div>
                      )}

                      {/* If no structured sections found, show original description */}
                      {examples.length === 0 && !constraints && !followUp && sections.length > 1 && (
                        <div className="bg-muted/20 p-6 rounded-lg border">
                          <pre className="whitespace-pre-wrap font-sans leading-relaxed">
                            {sections.slice(1).join('\n\n')}
                          </pre>
                        </div>
                      )}
                    </>
                  );
                })()}
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
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <span>💻</span>
                Solution Code
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Language Tabs */}
              <div className="flex space-x-1 mb-4 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab('python')}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    activeTab === 'python'
                      ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  Python
                </button>
                <button
                  onClick={() => setActiveTab('cpp')}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    activeTab === 'cpp'
                      ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  C++
                </button>
              </div>

              {/* Code Content */}
              <div className="relative">
                <div className="absolute top-4 right-4 z-10">
                  <span className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                    {activeTab === 'python' ? 'Python' : 'C++'}
                  </span>
            </div>

                {activeTab === 'python' ? (
                  <pre className="bg-[#1e1e1e] text-gray-100 p-6 rounded-lg overflow-x-auto border border-gray-600">
                    <code className="text-sm leading-relaxed">
                      <span className="text-blue-400">class</span> <span className="text-yellow-300">Solution</span>:
{'\n'}    <span className="text-blue-400">def</span> <span className="text-yellow-300">twoSum</span>(<span className="text-orange-400">self</span>, <span className="text-blue-300">nums</span>: List[<span className="text-green-400">int</span>], <span className="text-blue-300">target</span>: <span className="text-green-400">int</span>) -&gt; List[<span className="text-green-400">int</span>]:
{'\n'}        <span className="text-gray-400"># Hash table to store number and its index</span>
{'\n'}        <span className="text-blue-300">num_map</span> = {'{}'}
{'\n'}        
{'\n'}        <span className="text-blue-400">for</span> <span className="text-blue-300">i</span>, <span className="text-blue-300">num</span> <span className="text-blue-400">in</span> <span className="text-yellow-300">enumerate</span>(<span className="text-blue-300">nums</span>):
{'\n'}            <span className="text-blue-300">complement</span> = <span className="text-blue-300">target</span> - <span className="text-blue-300">num</span>
{'\n'}            
{'\n'}            <span className="text-blue-400">if</span> <span className="text-blue-300">complement</span> <span className="text-blue-400">in</span> <span className="text-blue-300">num_map</span>:
{'\n'}                <span className="text-blue-400">return</span> [<span className="text-blue-300">num_map</span>[<span className="text-blue-300">complement</span>], <span className="text-blue-300">i</span>]
{'\n'}            
{'\n'}            <span className="text-blue-300">num_map</span>[<span className="text-blue-300">num</span>] = <span className="text-blue-300">i</span>
{'\n'}        
{'\n'}        <span className="text-blue-400">return</span> []
                    </code>
                  </pre>
                ) : (
                  <pre className="bg-[#1e1e1e] text-gray-100 p-6 rounded-lg overflow-x-auto border border-gray-600">
                    <code className="text-sm leading-relaxed">
                      <span className="text-blue-400">class</span> <span className="text-yellow-300">Solution</span> {'{'}
{'\n'}<span className="text-blue-400">public</span>:
{'\n'}    <span className="text-green-400">vector</span>&lt;<span className="text-green-400">int</span>&gt; <span className="text-yellow-300">twoSum</span>(<span className="text-green-400">vector</span>&lt;<span className="text-green-400">int</span>&gt;&amp; <span className="text-blue-300">nums</span>, <span className="text-green-400">int</span> <span className="text-blue-300">target</span>) {'{'}
{'\n'}        <span className="text-gray-400">// Hash map to store number and its index</span>
{'\n'}        <span className="text-green-400">unordered_map</span>&lt;<span className="text-green-400">int</span>, <span className="text-green-400">int</span>&gt; <span className="text-blue-300">numMap</span>;
{'\n'}        
{'\n'}        <span className="text-blue-400">for</span> (<span className="text-green-400">int</span> <span className="text-blue-300">i</span> = <span className="text-purple-400">0</span>; <span className="text-blue-300">i</span> &lt; <span className="text-blue-300">nums</span>.<span className="text-yellow-300">size</span>(); <span className="text-blue-300">i</span>++) {'{'}
{'\n'}            <span className="text-green-400">int</span> <span className="text-blue-300">complement</span> = <span className="text-blue-300">target</span> - <span className="text-blue-300">nums</span>[<span className="text-blue-300">i</span>];
{'\n'}            
{'\n'}            <span className="text-blue-400">if</span> (<span className="text-blue-300">numMap</span>.<span className="text-yellow-300">find</span>(<span className="text-blue-300">complement</span>) != <span className="text-blue-300">numMap</span>.<span className="text-yellow-300">end</span>()) {'{'}
{'\n'}                <span className="text-blue-400">return</span> {'{'}<span className="text-blue-300">numMap</span>[<span className="text-blue-300">complement</span>], <span className="text-blue-300">i</span>{'}'};
{'\n'}            {'}'}
{'\n'}            
{'\n'}            <span className="text-blue-300">numMap</span>[<span className="text-blue-300">nums</span>[<span className="text-blue-300">i</span>]] = <span className="text-blue-300">i</span>;
{'\n'}        {'}'}
{'\n'}        
{'\n'}        <span className="text-blue-400">return</span> {'{}'}; 
{'\n'}    {'}'}
{'\n'}{'}'};
                    </code>
                  </pre>
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

