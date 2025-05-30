import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

export default function LeetcodeBlog() {
  const leetcodePosts = [
    {
      id: 1,
      title: "Two Sum - Efficient Solution",
      description: "An efficient O(n) solution to the classic Two Sum problem using hash maps.",
      date: "March 15, 2023",
      difficulty: "Easy",
      tags: ["Arrays", "Hash Table"],
      readMoreUrl: "#",
    },
    {
      id: 2,
      title: "Merge K Sorted Lists",
      description: "A detailed explanation of how to merge k sorted linked lists efficiently using a priority queue.",
      date: "February 28, 2023",
      difficulty: "Hard",
      tags: ["Linked List", "Divide and Conquer", "Heap"],
      readMoreUrl: "#",
    },
    {
      id: 3,
      title: "LRU Cache Implementation",
      description: "How to implement an LRU Cache with O(1) time complexity for both get and put operations.",
      date: "January 20, 2023",
      difficulty: "Medium",
      tags: ["Hash Table", "Linked List", "Design"],
      readMoreUrl: "#",
    },
    {
      id: 4,
      title: "Dynamic Programming: Coin Change Problem",
      description: "A step-by-step approach to solving the Coin Change problem using dynamic programming.",
      date: "December 10, 2022",
      difficulty: "Medium",
      tags: ["Dynamic Programming", "Array"],
      readMoreUrl: "#",
    },
  ]

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
    <section id="leetcode">
      <div className="space-y-6">
        {leetcodePosts.map((post) => (
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
                <a href={post.readMoreUrl}>
                  Read Solution <ChevronRight className="ml-1 h-4 w-4" />
                </a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}

