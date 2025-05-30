"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

// Mock data for retrospectives
const retrospectiveData = {
  "march-2023-retrospective": {
    id: "march-2023",
    title: "March 2023 Retrospective",
    date: "March 31, 2023",
    readTime: "5 min read",
    coverImage: "/placeholder.svg?height=600&width=1200",
    introduction: `
      March has been a productive month focused on backend development and improving my problem-solving skills. 
      I've made significant progress on several projects and learned valuable lessons along the way.
      
      This month's focus areas were:
      1. Completing the backend API for my e-commerce project
      2. Solving LeetCode problems to improve algorithmic thinking
      3. Learning GraphQL basics
      
      Let's dive into what went well, what didn't, and what I learned.
    `,
    content: [
      {
        type: "heading",
        content: "Achievements",
      },
      {
        type: "paragraph",
        content:
          "This month was filled with several key accomplishments that I'm proud of. Each of these achievements represents progress toward my larger goals as a developer.",
      },
      {
        type: "list",
        items: [
          "Completed the backend API for the e-commerce project with 95% test coverage",
          "Solved 15 LeetCode problems (5 easy, 8 medium, 2 hard)",
          "Built a simple GraphQL server and integrated it with a React frontend",
          "Wrote 2 technical blog posts that received positive feedback",
          "Contributed to an open-source project by fixing a documentation issue",
        ],
      },
      {
        type: "heading",
        content: "Challenges",
      },
      {
        type: "paragraph",
        content:
          "Not everything went smoothly this month. I faced several obstacles that tested my problem-solving abilities and patience.",
      },
      {
        type: "list",
        items: [
          "Struggled with optimizing database queries for large datasets",
          "Had to refactor code multiple times due to changing requirements",
          "Found it difficult to balance learning new technologies with deepening existing skills",
          "Spent too much time debugging a complex authentication issue",
        ],
      },
      {
        type: "image",
        url: "/placeholder.svg?height=400&width=800",
        caption: "Debugging session for the authentication system",
      },
      {
        type: "heading",
        content: "Key Learnings",
      },
      {
        type: "paragraph",
        content:
          "Despite the challenges, or perhaps because of them, this month was rich with learning opportunities. These insights will guide my approach to future projects.",
      },
      {
        type: "list",
        items: [
          "Improved understanding of database indexing and query optimization",
          "Learned more about state management patterns in React",
          "Discovered the importance of writing comprehensive tests before implementing features",
          "Realized the value of documenting architectural decisions",
        ],
      },
      {
        type: "quote",
        content: "The most valuable skill for a developer isn't knowing all the answers, but knowing how to find them.",
      },
      {
        type: "heading",
        content: "Next Month Goals",
      },
      {
        type: "paragraph",
        content:
          "Looking ahead to April, I've set several ambitious but achievable goals to continue my growth as a developer.",
      },
      {
        type: "list",
        items: [
          "Start learning TypeScript and migrate at least one project",
          "Contribute to an open-source project with a code contribution (not just documentation)",
          "Build a small project with GraphQL and Apollo Client",
          "Solve at least 20 LeetCode problems (focusing on dynamic programming)",
        ],
      },
      {
        type: "heading",
        content: "Conclusion",
      },
      {
        type: "paragraph",
        content:
          "Overall, March was a month of solid progress. While I faced some challenges with optimization and changing requirements, I managed to complete my primary objectives and learn valuable lessons along the way.",
      },
      {
        type: "paragraph",
        content:
          "The experience with GraphQL has opened up new possibilities for future projects, and I'm excited to continue exploring this technology. The LeetCode practice has definitely improved my problem-solving skills and confidence in technical interviews.",
      },
      {
        type: "paragraph",
        content:
          "Looking ahead to April, I'm excited to dive into TypeScript and contribute more meaningfully to open-source projects. I believe these goals will help me become a more well-rounded developer and open up new opportunities.",
      },
    ],
  },
  "february-2023-retrospective": {
    id: "february-2023",
    title: "February 2023 Retrospective",
    date: "February 28, 2023",
    readTime: "4 min read",
    coverImage: "/placeholder.svg?height=600&width=1200",
    introduction: `
      February was an exciting month where I focused on frontend development and participated in my first hackathon.
      Despite the shorter month, I managed to accomplish several key goals and learn new skills.
      
      This month's focus areas were:
      1. Launching my personal portfolio website
      2. Completing an Advanced React course
      3. Participating in a 48-hour hackathon
      
      Here's a breakdown of my month.
    `,
    content: [
      {
        type: "heading",
        content: "Achievements",
      },
      {
        type: "paragraph",
        content:
          "February was a month of significant accomplishments, particularly in frontend development and community engagement.",
      },
      {
        type: "list",
        items: [
          "Launched my personal portfolio website using Next.js and Tailwind CSS",
          "Completed the Advanced React course on Frontend Masters",
          "Won 3rd place in a local hackathon with a team of 3",
          "Implemented a complex animation system using Framer Motion",
          "Gave my first tech talk at a local meetup",
        ],
      },
      {
        type: "image",
        url: "/placeholder.svg?height=400&width=800",
        caption: "Our team at the hackathon presentation",
      },
      {
        type: "heading",
        content: "Challenges",
      },
      {
        type: "paragraph",
        content:
          "The month wasn't without its difficulties. These challenges pushed me to improve my time management and technical skills.",
      },
      {
        type: "list",
        items: [
          "Balancing work and personal projects led to some late nights",
          "Debugging a complex state management issue took longer than expected",
          "Struggled with responsive design for certain components",
          "Had difficulty with team coordination during the hackathon",
        ],
      },
      {
        type: "heading",
        content: "Key Learnings",
      },
      {
        type: "paragraph",
        content:
          'Every challenge presented an opportunity to learn. These insights have already improved my "Every challenge presented an opportunity to learn. These insights have already improved my approach to development.',
      },
      {
        type: "list",
        items: [
          "Gained a deeper understanding of React hooks and custom hooks",
          "Improved CSS Grid and Flexbox skills for complex layouts",
          "Learned the importance of clear communication in team settings",
          "Discovered new debugging techniques for React applications",
        ],
      },
      {
        type: "quote",
        content: "The best way to learn is by doing, especially when that doing involves failing and trying again.",
      },
      {
        type: "heading",
        content: "Next Month Goals",
      },
      {
        type: "paragraph",
        content: "For March, I'm shifting my focus to expand my skill set and tackle new challenges.",
      },
      {
        type: "list",
        items: [
          "Start building an e-commerce project with a robust backend",
          "Learn more about backend development with Node.js and Express",
          "Solve at least 10 LeetCode problems to improve algorithmic thinking",
          "Improve my understanding of authentication and authorization",
        ],
      },
      {
        type: "heading",
        content: "Conclusion",
      },
      {
        type: "paragraph",
        content:
          "February was a month of growth and achievement. The hackathon experience was particularly valuable, as it pushed me out of my comfort zone and forced me to work efficiently under pressure.",
      },
      {
        type: "paragraph",
        content:
          "Launching my portfolio site was a significant milestone, and I'm proud of the design and functionality I was able to implement. The positive feedback I've received has been encouraging.",
      },
      {
        type: "paragraph",
        content:
          "For March, I'm excited to shift my focus more toward backend development to become a more well-rounded full-stack developer. The e-commerce project will be a great opportunity to apply both frontend and backend skills.",
      },
    ],
  },
}

