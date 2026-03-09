"use client"

import { useParams } from "next/navigation"
import AgentRunner from "@/components/agents/AgentRunner"

const MOCK_AGENTS = [
  {
    id: "1",
    name: "Code Assistant",
    endpoint: "https://api.domain.com/code",
    template: { input: "both", output: "text" }
  },
  {
    id: "2",
    name: "Content Writer",
    endpoint: "https://api.domain.com/write",
    template: { input: "text", output: "text" }
  },
  {
    id: "3",
    name: "Data Analyzer",
    endpoint: "https://api.domain.com/analyze",
    template: { input: "file", output: "text" }
  },
  {
    id: "4",
    name: "Image Generator",
    endpoint: "https://api.domain.com/image",
    template: { input: "text", output: "file" }
  }
]

export default function AgentPage() {
  const params = useParams()
  const agentId = params.id as string

  const agent = MOCK_AGENTS.find((a) => a.id === agentId)

  if (!agent) {
    return (
      <main className="max-w-4xl mx-auto py-20 px-4">
        <h1 className="text-2xl font-bold">Agent not found</h1>
      </main>
    )
  }

  return (
    <main className="max-w-4xl mx-auto py-20 px-4">

      <h1 className="text-3xl font-bold mb-10">
        {agent.name}
      </h1>

      <AgentRunner agent={agent} />

    </main>
  )
}