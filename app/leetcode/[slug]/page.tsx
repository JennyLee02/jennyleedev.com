"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, Code, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

// Mock data for LeetCode solutions
const leetcodeSolutionData = {
  "two-sum": {
    id: 1,
    title: "Two Sum - Efficient Solution",
    date: "March 15, 2023",
    readTime: "4 min read",
    difficulty: "Easy",
    problemNumber: 1,
    problemLink: "https://leetcode.com/problems/two-sum/",
    tags: ["Arrays", "Hash Table"],
    introduction: `
      The Two Sum problem is a classic algorithmic challenge that's often asked in technical interviews. It's a great problem to understand how hash tables can be used to optimize solutions.
      
      In this post, I'll walk through my thought process for solving this problem, starting with the brute force approach and then optimizing to an O(n) solution using a hash map.
    `,
    problem: {
      description: `
        Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.
        
        You may assume that each input would have exactly one solution, and you may not use the same element twice.
        
        You can return the answer in any order.
      `,
      examples: [
        {
          input: "nums = [2,7,11,15], target = 9",
          output: "[0,1]",
          explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
        },
        {
          input: "nums = [3,2,4], target = 6",
          output: "[1,2]",
          explanation: "Because nums[1] + nums[2] == 6, we return [1, 2].",
        },
        {
          input: "nums = [3,3], target = 6",
          output: "[0,1]",
          explanation: "Because nums[0] + nums[1] == 6, we return [0, 1].",
        },
      ],
      constraints: [
        "2 <= nums.length <= 10^4",
        "-10^9 <= nums[i] <= 10^9",
        "-10^9 <= target <= 10^9",
        "Only one valid answer exists.",
      ],
    },
    approaches: [
      {
        name: "Brute Force",
        description: "The simplest approach is to check every possible pair of numbers in the array.",
        timeComplexity: "O(n²)",
        spaceComplexity: "O(1)",
        code: `function twoSum(nums: number[], target: number): number[] {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) {
        return [i, j];
      }
    }
  }
  return []; // No solution found
}`,
        explanation: `
          This approach uses two nested loops to check every possible pair of numbers in the array:
          
          1. The outer loop iterates through each element in the array.
          2. The inner loop starts from the next element and checks if any pair sums to the target.
          3. If a pair is found, we return their indices.
          
          While this solution works, it's not efficient for large arrays due to its O(n²) time complexity.
        `,
      },
      {
        name: "Hash Map (Optimized)",
        description: "We can use a hash map to store the numbers we've seen so far and their indices.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)",
        code: `function twoSum(nums: number[], target: number): number[] {
  const numMap = new Map<number, number>();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    
    if (numMap.has(complement)) {
      return [numMap.get(complement)!, i];
    }
    
    numMap.set(nums[i], i);
  }
  
  return []; // No solution found
}`,
        explanation: `
          This approach uses a hash map to achieve O(n) time complexity:
          
          1. We iterate through the array once.
          2. For each element, we calculate its complement (target - current number).
          3. If the complement exists in our hash map, we've found our pair.
          4. Otherwise, we add the current number and its index to the hash map.
          
          This approach is much more efficient as it only requires a single pass through the array.
        `,
      },
    ],
    conclusion: `
      The Two Sum problem demonstrates how using the right data structure can significantly improve the efficiency of our solution. While the brute force approach works, the hash map solution reduces the time complexity from O(n²) to O(n) at the cost of O(n) space.
      
      This pattern of trading space for time is common in algorithm optimization and is especially useful when dealing with large datasets.
      
      When approaching similar problems, consider whether a hash map can help you avoid nested loops and achieve a more efficient solution.
    `,
  },
  "merge-k-sorted-lists": {
    id: 2,
    title: "Merge K Sorted Lists",
    date: "February 28, 2023",
    readTime: "6 min read",
    difficulty: "Hard",
    problemNumber: 23,
    problemLink: "https://leetcode.com/problems/merge-k-sorted-lists/",
    tags: ["Linked List", "Divide and Conquer", "Heap"],
    introduction: `
      Merging k sorted linked lists is a challenging problem that combines linked list manipulation with efficient sorting algorithms. This problem is particularly interesting because it has multiple valid approaches, each with different trade-offs.
      
      In this post, I'll explore different strategies for solving this problem, focusing on the heap-based approach and the divide-and-conquer method.
    `,
    problem: {
      description: `
        You are given an array of k linked-lists lists, each linked-list is sorted in ascending order.
        
        Merge all the linked-lists into one sorted linked-list and return it.
      `,
      examples: [
        {
          input: "lists = [[1,4,5],[1,3,4],[2,6]]",
          output: "[1,1,2,3,4,4,5,6]",
          explanation:
            "The linked-lists are: [1->4->5, 1->3->4, 2->6]. Merging them results in 1->1->2->3->4->4->5->6.",
        },
        {
          input: "lists = []",
          output: "[]",
          explanation: "No linked lists to merge.",
        },
        {
          input: "lists = [[]]",
          output: "[]",
          explanation: "One empty linked list results in an empty merged list.",
        },
      ],
      constraints: [
        "k == lists.length",
        "0 <= k <= 10^4",
        "0 <= lists[i].length <= 500",
        "-10^4 <= lists[i][j] <= 10^4",
        "lists[i] is sorted in ascending order.",
        "The sum of lists[i].length won't exceed 10^4.",
      ],
    },
    approaches: [
      {
        name: "Priority Queue (Min Heap)",
        description: "Use a min heap to efficiently find the smallest element among the heads of all lists.",
        timeComplexity: "O(N log k) where N is the total number of nodes and k is the number of linked lists",
        spaceComplexity: "O(k)",
        code: `/**
 * Definition for singly-linked list.
 * class ListNode {
 *     val: number
 *     next: ListNode | null
 *     constructor(val?: number, next?: ListNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.next = (next===undefined ? null : next)
 *     }
 * }
 */

function mergeKLists(lists: Array<ListNode | null>): ListNode | null {
  // Filter out empty lists
  lists = lists.filter(list => list !== null);
  
  if (lists.length === 0) return null;
  
  // Create a min heap
  const minHeap = new MinPriorityQueue({ 
    priority: (node: ListNode) => node.val 
  });
  
  // Add the head of each list to the heap
  for (const list of lists) {
    if (list) minHeap.enqueue(list);
  }
  
  const dummy = new ListNode(0);
  let current = dummy;
  
  // Process nodes from the heap
  while (!minHeap.isEmpty()) {
    const node = minHeap.dequeue().element;
    current.next = node;
    current = current.next;
    
    if (node.next) {
      minHeap.enqueue(node.next);
    }
  }
  
  return dummy.next;
}`,
        explanation: `
          This approach uses a min heap (priority queue) to efficiently merge the lists:
          
          1. We first filter out any empty lists.
          2. We create a min heap and add the head node of each list to it.
          3. We then repeatedly extract the minimum node from the heap, add it to our result list, and add the next node from the same list to the heap (if it exists).
          4. This process continues until the heap is empty.
          
          The key insight is that the heap always contains exactly one node from each non-empty list, allowing us to efficiently find the next smallest node to add to our result.
        `,
      },
      {
        name: "Divide and Conquer",
        description: "Recursively merge pairs of lists until only one list remains.",
        timeComplexity: "O(N log k) where N is the total number of nodes and k is the number of linked lists",
        spaceComplexity: "O(log k) for the recursion stack",
        code: `/**
 * Definition for singly-linked list.
 * class ListNode {
 *     val: number
 *     next: ListNode | null
 *     constructor(val?: number, next?: ListNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.next = (next===undefined ? null : next)
 *     }
 * }
 */

function mergeKLists(lists: Array<ListNode | null>): ListNode | null {
  if (lists.length === 0) return null;
  
  return mergeLists(lists, 0, lists.length - 1);
}

function mergeLists(lists: Array<ListNode | null>, start: number, end: number): ListNode | null {
  if (start === end) {
    return lists[start];
  }
  
  if (start + 1 === end) {
    return merge2Lists(lists[start], lists[end]);
  }
  
  const mid = Math.floor((start + end) / 2);
  const left = mergeLists(lists, start, mid);
  const right = mergeLists(lists, mid + 1, end);
  
  return merge2Lists(left, right);
}

function merge2Lists(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  if (!l1) return l2;
  if (!l2) return l1;
  
  const dummy = new ListNode(0);
  let current = dummy;
  
  while (l1 && l2) {
    if (l1.val < l2.val) {
      current.next = l1;
      l1 = l1.next;
    } else {
      current.next = l2;
      l2 = l2.next;
    }
    current = current.next;
  }
  
  current.next = l1 || l2;
  
  return dummy.next;
}`,
        explanation: `
          This approach uses divide and conquer to merge the lists:
          
          1. We recursively split the problem into smaller subproblems.
          2. We divide the lists into two halves and recursively merge each half.
          3. Finally, we merge the two sorted halves using a helper function that merges two sorted lists.
          
          The advantage of this approach is that it doesn't require additional data structures like a heap, and it has good performance characteristics for large numbers of lists.
        `,
      },
    ],
    conclusion: `
      The "Merge K Sorted Lists" problem demonstrates the power of using appropriate data structures and algorithmic paradigms. Both the heap-based and divide-and-conquer approaches achieve O(N log k) time complexity, but they have different characteristics:
      
      - The heap-based approach is more intuitive and uses less code, but requires an additional data structure.
      - The divide-and-conquer approach is more elegant and doesn't require additional data structures, but the recursion might be harder to understand.
      
      In practice, the choice between these approaches might depend on the specific constraints of your environment, such as memory limitations or the availability of a heap implementation.
      
      This problem is a great example of how different algorithmic strategies can be applied to solve the same problem efficiently.
    `,
  },
}

