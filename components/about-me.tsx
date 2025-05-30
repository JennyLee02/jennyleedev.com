import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Github, Linkedin, Mail } from "lucide-react"

export default function AboutMe() {
  return (
    <section id="about" className="py-10">
      <div className="grid gap-8 md:grid-cols-2 items-center">
        <div className="order-2 md:order-1">
          <h1 className="text-4xl font-bold mb-4">Hi, I'm Jenny Lee</h1>
          <h2 className="text-2xl font-medium text-muted-foreground mb-4">Full Stack Developer</h2>
          <p className="text-muted-foreground mb-6">
            I'm passionate about building web applications and solving complex problems. With experience in React,
            Node.js, and cloud technologies, I create efficient and scalable solutions. When I'm not coding, I enjoy
            contributing to open-source projects and sharing my knowledge through my blog.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button>
              <Mail className="mr-2 h-4 w-4" /> Contact Me
            </Button>
            <Button variant="outline">
              <Github className="mr-2 h-4 w-4" /> GitHub
            </Button>
            <Button variant="outline">
              <Linkedin className="mr-2 h-4 w-4" /> LinkedIn
            </Button>
          </div>
        </div>

        <div className="flex justify-center order-1 md:order-2">
          <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-primary">
            <Image src="/placeholder.svg?height=256&width=256" alt="Jenny Lee" fill className="object-cover" />
          </div>
        </div>
      </div>

      <div className="mt-16">
        <h3 className="text-2xl font-bold mb-4">Experience</h3>
        <div className="space-y-6">
          <div className="border rounded-lg p-6">
            <div className="flex justify-between flex-wrap gap-2">
              <h4 className="text-xl font-semibold">Senior Developer</h4>
              <span className="text-muted-foreground">2021 - Present</span>
            </div>
            <p className="text-primary">Company Name</p>
            <p className="mt-2">
              Led development of key features for the company's flagship product. Mentored junior developers and
              implemented best practices for code quality.
            </p>
          </div>

          <div className="border rounded-lg p-6">
            <div className="flex justify-between flex-wrap gap-2">
              <h4 className="text-xl font-semibold">Full Stack Developer</h4>
              <span className="text-muted-foreground">2018 - 2021</span>
            </div>
            <p className="text-primary">Previous Company</p>
            <p className="mt-2">
              Developed and maintained web applications using React and Node.js. Collaborated with design and product
              teams to deliver high-quality features.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