export default function RetrospectiveDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const [retrospective, setRetrospective] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, you would fetch the retrospective from an API
    // For this demo, we'll use the mock data
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      if (slug) {
        const foundRetrospective = retrospectiveData[slug]
        setRetrospective(foundRetrospective || null)
      } else {
        setRetrospective(null)
      }
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

  if (!retrospective) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Retrospective Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The retrospective you're looking for doesn't exist or has been moved.
            </p>
            <Button asChild>
              <Link href="/retrospective">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Retrospectives
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Render content blocks
  const renderContent = (item: any, index: number) => {
    switch (item.type) {
      case "heading":
        return (
          <h2 key={index} className="text-2xl font-bold mt-12 mb-4">
            {item.content}
          </h2>
        )
      case "paragraph":
        return (
          <p key={index} className="text-lg leading-relaxed mb-6 text-muted-foreground">
            {item.content}
          </p>
        )
      case "list":
        return (
          <ul key={index} className="list-disc pl-6 mb-8 space-y-2">
            {item.items.map((listItem: string, i: number) => (
              <li key={i} className="text-lg leading-relaxed text-muted-foreground">
                {listItem}
              </li>
            ))}
          </ul>
        )
      case "image":
        return (
          <figure key={index} className="my-8">
            <div className="relative h-[300px] md:h-[400px] w-full rounded-lg overflow-hidden">
              <Image src={item.url || "/placeholder.svg"} alt={item.caption || "Image"} fill className="object-cover" />
            </div>
            {item.caption && (
              <figcaption className="text-center text-sm text-muted-foreground mt-2">{item.caption}</figcaption>
            )}
          </figure>
        )
      case "quote":
        return (
          <blockquote key={index} className="border-l-4 border-primary pl-4 italic my-8 text-xl">
            {item.content}
          </blockquote>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Back button - outside the article container for better spacing */}
        <div className="container mx-auto px-4 py-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/retrospective">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Retrospectives
            </Link>
          </Button>
        </div>

        <article className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">{retrospective.title}</h1>

            {/* Meta information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                {retrospective.date}
              </div>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                {retrospective.readTime}
              </div>
            </div>

            {/* Cover Image */}
            <div className="relative h-[300px] md:h-[400px] w-full rounded-lg overflow-hidden mb-10">
              <Image
                src={retrospective.coverImage || "/placeholder.svg"}
                alt={retrospective.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            <Separator className="mb-10" />

            {/* Introduction */}
            <div className="text-xl leading-relaxed mb-10 whitespace-pre-line">{retrospective.introduction}</div>

            {/* Main Content */}
            <div>{retrospective.content.map(renderContent)}</div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  )
}

