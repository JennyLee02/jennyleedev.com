"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function LeetcodePage() {
  const [activeCategory, setActiveCategory] = useState("all")

  const categories = [
    { id: "all", name: "All Problems" },
    { id: "arrays", name: "Arrays" },
    { id: "strings", name: "Strings" },
    { id: "linked-lists", name: "Linked Lists" },
    { id: "trees", name: "Trees" },
    { id: "graphs", name: "Graphs" },
    { id: "dp", name: "Dynamic Programming" },
    { id: "hash", name: "Hash Tables" },
  ]

  const leetcodePosts = [
    {
      id: 1,
      title: "Two Sum - Efficient Solution",
      description: "An efficient O(n) solution to the classic Two Sum problem using hash maps.",
      date: "March 15, 2023",
      difficulty: "Easy",
      categories: ["arrays", "hash"],
      tags: ["Arrays", "Hash Table"],
      slug: "two-sum",
    },
    {
      id: 2,
      title: "Merge K Sorted Lists",
      description: "A detailed explanation of how to merge k sorted linked lists efficiently using a priority queue.",
      date: "February 28, 2023",
      difficulty: "Hard",
      categories: ["linked-lists", "heap"],
      tags: ["Linked List", "Divide and Conquer", "Heap"],
      slug: "merge-k-sorted-lists",
    },
    {
      id: 3,
      title: "LRU Cache Implementation",
      description: "How to implement an LRU Cache with O(1) time complexity for both get and put operations.",
      date: "January 20, 2023",
      difficulty: "Medium",
      categories: ["hash", "linked-lists"],
      tags: ["Hash Table", "Linked List", "Design"],
      slug: "lru-cache",
    },
    {
      id: 4,
      title: "Dynamic Programming: Coin Change Problem",
      description: "A step-by-step approach to solving the Coin Change problem using dynamic programming.",
      date: "December 10, 2022",
      difficulty: "Medium",
      categories: ["dp", "arrays"],
      tags: ["Dynamic Programming", "Array"],
      slug: "coin-change",
    },
    {
      id: 5,
      title: "Binary Tree Level Order Traversal",
      description: "How to perform level order traversal on a binary tree using BFS and queues.",
      date: "November 5, 2022",
      difficulty: "Medium",
      categories: ["trees", "bfs"],
      tags: ["Binary Tree", "BFS", "Queue"],
      slug: "binary-tree-level-order",
    },
    {
      id: 6,
      title: "Longest Palindromic Substring",
      description: "Different approaches to find the longest palindromic substring in a given string.",
      date: "October 15, 2022",
      difficulty: "Medium",
      categories: ["strings", "dp"],
      tags: ["String", "Dynamic Programming"],
      slug: "longest-palindromic-substring",
    },
    {
      id: 7,
      title: "Graph Valid Tree",
      description: "How to determine if an undirected graph is a valid tree using DFS or Union Find.",
      date: "September 20, 2022",
      difficulty: "Medium",
      categories: ["graphs", "dfs"],
      tags: ["Graph", "DFS", "Union Find"],
      slug: "graph-valid-tree",
    },
    {
      id: 8,
      title: "Implement Trie (Prefix Tree)",
      description: "A step-by-step guide to implementing a Trie data structure for efficient string operations.",
      date: "August 10, 2022",
      difficulty: "Medium",
      categories: ["trees", "strings"],
      tags: ["Trie", "String", "Design"],
      slug: "implement-trie",
    },
  ]

  const filteredPosts =
    activeCategory === "all" ? leetcodePosts : leetcodePosts.filter((post) => post.categories.includes(activeCategory))

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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">LeetCode Solutions</h1>
          <p className="text-muted-foreground mb-8">
            A collection of my solutions and explanations for various LeetCode problems. These posts detail my approach,
            thought process, and optimizations.
          </p>

          {/* Category Filter */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-3">Filter by Category:</h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(category.id)}
                  className="mb-2"
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {filteredPosts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{post.title}</CardTitle>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${difficultyColor(post.difficulty)}`}>
                    {post.difficulty}
                  </span>
                </div>
                <CardDescription>{post.date}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">{post.description}</p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="ml-auto" asChild>
                  <Link href={`/leetcode/${post.slug}`}>
                    Read Solution <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No solutions found for this category yet.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

