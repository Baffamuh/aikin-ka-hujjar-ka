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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      complaints: {
        Row: {
          category: string
          created_at: string
          email: string | null
          full_name: string
          id: string
          lga: string
          message: string
          phone: string
          public_remarks: string | null
          status: string
          subject: string
          tracking_code: string
          updated_at: string
          ward: string
        }
        Insert: {
          category: string
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          lga: string
          message: string
          phone: string
          public_remarks?: string | null
          status?: string
          subject: string
          tracking_code: string
          updated_at?: string
          ward: string
        }
        Update: {
          category?: string
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          lga?: string
          message?: string
          phone?: string
          public_remarks?: string | null
          status?: string
          subject?: string
          tracking_code?: string
          updated_at?: string
          ward?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string
          description: string | null
          event_type: string
          id: string
          image_url: string | null
          lga: string
          published: boolean
          starts_at: string
          title: string
          venue: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          event_type?: string
          id?: string
          image_url?: string | null
          lga?: string
          published?: boolean
          starts_at: string
          title: string
          venue?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          event_type?: string
          id?: string
          image_url?: string | null
          lga?: string
          published?: boolean
          starts_at?: string
          title?: string
          venue?: string | null
        }
        Relationships: []
      }
      media_items: {
        Row: {
          caption: string | null
          category: string
          created_at: string
          id: string
          media_type: string
          sort_order: number
          title: string
          url: string
        }
        Insert: {
          caption?: string | null
          category?: string
          created_at?: string
          id?: string
          media_type?: string
          sort_order?: number
          title: string
          url: string
        }
        Update: {
          caption?: string | null
          category?: string
          created_at?: string
          id?: string
          media_type?: string
          sort_order?: number
          title?: string
          url?: string
        }
        Relationships: []
      }
      news_articles: {
        Row: {
          body: string | null
          category: string
          created_at: string
          excerpt: string | null
          id: string
          image_url: string | null
          published: boolean
          published_at: string
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          body?: string | null
          category?: string
          created_at?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          published?: boolean
          published_at?: string
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          body?: string | null
          category?: string
          created_at?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          published?: boolean
          published_at?: string
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          category: string
          created_at: string
          featured: boolean
          id: string
          image_url: string | null
          lga: string
          location: string | null
          scope: string | null
          slug: string
          sort_order: number
          status: string
          summary: string | null
          tenure: string
          title: string
          updated_at: string
          year: number | null
        }
        Insert: {
          category: string
          created_at?: string
          featured?: boolean
          id?: string
          image_url?: string | null
          lga?: string
          location?: string | null
          scope?: string | null
          slug: string
          sort_order?: number
          status?: string
          summary?: string | null
          tenure?: string
          title: string
          updated_at?: string
          year?: number | null
        }
        Update: {
          category?: string
          created_at?: string
          featured?: boolean
          id?: string
          image_url?: string | null
          lga?: string
          location?: string | null
          scope?: string | null
          slug?: string
          sort_order?: number
          status?: string
          summary?: string | null
          tenure?: string
          title?: string
          updated_at?: string
          year?: number | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          email: string
          hero_subtitle: string
          hero_title: string
          id: number
          office_address: string
          office_hours: string
          phone: string
          slogan: string
          updated_at: string
        }
        Insert: {
          email?: string
          hero_subtitle?: string
          hero_title?: string
          id?: number
          office_address?: string
          office_hours?: string
          phone?: string
          slogan?: string
          updated_at?: string
        }
        Update: {
          email?: string
          hero_subtitle?: string
          hero_title?: string
          id?: number
          office_address?: string
          office_hours?: string
          phone?: string
          slogan?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_exists: { Args: never; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      submit_complaint: {
        Args: {
          _category: string
          _email: string
          _full_name: string
          _lga: string
          _message: string
          _phone: string
          _subject: string
          _ward: string
        }
        Returns: string
      }
      track_complaint: {
        Args: { _code: string }
        Returns: {
          category: string
          created_at: string
          lga: string
          public_remarks: string
          status: string
          subject: string
          tracking_code: string
          updated_at: string
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
