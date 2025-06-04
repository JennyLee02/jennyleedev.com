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

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/dsa")
      if (response.ok) {
        const data = await response.json()
        setPosts(data)
      } else {
        setError("Failed to fetch DSA posts")
      }
    } catch (error) {
      console.error("Failed to fetch DSA posts:", error)
      setError("Failed to fetch DSA posts")
    } finally {
      setLoading(false)
    }
  }

  // Get unique categories from posts
  const categories = Array.from(new Set(posts.map(post => post.category)))

  // Filter posts based on selected category
  const filteredPosts = selectedCategory === "all" 
    ? posts 
    : posts.filter(post => post.category === selectedCategory)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto mb-12 text-center">
            <h1 className="text-4xl font-bold mb-4">Data Structures & Algorithms</h1>
            <p className="text-muted-foreground">Loading DSA posts...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto mb-12 text-center">
            <h1 className="text-4xl font-bold mb-4">Data Structures & Algorithms</h1>
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={fetchPosts}>Try Again</Button>
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
          <p className="text-muted-foreground mb-6">
            Master the fundamentals of computer science with comprehensive guides and practical examples
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <BookOpen size={16} />
              <span>{posts.length} Posts Available</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>Updated Regularly</span>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Browse by Category</h2>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                onClick={() => setSelectedCategory("all")}
                size="sm"
              >
                All Categories ({posts.length})
              </Button>
              {categories.map((category) => {
                const count = posts.filter(post => post.category === category).length
                return (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category)}
                    size="sm"
                  >
                    {category} ({count})
                  </Button>
                )
              })}
            </div>
          </div>
        )}

        {/* Posts Grid */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">
              {selectedCategory === "all" ? "No DSA posts available yet." : `No posts found in "${selectedCategory}" category.`}
            </p>
            {selectedCategory !== "all" && (
              <Button onClick={() => setSelectedCategory("all")} variant="outline">
                View All Posts
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden h-full flex flex-col group hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="outline">{post.category}</Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock size={14} className="mr-1" />
                      {post.readTime} min
                    </div>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {post.title}
                  </CardTitle>
                  <CardDescription>
                    {post.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow pt-0 flex flex-col">
                  <div className="flex flex-wrap gap-1 mb-4">
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
                  <div className="flex items-center justify-between mt-auto pt-4">
                    <div className="text-sm text-muted-foreground">
                      {formatDate(post.createdAt)}
                    </div>
                    <Link href={`/dsa/${post.slug}`}>
                      <Button size="sm" className="group/btn hover:bg-primary hover:scale-105 transition-all duration-300 hover:shadow-md">
                        Read More
                        <ArrowRight size={14} className="ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
} 