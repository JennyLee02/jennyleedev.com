import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Github, ExternalLink } from "lucide-react"

export default function ProjectsList() {
  const projects = [
    {
      id: 1,
      title: "E-commerce Platform",
      description:
        "A full-stack e-commerce platform with product management, cart functionality, and payment processing.",
      image: "/placeholder.svg?height=200&width=400",
      tags: ["React", "Node.js", "MongoDB", "Stripe"],
      githubUrl: "#",
      liveUrl: "#",
    },
    {
      id: 2,
      title: "Task Management App",
      description: "A collaborative task management application with real-time updates and team features.",
      image: "/placeholder.svg?height=200&width=400",
      tags: ["React", "Firebase", "Tailwind CSS"],
      githubUrl: "#",
      liveUrl: "#",
    },
    {
      id: 3,
      title: "Weather Dashboard",
      description: "A weather dashboard that displays current and forecasted weather data for multiple locations.",
      image: "/placeholder.svg?height=200&width=400",
      tags: ["JavaScript", "Weather API", "Chart.js"],
      githubUrl: "#",
      liveUrl: "#",
    },
    {
      id: 4,
      title: "Portfolio Website",
      description: "A personal portfolio website showcasing projects and skills.",
      image: "/placeholder.svg?height=200&width=400",
      tags: ["Next.js", "Tailwind CSS", "Framer Motion"],
      githubUrl: "#",
      liveUrl: "#",
    },
  ]

  return (
    <section id="projects">
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
        {projects.map((project) => (
          <Card key={project.id} className="overflow-hidden">
            <div className="relative h-48 w-full">
              <Image src={project.image || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
            </div>
            <CardHeader>
              <CardTitle>{project.title}</CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" /> Code
                </a>
              </Button>
              <Button size="sm" asChild>
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" /> Live Demo
                </a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}

