"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Clock, BookOpen, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import rehypeRaw from "rehype-raw"

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

export default function DSAPostPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const [post, setPost] = useState<DSAPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Mock data - later this will be fetched from API
  const mockPost: DSAPost = {
    id: "1",
    title: "Understanding Time and Space Complexity",
    slug: "time-space-complexity",
    description: "A comprehensive guide to analyzing algorithm efficiency using Big O notation.",
    content: `# Understanding Time and Space Complexity

Time and space complexity are fundamental concepts in computer science that help us analyze the efficiency of algorithms. Understanding these concepts is crucial for writing performant code and making informed decisions about algorithm selection.

## What is Time Complexity?

Time complexity measures how the execution time of an algorithm increases with the size of the input data. It's expressed using **Big O notation**, which describes the upper bound of an algorithm's growth rate.

### Common Time Complexities

1. **O(1) - Constant Time**
   - The algorithm takes the same amount of time regardless of input size
   - Example: Accessing an array element by index

\`\`\`javascript
function getFirstElement(arr) {
    return arr[0]; // Always takes the same time
}
\`\`\`

2. **O(log n) - Logarithmic Time**
   - Time increases logarithmically with input size
   - Example: Binary search

\`\`\`javascript
function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (arr[mid] === target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}
\`\`\`

3. **O(n) - Linear Time**
   - Time increases linearly with input size
   - Example: Finding an element in an unsorted array

\`\`\`javascript
function linearSearch(arr, target) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === target) return i;
    }
    return -1;
}
\`\`\`

4. **O(n²) - Quadratic Time**
   - Time increases quadratically with input size
   - Example: Bubble sort, nested loops

\`\`\`javascript
function bubbleSort(arr) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    return arr;
}
\`\`\`

## What is Space Complexity?

Space complexity measures how much additional memory an algorithm uses relative to the input size. It includes:

- **Auxiliary Space**: Extra space used by the algorithm
- **Input Space**: Space used to store the input

### Space Complexity Examples

1. **O(1) - Constant Space**
   - Uses a fixed amount of extra space

\`\`\`javascript
function findMax(arr) {
    let max = arr[0]; // Only one extra variable
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > max) max = arr[i];
    }
    return max;
}
\`\`\`

2. **O(n) - Linear Space**
   - Uses space proportional to input size

\`\`\`javascript
function createCopy(arr) {
    const copy = []; // New array of size n
    for (let i = 0; i < arr.length; i++) {
        copy.push(arr[i]);
    }
    return copy;
}
\`\`\`

## Best, Average, and Worst Case

When analyzing algorithms, consider:

- **Best Case**: Minimum time/space needed
- **Average Case**: Expected time/space for typical input
- **Worst Case**: Maximum time/space needed

### Example: Quick Sort

- **Best Case**: O(n log n) - when pivot divides array evenly
- **Average Case**: O(n log n) - for random data
- **Worst Case**: O(n²) - when pivot is always the smallest/largest element

## Tips for Analysis

1. **Drop Constants**: O(2n) becomes O(n)
2. **Drop Lower Order Terms**: O(n² + n) becomes O(n²)
3. **Consider Input Size**: Analyze how algorithm behaves as n grows large
4. **Account for All Operations**: Include loops, recursive calls, and data structure operations

## Practice Problems

Try analyzing these algorithms:

1. What's the time complexity of finding the middle element in a linked list?
2. Analyze the space complexity of merge sort
3. Compare the time complexity of different sorting algorithms

## Conclusion

Understanding time and space complexity is essential for:
- Choosing the right algorithm for your problem
- Optimizing existing code
- Predicting how your program will scale
- Technical interviews and algorithm discussions

Master these concepts, and you'll be well-equipped to write efficient, scalable code!`,
    category: "Fundamentals",
    difficulty: "Beginner",
    tags: ["Big O", "Complexity Analysis", "Performance", "Algorithms"],
    readTime: 8,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  }

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      if (slug === "time-space-complexity") {
        setPost(mockPost)
      } else {
        setError("Post not found")
      }
      setLoading(false)
    }, 500)
  }, [slug])

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
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-muted rounded w-24"></div>
              <div className="h-8 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The DSA post you're looking for doesn't exist or has been moved.
            </p>
            <Button asChild>
              <Link href="/dsa">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to DSA
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <article className="max-w-4xl mx-auto">
          {/* Back Navigation */}
          <div className="mb-8">
            <Link 
              href="/dsa" 
              className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to DSA
            </Link>
          </div>

          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline">{post.category}</Badge>
              <Badge 
                variant="outline" 
                className={getDifficultyColor(post.difficulty)}
              >
                {post.difficulty}
              </Badge>
            </div>
            
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            
            <p className="text-xl text-muted-foreground mb-6">
              {post.description}
            </p>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{post.readTime} min read</span>
              </div>
              <span>{formattedDate}</span>
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-lg max-w-none dark:prose-invert mb-12">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight, rehypeRaw]}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          {/* Tags */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Tags</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Related Navigation */}
          <div className="mt-12 pt-8 border-t">
            <div className="flex justify-between items-center">
              <Button variant="outline" asChild>
                <Link href="/dsa">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  All DSA Topics
                </Link>
              </Button>
              <Button asChild>
                <Link href="/leetcode">
                  Practice Problems →
                </Link>
              </Button>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  )
} 