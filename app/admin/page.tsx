"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AdminPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login")
    },
  })

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (session?.user?.role !== "admin") {
    redirect("/")
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 border rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Projects</h2>
          <p className="text-muted-foreground mb-4">
            Create and manage your portfolio projects
          </p>
          <Button asChild>
            <Link href="/admin/projects">Manage Projects</Link>
          </Button>
        </div>

        <div className="p-6 border rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">DSA Posts</h2>
          <p className="text-muted-foreground mb-4">
            Create and manage Data Structures & Algorithms content
          </p>
          <Button asChild>
            <Link href="/admin/dsa">Manage DSA Posts</Link>
          </Button>
        </div>

        <div className="p-6 border rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">LeetCode Solutions</h2>
          <p className="text-muted-foreground mb-4">
            Create and manage your LeetCode problem solutions and explanations
          </p>
          <Button asChild>
            <Link href="/admin/leetcode">Manage Solutions</Link>
          </Button>
        </div>

        <div className="p-6 border rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Retrospectives</h2>
          <p className="text-muted-foreground mb-4">
            Create and manage monthly retrospective posts
          </p>
          <Button asChild>
            <Link href="/admin/retrospective">Manage Retrospectives</Link>
          </Button>
        </div>
      </div>
    </div>
  )
} 