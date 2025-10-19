"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Sparkles, Loader2 } from "lucide-react"

interface MoodAnalysis {
  detectedMood: string
  confidence: number
  analysis: string
  themes: string[]
}

interface MoodAnalyzerProps {
  title: string
  content: string
  onMoodDetected?: (mood: string, analysis?: string) => void
}

export function MoodAnalyzer({ title, content, onMoodDetected }: MoodAnalyzerProps) {
  const [analysis, setAnalysis] = useState<MoodAnalysis | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const analyzeMood = async () => {
    if (!title.trim() || !content.trim()) {
      setError("Please write some content first")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/analyze-mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      })

      if (!response.ok) {
        throw new Error("Failed to analyze mood")
      }

      const data = await response.json()
      setAnalysis(data)
      onMoodDetected?.(data.detectedMood, data.analysis)
    } catch (err) {
      setError("Could not analyze mood. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Button
        onClick={analyzeMood}
        disabled={isLoading}
        variant="outline"
        className="w-full border-accent text-accent hover:bg-accent/10 font-serif bg-transparent"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            Analyze Mood with AI
          </>
        )}
      </Button>

      {error && <p className="text-sm text-destructive font-serif">{error}</p>}

      {analysis && (
        <Card className="p-6 border-accent/50 bg-accent/5">
          <div className="space-y-4">
            <div>
              <p className="font-serif text-xs text-muted-foreground uppercase tracking-wide mb-1">Detected Mood</p>
              <p className="font-serif text-2xl font-bold text-foreground">{analysis.detectedMood}</p>
              <p className="font-serif text-sm text-muted-foreground mt-1">Confidence: {analysis.confidence}%</p>
            </div>

            <div>
              <p className="font-serif text-xs text-muted-foreground uppercase tracking-wide mb-2">Analysis</p>
              <p className="font-serif text-foreground leading-relaxed">{analysis.analysis}</p>
            </div>

            {analysis.themes.length > 0 && (
              <div>
                <p className="font-serif text-xs text-muted-foreground uppercase tracking-wide mb-2">Themes</p>
                <div className="flex flex-wrap gap-2">
                  {analysis.themes.map((theme, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full bg-secondary/20 text-secondary-foreground font-serif text-sm"
                    >
                      {theme}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  )
}
