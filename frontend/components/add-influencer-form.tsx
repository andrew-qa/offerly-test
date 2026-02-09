import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { addInfluencer } from "@/src/api"

type AddInfluencerFormProps = {
  onCreated?: () => void
}

export function AddInfluencerForm({ onCreated }: AddInfluencerFormProps) {
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!name.trim()) return
    setIsLoading(true)
    try {
      await addInfluencer(name)
      setName("")
      onCreated?.()
      alert("Influencer added!")
    } catch (error) {
      console.error("Failed to add influencer", error)
      alert("Error adding influencer")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-6">
      <Input
        type="text"
        placeholder="Influencer name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Adding..." : "Add Influencer"}
      </Button>
    </form>
  )
}
