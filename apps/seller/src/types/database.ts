export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          avatar_url: string | null
          phone_number: string | null
          role: "user" | "seller" | "admin"
          store_name: string | null
          store_description: string | null
          store_logo_url: string | null
          is_seller_approved: boolean | null
          seller_approved_at: string | null
          seller_commission_rate: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          phone_number?: string | null
          role?: "user" | "seller" | "admin"
          store_name?: string | null
          store_description?: string | null
          store_logo_url?: string | null
          is_seller_approved?: boolean | null
          seller_approved_at?: string | null
          seller_commission_rate?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          phone_number?: string | null
          role?: "user" | "seller" | "admin"
          store_name?: string | null
          store_description?: string | null
          store_logo_url?: string | null
          is_seller_approved?: boolean | null
          seller_approved_at?: string | null
          seller_commission_rate?: number | null
          created_at?: string
          updated_at?: string
        }
      }

      categories: {
        Row: {
          id: string
          name: string
          slug: string
          type: string | null
          parent_id: string | null
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          type?: string | null
          parent_id?: string | null
          display_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          type?: string | null
          parent_id?: string | null
          display_order?: number
          created_at?: string
        }
      }

      products: {
        Row: {
          id: string
          name: string
          slug: string
          seller_id: string | null
          brand: string | null
          description: string | null
          frame_type: string | null
          frame_material: string | null
          frame_color: string | null
          lens_width_mm: number | null
          bridge_width_mm: number | null
          temple_length_mm: number | null
          price_cents: number
          currency_code: string | null
          thumbnail_url: string | null
          is_active: boolean
          stock_quantity: number
          avg_rating: number | null
          ar_enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          seller_id?: string | null
          brand?: string | null
          description?: string | null
          frame_type?: string | null
          frame_material?: string | null
          frame_color?: string | null
          lens_width_mm?: number | null
          bridge_width_mm?: number | null
          temple_length_mm?: number | null
          price_cents: number
          currency_code?: string | null
          thumbnail_url?: string | null
          is_active?: boolean
          stock_quantity?: number
          avg_rating?: number | null
          ar_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          seller_id?: string | null
          brand?: string | null
          description?: string | null
          frame_type?: string | null
          frame_material?: string | null
          frame_color?: string | null
          lens_width_mm?: number | null
          bridge_width_mm?: number | null
          temple_length_mm?: number | null
          price_cents?: number
          currency_code?: string | null
          thumbnail_url?: string | null
          is_active?: boolean
          stock_quantity?: number
          avg_rating?: number | null
          ar_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
      }

      orders: {
        Row: {
          id: string
          user_id: string
          status: "pending" | "paid" | "shipped" | "delivered" | "cancelled"
          total_amount_cents: number
          currency_code: string | null
          shipping_address_json: Json | null
          payment_provider: string | null
          payment_reference: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          status?: "pending" | "paid" | "shipped" | "delivered" | "cancelled"
          total_amount_cents: number
          currency_code?: string | null
          shipping_address_json?: Json | null
          payment_provider?: string | null
          payment_reference?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          status?: "pending" | "paid" | "shipped" | "delivered" | "cancelled"
          total_amount_cents?: number
          currency_code?: string | null
          shipping_address_json?: Json | null
          payment_provider?: string | null
          payment_reference?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }

      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          unit_price_cents: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          unit_price_cents: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          unit_price_cents?: number
          created_at?: string
          updated_at?: string
        }
      }

      reviews: {
        Row: {
          id: string
          seller_id: string
          product_id: string
          user_id: string
          order_id: string | null
          rating: number
          title: string | null
          body: string | null
          is_verified_purchase: boolean
          helpful_count: number
          is_approved: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          seller_id: string
          product_id: string
          user_id: string
          order_id?: string | null
          rating: number
          title?: string | null
          body?: string | null
          is_verified_purchase?: boolean
          helpful_count?: number
          is_approved?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          seller_id?: string
          product_id?: string
          user_id?: string
          order_id?: string | null
          rating?: number
          title?: string | null
          body?: string | null
          is_verified_purchase?: boolean
          helpful_count?: number
          is_approved?: boolean
          created_at?: string
          updated_at?: string
        }
      }

      feedback: {
        Row: {
          id: string
          user_id: string | null
          type: string
          subject: string
          message: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          type: string
          subject: string
          message: string
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          type?: string
          subject?: string
          message?: string
          status?: string
          created_at?: string
        }
      }

      ar_assets: {
        Row: {
          id: string
          product_id: string
          variant_id: string | null
          model_url: string
          model_format: string
          default_scale: number
          default_vertical_offset: number
          default_horizontal_offset: number
          platform: string
          is_active: boolean
          file_size_bytes: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          variant_id?: string | null
          model_url: string
          model_format?: string
          default_scale?: number
          default_vertical_offset?: number
          default_horizontal_offset?: number
          platform?: string
          is_active?: boolean
          file_size_bytes?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          variant_id?: string | null
          model_url?: string
          model_format?: string
          default_scale?: number
          default_vertical_offset?: number
          default_horizontal_offset?: number
          platform?: string
          is_active?: boolean
          file_size_bytes?: number | null
          created_at?: string
          updated_at?: string
        }
      }

      seller_stats: {
        Row: {
          id: string
          seller_id: string
          date: string
          total_orders: number
          total_revenue_cents: number
          total_products: number
          total_views: number
          created_at: string
        }
        Insert: {
          id?: string
          seller_id: string
          date?: string
          total_orders?: number
          total_revenue_cents?: number
          total_products?: number
          total_views?: number
          created_at?: string
        }
        Update: {
          id?: string
          seller_id?: string
          date?: string
          total_orders?: number
          total_revenue_cents?: number
          total_products?: number
          total_views?: number
          created_at?: string
        }
      }

      seller_payouts: {
        Row: {
          id: string
          seller_id: string
          amount_cents: number
          currency: string
          status: "pending" | "processing" | "completed" | "failed"
          payout_method: string | null
          payout_details: Json | null
          processed_at: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          seller_id: string
          amount_cents: number
          currency?: string
          status?: "pending" | "processing" | "completed" | "failed"
          payout_method?: string | null
          payout_details?: Json | null
          processed_at?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          seller_id?: string
          amount_cents?: number
          currency?: string
          status?: "pending" | "processing" | "completed" | "failed"
          payout_method?: string | null
          payout_details?: Json | null
          processed_at?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }

    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"]
export type Product = Database["public"]["Tables"]["products"]["Row"]
export type Category = Database["public"]["Tables"]["categories"]["Row"]
export type Order = Database["public"]["Tables"]["orders"]["Row"]
export type OrderItem = Database["public"]["Tables"]["order_items"]["Row"]
export type Review = Database["public"]["Tables"]["reviews"]["Row"]
export type Feedback = Database["public"]["Tables"]["feedback"]["Row"]
export type ARAsset = Database["public"]["Tables"]["ar_assets"]["Row"]
export type SellerPayout = Database["public"]["Tables"]["seller_payouts"]["Row"]
export type SellerStat = Database["public"]["Tables"]["seller_stats"]["Row"]