export default function LeetCodeSolutionPage() {
  const params = useParams()
  const slug = params.slug as string
  const [solution, setSolution] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, you would fetch the solution from an API
    // For this demo, we'll use the mock data
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      const foundSolution = leetcodeSolutionData[slug as keyof typeof leetcodeSolutionData]
      setSolution(foundSolution || null)
      setLoading(false)
    }, 300)
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-64 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!solution) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Solution Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The LeetCode solution you're looking for doesn't exist or has been moved.
            </p>
            <Button asChild>
              <Link href="/leetcode">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Solutions
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

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
      <main className="flex-1">
        {/* Back button - outside the article container for better spacing */}
        <div className="container mx-auto px-4 py-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/leetcode">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Solutions
            </Link>
          </Button>
        </div>

        <article className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* Title and Problem Info */}
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">{solution.title}</h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  {solution.date}
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  {solution.readTime}
                </div>
                <div className="flex items-center">
                  <Code className="mr-2 h-4 w-4" />
                  Problem #{solution.problemNumber}
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${difficultyColor(solution.difficulty)}`}>
                  {solution.difficulty}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {solution.tags.map((tag: string) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>

              <Button variant="outline" size="sm" className="mb-6" asChild>
                <a href={solution.problemLink} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" /> View on LeetCode
                </a>
              </Button>
            </div>

            <Separator className="mb-10" />

            {/* Introduction */}
            <div className="text-xl leading-relaxed mb-10 whitespace-pre-line">{solution.introduction}</div>

            {/* Problem Description */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold mb-4">Problem</h2>
              <div className="bg-muted p-6 rounded-lg mb-6 whitespace-pre-line">{solution.problem.description}</div>

              <h3 className="text-xl font-bold mb-3">Examples</h3>
              <div className="space-y-4 mb-6">
                {solution.problem.examples.map((example: any, index: number) => (
                  <div key={index} className="bg-muted p-4 rounded-lg">
                    <div className="mb-2">
                      <strong>Input:</strong> {example.input}
                    </div>
                    <div className="mb-2">
                      <strong>Output:</strong> {example.output}
                    </div>
                    {example.explanation && (
                      <div>
                        <strong>Explanation:</strong> {example.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <h3 className="text-xl font-bold mb-3">Constraints</h3>
              <ul className="list-disc pl-6 space-y-1 mb-6">
                {solution.problem.constraints.map((constraint: string, index: number) => (
                  <li key={index} className="text-muted-foreground">
                    {constraint}
                  </li>
                ))}
              </ul>
            </div>

            {/* Solution Approaches */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold mb-6">Solution Approaches</h2>

              <Tabs defaultValue={solution.approaches[0].name.toLowerCase().replace(/\s+/g, "-")}>
                <TabsList className="mb-4">
                  {solution.approaches.map((approach: any, index: number) => (
                    <TabsTrigger key={index} value={approach.name.toLowerCase().replace(/\s+/g, "-")}>
                      {approach.name}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {solution.approaches.map((approach: any, index: number) => (
                  <TabsContent
                    key={index}
                    value={approach.name.toLowerCase().replace(/\s+/g, "-")}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-xl font-bold mb-2">{approach.name}</h3>
                      <p className="mb-4">{approach.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-muted p-4 rounded-lg">
                          <div className="font-medium mb-1">Time Complexity</div>
                          <div className="text-muted-foreground">{approach.timeComplexity}</div>
                        </div>
                        <div className="bg-muted p-4 rounded-lg">
                          <div className="font-medium mb-1">Space Complexity</div>
                          <div className="text-muted-foreground">{approach.spaceComplexity}</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold mb-3">Implementation</h4>
                      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm mb-6">
                        <code>{approach.code}</code>
                      </pre>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold mb-3">Explanation</h4>
                      <div className="whitespace-pre-line text-muted-foreground">{approach.explanation}</div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>

            {/* Conclusion */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Conclusion</h2>
              <div className="whitespace-pre-line text-muted-foreground">{solution.conclusion}</div>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  )
}

