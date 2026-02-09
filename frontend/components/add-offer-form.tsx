import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { addOffer, addOfferOverride, type Influencer } from "@/src/api"

const PAYOUT_TYPES = ["CPA", "FIXED", "CPA+FIXED"] as const

type AddOfferFormProps = {
  influencers: Influencer[]
  onCreated?: () => void
}

function parseAmount(value: string): number | undefined {
  const trimmed = value.trim()
  if (!trimmed) return undefined
  const parsed = Number(trimmed)
  return Number.isFinite(parsed) ? parsed : undefined
}

export function AddOfferForm({ influencers, onCreated }: AddOfferFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [payoutType, setPayoutType] = useState<(typeof PAYOUT_TYPES)[number]>("CPA")
  const [payoutCpaAmount, setPayoutCpaAmount] = useState("")
  const [payoutFixedAmount, setPayoutFixedAmount] = useState("")
  const [overrideInfluencerId, setOverrideInfluencerId] = useState("none")
  const [overrideCpaAmount, setOverrideCpaAmount] = useState("")
  const [overrideFixedAmount, setOverrideFixedAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!title.trim()) return

    setIsLoading(true)
    try {
      const offer = await addOffer({
        title: title.trim(),
        description: description.trim(),
        payout_type: payoutType,
        payout_cpa_amount: parseAmount(payoutCpaAmount),
        payout_fixed_amount: parseAmount(payoutFixedAmount),
      })

      if (overrideInfluencerId !== "none") {
        await addOfferOverride(offer.id, overrideInfluencerId, {
          payout_cpa_amount: parseAmount(overrideCpaAmount),
          payout_fixed_amount: parseAmount(overrideFixedAmount),
        })
      }

      setTitle("")
      setDescription("")
      setPayoutType("CPA")
      setPayoutCpaAmount("")
      setPayoutFixedAmount("")
      setOverrideInfluencerId("none")
      setOverrideCpaAmount("")
      setOverrideFixedAmount("")
      onCreated?.()
      alert("Offer added!")
    } catch (error) {
      console.error("Failed to add offer", error)
      alert("Error adding offer")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 mt-6">
      <div className="space-y-1">
        <label htmlFor="offer-title" className="text-sm font-medium">
          Title
        </label>
        <Input
          id="offer-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Offer title"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="offer-description" className="text-sm font-medium">
          Description
        </label>
        <Textarea
          id="offer-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Offer description"
          rows={3}
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">Payout Type</label>
        <Select value={payoutType} onValueChange={(value) => setPayoutType(value as typeof payoutType)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select payout type" />
          </SelectTrigger>
          <SelectContent>
            {PAYOUT_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {(payoutType === "CPA" || payoutType === "CPA+FIXED") && (
        <div className="space-y-1">
          <label htmlFor="offer-cpa" className="text-sm font-medium">
            CPA Amount
          </label>
          <Input
            id="offer-cpa"
            type="number"
            value={payoutCpaAmount}
            onChange={(e) => setPayoutCpaAmount(e.target.value)}
            placeholder="CPA amount"
          />
        </div>
      )}

      {(payoutType === "FIXED" || payoutType === "CPA+FIXED") && (
        <div className="space-y-1">
          <label htmlFor="offer-fixed" className="text-sm font-medium">
            Fixed Amount
          </label>
          <Input
            id="offer-fixed"
            type="number"
            value={payoutFixedAmount}
            onChange={(e) => setPayoutFixedAmount(e.target.value)}
            placeholder="Fixed amount"
          />
        </div>
      )}

      <div className="space-y-1 pt-2">
        <label className="text-sm font-medium">Override Influencer (Optional)</label>
        <Select value={overrideInfluencerId} onValueChange={setOverrideInfluencerId}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select influencer" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No override</SelectItem>
            {influencers.map((influencer) => (
              <SelectItem key={influencer.id} value={influencer.id}>
                {influencer.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {overrideInfluencerId !== "none" && (
        <div className="space-y-3">
          {(payoutType === "CPA" || payoutType === "CPA+FIXED") && (
            <div className="space-y-1">
              <label htmlFor="override-cpa" className="text-sm font-medium">
                Override CPA Amount
              </label>
              <Input
                id="override-cpa"
                type="number"
                value={overrideCpaAmount}
                onChange={(e) => setOverrideCpaAmount(e.target.value)}
                placeholder="Override CPA amount"
              />
            </div>
          )}

          {(payoutType === "FIXED" || payoutType === "CPA+FIXED") && (
            <div className="space-y-1">
              <label htmlFor="override-fixed" className="text-sm font-medium">
                Override Fixed Amount
              </label>
              <Input
                id="override-fixed"
                type="number"
                value={overrideFixedAmount}
                onChange={(e) => setOverrideFixedAmount(e.target.value)}
                placeholder="Override fixed amount"
              />
            </div>
          )}
        </div>
      )}

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Adding..." : "Add Offer"}
      </Button>
    </form>
  )
}
