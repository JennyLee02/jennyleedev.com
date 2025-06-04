"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, ArrowLeft, Save, Download } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  spaceComplexity: string;
  tags: string[];
  leetcodeUrl?: string;
}

export default function EditLeetcodePage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [saving, setSaving] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    number: 0,
    difficulty: "" as "Easy" | "Medium" | "Hard" | "",
    category: "",
    description: "",
    approach: "",
    solution: "",
    timeComplexity: "",
    spaceComplexity: "",
    leetcodeUrl: "",
  });

  useEffect(() => {
    const fetchSolution = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/leetcode/${params.id}`);
        if (response.ok) {
          const data: LeetcodeSolution = await response.json();
          setFormData({
            title: data.title,
            number: data.number,
            difficulty: data.difficulty,
            category: data.category || "",
            description: data.description,
            approach: data.approach,
            solution: data.solution,
            timeComplexity: data.timeComplexity,
            spaceComplexity: data.spaceComplexity,
            leetcodeUrl: data.leetcodeUrl || "",
          });
          setTags(data.tags || []);
        } else {
          alert("Failed to fetch solution");
        }
      } catch (error) {
        console.error("Error fetching solution:", error);
        alert("Error fetching solution");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchSolution();
    }
  }, [params.id]);

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && currentTag.trim()) {
      e.preventDefault();
      if (!tags.includes(currentTag.trim())) {
        setTags([...tags, currentTag.trim()]);
      }
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const fetchFromLeetCode = async () => {
    if (!formData.leetcodeUrl) {
      alert('Please enter a LeetCode URL first')
      return
    }

    setFetchingData(true)
    try {
      const response = await fetch('/api/leetcode/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: formData.leetcodeUrl }),
      })

      const data = await response.json()

      if (response.ok) {
        // Update form with fetched data
        setFormData(prev => ({
          ...prev,
          title: data.title || prev.title,
          number: data.number ? data.number.toString() : prev.number,
          difficulty: data.difficulty || prev.difficulty,
        }))

        if (data.warning) {
          alert(data.warning)
        } else {
          alert('Basic information fetched successfully!')
        }
      } else {
        alert(data.error || 'Failed to fetch data from LeetCode')
      }
    } catch (error) {
      console.error('Error fetching from LeetCode:', error)
      alert('Error fetching data from LeetCode.')
    } finally {
      setFetchingData(false)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDifficultyChange = (value: "Easy" | "Medium" | "Hard") => {
    setFormData((prev) => ({ ...prev, difficulty: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/leetcode/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          number: formData.number,
          difficulty: formData.difficulty,
          category: formData.category,
          description: formData.description,
          approach: formData.approach,
          timeComplexity: formData.timeComplexity,
          spaceComplexity: formData.spaceComplexity,
          solution: formData.solution,
          leetcodeUrl: formData.leetcodeUrl,
          tags,
        }),
      });

      if (response.ok) {
        router.push("/admin/leetcode");
      } else {
        alert("Failed to update solution");
      }
    } catch (error) {
      console.error("Error updating solution:", error);
      alert("Error updating solution");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" asChild>
          <Link href="/admin/leetcode">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Solutions
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Edit LeetCode Solution</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Details */}
        <Card>
          <CardHeader>
            <CardTitle>📝 Basic Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* LeetCode URL */}
            <div>
              <Label htmlFor="leetcodeUrl">LeetCode Problem URL</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="leetcodeUrl"
                  name="leetcodeUrl"
                  value={formData.leetcodeUrl}
                  onChange={handleInputChange}
                  placeholder="https://leetcode.com/problems/two-sum/"
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  onClick={fetchFromLeetCode}
                  disabled={fetchingData || !formData.leetcodeUrl}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  {fetchingData ? 'Fetching...' : 'Auto-Fill'}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Optional: Update LeetCode URL to auto-fill basic information
              </p>
            </div>

            <div>
              <Label htmlFor="title">Problem Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Two Sum - Hash Table Solution"
                required
              />
            </div>

            <div>
              <Label htmlFor="number">Problem Number</Label>
              <Input
                id="number"
                name="number"
                type="number"
                value={formData.number}
                onChange={handleInputChange}
                placeholder="e.g., 1"
                required
              />
            </div>

            <div>
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select value={formData.difficulty} onValueChange={handleDifficultyChange} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={handleCategoryChange} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Array">Array</SelectItem>
                  <SelectItem value="String">String</SelectItem>
                  <SelectItem value="Hash Table">Hash Table</SelectItem>
                  <SelectItem value="Two Pointers">Two Pointers</SelectItem>
                  <SelectItem value="Binary Search">Binary Search</SelectItem>
                  <SelectItem value="Linked List">Linked List</SelectItem>
                  <SelectItem value="Tree">Tree</SelectItem>
                  <SelectItem value="Graph">Graph</SelectItem>
                  <SelectItem value="Dynamic Programming">Dynamic Programming</SelectItem>
                  <SelectItem value="Greedy">Greedy</SelectItem>
                  <SelectItem value="Backtracking">Backtracking</SelectItem>
                  <SelectItem value="Stack">Stack</SelectItem>
                  <SelectItem value="Queue">Queue</SelectItem>
                  <SelectItem value="Heap">Heap</SelectItem>
                  <SelectItem value="Sliding Window">Sliding Window</SelectItem>
                  <SelectItem value="Math">Math</SelectItem>
                  <SelectItem value="Bit Manipulation">Bit Manipulation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Problem Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target..."
                rows={4}
                required
              />
            </div>

            <div>
              <Label htmlFor="tags">Tags</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
              <Input
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyDown={addTag}
                placeholder="array, hash-table, two-pointers (press Enter to add)"
              />
            </div>
          </CardContent>
        </Card>

        {/* Approach */}
        <Card>
          <CardHeader>
            <CardTitle>🎯 Approach & Strategy</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="approach">Solution Approach</Label>
            <Textarea
              id="approach"
              name="approach"
              value={formData.approach}
              onChange={handleInputChange}
              placeholder="Explain your approach to solving this problem. What data structures did you use? What was your thought process?"
              rows={6}
              className="mt-2"
              required
            />
          </CardContent>
        </Card>

        {/* Complexity Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>📊 Complexity Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="timeComplexity">Time Complexity</Label>
              <Input
                id="timeComplexity"
                name="timeComplexity"
                value={formData.timeComplexity}
                onChange={handleInputChange}
                placeholder="e.g., O(n)"
                required
              />
            </div>

            <div>
              <Label htmlFor="spaceComplexity">Space Complexity</Label>
              <Input
                id="spaceComplexity"
                name="spaceComplexity"
                value={formData.spaceComplexity}
                onChange={handleInputChange}
                placeholder="e.g., O(n)"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Solution Code */}
        <Card>
          <CardHeader>
            <CardTitle>💻 Solution Code</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="solution">Python Solution</Label>
            <Textarea
              id="solution"
              name="solution"
              value={formData.solution}
              onChange={handleInputChange}
              placeholder="class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        # Your solution here
        pass"
              rows={12}
              className="mt-2 font-mono"
              required
            />
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={saving} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/leetcode">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  );
} 