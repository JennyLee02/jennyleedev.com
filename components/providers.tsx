"use client"

import * as React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { SessionProvider } from "next-auth/react"

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps): React.JSX.Element {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <Toaster />
      </ThemeProvider>
    </SessionProvider>
  )
} 