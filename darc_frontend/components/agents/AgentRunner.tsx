"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function AgentRunner({ agent }: any) {

  const [prompt, setPrompt] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState("")

  const runAgent = async () => {

    const formData = new FormData()

    if (prompt) formData.append("prompt", prompt)
    if (file) formData.append("file", file)

    const res = await fetch(agent.endpoint, {
      method: "POST",
      body: formData
    })

    const data = await res.json()

    setResult(data.result)

    console.log("Agent Response:", data)
  }

  return (
    <div className="space-y-6">

      {(agent.template.input === "text" || agent.template.input === "both") && (
        <textarea
          placeholder="Enter prompt"
          className="w-full border rounded-lg p-4"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      )}

      {(agent.template.input === "file" || agent.template.input === "both") && (
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
      )}

      <Button onClick={runAgent}>
        Run Agent
      </Button>

      {result && (
        <div className="border rounded-lg p-4">
          {result}
        </div>
      )}

    </div>
  )
}