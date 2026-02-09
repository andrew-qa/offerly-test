import { use, useEffect, useState } from "react"
import { getInfluencers, getOffers, getOffersWithOverrides, type Influencer, type Offer } from "@/src/api"
import { OffersTable } from "../components/offers-table"
import { AddInfluencerForm } from "@/components/add-influencer-form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


function App() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [influencers, setInfluencers] = useState<Influencer[]>([])
  const [selectedInfluencer, setSelectedInfluencer] = useState<string | null>(null)
  const [filter, setFilter] = useState("")

  useEffect(() => {
    getOffers().then(setOffers)
    getInfluencers().then(setInfluencers)
  }, [])

  useEffect(() => {
    if (selectedInfluencer && selectedInfluencer !== "all") {
      getOffersWithOverrides(selectedInfluencer).then(setOffers)
    } else {
      getOffers().then(setOffers)
    }
  }, [selectedInfluencer])

  const filteredOffers = offers.filter((offer) =>
    offer.title.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Offers</h1>
      <Input
        placeholder="Filter by title..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="max-w-sm mb-3"
      />
      <Select onValueChange={setSelectedInfluencer}>
        <SelectTrigger className="w-full max-w-48">
          <SelectValue placeholder="Filter by influencer" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Influencers</SelectItem>
          {influencers.map((influencer) => (
            <SelectItem key={influencer.id} value={influencer.id.toString()}>
              {influencer.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="mt-4">
        <OffersTable offers={filteredOffers} />
      </div>
      <hr className="my-6" />
      <div className="p-6 max-w-2xl">
        <h2 className="text-xl font-bold mb-4">Add Influencer</h2>
        <AddInfluencerForm />
      </div>
    </div>
  )
}

export default App
