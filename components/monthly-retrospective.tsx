import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon } from "lucide-react"

export default function MonthlyRetrospective() {
  const retrospectives = [
    {
      id: "march-2023",
      month: "March 2023",
      achievements: [
        "Completed the backend API for the e-commerce project",
        "Solved 15 LeetCode problems",
        "Learned GraphQL basics",
      ],
      challenges: ["Struggled with optimizing database queries", "Had to refactor code due to changing requirements"],
      learnings: [
        "Improved understanding of database indexing",
        "Learned more about state management patterns in React",
      ],
      goals: [
        "Start learning TypeScript",
        "Contribute to an open-source project",
        "Build a small project with GraphQL",
      ],
    },
    {
      id: "february-2023",
      month: "February 2023",
      achievements: [
        "Launched personal portfolio website",
        "Completed Advanced React course",
        "Participated in a hackathon",
      ],
      challenges: ["Balancing work and personal projects", "Debugging a complex state management issue"],
      learnings: ["Deeper understanding of React hooks", "Improved CSS Grid and Flexbox skills"],
      goals: [
        "Start building an e-commerce project",
        "Learn more about backend development",
        "Solve at least 10 LeetCode problems",
      ],
    },
    {
      id: "january-2023",
      month: "January 2023",
      achievements: [
        "Completed JavaScript algorithms course",
        "Refactored legacy code at work",
        "Started learning React",
      ],
      challenges: ["Understanding complex algorithms", "Managing time effectively"],
      learnings: ["Better problem-solving approaches", "Improved code organization techniques"],
      goals: ["Complete React course", "Start building portfolio website", "Learn more about testing"],
    },
  ]

  return (
    <section id="retrospective">
      <div className="space-y-6">
        {retrospectives.map((retro) => (
          <Card key={retro.id}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                <CardTitle>{retro.month}</CardTitle>
              </div>
              <CardDescription>Monthly reflection on progress, challenges, and goals</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="achievements">
                  <AccordionTrigger>Achievements</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-1">
                      {retro.achievements.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="challenges">
                  <AccordionTrigger>Challenges</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-1">
                      {retro.challenges.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="learnings">
                  <AccordionTrigger>Learnings</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-1">
                      {retro.learnings.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="goals">
                  <AccordionTrigger>Next Month Goals</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-1">
                      {retro.goals.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

