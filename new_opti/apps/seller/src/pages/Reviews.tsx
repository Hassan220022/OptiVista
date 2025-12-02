import { useState } from "react"
import { Header } from "@/components/layout/Header"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Search, Star, ThumbsUp, Loader2 } from "lucide-react"
import { formatDateTime } from "@/lib/utils"

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  )
}

// Mock data
const mockReviews = [
  { id: "1", customer: "John D.", product: "Classic Aviator", rating: 5, title: "Amazing quality!", body: "These glasses are perfect. Great fit and fantastic quality.", created_at: "2024-01-15T10:30:00Z", helpful: 12 },
  { id: "2", customer: "Sarah M.", product: "Round Vintage", rating: 4, title: "Good value", body: "Nice frames, comfortable to wear all day.", created_at: "2024-01-14T15:45:00Z", helpful: 5 },
  { id: "3", customer: "Mike R.", product: "Sport Shield", rating: 3, title: "Decent", body: "They're okay, but expected better for the price.", created_at: "2024-01-13T09:20:00Z", helpful: 2 },
  { id: "4", customer: "Emily K.", product: "Cat Eye Glamour", rating: 5, title: "Love them!", body: "Absolutely beautiful! Get compliments all the time.", created_at: "2024-01-12T14:10:00Z", helpful: 18 },
]

export function Reviews() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading] = useState(false)

  const filteredReviews = mockReviews.filter((review) =>
    review.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
    review.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    review.title.toLowerCase().includes(searchQuery.toLowerCase())
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

  const totalReviews = mockReviews.length
  const avgRating = (mockReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)

  return (
    <div className="flex flex-col">
      <Header title="Reviews" description="Customer feedback on your products" />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Total Reviews</span>
              </div>
              <p className="text-2xl font-bold mt-1">{totalReviews}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm text-muted-foreground">Average Rating</span>
              </div>
              <p className="text-2xl font-bold mt-1">{avgRating}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <ThumbsUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-muted-foreground">5 Star Reviews</span>
              </div>
              <p className="text-2xl font-bold mt-1 text-green-600">
                {mockReviews.filter(r => r.rating === 5).length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Response Rate</span>
              </div>
              <p className="text-2xl font-bold mt-1">100%</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search reviews..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>

        {/* Reviews Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Review</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Helpful</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReviews.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No reviews found
                  </TableCell>
                </TableRow>
              ) : (
                filteredReviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>
                      <div className="max-w-md">
                        <p className="font-medium">{review.customer}</p>
                        <p className="text-sm font-medium mt-1">{review.title}</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">{review.body}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{review.product}</Badge>
                    </TableCell>
                    <TableCell>
                      <StarRating rating={review.rating} />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDateTime(review.created_at)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <ThumbsUp className="h-3 w-3" />
                        {review.helpful}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  )
}
