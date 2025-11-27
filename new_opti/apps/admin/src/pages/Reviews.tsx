import { useState } from "react"
import { Header } from "@/components/layout/Header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select } from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Search, Star, Check, X, Eye, ThumbsUp, Clock } from "lucide-react"
import { formatDateTime } from "@/lib/utils"

interface Review {
  id: string
  userId: string
  userName: string
  productId: string
  productName: string
  rating: number
  title: string | null
  body: string | null
  isVerifiedPurchase: boolean
  isApproved: boolean
  createdAt: string
}

const mockReviews: Review[] = [
  {
    id: "1",
    userId: "user1",
    userName: "John Doe",
    productId: "prod1",
    productName: "Ray-Ban Aviator Classic",
    rating: 5,
    title: "Perfect sunglasses!",
    body: "These sunglasses are exactly what I was looking for. Great quality and the AR try-on feature helped me choose the perfect fit.",
    isVerifiedPurchase: true,
    isApproved: true,
    createdAt: "2024-01-18T14:30:00",
  },
  {
    id: "2",
    userId: "user2",
    userName: "Jane Smith",
    productId: "prod2",
    productName: "Oakley Holbrook XL",
    rating: 4,
    title: "Great quality",
    body: "Very happy with my purchase. The frames are sturdy and lightweight.",
    isVerifiedPurchase: true,
    isApproved: true,
    createdAt: "2024-01-17T10:15:00",
  },
  {
    id: "3",
    userId: "user3",
    userName: "Mike Johnson",
    productId: "prod3",
    productName: "Gucci GG0061S",
    rating: 3,
    title: "Good but pricey",
    body: "The glasses look great but I feel they are overpriced for what you get.",
    isVerifiedPurchase: true,
    isApproved: false,
    createdAt: "2024-01-16T16:45:00",
  },
  {
    id: "4",
    userId: "user4",
    userName: "Sarah Wilson",
    productId: "prod1",
    productName: "Ray-Ban Aviator Classic",
    rating: 5,
    title: "Love them!",
    body: "Second pair I've bought. Absolutely love the classic design.",
    isVerifiedPurchase: true,
    isApproved: false,
    createdAt: "2024-01-15T09:30:00",
  },
  {
    id: "5",
    userId: "user5",
    userName: "Chris Brown",
    productId: "prod4",
    productName: "Tom Ford FT5178",
    rating: 2,
    title: "Not as expected",
    body: "The color was different from what I saw online. Returning them.",
    isVerifiedPurchase: false,
    isApproved: false,
    createdAt: "2024-01-14T11:00:00",
  },
  {
    id: "6",
    userId: "user6",
    userName: "Emily Davis",
    productId: "prod2",
    productName: "Oakley Holbrook XL",
    rating: 4,
    title: null,
    body: "Good sunglasses, fast shipping.",
    isVerifiedPurchase: true,
    isApproved: true,
    createdAt: "2024-01-13T15:20:00",
  },
]

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

export function Reviews() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [ratingFilter, setRatingFilter] = useState("all")

  const filteredReviews = mockReviews.filter((review) => {
    const matchesSearch =
      review.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (review.title?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "approved" && review.isApproved) ||
      (statusFilter === "pending" && !review.isApproved)
    const matchesRating =
      ratingFilter === "all" || review.rating === parseInt(ratingFilter)
    return matchesSearch && matchesStatus && matchesRating
  })

  const reviewStats = {
    total: mockReviews.length,
    approved: mockReviews.filter((r) => r.isApproved).length,
    pending: mockReviews.filter((r) => !r.isApproved).length,
    averageRating: (
      mockReviews.reduce((acc, r) => acc + r.rating, 0) / mockReviews.length
    ).toFixed(1),
  }

  const handleApprove = (reviewId: string) => {
    console.log("Approve review:", reviewId)
  }

  const handleReject = (reviewId: string) => {
    console.log("Reject review:", reviewId)
  }

  return (
    <div className="flex flex-col">
      <Header title="Reviews" description="Moderate and manage product reviews" />

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Total Reviews</span>
              </div>
              <p className="text-2xl font-bold mt-1">{reviewStats.total}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <ThumbsUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-muted-foreground">Approved</span>
              </div>
              <p className="text-2xl font-bold mt-1 text-green-600">{reviewStats.approved}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-500" />
                <span className="text-sm text-muted-foreground">Pending</span>
              </div>
              <p className="text-2xl font-bold mt-1 text-yellow-600">{reviewStats.pending}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm text-muted-foreground">Average Rating</span>
              </div>
              <p className="text-2xl font-bold mt-1">{reviewStats.averageRating}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-40"
          >
            <option value="all">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
          </Select>
          <Select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="w-40"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </Select>
        </div>

        {/* Reviews Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Review</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>
                    <div className="max-w-sm">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{review.userName}</p>
                        {review.isVerifiedPurchase && (
                          <Badge variant="outline" className="text-xs">
                            Verified
                          </Badge>
                        )}
                      </div>
                      {review.title && (
                        <p className="text-sm font-medium mt-1">{review.title}</p>
                      )}
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {review.body}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">{review.productName}</p>
                  </TableCell>
                  <TableCell>
                    <StarRating rating={review.rating} />
                  </TableCell>
                  <TableCell>
                    <Badge variant={review.isApproved ? "success" : "warning"}>
                      {review.isApproved ? "Approved" : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDateTime(review.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" title="View">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {!review.isApproved && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Approve"
                            className="text-green-600 hover:text-green-700"
                            onClick={() => handleApprove(review.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Reject"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleReject(review.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredReviews.length} of {mockReviews.length} reviews
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
