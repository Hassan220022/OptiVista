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
          phone: string | null
          role: "shopper" | "admin"
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          role?: "shopper" | "admin"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          role?: "shopper" | "admin"
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
          sku: string | null
          name: string
          slug: string
          description: string | null
          short_description: string | null
          brand: string | null
          base_price: number
          currency: string
          is_active: boolean
          is_ar_enabled: boolean
          primary_image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          sku?: string | null
          name: string
          slug: string
          description?: string | null
          short_description?: string | null
          brand?: string | null
          base_price: number
          currency?: string
          is_active?: boolean
          is_ar_enabled?: boolean
          primary_image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          sku?: string | null
          name?: string
          slug?: string
          description?: string | null
          short_description?: string | null
          brand?: string | null
          base_price?: number
          currency?: string
          is_active?: boolean
          is_ar_enabled?: boolean
          primary_image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
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
          shipping_address: Json
          billing_address: Json | null
          payment_method: string | null
          payment_status: "pending" | "paid" | "failed" | "refunded"
          payment_intent_id: string | null
          notes: string | null
          tracking_number: string | null
          tracking_url: string | null
          carrier: string | null
          estimated_delivery: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          order_number: string
          status?: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
          subtotal: number
          shipping_cost?: number
          tax_amount?: number
          discount_amount?: number
          total: number
          currency?: string
          shipping_address: Json
          billing_address?: Json | null
          payment_method?: string | null
          payment_status?: "pending" | "paid" | "failed" | "refunded"
          payment_intent_id?: string | null
          notes?: string | null
          tracking_number?: string | null
          tracking_url?: string | null
          carrier?: string | null
          estimated_delivery?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          order_number?: string
          status?: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
          subtotal?: number
          shipping_cost?: number
          tax_amount?: number
          discount_amount?: number
          total?: number
          currency?: string
          shipping_address?: Json
          billing_address?: Json | null
          payment_method?: string | null
          payment_status?: "pending" | "paid" | "failed" | "refunded"
          payment_intent_id?: string | null
          notes?: string | null
          tracking_number?: string | null
          tracking_url?: string | null
          carrier?: string | null
          estimated_delivery?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          variant_id: string | null
          product_name: string
          variant_name: string | null
          quantity: number
          unit_price: number
          total_price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          variant_id?: string | null
          product_name: string
          variant_name?: string | null
          quantity: number
          unit_price: number
          total_price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          variant_id?: string | null
          product_name?: string
          variant_name?: string | null
          quantity?: number
          unit_price?: number
          total_price?: number
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          user_id: string
          product_id: string
          order_id: string | null
          rating: number
          title: string | null
          body: string | null
          is_verified_purchase: boolean
          is_approved: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          order_id?: string | null
          rating: number
          title?: string | null
          body?: string | null
          is_verified_purchase?: boolean
          is_approved?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          order_id?: string | null
          rating?: number
          title?: string | null
          body?: string | null
          is_verified_purchase?: boolean
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
