import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"

type DbProduct = {
  id: string
  name: string
  slug: string
  brand: string | null
  description: string | null
  frame_type: string | null
  price_cents: number
  currency_code: string | null
  thumbnail_url: string | null
  is_active: boolean | null
  ar_enabled: boolean | null
  created_at: string
  updated_at: string
}

type DbProfile = {
  id: string
  full_name: string | null
  avatar_url: string | null
  phone_number: string | null
  role: string | null
  created_at: string
  updated_at: string
}

type DbOrder = {
  id: string
  user_id: string
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled"
  total_amount_cents: number
  currency_code: string | null
  shipping_address_json: Record<string, unknown> | null
  payment_provider: string | null
  payment_reference: string | null
  created_at: string
  updated_at: string
  profiles?: { full_name: string | null } | null
}

type DbReview = {
  id: string
  user_id: string
  product_id: string
  rating: number
  title: string | null
  body: string | null
  is_verified_purchase: boolean | null
  is_approved: boolean | null
  created_at: string
  profiles?: { full_name: string | null } | null
  products?: { name: string | null } | null
}

type DbFeedback = {
  id: string
  user_id: string | null
  type: string | null
  rating: number | null
  message: string | null
  created_at: string
  profiles?: { full_name: string | null } | null
}

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

export type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled"

export interface Order {
  id: string
  user_id: string
  order_number: string
  status: OrderStatus
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
  role: "shopper" | "seller" | "admin"
  created_at: string
  updated_at: string
}

export interface ProfileWithStats extends Profile {
  orders_count: number
  total_spent: number
}

function centsToCurrency(cents: number | null | undefined) {
  return (cents ?? 0) / 100
}

