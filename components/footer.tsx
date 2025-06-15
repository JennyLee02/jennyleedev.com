import Link from "next/link"
import { Github, Linkedin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="container flex flex-col md:flex-row items-center justify-between py-8 gap-4 px-6">
        <div className="text-center md:text-left">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Jenny Lee. All rights reserved.
          </p>
        </div>

        <div className="flex items-center gap-6">
          <Link 
            href="https://github.com/JennyLee02" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </Link>
          <Link 
            href="https://www.linkedin.com/in/jenny-lee02/" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Linkedin className="h-5 w-5" />
            <span className="sr-only">LinkedIn</span>
          </Link>
        </div>
      </div>
    </footer>
  )
}

