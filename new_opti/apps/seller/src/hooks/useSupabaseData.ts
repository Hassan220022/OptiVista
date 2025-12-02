import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import type { Product, Order, Review, Feedback, Profile } from "@/types/database"

// ============ PRODUCTS ============

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      return (data ?? []) as Product[]
    },
  })
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ["products", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single()

      if (error) throw error
      return data as Product
    },
    enabled: !!id,
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Product> }) => {
      const { data, error } = await supabase
        .from("products")
        .update(updates as never)
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
    },
  })
}

// ============ ORDERS ============

export interface OrderWithProfile extends Order {
  profiles: { full_name: string | null; email: string | null } | null
}

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          profiles:user_id (full_name, email)
        `)
        .order("created_at", { ascending: false })

      if (error) throw error
      return (data ?? []) as unknown as OrderWithProfile[]
    },
  })
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          profiles:user_id (full_name, email),
          order_items (*)
        `)
        .eq("id", id)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!id,
  })
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Order["status"] }) => {
      const { data, error } = await supabase
        .from("orders")
        .update({ status, updated_at: new Date().toISOString() } as never)
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
    },
  })
}

// ============ USERS/PROFILES ============

export interface ProfileWithStats extends Profile {
  orders_count: number
  total_spent: number
}

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      // First get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false })

      if (profilesError) throw profilesError
      if (!profiles) return []

      // Get order stats for each user
      const { data: orderStats, error: statsError } = await supabase
        .from("orders")
        .select("user_id, total")

      if (statsError) throw statsError

      // Aggregate stats by user
      const statsByUser = (orderStats ?? []).reduce((acc, order) => {
        const userId = (order as { user_id: string; total: number }).user_id
        const total = (order as { user_id: string; total: number }).total
        if (!acc[userId]) {
          acc[userId] = { count: 0, total: 0 }
        }
        acc[userId].count++
        acc[userId].total += total || 0
        return acc
      }, {} as Record<string, { count: number; total: number }>)

      // Merge stats with profiles
      const profilesWithStats: ProfileWithStats[] = (profiles as Profile[]).map((profile) => ({
        ...profile,
        orders_count: statsByUser[profile.id]?.count || 0,
        total_spent: statsByUser[profile.id]?.total || 0,
      }))

      return profilesWithStats
    },
  })
}

// ============ REVIEWS ============

export interface ReviewWithDetails extends Review {
  profiles: { full_name: string | null; email: string | null } | null
  products: { name: string } | null
}

export function useReviews() {
  return useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select(`
          *,
          profiles:user_id (full_name, email),
          products:product_id (name)
        `)
        .order("created_at", { ascending: false })

      if (error) throw error
      return (data ?? []) as unknown as ReviewWithDetails[]
    },
  })
}

export function useApproveReview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, isApproved }: { id: string; isApproved: boolean }) => {
      const { data, error } = await supabase
        .from("reviews")
        .update({ is_approved: isApproved, updated_at: new Date().toISOString() } as never)
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] })
    },
  })
}

export function useDeleteReview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("reviews").delete().eq("id", id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] })
    },
  })
}

// ============ FEEDBACK ============

export interface FeedbackWithProfile extends Feedback {
  profiles: { full_name: string | null; email: string | null } | null
}

export function useFeedback() {
  return useQuery({
    queryKey: ["feedback"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("feedback")
        .select(`
          *,
          profiles:user_id (full_name, email)
        `)
        .order("created_at", { ascending: false })

      if (error) throw error
      return (data ?? []) as unknown as FeedbackWithProfile[]
    },
  })
}

export function useUpdateFeedbackStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await supabase
        .from("feedback")
        .update({ status } as never)
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedback"] })
    },
  })
}

// ============ DASHBOARD STATS ============

export interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  totalProducts: number
  totalUsers: number
  pendingOrders: number
  pendingReviews: number
  recentOrders: OrderWithProfile[]
  topProducts: Product[]
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      // Get total revenue and orders
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select(`
          *,
          profiles:user_id (full_name, email)
        `)
        .order("created_at", { ascending: false })

      if (ordersError) throw ordersError

      const orders = (ordersData ?? []) as unknown as OrderWithProfile[]

      const totalRevenue = orders
        .filter((o) => o.payment_status === "paid")
        .reduce((sum, o) => sum + (o.total || 0), 0)

      const pendingOrders = orders.filter((o) => o.status === "pending").length

      // Get total products
      const { count: totalProducts, error: productsError } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true })

      if (productsError) throw productsError

      // Get total users
      const { count: totalUsers, error: usersError } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })

      if (usersError) throw usersError

      // Get pending reviews
      const { count: pendingReviews, error: reviewsError } = await supabase
        .from("reviews")
        .select("*", { count: "exact", head: true })
        .eq("is_approved", false)

      if (reviewsError) throw reviewsError

      // Get top products (by order count)
      const { data: topProductsData, error: topProductsError } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(5)

      if (topProductsError) throw topProductsError

      return {
        totalRevenue,
        totalOrders: orders.length,
        totalProducts: totalProducts || 0,
        totalUsers: totalUsers || 0,
        pendingOrders,
        pendingReviews: pendingReviews || 0,
        recentOrders: orders.slice(0, 5),
        topProducts: (topProductsData ?? []) as Product[],
      } as DashboardStats
    },
  })
}
