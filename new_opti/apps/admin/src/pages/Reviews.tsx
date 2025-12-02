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
import { Search, Star, Check, X, Eye, ThumbsUp, Clock, Loader2 } from "lucide-react"
import { formatDateTime } from "@/lib/utils"
import { useAdminReviews, useModerateReview } from "@/hooks/useAdminApi"

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
  
  const { data: reviews, isLoading, error } = useAdminReviews()
  const moderateReview = useModerateReview()

  const filteredReviews = (reviews ?? []).filter((review) => {
    const matchesSearch =
      (review.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (review.products?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (review.title?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "approved" && review.is_approved) ||
      (statusFilter === "pending" && !review.is_approved)
    const matchesRating =
      ratingFilter === "all" || review.rating === parseInt(ratingFilter)
    return matchesSearch && matchesStatus && matchesRating
  })

  const handleApprove = async (reviewId: string) => {
    await moderateReview.mutateAsync({ id: reviewId, is_approved: true })
  }

  const handleReject = async (reviewId: string) => {
    await moderateReview.mutateAsync({ id: reviewId, is_approved: false })
  }

  if (isLoading) {
    return (
      <div className="flex flex-col">
        <Header title="Reviews" description="Moderate and manage product reviews" />
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col">
        <Header title="Reviews" description="Moderate and manage product reviews" />
        <div className="p-6">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-600">Error loading reviews: {error.message}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const totalReviews = reviews?.length ?? 0
  const reviewStats = {
    total: totalReviews,
    approved: reviews?.filter((r) => r.is_approved).length ?? 0,
    pending: reviews?.filter((r) => !r.is_approved).length ?? 0,
    averageRating: totalReviews > 0
      ? (reviews!.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
      : "0.0",
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
              {filteredReviews.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No reviews found
                  </TableCell>
                </TableRow>
              ) : (
                filteredReviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>
                      <div className="max-w-sm">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{review.profiles?.full_name || review.profiles?.email || "Unknown"}</p>
                          {review.is_verified_purchase && (
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
                      <p className="text-sm">{review.products?.name || "Unknown Product"}</p>
                    </TableCell>
                    <TableCell>
                      <StarRating rating={review.rating} />
                    </TableCell>
                    <TableCell>
                      <Badge variant={review.is_approved ? "success" : "warning"}>
                        {review.is_approved ? "Approved" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDateTime(review.created_at)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" title="View">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {!review.is_approved && (
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
                ))
              )}
            </TableBody>
          </Table>
        </Card>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredReviews.length} of {reviewStats.total} reviews
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
