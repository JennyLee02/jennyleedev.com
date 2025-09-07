"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, ArrowLeft, Hash, Clock, Target, Cpu, Calendar, ExternalLink, Lightbulb, Download, X, Plus, Eye, EyeOff } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function CreateLeetcodePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [examples, setExamples] = useState<{input: string, output: string, explanation?: string}[]>([{input: "", output: "", explanation: ""}]);
  const [showCodePreview, setShowCodePreview] = useState<{python: boolean, cpp: boolean}>({python: false, cpp: false});

  const [formData, setFormData] = useState({
    title: "",
    number: "",
    difficulty: "" as "Easy" | "Medium" | "Hard" | "",
    category: "",
    description: "",
    constraints: "",
    followUp: "",
    approach: "",
    solution: "",
    timeComplexity: "",
    timeComplexityExplanation: "",
    spaceComplexity: "",
    spaceComplexityExplanation: "",
    leetcodeUrl: "",
    pythonCode: "",
    cppCode: "",
  });

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

  const addExample = () => {
    setExamples([...examples, {input: "", output: "", explanation: ""}]);
  };

  const removeExample = (index: number) => {
    if (examples.length > 1) {
      setExamples(examples.filter((_, i) => i !== index));
    }
  };

  const updateExample = (index: number, field: 'input' | 'output' | 'explanation', value: string) => {
    const updatedExamples = [...examples];
    updatedExamples[index] = {...updatedExamples[index], [field]: value};
    setExamples(updatedExamples);
  };

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
          timeComplexity: data.timeComplexity || prev.timeComplexity,
          timeComplexityExplanation: data.timeComplexityExplanation || prev.timeComplexityExplanation,
          spaceComplexity: data.spaceComplexity || prev.spaceComplexity,
          spaceComplexityExplanation: data.spaceComplexityExplanation || prev.spaceComplexityExplanation,
          pythonCode: data.pythonCode || prev.pythonCode,
          cppCode: data.cppCode || prev.cppCode,
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
      alert('Error fetching data from LeetCode. Please enter details manually.')
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
    setLoading(true);

    try {
      const response = await fetch("/api/leetcode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          number: parseInt(formData.number),
          difficulty: formData.difficulty,
          category: formData.category,
          description: formData.description,
          examples: examples.filter(ex => ex.input.trim() || ex.output.trim()), // Only include non-empty examples
          constraints: formData.constraints || undefined,
          followUp: formData.followUp || undefined,
          approach: formData.approach,
          timeComplexity: formData.timeComplexity,
          timeComplexityExplanation: formData.timeComplexityExplanation,
          spaceComplexity: formData.spaceComplexity,
          spaceComplexityExplanation: formData.spaceComplexityExplanation,
          solution: formData.solution,
          pythonCode: formData.pythonCode,
          cppCode: formData.cppCode,
          tags,
          leetcodeUrl: formData.leetcodeUrl,
        }),
      });

      if (response.ok) {
        router.push("/admin/leetcode");
      } else {
        const errorData = await response.json();
        console.error("Server error:", errorData);
        alert(`Failed to create solution: ${errorData.details || errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error creating solution:", error);
      alert("Error creating solution");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/leetcode">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Solutions
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">🧩 Create LeetCode Solution</h1>
          <p className="text-muted-foreground">
            Create a detailed solution for a LeetCode problem
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Details */}
        <Card>
          <CardHeader>
            <CardTitle>📝 Basic Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* LeetCode URL */}
            <div>
              <label className="block text-sm font-medium mb-2">
                LeetCode URL (Optional)
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={formData.leetcodeUrl}
                  onChange={(e) => setFormData({...formData, leetcodeUrl: e.target.value})}
                  className="flex-1 p-2 border rounded-md"
                  placeholder="https://leetcode.com/problems/..."
                />
                <button
                  type="button"
                  onClick={fetchFromLeetCode}
                  disabled={fetchingData || !formData.leetcodeUrl}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 min-w-[80px]"
                >
                  {fetchingData ? '...' : 'Fetch'}
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Leave empty to manually enter all details, or paste LeetCode URL to auto-fetch
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
              <Select onValueChange={handleDifficultyChange} required>
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
              <Select onValueChange={handleCategoryChange} required>
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

            {/* Examples Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Examples</Label>
                <Button type="button" onClick={addExample} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Example
                </Button>
              </div>
              
              {examples.map((example, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-sm font-medium">Example {index + 1}</Label>
                    {examples.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeExample(index)}
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor={`input-${index}`} className="text-sm">Input</Label>
                      <Textarea
                        id={`input-${index}`}
                        value={example.input}
                        onChange={(e) => updateExample(index, 'input', e.target.value)}
                        placeholder="nums = [2,7,11,15], target = 9"
                        rows={2}
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor={`output-${index}`} className="text-sm">Output</Label>
                      <Textarea
                        id={`output-${index}`}
                        value={example.output}
                        onChange={(e) => updateExample(index, 'output', e.target.value)}
                        placeholder="[0,1]"
                        rows={2}
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor={`explanation-${index}`} className="text-sm">Explanation (Optional)</Label>
                      <Textarea
                        id={`explanation-${index}`}
                        value={example.explanation || ''}
                        onChange={(e) => updateExample(index, 'explanation', e.target.value)}
                        placeholder="Because nums[0] + nums[1] == 9, we return [0, 1]."
                        rows={2}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div>
              <Label htmlFor="constraints">Constraints (Optional)</Label>
              <Textarea
                id="constraints"
                name="constraints"
                value={formData.constraints}
                onChange={handleInputChange}
                placeholder="• 2 ≤ nums.length ≤ 10⁴&#10;• -10⁹ ≤ nums[i] ≤ 10⁹&#10;• -10⁹ ≤ target ≤ 10⁹&#10;• Only one valid answer exists."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="followUp">Follow-up Questions (Optional)</Label>
              <Textarea
                id="followUp"
                name="followUp"
                value={formData.followUp}
                onChange={handleInputChange}
                placeholder="Can you come up with an algorithm that is less than O(n²) time complexity?"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="tags">Tags</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <ExternalLink
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
              <Label htmlFor="timeComplexityExplanation">Time Complexity Explanation</Label>
              <Textarea
                id="timeComplexityExplanation"
                name="timeComplexityExplanation"
                value={formData.timeComplexityExplanation}
                onChange={handleInputChange}
                placeholder="Explain why the time complexity is what it is..."
                rows={4}
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

            <div>
              <Label htmlFor="spaceComplexityExplanation">Space Complexity Explanation</Label>
              <Textarea
                id="spaceComplexityExplanation"
                name="spaceComplexityExplanation"
                value={formData.spaceComplexityExplanation}
                onChange={handleInputChange}
                placeholder="Explain why the space complexity is what it is..."
                rows={4}
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
            <Tabs defaultValue="python">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="python">Python</TabsTrigger>
                <TabsTrigger value="cpp">C++</TabsTrigger>
              </TabsList>
              
              <TabsContent value="python" className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="pythonCode" className="flex items-center gap-2">
                    🐍 Python Solution
                  </Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCodePreview(prev => ({...prev, python: !prev.python}))}
                    className="flex items-center gap-2"
                  >
                    {showCodePreview.python ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    {showCodePreview.python ? 'Hide Preview' : 'Show Preview'}
                  </Button>
                </div>
                
                {showCodePreview.python && formData.pythonCode && (
                  <div className="mb-4 border rounded-lg overflow-hidden">
                    <div className="bg-muted/50 px-3 py-2 text-sm font-medium text-muted-foreground border-b">
                      Preview
                    </div>
                    <SyntaxHighlighter
                      language="python"
                      style={vscDarkPlus}
                      customStyle={{
                        margin: 0,
                        background: '#1e1e1e',
                        fontSize: '13px',
                        lineHeight: '1.5'
                      }}
                      showLineNumbers={true}
                      lineNumberStyle={{
                        color: '#6e7681',
                        backgroundColor: '#161b22',
                        paddingRight: '1em',
                        marginRight: '1em',
                        borderRight: '1px solid #30363d'
                      }}
                    >
                      {formData.pythonCode}
                    </SyntaxHighlighter>
                  </div>
                )}
                
                <Textarea
                  id="pythonCode"
                  name="pythonCode"
                  value={formData.pythonCode}
                  onChange={handleInputChange}
                  placeholder="class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        # Your Python solution here
        pass"
                  rows={15}
                  className="font-mono text-sm bg-slate-50 dark:bg-slate-900"
                />
              </TabsContent>
              
              <TabsContent value="cpp" className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="cppCode" className="flex items-center gap-2">
                    ⚡ C++ Solution
                  </Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCodePreview(prev => ({...prev, cpp: !prev.cpp}))}
                    className="flex items-center gap-2"
                  >
                    {showCodePreview.cpp ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    {showCodePreview.cpp ? 'Hide Preview' : 'Show Preview'}
                  </Button>
                </div>
                
                {showCodePreview.cpp && formData.cppCode && (
                  <div className="mb-4 border rounded-lg overflow-hidden">
                    <div className="bg-muted/50 px-3 py-2 text-sm font-medium text-muted-foreground border-b">
                      Preview
                    </div>
                    <SyntaxHighlighter
                      language="cpp"
                      style={vscDarkPlus}
                      customStyle={{
                        margin: 0,
                        background: '#1e1e1e',
                        fontSize: '13px',
                        lineHeight: '1.5'
                      }}
                      showLineNumbers={true}
                      lineNumberStyle={{
                        color: '#6e7681',
                        backgroundColor: '#161b22',
                        paddingRight: '1em',
                        marginRight: '1em',
                        borderRight: '1px solid #30363d'
                      }}
                    >
                      {formData.cppCode}
                    </SyntaxHighlighter>
                  </div>
                )}
                
                <Textarea
                  id="cppCode"
                  name="cppCode"
                  value={formData.cppCode}
                  onChange={handleInputChange}
                  placeholder="class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Your C++ solution here
        return {};
    }
};"
                  rows={15}
                  className="font-mono text-sm bg-slate-50 dark:bg-slate-900"
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            {loading ? "Creating..." : "Create Solution"}
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/leetcode">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  );
} 