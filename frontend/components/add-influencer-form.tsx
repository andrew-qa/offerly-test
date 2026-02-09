import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { addInfluencer } from "@/src/api"

export function AddInfluencerForm() {
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setIsLoading(true)
    try {
      await addInfluencer(name)
      setName("") // reset form
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