function toProduct(row: DbProduct): Product {
  return {
    id: row.id,
    name: row.name,
    sku: null,
    slug: row.slug,
    brand: row.brand,
    description: row.description,
    short_description: row.frame_type,
    base_price: centsToCurrency(row.price_cents),
    price_cents: row.price_cents,
    currency: row.currency_code ?? "USD",
    is_active: row.is_active ?? true,
    is_ar_enabled: row.ar_enabled ?? false,
    primary_image_url: row.thumbnail_url,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

function toOrder(row: DbOrder): Order {
  const total = centsToCurrency(row.total_amount_cents)
  const paidStatuses: OrderStatus[] = ["paid", "shipped", "delivered"]

  return {
    id: row.id,
    user_id: row.user_id,
    order_number: `ORD-${row.id.slice(0, 8).toUpperCase()}`,
    status: row.status,
    subtotal: total,
    shipping_cost: 0,
    tax_amount: 0,
    discount_amount: 0,
    total,
    currency: row.currency_code ?? "USD",
    shipping_address: row.shipping_address_json ?? {},
    payment_status: paidStatuses.includes(row.status) ? "paid" : "pending",
    tracking_number: row.payment_reference,
    carrier: row.payment_provider,
    created_at: row.created_at,
    updated_at: row.updated_at,
    profiles: {
      full_name: row.profiles?.full_name ?? null,
      email: null,
    },
  }
}

function toReview(row: DbReview): Review {
  return {
    id: row.id,
    user_id: row.user_id,
    product_id: row.product_id,
    rating: row.rating,
    title: row.title,
    body: row.body,
    is_verified_purchase: row.is_verified_purchase ?? false,
    is_approved: row.is_approved ?? false,
    created_at: row.created_at,
    profiles: {
      full_name: row.profiles?.full_name ?? null,
      email: null,
    },
    products: {
      name: row.products?.name ?? "Unknown product",
    },
  }
}

function toFeedback(row: DbFeedback): Feedback {
  const type = row.type ?? "other"
  const message = row.message ?? ""

  return {
    id: row.id,
    user_id: row.user_id,
    type,
    subject: type.replaceAll("_", " "),
    message,
    status: "new",
    created_at: row.created_at,
    profiles: {
      full_name: row.profiles?.full_name ?? null,
      email: null,
    },
  }
}

function toProfile(row: DbProfile): Profile {
  const role = row.role === "admin" || row.role === "seller" ? row.role : "shopper"

  return {
    id: row.id,
    email: null,
    full_name: row.full_name,
    avatar_url: row.avatar_url,
    phone: row.phone_number,
    role,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function toProductUpdate(updates: Partial<Product>) {
  const dbUpdates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  }

  if (updates.name !== undefined) dbUpdates.name = updates.name
  if (updates.slug !== undefined) dbUpdates.slug = updates.slug
  if (updates.brand !== undefined) dbUpdates.brand = updates.brand
  if (updates.description !== undefined) dbUpdates.description = updates.description
  if (updates.price_cents !== undefined) dbUpdates.price_cents = updates.price_cents
  if (updates.base_price !== undefined) dbUpdates.price_cents = Math.round(updates.base_price * 100)
  if (updates.currency !== undefined) dbUpdates.currency_code = updates.currency
  if (updates.is_active !== undefined) dbUpdates.is_active = updates.is_active
  if (updates.is_ar_enabled !== undefined) dbUpdates.ar_enabled = updates.is_ar_enabled
  if (updates.primary_image_url !== undefined) dbUpdates.thumbnail_url = updates.primary_image_url

  return dbUpdates
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const [{ data: ordersData, error: ordersError }, { count: totalProducts, error: productsError }, { count: totalUsers, error: usersError }, { count: pendingReviews, error: reviewsError }, { data: topProductsData, error: topProductsError }, { count: pendingFeedback, error: feedbackError }] = await Promise.all([
        supabase.from("orders").select("*, profiles:user_id(full_name)").order("created_at", { ascending: false }),
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("reviews").select("*", { count: "exact", head: true }).eq("is_approved", false),
        supabase.from("products").select("*").eq("is_active", true).order("created_at", { ascending: false }).limit(5),
        supabase.from("feedback").select("*", { count: "exact", head: true }),
      ])

      if (ordersError) throw ordersError
      if (productsError) throw productsError
      if (usersError) throw usersError
      if (reviewsError) throw reviewsError
      if (topProductsError) throw topProductsError
      if (feedbackError) throw feedbackError

      const orders = ((ordersData ?? []) as unknown as DbOrder[]).map(toOrder)

      return {
        total_revenue: orders.reduce((sum, order) => sum + (order.payment_status === "paid" ? order.total : 0), 0),
        total_orders: orders.length,
        total_products: totalProducts ?? 0,
        total_users: totalUsers ?? 0,
        pending_orders: orders.filter((order) => order.status === "pending").length,
        pending_reviews: pendingReviews ?? 0,
        pending_feedback: pendingFeedback ?? 0,
        recent_orders: orders.slice(0, 5),
        top_products: ((topProductsData ?? []) as unknown as DbProduct[]).map(toProduct),
      } satisfies DashboardStats
    },
  })
}

export function useAdminProducts() {
  return useQuery({
    queryKey: ["admin", "products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      return ((data ?? []) as unknown as DbProduct[]).map(toProduct)
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
      const { data, error } = await supabase
        .from("products")
        .insert({
          name: product.name,
          slug: `${slugify(product.name)}-${Date.now()}`,
          brand: product.brand,
          description: product.description,
          price_cents: product.price_cents,
          is_active: true,
        } as never)
        .select("*")
        .single()

      if (error) throw error
      return toProduct(data as unknown as DbProduct)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] })
    },
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Product> }) => {
      const { data, error } = await supabase
        .from("products")
        .update(toProductUpdate(updates) as never)
        .eq("id", id)
        .select("*")
        .single()

      if (error) throw error
      return toProduct(data as unknown as DbProduct)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] })
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] })
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
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] })
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] })
    },
  })
}

