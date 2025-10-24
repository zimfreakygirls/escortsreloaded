export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_audit_log: {
        Row: {
          action: string
          admin_user_id: string | null
          created_at: string | null
          id: string
          ip_address: unknown
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          admin_user_id?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          admin_user_id?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
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
      user_profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
          username: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
          username?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
          username?: string | null
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
      admin_delete_user: {
        Args: { target_user_id: string }
        Returns: undefined
      }
      is_admin: { Args: { user_id?: string }; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
