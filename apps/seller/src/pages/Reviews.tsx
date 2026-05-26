import { useState } from "react"
import { Header } from "@/components/layout/Header"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Star, ThumbsUp, Loader2 } from "lucide-react"
import { formatDateTime } from "@/lib/utils"
import { useSellerReviews } from "@/hooks/useSupabaseData"

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star key={star} className={`h-4 w-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
      ))}
    </div>
  )
}

export function Reviews() {
  const [searchQuery, setSearchQuery] = useState("")
  const { data: reviews = [], isLoading } = useSellerReviews()

  const filteredReviews = reviews.filter((review) =>
    review.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
    review.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (review.title ?? "").toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="flex flex-col">
        <Header title="Reviews" description="Customer feedback on your products" />
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  const totalReviews = reviews.length
  const avgRating = totalReviews ? (reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1) : "0.0"

  return (
    <div className="flex flex-col">
      <Header title="Reviews" description="Customer feedback on your products" />

      <div className="p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <Card><CardContent className="pt-6"><div className="flex items-center gap-2"><Star className="h-4 w-4 text-muted-foreground" /><span className="text-sm text-muted-foreground">Total Reviews</span></div><p className="text-2xl font-bold mt-1">{totalReviews}</p></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="flex items-center gap-2"><Star className="h-4 w-4 fill-yellow-400 text-yellow-400" /><span className="text-sm text-muted-foreground">Average Rating</span></div><p className="text-2xl font-bold mt-1">{avgRating}</p></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="flex items-center gap-2"><ThumbsUp className="h-4 w-4 text-green-500" /><span className="text-sm text-muted-foreground">5 Star Reviews</span></div><p className="text-2xl font-bold mt-1 text-green-600">{reviews.filter((review) => review.rating === 5).length}</p></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="flex items-center gap-2"><span className="text-sm text-muted-foreground">Approved</span></div><p className="text-2xl font-bold mt-1">{reviews.filter((review) => review.is_approved).length}</p></CardContent></Card>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input type="search" placeholder="Search reviews..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-8" />
        </div>

        <Card>
          <Table>
            <TableHeader><TableRow><TableHead>Review</TableHead><TableHead>Product</TableHead><TableHead>Rating</TableHead><TableHead>Date</TableHead><TableHead>Helpful</TableHead></TableRow></TableHeader>
            <TableBody>
              {filteredReviews.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No reviews found</TableCell></TableRow>
              ) : filteredReviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>
                    <div className="max-w-md">
                      <p className="font-medium">{review.customer}</p>
                      <p className="text-sm font-medium mt-1">{review.title ?? "Untitled review"}</p>
                      <p className="text-sm text-muted-foreground line-clamp-2">{review.body ?? "No review body provided."}</p>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="outline">{review.product}</Badge></TableCell>
                  <TableCell><StarRating rating={review.rating} /></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDateTime(review.created_at)}</TableCell>
                  <TableCell><div className="flex items-center gap-1 text-sm text-muted-foreground"><ThumbsUp className="h-3 w-3" />{review.helpful_count}</div></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  )
}