export function useAdminOrders(params?: { status?: string }) {
  return useQuery({
    queryKey: ["admin", "orders", params],
    queryFn: async () => {
      let query = supabase
        .from("orders")
        .select("*, profiles:user_id(full_name)")
        .order("created_at", { ascending: false })

      if (params?.status && params.status !== "all") {
        query = query.eq("status", params.status)
      }

      const { data, error } = await query
      if (error) throw error

      const items = ((data ?? []) as unknown as DbOrder[]).map(toOrder)
      return { items, total: items.length }
    },
  })
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: OrderStatus; note?: string }) => {
      const { data, error } = await supabase
        .from("orders")
        .update({ status, updated_at: new Date().toISOString() } as never)
        .eq("id", id)
        .select("*, profiles:user_id(full_name)")
        .single()

      if (error) throw error
      return toOrder(data as unknown as DbOrder)
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
    mutationFn: async ({ id, tracking }: { id: string; tracking: { tracking_number: string; carrier: string } }) => {
      const { data, error } = await supabase
        .from("orders")
        .update({
          payment_reference: tracking.tracking_number,
          payment_provider: tracking.carrier,
          updated_at: new Date().toISOString(),
        } as never)
        .eq("id", id)
        .select("*, profiles:user_id(full_name)")
        .single()

      if (error) throw error
      return toOrder(data as unknown as DbOrder)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] })
    },
  })
}

export function useAdminReviews(params?: { status?: string }) {
  return useQuery({
    queryKey: ["admin", "reviews", params],
    queryFn: async () => {
      let query = supabase
        .from("reviews")
        .select("*, profiles:user_id(full_name), products:product_id(name)")
        .order("created_at", { ascending: false })

      if (params?.status === "approved") query = query.eq("is_approved", true)
      if (params?.status === "pending") query = query.eq("is_approved", false)

      const { data, error } = await query
      if (error) throw error
      return ((data ?? []) as unknown as DbReview[]).map(toReview)
    },
  })
}

export function useModerateReview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, is_approved }: { id: string; is_approved: boolean; rejection_reason?: string }) => {
      const { data, error } = await supabase
        .from("reviews")
        .update({ is_approved, updated_at: new Date().toISOString() } as never)
        .eq("id", id)
        .select("*, profiles:user_id(full_name), products:product_id(name)")
        .single()

      if (error) throw error
      return toReview(data as unknown as DbReview)
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
      const { error } = await supabase.from("reviews").delete().eq("id", id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] })
    },
  })
}

export function useAdminFeedback(params?: { type?: string }) {
  return useQuery({
    queryKey: ["admin", "feedback", params],
    queryFn: async () => {
      let query = supabase
        .from("feedback")
        .select("*, profiles:user_id(full_name)")
        .order("created_at", { ascending: false })

      if (params?.type && params.type !== "all") query = query.eq("type", params.type)

      const { data, error } = await query
      if (error) throw error
      return ((data ?? []) as unknown as DbFeedback[]).map(toFeedback)
    },
  })
}

export function useUpdateFeedbackStatus() {
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string; admin_notes?: string }) => ({ id, status }),
  })
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: async () => {
      const [{ data: profiles, error: profilesError }, { data: orderStats, error: statsError }] = await Promise.all([
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
        supabase.from("orders").select("user_id, total_amount_cents"),
      ])

      if (profilesError) throw profilesError
      if (statsError) throw statsError

      const statsByUser = ((orderStats ?? []) as unknown as Array<{ user_id: string; total_amount_cents: number }>).reduce(
        (acc, order) => {
          if (!acc[order.user_id]) acc[order.user_id] = { count: 0, total: 0 }
          acc[order.user_id].count++
          acc[order.user_id].total += centsToCurrency(order.total_amount_cents)
          return acc
        },
        {} as Record<string, { count: number; total: number }>
      )

      return ((profiles ?? []) as unknown as DbProfile[]).map((row) => {
        const profile = toProfile(row)
        return {
          ...profile,
          orders_count: statsByUser[profile.id]?.count ?? 0,
          total_spent: statsByUser[profile.id]?.total ?? 0,
        }
      }) satisfies ProfileWithStats[]
    },
  })
}
