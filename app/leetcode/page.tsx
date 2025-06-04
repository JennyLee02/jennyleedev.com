"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronRight, Search } from "lucide-react"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

interface LeetcodeSolution {
  id: string;
  title: string;
  number: number;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  description: string;
  tags: string[];
  createdAt: string;
}

export default function LeetcodePage() {
  const [solutions, setSolutions] = useState<LeetcodeSolution[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchSolutions();
  }, []);

  const fetchSolutions = async () => {
    try {
      const response = await fetch("/api/leetcode");
      if (response.ok) {
        const data = await response.json();
        setSolutions(data);
      }
    } catch (error) {
      console.error("Error fetching solutions:", error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: "all", name: "All Problems" },
    { id: "array", name: "Array" },
    { id: "string", name: "String" },
    { id: "hash-table", name: "Hash Table" },
    { id: "two-pointers", name: "Two Pointers" },
    { id: "binary-search", name: "Binary Search" },
    { id: "linked-list", name: "Linked List" },
    { id: "tree", name: "Tree" },
    { id: "graph", name: "Graph" },
    { id: "dynamic-programming", name: "Dynamic Programming" },
    { id: "greedy", name: "Greedy" },
    { id: "backtracking", name: "Backtracking" },
    { id: "stack", name: "Stack" },
    { id: "queue", name: "Queue" },
    { id: "heap", name: "Heap" },
    { id: "sliding-window", name: "Sliding Window" },
    { id: "math", name: "Math" },
    { id: "bit-manipulation", name: "Bit Manipulation" },
  ]

  const filteredSolutions = solutions.filter((solution) => {
    // Filter by search query
    const matchesSearch = searchQuery === "" || 
      solution.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      solution.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      solution.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    // Filter by category
    const matchesCategory = activeCategory === "all" || 
      (solution.category && solution.category.toLowerCase().includes(activeCategory.toLowerCase())) ||
      (solution.tags && solution.tags.some(tag => tag.toLowerCase().includes(activeCategory.toLowerCase())));

    return matchesSearch && matchesCategory;
  });

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

  // Helper function to extract main problem statement
  const extractMainProblemStatement = (description: string): string => {
    // Split by double newlines to get sections
    const sections = description.split('\n\n');
    const mainDescription = sections[0];
    
    // If the first section is too short, take the first two sections
    if (mainDescription.length < 50 && sections.length > 1) {
      return `${mainDescription}\n\n${sections[1]}`;
    }
    
    return mainDescription;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
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

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search problems by name, description, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full"
              />
            </div>
          </div>

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
          {filteredSolutions.map((solution) => (
            <Card 
              key={solution.id}
              className="group hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer border-muted hover:border-border"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="group-hover:text-primary transition-colors duration-200">
                    {solution.title}
                  </CardTitle>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${difficultyColor(solution.difficulty)}`}>
                    {solution.difficulty}
                  </span>
                </div>
                <CardDescription>
                  Problem #{solution.number} • {new Date(solution.createdAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-muted-foreground leading-relaxed">
                  {extractMainProblemStatement(solution.description)}
                </p>
                <div className="flex flex-wrap gap-2">
                  {solution.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="group-hover:bg-muted/50 transition-colors duration-200">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="ml-auto group-hover:bg-primary/10 group-hover:text-primary transition-all duration-200" 
                  asChild
                >
                  <Link href={`/leetcode/${solution.id}`}>
                    Read Solution <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredSolutions.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {solutions.length === 0 
                ? "No solutions available yet." 
                : searchQuery || activeCategory !== "all"
                  ? `No solutions found for "${searchQuery}" in ${activeCategory === "all" ? "all categories" : activeCategory}.`
                  : "No solutions found for this category yet."
              }
            </p>
            {(searchQuery || activeCategory !== "all") && (
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("all");
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

