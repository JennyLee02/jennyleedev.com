"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Github, Linkedin, Mail, ArrowRight, MousePointer } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { cn } from "@/lib/utils"

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null)
  const techStackRef = useRef<HTMLDivElement>(null)
  const skills = [
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "Tailwind CSS",
    "JavaScript",
    "MongoDB",
    "SQL",
    "Git",
    "AWS",
    "Docker",
  ]

  return (
    <div className="min-h-screen flex flex-col relative">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section ref={heroRef} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
          {/* Enhanced background effects */}
          <div className="absolute inset-0 bg-grid-pattern opacity-5">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-secondary/20 to-background animate-gradient"></div>
          </div>

          {/* Larger, more prominent animated background shapes */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-primary/20 rounded-full blur-3xl animate-blob"></div>
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
          </div>

          <div className="container mx-auto px-8 max-w-7xl z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto text-center"
            >
              <motion.h1
                className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                Hello, I'm <span className="text-primary animate-pulse">Jenny Lee</span>
              </motion.h1>

              <motion.h2
                className="text-2xl md:text-3xl font-medium mb-8 bg-clip-text"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Computer Engineering Student {" "}<br/>  @ University of Waterloo
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="flex flex-wrap justify-center gap-4 mb-12"
              >
                <Button 
                  size="lg" 
                  className="relative overflow-hidden bg-blue-600 hover:bg-blue-700 transform transition-all duration-300 group" 
                  asChild
                >
                  <Link href="/projects" className="flex items-center">
                    View My Work 
                    <ArrowRight className="ml-2 h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  className="relative overflow-hidden border-2 border-zinc-200 dark:border-zinc-700 bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 text-foreground transform transition-all duration-300 group" 
                  asChild
                >
                  <Link href="#contact" className="flex items-center">
                    <Mail className="mr-2 h-4 w-4" /> Contact Me
                  </Link>
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="flex justify-center space-x-6"
              >
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors transform hover:scale-110">
                  <Github className="h-8 w-8" />
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors transform hover:scale-110">
                  <Linkedin className="h-8 w-8" />
                </Link>
              </motion.div>
            </motion.div>
          </div>

          <motion.div
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
          >
            <MousePointer className="h-6 w-6 text-primary animate-bounce" />
            <p className="text-xs text-muted-foreground mt-2">Scroll to explore</p>
          </motion.div>
        </section>

        {/* Tech Stack Section */}
        <section ref={techStackRef} className="py-16 bg-muted/20">
          <div className="container mx-auto px-8 max-w-7xl">
            <h2 className="text-3xl font-bold mb-10 text-center">My Tech Stack</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-8 max-w-4xl mx-auto">
              {[
                "React",
                "Next.js",
                "TypeScript",
                "Node.js",
                "Python",
                "C++",
                "MongoDB",
                "SQL",
                "AWS",
                "Docker",
                "Git",
                "Tailwind CSS",
              ].map((tech, index) => (
                <motion.div
                  key={tech}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-16 h-16 mb-3 bg-background rounded-full flex items-center justify-center shadow-sm">
                    <Image
                      src={`/placeholder.svg?height=40&width=40`}
                      alt={tech}
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  </div>
                  <p className="text-sm font-medium">{tech}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-8 max-w-7xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                className="relative h-[400px] w-full rounded-lg overflow-hidden"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Image src="/images/jenny-profile.jpg" alt="Jenny Lee" fill className="object-cover" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-bold mb-6">About Me</h2>
                <p className="text-muted-foreground mb-6">
                  I'm a passionate full stack developer with expertise in building modern web applications. With a
                  strong foundation in both frontend and backend technologies, I create efficient, scalable, and
                  user-friendly solutions to complex problems.
                </p>
                <p className="text-muted-foreground mb-8">
                  When I'm not coding, I enjoy contributing to open-source projects, writing technical articles, and
                  continuously learning new technologies to stay at the forefront of web development.
                </p>

                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-sm py-1">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Interactive Experience Section */}
        <section className="py-20 bg-muted/30 relative overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 -right-1/3 w-2/3 h-2/3 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-1/4 -left-1/4 w-2/3 h-2/3 bg-secondary/10 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-2/3 bg-accent/10 rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto px-8 max-w-7xl relative z-10">
            <h2 className="text-3xl font-bold mb-12 text-center">Professional Experience</h2>

            <div className="max-w-3xl mx-auto">
              <ExperienceTimeline />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-8 max-w-7xl text-center">
            <h2 className="text-3xl font-bold mb-6">Interested in working together?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              I'm always open to discussing new projects, creative ideas or opportunities to be part of your vision.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg" 
                variant="secondary"
                className="hover:bg-secondary/80 transform transition-all duration-300" 
                asChild
              >
                <Link href="/projects">View My Projects</Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-transparent hover:bg-primary-foreground/10 transform transition-all duration-300" 
                asChild
              >
                <Link href="#contact">Get In Touch</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

function ExperienceTimeline() {
  const experiences = [
    {
      id: 1,
      role: "Software Engineering Intern",
      company: "Altis Labs",
      period: "May 2025 - Present",
      description: "Led development of key features for the company's flagship product. Mentored junior developers and implemented best practices for code quality.",
      skills: ["React", "TypeScript", "Node.js", "AWS"]
    },
    {
      id: 2,
      role: "Associate Software Engineer",
      company: "Sun Life",
      period: "Sept 2024 - Dec 2024",
      description: "Developed and maintained web applications using React and Node.js. Collaborated with design and product teams to deliver high-quality features.",
      skills: ["React", "JavaScript", "AWS", "Docker"]
    },
    {
      id: 3,
      role: "Web Developer",
      company: "Best Athletes",
      period: "Feb 2023 - Apr 2023",
      description: "Built responsive user interfaces using modern JavaScript frameworks. Worked closely with designers to implement pixel-perfect designs.",
      skills: ["React", "Next.js", "Tailwind"]
    },
  ]

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 bg-border transform md:-translate-x-1/2"></div>

      {/* Experience items */}
      <div className="space-y-12">
        {experiences.map((exp, index) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={cn("relative grid grid-cols-1 md:grid-cols-2 gap-6", index % 2 === 0 ? "md:text-right" : "")}
          >
            {/* Timeline dot with hover effect */}
            <motion.div 
              className="absolute left-0 md:left-1/2 top-0 w-5 h-5 rounded-full bg-primary transform -translate-x-1/2 z-10 cursor-pointer"
              whileHover={{ scale: 1.2 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            />

            {/* Content */}
            <div className={cn("md:col-span-1", index % 2 === 0 ? "md:col-start-1" : "md:col-start-2")}>
              <motion.div 
                className="bg-card rounded-lg p-6 border shadow-sm hover:shadow-lg transition-all duration-300"
                whileHover={{ y: -5 }}
              >
                <h3 className="text-xl font-bold">{exp.role}</h3>
                <p className="text-primary font-medium">{exp.company}</p>
                <p className="text-muted-foreground text-sm mb-4">{exp.period}</p>
                <p className="mb-4">{exp.description}</p>
                
                {/* Skills tags */}
                <div className="flex flex-wrap gap-2">
                  {exp.skills.map((skill) => (
                    <span 
                      key={skill} 
                      className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Empty column for layout */}
            <div className="hidden md:block"></div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

