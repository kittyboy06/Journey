import { generateText } from "ai"

export async function POST(request: Request) {
  try {
    const { content, title } = await request.json()

    if (!content || !title) {
      return Response.json({ error: "Missing content or title" }, { status: 400 })
    }

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: `Analyze the mood and emotional tone of this diary entry. Respond with a JSON object containing:
1. "detectedMood": The primary mood (choose from: Happy, Sad, Angry, Anxious, Longing, Peaceful, Confused, Hopeful)
2. "confidence": A number from 0-100 indicating confidence in the mood detection
3. "analysis": A brief 1-2 sentence analysis of the emotional tone
4. "themes": An array of 2-3 key emotional themes present in the text

Diary Entry:
Title: ${title}
Content: ${content}

Respond only with valid JSON, no additional text.`,
    })

    const analysis = JSON.parse(text)
    return Response.json(analysis)
  } catch (error) {
    console.error("Mood analysis error:", error)
    return Response.json({ error: "Failed to analyze mood" }, { status: 500 })
  }
}
