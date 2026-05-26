/**
 * Admin API hooks - uses FastAPI backend
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"

// ============ Types ============

export interface Product {
  id: string
  name: string
  sku: string | null
  slug: string
  brand: string | null
  description: string | null
  short_description: string | null
  base_price: number
  price_cents: number
  currency: string
  is_active: boolean
  is_ar_enabled: boolean
  primary_image_url: string | null
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  user_id: string
  order_number: string
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
  subtotal: number
  shipping_cost: number
  tax_amount: number
  discount_amount: number
  total: number
  currency: string
  shipping_address: Record<string, unknown>
  payment_status: "pending" | "paid" | "failed" | "refunded"
  tracking_number: string | null
  carrier: string | null
  created_at: string
  updated_at: string
  // Joined data
  profiles?: { full_name: string | null; email: string | null }
  order_items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_name: string
  quantity: number
  unit_price: number
  total_price: number
}

export interface Review {
  id: string
  user_id: string
  product_id: string
  rating: number
  title: string | null
  body: string | null
  is_verified_purchase: boolean
  is_approved: boolean
  created_at: string
  // Joined data
  profiles?: { full_name: string | null; email: string | null }
  products?: { name: string }
}

export interface Feedback {
  id: string
  user_id: string | null
  type: string
  subject: string
  message: string
  status: string
  created_at: string
  // Joined data
  profiles?: { full_name: string | null; email: string | null }
}

export interface DashboardStats {
  total_products: number
  total_orders: number
  total_users: number
  total_revenue: number
  pending_orders: number
  pending_reviews: number
  pending_feedback: number
  recent_orders: Order[]
  top_products: Product[]
}

export interface Profile {
  id: string
  email: string | null
  full_name: string | null
  avatar_url: string | null
  phone: string | null
  role: "shopper" | "admin"
  created_at: string
  updated_at: string
}

// ============ Dashboard ============

export function useDashboardStats() {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const { data, error } = await api.get<DashboardStats>("/admin/stats")
      if (error) throw new Error(error)
      return data!
    },
  })
}

// ============ Products ============

export function useAdminProducts() {
  return useQuery({
    queryKey: ["admin", "products"],
    queryFn: async () => {
      const { data, error } = await api.get<{ items: Product[] }>("/products/")
      if (error) throw new Error(error)
      return data?.items ?? []
    },
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (product: {
      name: string
      brand: string
      description: string
      price_cents: number
      category_ids?: string[]
    }) => {
      const { data, error } = await api.post<Product>("/admin/products", product)
      if (error) throw new Error(error)
      return data!
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] })
    },
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string
      updates: Partial<Product>
    }) => {
      const { data, error } = await api.put<Product>(`/admin/products/${id}`, updates)
      if (error) throw new Error(error)
      return data!
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] })
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await api.delete(`/admin/products/${id}`)
      if (error) throw new Error(error)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] })
    },
  })
}

// ============ Orders ============

export function useAdminOrders(params?: {
  page?: number
  status?: string
  date_from?: string
  date_to?: string
}) {
  return useQuery({
    queryKey: ["admin", "orders", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      if (params?.page) searchParams.set("page", String(params.page))
      if (params?.status) searchParams.set("status", params.status)
      if (params?.date_from) searchParams.set("date_from", params.date_from)
      if (params?.date_to) searchParams.set("date_to", params.date_to)

      const query = searchParams.toString()
      const { data, error } = await api.get<{ items: Order[]; total: number }>(
        `/admin/orders${query ? `?${query}` : ""}`
      )
      if (error) throw new Error(error)
      return data!
    },
  })
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      status,
      note,
    }: {
      id: string
      status: Order["status"]
      note?: string
    }) => {
      const { data, error } = await api.patch<Order>(`/admin/orders/${id}/status`, {
        status,
        note,
      })
      if (error) throw new Error(error)
      return data!
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] })
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] })
    },
  })
}

export function useUpdateOrderTracking() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      tracking,
    }: {
      id: string
      tracking: {
        tracking_number: string
        tracking_url?: string
        carrier: string
        estimated_delivery?: string
      }
    }) => {
      const { data, error } = await api.patch<Order>(
        `/admin/orders/${id}/tracking`,
        tracking
      )
      if (error) throw new Error(error)
      return data!
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] })
    },
  })
}

// ============ Reviews ============

export function useAdminReviews(params?: { status?: string }) {
  return useQuery({
    queryKey: ["admin", "reviews", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      if (params?.status) searchParams.set("status", params.status)
      
      const query = searchParams.toString()
      const { data, error } = await api.get<{ items: Review[] }>(
        `/admin/reviews${query ? `?${query}` : ""}`
      )
      if (error) throw new Error(error)
      return data?.items ?? []
    },
  })
}

export function useModerateReview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      is_approved,
      rejection_reason,
    }: {
      id: string
      is_approved: boolean
      rejection_reason?: string
    }) => {
      const { data, error } = await api.patch<Review>(`/admin/reviews/${id}`, {
        is_approved,
        rejection_reason,
      })
      if (error) throw new Error(error)
      return data!
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] })
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] })
    },
  })
}

export function useDeleteReview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await api.delete(`/admin/reviews/${id}`)
      if (error) throw new Error(error)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] })
    },
  })
}

// ============ Feedback ============

export function useAdminFeedback(params?: { status?: string; type?: string }) {
  return useQuery({
    queryKey: ["admin", "feedback", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      if (params?.status) searchParams.set("status", params.status)
      if (params?.type) searchParams.set("feedback_type", params.type)

      const query = searchParams.toString()
      const { data, error } = await api.get<{ items: Feedback[] }>(
        `/admin/feedback${query ? `?${query}` : ""}`
      )
      if (error) throw new Error(error)
      return data?.items ?? []
    },
  })
}

export function useUpdateFeedbackStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      status,
      admin_notes,
    }: {
      id: string
      status: string
      admin_notes?: string
    }) => {
      const { data, error } = await api.patch<Feedback>(`/admin/feedback/${id}`, {
        status,
        admin_notes,
      })
      if (error) throw new Error(error)
      return data!
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "feedback"] })
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] })
    },
  })
}

// ============ Users (via Supabase - no admin endpoint yet) ============
// For users, we still use Supabase directly as there's no admin endpoint
// This should be migrated to backend in the future

import { supabase } from "@/lib/supabase"

export interface ProfileWithStats extends Profile {
  orders_count: number
  total_spent: number
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: async () => {
      // Get profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false })

      if (profilesError) throw profilesError
      if (!profiles) return []

      // Get order stats
      const { data: orderStats, error: statsError } = await supabase
        .from("orders")
        .select("user_id, total")

      if (statsError) throw statsError

      // Aggregate stats
      type OrderStat = { user_id: string; total: number }
      const statsByUser = (orderStats as OrderStat[] ?? []).reduce(
        (acc, order) => {
          const userId = order.user_id
          const total = order.total
          if (!acc[userId]) {
            acc[userId] = { count: 0, total: 0 }
          }
          acc[userId].count++
          acc[userId].total += total || 0
          return acc
        },
        {} as Record<string, { count: number; total: number }>
      )

      return (profiles as Profile[]).map((profile) => ({
        ...profile,
        orders_count: statsByUser[profile.id]?.count || 0,
        total_spent: statsByUser[profile.id]?.total || 0,
      })) as ProfileWithStats[]
    },
  })
}
