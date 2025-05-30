import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { CalendarIcon } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function RetrospectivePage() {
  const retrospectives = [
    {
      id: "march-2023",
      title: "March 2023 Retrospective",
      excerpt: "Reflecting on my progress with backend development and solving LeetCode problems.",
      thumbnail: "/placeholder.svg?height=200&width=300",
      date: "March 31, 2023",
      slug: "march-2023-retrospective",
    },
    {
      id: "february-2023",
      title: "February 2023 Retrospective",
      excerpt: "Launching my portfolio website and participating in a hackathon.",
      thumbnail: "/placeholder.svg?height=200&width=300",
      date: "February 28, 2023",
      slug: "february-2023-retrospective",
    },
    {
      id: "january-2023",
      title: "January 2023 Retrospective",
      excerpt: "Starting my journey with React and improving my JavaScript skills.",
      thumbnail: "/placeholder.svg?height=200&width=300",
      date: "January 31, 2023",
      slug: "january-2023-retrospective",
    },
    {
      id: "december-2022",
      title: "December 2022 Retrospective",
      excerpt: "Wrapping up the year and setting goals for the upcoming months.",
      thumbnail: "/placeholder.svg?height=200&width=300",
      date: "December 31, 2022",
      slug: "december-2022-retrospective",
    },
    {
      id: "november-2022",
      title: "November 2022 Retrospective",
      excerpt: "Diving deeper into backend technologies and database optimization.",
      thumbnail: "/placeholder.svg?height=200&width=300",
      date: "November 30, 2022",
      slug: "november-2022-retrospective",
    },
    {
      id: "october-2022",
      title: "October 2022 Retrospective",
      excerpt: "Learning about cloud services and deploying my first application.",
      thumbnail: "/placeholder.svg?height=200&width=300",
      date: "October 31, 2022",
      slug: "october-2022-retrospective",
    },
    {
      id: "september-2022",
      title: "September 2022 Retrospective",
      excerpt: "Exploring new frontend frameworks and improving UI/UX skills.",
      thumbnail: "/placeholder.svg?height=200&width=300",
      date: "September 30, 2022",
      slug: "september-2022-retrospective",
    },
    {
      id: "august-2022",
      title: "August 2022 Retrospective",
      excerpt: "Building my first full-stack application and learning about authentication.",
      thumbnail: "/placeholder.svg?height=200&width=300",
      date: "August 31, 2022",
      slug: "august-2022-retrospective",
    },
    {
      id: "july-2022",
      title: "July 2022 Retrospective",
      excerpt: "Starting my coding journey and setting up my development environment.",
      thumbnail: "/placeholder.svg?height=200&width=300",
      date: "July 31, 2022",
      slug: "july-2022-retrospective",
    },
    {
      id: "june-2022",
      title: "June 2022 Retrospective",
      excerpt: "Learning the fundamentals of web development and HTML/CSS.",
      thumbnail: "/placeholder.svg?height=200&width=300",
      date: "June 30, 2022",
      slug: "june-2022-retrospective",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Monthly Retrospectives</h1>
          <p className="text-muted-foreground">
            A monthly reflection on my progress, challenges, learnings, and goals. These retrospectives help me track my
            growth as a developer.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {retrospectives.map((retro) => (
            <Link key={retro.id} href={`/retrospective/${retro.slug}`} className="group">
              <Card className="overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow">
                <div className="relative aspect-[3/2] w-full">
                  <Image
                    src={retro.thumbnail || "/placeholder.svg"}
                    alt={retro.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <CardContent className="pt-4 pb-2 px-3 flex-grow">
                  <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                    {retro.title}
                  </h3>
                </CardContent>
                <CardFooter className="px-3 pb-3 pt-0">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    {retro.date}
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}

