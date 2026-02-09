import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Offer } from "@/src/api"

type OffersTableProps = {
  offers: Offer[]
}

export function OffersTable({ offers }: OffersTableProps) {
  return (
    <Table className="border border-border [&_th]:border [&_td]:border">
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>CPA Amount</TableHead>
          <TableHead>Fixed Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {offers.map((offer) => (
          <TableRow key={offer.id}>
            <TableCell>{offer.title}</TableCell>
            <TableCell>{offer.description}</TableCell>
            <TableCell>{offer.payout_type}</TableCell>
            <TableCell>{offer.payout_cpa_amount ?? "-"}</TableCell>
            <TableCell>{offer.payout_fixed_amount ?? "-"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
