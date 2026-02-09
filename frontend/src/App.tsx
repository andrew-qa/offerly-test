import { useEffect, useState } from "react"
import { getOffers, type Offer } from "@/src/api"
import { OffersTable } from "../components/offers-table"

function App() {
  const [offers, setOffers] = useState<Offer[]>([])

  useEffect(() => {
    getOffers().then(setOffers)
  }, [])

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Offers</h1>
      <OffersTable offers={offers} />
    </div>
  )
}

export default App
