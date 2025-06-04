"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { MarkdownEditor } from "@/components/markdown-editor"
import { PracticeQuestionsEditor, PracticeQuestion } from "@/components/practice-questions-editor"

export default function CreateDSAPostPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    category: "",
    tags: "",
    readTime: "5",
    // Content sections
    introduction: "",
    conceptDescription: "",
    approach: "",
    timeComplexity: "",
    spaceComplexity: "",
    examples: "",
    codeImplementation: "",
    conclusion: ""
  })
  const [practiceQuestions, setPracticeQuestions] = useState<PracticeQuestion[]>([])

  const categories = [
    "Dynamic Programming",
    "Graph Algorithms", 
    "Greedy Algorithms",
    "Sorting Algorithms",
    "Divide and Conquer",
    "Tree Algorithms",
    "Hash Tables",
    "Searching Algorithms",
    "Array Techniques",
    "String Algorithms",
    "Linked List Operations",
    "Stack & Queue",
    "Recursion & Backtracking",
    "Two Pointers",
    "Sliding Window",
    "Binary Search",
    "Heap & Priority Queue",
    "Trie",
    "Union Find"
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Auto-generate slug from title
    if (field === 'title') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim()
      setFormData(prev => ({
        ...prev,
        slug
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      
      // Combine all content sections into markdown
      const content = [
        formData.introduction && `## Introduction\n\n${formData.introduction}`,
        formData.conceptDescription && `## Concept Description\n\n${formData.conceptDescription}`,
        formData.approach && `## Approach\n\n${formData.approach}`,
        (formData.timeComplexity || formData.spaceComplexity) && `## Complexity Analysis\n\n${formData.timeComplexity ? `**Time Complexity:** ${formData.timeComplexity}\n\n` : ''}${formData.spaceComplexity ? `**Space Complexity:** ${formData.spaceComplexity}` : ''}`,
        formData.examples && `## Examples\n\n${formData.examples}`,
        formData.codeImplementation && `## Code Implementation\n\n${formData.codeImplementation}`,
        formData.conclusion && `## Conclusion\n\n${formData.conclusion}`
      ].filter(Boolean).join('\n\n')
      
      const response = await fetch("/api/dsa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          slug: formData.slug,
          description: formData.description,
          content,
          category: formData.category,
          tags: tagsArray,
          readTime: formData.readTime,
          practiceQuestions: practiceQuestions.length > 0 ? practiceQuestions : null,
        }),
      })

      if (response.ok) {
        router.push("/admin/dsa")
      } else {
        console.error("Failed to create DSA post")
      }
    } catch (error) {
      console.error("Error creating DSA post:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/admin/dsa" 
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to DSA Posts
          </Link>
          <h1 className="text-4xl font-bold mb-2">Create DSA Post</h1>
          <p className="text-muted-foreground">
            Create a new educational post about algorithms and data structures concepts.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title" className="mb-2 block">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., Understanding Big-O Notation"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="slug" className="mb-2 block">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    placeholder="Auto-generated from title"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="mb-2 block">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Brief description of the algorithm or data structure concept..."
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category" className="mb-2 block">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="readTime" className="mb-2 block">Read Time (minutes)</Label>
                  <Input
                    id="readTime"
                    type="number"
                    value={formData.readTime}
                    onChange={(e) => handleInputChange('readTime', e.target.value)}
                    placeholder="5"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="tags" className="mb-2 block">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => handleInputChange('tags', e.target.value)}
                  placeholder="algorithm, theory, optimization, complexity"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>📚 Introduction</CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="introduction" className="mb-2 block">Introduction & Overview</Label>
              <Textarea
                id="introduction"
                value={formData.introduction}
                onChange={(e) => handleInputChange('introduction', e.target.value)}
                placeholder="Provide an introduction to the algorithm or data structure concept..."
                rows={4}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🎯 Concept Description</CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="conceptDescription" className="mb-2 block">Detailed Concept Explanation</Label>
              <Textarea
                id="conceptDescription"
                value={formData.conceptDescription}
                onChange={(e) => handleInputChange('conceptDescription', e.target.value)}
                placeholder="Explain the core concept, how it works, and its key properties..."
                rows={6}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>⚡ Approach & Strategy</CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="approach" className="mb-2 block">Problem-Solving Approach</Label>
              <Textarea
                id="approach"
                value={formData.approach}
                onChange={(e) => handleInputChange('approach', e.target.value)}
                placeholder="Describe the approach, strategy, or methodology for implementing/using this concept..."
                rows={6}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>📊 Complexity Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="timeComplexity" className="mb-2 block">Time Complexity</Label>
                <Textarea
                  id="timeComplexity"
                  value={formData.timeComplexity}
                  onChange={(e) => handleInputChange('timeComplexity', e.target.value)}
                  placeholder="e.g., O(n log n) - Explain the time complexity and reasoning..."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="spaceComplexity" className="mb-2 block">Space Complexity</Label>
                <Textarea
                  id="spaceComplexity"
                  value={formData.spaceComplexity}
                  onChange={(e) => handleInputChange('spaceComplexity', e.target.value)}
                  placeholder="e.g., O(1) - Explain the space complexity and reasoning..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>💡 Examples</CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="examples" className="mb-2 block">Practical Examples</Label>
              <Textarea
                id="examples"
                value={formData.examples}
                onChange={(e) => handleInputChange('examples', e.target.value)}
                placeholder="Provide step-by-step examples, use cases, or demonstrations..."
                rows={6}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>💻 Code Implementation</CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="codeImplementation" className="mb-2 block">Code Examples & Implementation</Label>
              <Textarea
                id="codeImplementation"
                value={formData.codeImplementation}
                onChange={(e) => handleInputChange('codeImplementation', e.target.value)}
                placeholder="Include code snippets, implementation details, or pseudocode..."
                rows={8}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🎉 Conclusion</CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="conclusion" className="mb-2 block">Summary & Key Takeaways</Label>
              <Textarea
                id="conclusion"
                value={formData.conclusion}
                onChange={(e) => handleInputChange('conclusion', e.target.value)}
                placeholder="Summarize the key points, when to use this concept, and final thoughts..."
                rows={4}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Practice Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <PracticeQuestionsEditor
                questions={practiceQuestions}
                onChange={setPracticeQuestions}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/dsa")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Post"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 