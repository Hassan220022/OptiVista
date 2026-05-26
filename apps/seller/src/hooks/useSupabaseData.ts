import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/AuthContext"

export type SellerOrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled"

export interface SellerProduct {
  id: string
  name: string
  slug: string
  brand: string | null
  description: string | null
  price: number
  price_cents: number
  currency: string
  thumbnail_url: string | null
  is_active: boolean
  stock_quantity: number
  avg_rating: number | null
  ar_enabled: boolean
  created_at: string
  updated_at: string
}

export interface SellerOrder {
  id: string
  order_number: string
  customer: string
  total: number
  seller_total: number
  currency: string
  status: SellerOrderStatus
  items: number
  created_at: string
}

export interface SellerReview {
  id: string
  customer: string
  product: string
  rating: number
  title: string | null
  body: string | null
  is_approved: boolean
  is_verified_purchase: boolean
  helpful_count: number
  created_at: string
}

export interface SellerPayout {
  id: string
  amount: number
  currency: string
  status: "pending" | "processing" | "completed" | "failed"
  payout_method: string | null
  processed_at: string | null
  created_at: string
}

export interface SellerProfile {
  id: string
  full_name: string | null
  phone_number: string | null
  store_name: string | null
  store_description: string | null
  store_logo_url: string | null
  seller_commission_rate: number | null
  is_seller_approved: boolean | null
}

export interface SellerStats {
  totalRevenue: number
  pendingRevenue: number
  totalOrders: number
  pendingOrders: number
  totalProducts: number
  activeProducts: number
  totalReviews: number
  averageRating: number
  totalViews: number | null
  recentOrders: SellerOrder[]
  topProducts: Array<SellerProduct & { sold: number; revenue: number }>
}

type DbProduct = {
  id: string
  name: string
  slug: string
  brand: string | null
  description: string | null
  price_cents: number
  currency_code: string | null
  thumbnail_url: string | null
  is_active: boolean | null
  stock_quantity: number | null
  avg_rating: number | null
  ar_enabled: boolean | null
  created_at: string
  updated_at: string
}

type OrderItemRow = {
  order_id: string
  quantity: number
  unit_price_cents: number
  products: DbProduct | null
  orders: {
    id: string
    user_id: string
    status: SellerOrderStatus | null
    total_amount_cents: number
    currency_code: string | null
    created_at: string
    profiles?: { full_name: string | null } | null
  } | null
}

function cents(centsValue: number | null | undefined) {
  return (centsValue ?? 0) / 100
}

