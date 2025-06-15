export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_settings: {
        Row: {
          created_at: string | null
          id: string
          signup_code: string | null
          signup_enabled: boolean | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          signup_code?: string | null
          signup_enabled?: boolean | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          signup_code?: string | null
          signup_enabled?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      admin_users: {
        Row: {
          created_at: string | null
          id: string
        }
        Insert: {
          created_at?: string | null
          id: string
        }
        Update: {
          created_at?: string | null
          id?: string
        }
        Relationships: []
      }
      contact_info: {
        Row: {
          created_at: string | null
          disclaimer: string
          email: string
          hours: string
          id: string
          phone: string
        }
        Insert: {
          created_at?: string | null
          disclaimer: string
          email: string
          hours: string
          id: string
          phone: string
        }
        Update: {
          created_at?: string | null
          disclaimer?: string
          email?: string
          hours?: string
          id?: string
          phone?: string
        }
        Relationships: []
      }
      countries: {
        Row: {
          active: boolean | null
          created_at: string | null
          currency: string | null
          id: string
          name: string
          payment_name: string | null
          payment_phone: string | null
          signup_price: number | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          currency?: string | null
          id?: string
          name: string
          payment_name?: string | null
          payment_phone?: string | null
          signup_price?: number | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          currency?: string | null
          id?: string
          name?: string
          payment_name?: string | null
          payment_phone?: string | null
          signup_price?: number | null
        }
        Relationships: []
      }
      payment_verifications: {
        Row: {
          created_at: string
          id: string
          proof_image_url: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          proof_image_url: string
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          proof_image_url?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: number
          city: string
          country: string
          created_at: string | null
          currency: string | null
          id: string
          images: string[] | null
          is_premium: boolean | null
          is_verified: boolean | null
          is_video: boolean | null
          location: string
          name: string
          phone: string | null
          price_per_hour: number
          video_url: string | null
        }
        Insert: {
          age: number
          city: string
          country: string
          created_at?: string | null
          currency?: string | null
          id?: string
          images?: string[] | null
          is_premium?: boolean | null
          is_verified?: boolean | null
          is_video?: boolean | null
          location: string
          name: string
          phone?: string | null
          price_per_hour: number
          video_url?: string | null
        }
        Update: {
          age?: number
          city?: string
          country?: string
          created_at?: string | null
          currency?: string | null
          id?: string
          images?: string[] | null
          is_premium?: boolean | null
          is_verified?: boolean | null
          is_video?: boolean | null
          location?: string
          name?: string
          phone?: string | null
          price_per_hour?: number
          video_url?: string | null
        }
        Relationships: []
      }
      settings: {
        Row: {
          created_at: string
          currency: string
          id: string
          profiles_per_page: number
          signup_price: number | null
        }
        Insert: {
          created_at?: string
          currency?: string
          id: string
          profiles_per_page?: number
          signup_price?: number | null
        }
        Update: {
          created_at?: string
          currency?: string
          id?: string
          profiles_per_page?: number
          signup_price?: number | null
        }
        Relationships: []
      }
      site_status: {
        Row: {
          id: string
          is_online: boolean
          maintenance_message: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          id?: string
          is_online?: boolean
          maintenance_message?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          id?: string
          is_online?: boolean
          maintenance_message?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      user_status: {
        Row: {
          approved: boolean
          banned: boolean
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          approved?: boolean
          banned?: boolean
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          approved?: boolean
          banned?: boolean
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
