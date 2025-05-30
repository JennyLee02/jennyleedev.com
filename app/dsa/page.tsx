"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, BookOpen, ArrowRight } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"

interface DSAPost {
  id: string
  title: string
  slug: string
  description: string
  content: string
  category: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  tags: string[]
  readTime: number
  createdAt: string
  updatedAt: string
}

export default function DSAPage() {
  const [posts, setPosts] = useState<DSAPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  // Mock data for now - later we'll fetch from API
  const mockPosts: DSAPost[] = [
    {
      id: "1",
      title: "Understanding Time and Space Complexity",
      slug: "time-space-complexity",
      description: "A comprehensive guide to analyzing algorithm efficiency using Big O notation.",
      content: "",
      category: "Fundamentals",
      difficulty: "Beginner",
      tags: ["Big O", "Complexity Analysis", "Performance"],
      readTime: 8,
      createdAt: "2024-01-15",
      updatedAt: "2024-01-15"
    },
    {
      id: "2",
      title: "Arrays and Dynamic Arrays",
      slug: "arrays-dynamic-arrays",
      description: "Deep dive into array data structures, operations, and when to use them.",
      content: "",
      category: "Data Structures",
      difficulty: "Beginner",
      tags: ["Arrays", "Dynamic Arrays", "Data Structures"],
      readTime: 12,
      createdAt: "2024-01-20",
      updatedAt: "2024-01-20"
    },
    {
      id: "3",
      title: "Binary Search Trees: Implementation and Applications",
      slug: "binary-search-trees",
      description: "Learn about BST properties, operations, and real-world applications.",
      content: "",
      category: "Data Structures",
      difficulty: "Intermediate",
      tags: ["Trees", "BST", "Search", "Insertion", "Deletion"],
      readTime: 15,
      createdAt: "2024-01-25",
      updatedAt: "2024-01-25"
    },
    {
      id: "4",
      title: "Graph Algorithms: DFS and BFS",
      slug: "graph-dfs-bfs",
      description: "Explore graph traversal algorithms and their practical implementations.",
      content: "",
      category: "Algorithms",
      difficulty: "Intermediate",
      tags: ["Graphs", "DFS", "BFS", "Traversal"],
      readTime: 18,
      createdAt: "2024-02-01",
      updatedAt: "2024-02-01"
    },
    {
      id: "5",
      title: "Dynamic Programming: From Beginner to Expert",
      slug: "dynamic-programming-guide",
      description: "Master the art of dynamic programming with examples and patterns.",
      content: "",
      category: "Algorithms",
      difficulty: "Advanced",
      tags: ["Dynamic Programming", "Optimization", "Memoization"],
      readTime: 25,
      createdAt: "2024-02-10",
      updatedAt: "2024-02-10"
    }
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPosts(mockPosts)
      setLoading(false)
    }, 500)
  }, [])

  const categories = ["all", ...Array.from(new Set(mockPosts.map(post => post.category)))]
  const filteredPosts = selectedCategory === "all" 
    ? posts 
    : posts.filter(post => post.category === selectedCategory)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800 border-green-200"
      case "Intermediate": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Advanced": return "bg-red-100 text-red-800 border-red-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto mb-12 text-center">
            <h1 className="text-4xl font-bold mb-4">Data Structures & Algorithms</h1>
            <p className="text-muted-foreground">Loading content...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Data Structures & Algorithms</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Deep dive into computer science fundamentals. Explore theoretical concepts, 
            implementation details, and practical applications of data structures and algorithms.
          </p>
        </div>

        {/* Category Filter */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {category === "all" ? "All Topics" : category}
              </button>
            ))}
          </div>
        </div>

        {/* Posts Grid */}
        <div className="max-w-6xl mx-auto">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No posts found</h3>
              <p className="text-muted-foreground">
                {selectedCategory === "all" 
                  ? "Check back later for new content!" 
                  : `No posts found in ${selectedCategory} category.`
                }
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post) => (
                <Link 
                  key={post.id} 
                  href={`/dsa/${post.slug}`}
                  className="group"
                >
                  <Card className="h-full cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-primary/50">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-xs">
                          {post.category}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getDifficultyColor(post.difficulty)}`}
                        >
                          {post.difficulty}
                        </Badge>
                      </div>
                      <CardTitle className="group-hover:text-primary transition-colors duration-300 leading-tight">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {post.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{post.readTime} min read</span>
                        </div>
                        <ArrowRight className="h-4 w-4 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {post.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{post.tags.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="max-w-4xl mx-auto mt-16 text-center">
          <div className="bg-muted/50 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Want to Suggest a Topic?</h2>
            <p className="text-muted-foreground mb-6">
              Have a specific data structure or algorithm you'd like to see explained? 
              I'm always looking for new topics to explore.
            </p>
            <Button asChild>
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
} 