function toProduct(row: DbProduct): SellerProduct {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    brand: row.brand,
    description: row.description,
    price: cents(row.price_cents),
    price_cents: row.price_cents,
    currency: row.currency_code ?? "USD",
    thumbnail_url: row.thumbnail_url,
    is_active: row.is_active ?? false,
    stock_quantity: row.stock_quantity ?? 0,
    avg_rating: row.avg_rating,
    ar_enabled: row.ar_enabled ?? false,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

function orderNumber(id: string) {
  return `ORD-${id.slice(0, 8).toUpperCase()}`
}

function toOrders(rows: OrderItemRow[]): SellerOrder[] {
  const byOrder = new Map<string, SellerOrder>()

  for (const row of rows) {
    if (!row.orders) continue
    const existing = byOrder.get(row.orders.id)
    const lineTotal = cents(row.unit_price_cents * row.quantity)

    if (existing) {
      existing.items += row.quantity
      existing.seller_total += lineTotal
      continue
    }

    byOrder.set(row.orders.id, {
      id: row.orders.id,
      order_number: orderNumber(row.orders.id),
      customer: row.orders.profiles?.full_name ?? "Customer",
      total: cents(row.orders.total_amount_cents),
      seller_total: lineTotal,
      currency: row.orders.currency_code ?? "USD",
      status: row.orders.status ?? "pending",
      items: row.quantity,
      created_at: row.orders.created_at,
    })
  }

  return Array.from(byOrder.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
}

function useSellerId() {
  const { user } = useAuth()
  return user?.id ?? null
}

export function useSellerProducts() {
  const sellerId = useSellerId()

  return useQuery({
    queryKey: ["seller", sellerId, "products"],
    enabled: Boolean(sellerId),
    queryFn: async () => {
      if (!sellerId) throw new Error("Not signed in")
      const { data, error } = await supabase
        .from("products")
        .select("id, name, slug, brand, description, price_cents, currency_code, thumbnail_url, is_active, stock_quantity, avg_rating, ar_enabled, created_at, updated_at")
        .eq("seller_id", sellerId)
        .order("created_at", { ascending: false })

      if (error) throw error
      return ((data ?? []) as DbProduct[]).map(toProduct)
    },
  })
}

export function useSellerOrders() {
  const sellerId = useSellerId()

  return useQuery({
    queryKey: ["seller", sellerId, "orders"],
    enabled: Boolean(sellerId),
    queryFn: async () => {
      if (!sellerId) throw new Error("Not signed in")
      const { data, error } = await supabase
        .from("order_items")
        .select("order_id, quantity, unit_price_cents, products!inner(id, name, slug, brand, description, price_cents, currency_code, thumbnail_url, is_active, stock_quantity, avg_rating, ar_enabled, created_at, updated_at, seller_id), orders!inner(id, user_id, status, total_amount_cents, currency_code, created_at, profiles:user_id(full_name))")
        .eq("products.seller_id", sellerId)

      if (error) throw error
      return toOrders((data ?? []) as unknown as OrderItemRow[])
    },
  })
}

export function useSellerReviews() {
  const sellerId = useSellerId()

  return useQuery({
    queryKey: ["seller", sellerId, "reviews"],
    enabled: Boolean(sellerId),
    queryFn: async () => {
      if (!sellerId) throw new Error("Not signed in")
      const { data, error } = await supabase
        .from("reviews")
        .select("id, rating, title, body, is_approved, is_verified_purchase, helpful_count, created_at, products:product_id(name), profiles:user_id(full_name)")
        .eq("seller_id", sellerId)
        .order("created_at", { ascending: false })

      if (error) throw error
      return ((data ?? []) as Array<{
        id: string
        rating: number | null
        title: string | null
        body: string | null
        is_approved: boolean | null
        is_verified_purchase: boolean | null
        helpful_count: number | null
        created_at: string
        products?: { name: string | null } | null
        profiles?: { full_name: string | null } | null
      }>).map((row) => ({
        id: row.id,
        customer: row.profiles?.full_name ?? "Customer",
        product: row.products?.name ?? "Product",
        rating: row.rating ?? 0,
        title: row.title,
        body: row.body,
        is_approved: row.is_approved ?? false,
        is_verified_purchase: row.is_verified_purchase ?? false,
        helpful_count: row.helpful_count ?? 0,
        created_at: row.created_at,
      })) satisfies SellerReview[]
    },
  })
}

export function useSellerPayouts() {
  const sellerId = useSellerId()

  return useQuery({
    queryKey: ["seller", sellerId, "payouts"],
    enabled: Boolean(sellerId),
    queryFn: async () => {
      if (!sellerId) throw new Error("Not signed in")
      const { data, error } = await supabase
        .from("seller_payouts")
        .select("id, amount_cents, currency, status, payout_method, processed_at, created_at")
        .eq("seller_id", sellerId)
        .order("created_at", { ascending: false })

      if (error) throw error
      return ((data ?? []) as Array<{
        id: string
        amount_cents: number
        currency: string | null
        status: SellerPayout["status"] | null
        payout_method: string | null
        processed_at: string | null
        created_at: string
      }>).map((row) => ({
        id: row.id,
        amount: cents(row.amount_cents),
        currency: row.currency ?? "USD",
        status: row.status ?? "pending",
        payout_method: row.payout_method,
        processed_at: row.processed_at,
        created_at: row.created_at,
      })) satisfies SellerPayout[]
    },
  })
}

export function useSellerProfile() {
  const sellerId = useSellerId()

  return useQuery({
    queryKey: ["seller", sellerId, "profile"],
    enabled: Boolean(sellerId),
    queryFn: async () => {
      if (!sellerId) throw new Error("Not signed in")
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, phone_number, store_name, store_description, store_logo_url, seller_commission_rate, is_seller_approved")
        .eq("id", sellerId)
        .single()

      if (error) throw error
      return data as SellerProfile
    },
  })
}

export function useUpdateSellerProfile() {
  const queryClient = useQueryClient()
  const sellerId = useSellerId()

  return useMutation({
    mutationFn: async (updates: Pick<SellerProfile, "store_name" | "store_description" | "phone_number" | "store_logo_url">) => {
      if (!sellerId) throw new Error("Not signed in")
      const { error } = await supabase
        .from("profiles")
        .update({ ...updates, updated_at: new Date().toISOString() } as never)
        .eq("id", sellerId)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller", sellerId, "profile"] })
    },
  })
}

export function useUpdateSellerProduct() {
  const queryClient = useQueryClient()
  const sellerId = useSellerId()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<SellerProduct> }) => {
      if (!sellerId) throw new Error("Not signed in")
      const dbUpdates: Record<string, unknown> = { updated_at: new Date().toISOString() }
      if (updates.is_active !== undefined) dbUpdates.is_active = updates.is_active
      if (updates.stock_quantity !== undefined) dbUpdates.stock_quantity = updates.stock_quantity

      const { error } = await supabase
        .from("products")
        .update(dbUpdates as never)
        .eq("id", id)
        .eq("seller_id", sellerId)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller", sellerId, "products"] })
      queryClient.invalidateQueries({ queryKey: ["seller", sellerId, "stats"] })
    },
  })
}

