"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Trash2, Plus, Eye, BarChart3 } from "lucide-react";

interface LeetcodeSolution {
  id: string;
  title: string;
  number: number;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  description: string;
  examples?: {input: string; output: string; explanation?: string}[];
  constraints?: string;
  followUp?: string;
  solution?: string;
  pythonCode?: string;
  cppCode?: string;
  approach: string;
  timeComplexity: string;
  timeComplexityExplanation?: string;
  spaceComplexity: string;
  spaceComplexityExplanation?: string;
  tags: string[];
  leetcodeUrl?: string;
  neetcodeUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export default function LeetcodeAdminPage() {
  const [solutions, setSolutions] = useState<LeetcodeSolution[]>([]);
  const [loading, setLoading] = useState(true);

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

  const deleteSolution = async (id: string) => {
    if (!confirm("Are you sure you want to delete this solution?")) return;

    try {
      const response = await fetch(`/api/leetcode/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setSolutions(solutions.filter((s) => s.id !== id));
      } else {
        alert("Failed to delete solution");
      }
    } catch (error) {
      console.error("Error deleting solution:", error);
      alert("Error deleting solution");
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Hard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">🧩 LeetCode Solutions</h1>
          <p className="text-muted-foreground">
            Manage your LeetCode problem solutions and explanations
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/leetcode/create" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Solution
          </Link>
        </Button>
      </div>

      {solutions.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No solutions yet</h3>
            <p className="text-muted-foreground mb-4">
              Start by creating your first LeetCode solution
            </p>
            <Button asChild>
              <Link href="/admin/leetcode/create">Create First Solution</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {solutions.map((solution) => (
            <Card key={solution.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{solution.title}</CardTitle>
                    <p className="text-muted-foreground mb-3">Problem #{solution.number} • {solution.category}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                          solution.difficulty
                        )}`}
                      >
                        {solution.difficulty}
                      </span>
                      {solution.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/leetcode/${solution.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/leetcode/edit/${solution.id}`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteSolution(solution.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {solution.description}
                </p>
                <div className="mt-3 text-xs text-muted-foreground">
                  Created: {new Date(solution.createdAt).toLocaleDateString()} •
                  Updated: {new Date(solution.updatedAt).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 