export function useSellerStats() {
  const sellerId = useSellerId()
  const productsQuery = useSellerProducts()
  const ordersQuery = useSellerOrders()
  const reviewsQuery = useSellerReviews()

  return useQuery({
    queryKey: ["seller", sellerId, "stats", productsQuery.data, ordersQuery.data, reviewsQuery.data],
    enabled: Boolean(sellerId) && productsQuery.isSuccess && ordersQuery.isSuccess && reviewsQuery.isSuccess,
    queryFn: async () => {
      if (!sellerId) throw new Error("Not signed in")
      const products = productsQuery.data ?? []
      const orders = ordersQuery.data ?? []
      const reviews = reviewsQuery.data ?? []

      const deliveredStatuses: SellerOrderStatus[] = ["paid", "shipped", "delivered"]
      const totalRevenue = orders
        .filter((order) => deliveredStatuses.includes(order.status))
        .reduce((sum, order) => sum + order.seller_total, 0)
      const pendingRevenue = orders
        .filter((order) => order.status === "pending")
        .reduce((sum, order) => sum + order.seller_total, 0)
      const averageRating = reviews.length
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
        : 0

      const soldByProduct = new Map<string, { sold: number; revenue: number }>()
      const { data: itemRows, error } = await supabase
        .from("order_items")
        .select("product_id, quantity, unit_price_cents, products!inner(seller_id)")
        .eq("products.seller_id", sellerId)
      if (error) throw error

      for (const item of (itemRows ?? []) as Array<{ product_id: string; quantity: number; unit_price_cents: number }>) {
        const current = soldByProduct.get(item.product_id) ?? { sold: 0, revenue: 0 }
        current.sold += item.quantity
        current.revenue += cents(item.unit_price_cents * item.quantity)
        soldByProduct.set(item.product_id, current)
      }

      return {
        totalRevenue,
        pendingRevenue,
        totalOrders: orders.length,
        pendingOrders: orders.filter((order) => order.status === "pending").length,
        totalProducts: products.length,
        activeProducts: products.filter((product) => product.is_active).length,
        totalReviews: reviews.length,
        averageRating,
        totalViews: null,
        recentOrders: orders.slice(0, 5),
        topProducts: products
          .map((product) => ({
            ...product,
            sold: soldByProduct.get(product.id)?.sold ?? 0,
            revenue: soldByProduct.get(product.id)?.revenue ?? 0,
          }))
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 5),
      } satisfies SellerStats
    },
  })
}
