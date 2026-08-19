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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      astrologers: {
        Row: {
          bio: string | null
          created_at: string
          id: string
          specialties: string[]
          total_predictions: number
          trust_score: number
          updated_at: string
          user_id: string
          verified_predictions: number
        }
        Insert: {
          bio?: string | null
          created_at?: string
          id?: string
          specialties?: string[]
          total_predictions?: number
          trust_score?: number
          updated_at?: string
          user_id: string
          verified_predictions?: number
        }
        Update: {
          bio?: string | null
          created_at?: string
          id?: string
          specialties?: string[]
          total_predictions?: number
          trust_score?: number
          updated_at?: string
          user_id?: string
          verified_predictions?: number
        }
        Relationships: [
          {
            foreignKeyName: "astrologers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      circle_posts: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          score_type: Database["public"]["Enums"]["circle_score_type"]
          score_value: number
          user_id: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: string
          score_type?: Database["public"]["Enums"]["circle_score_type"]
          score_value: number
          user_id: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          score_type?: Database["public"]["Enums"]["circle_score_type"]
          score_value?: number
          user_id?: string
        }
        Relationships: []
      }
      circle_resonances: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "circle_resonances_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "circle_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      journal_entries: {
        Row: {
          created_at: string
          date: string
          id: string
          mood: Database["public"]["Enums"]["mood_type"]
          note: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date?: string
          id?: string
          mood?: Database["public"]["Enums"]["mood_type"]
          note?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          mood?: Database["public"]["Enums"]["mood_type"]
          note?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "journal_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_leads: {
        Row: {
          company: string
          created_at: string
          email: string
          id: string
          message: string | null
          name: string
          updated_at: string
        }
        Insert: {
          company: string
          created_at?: string
          email: string
          id?: string
          message?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          company?: string
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      prediction_templates: {
        Row: {
          created_at: string
          id: string
          specialty: string
          text: string
        }
        Insert: {
          created_at?: string
          id?: string
          specialty: string
          text: string
        }
        Update: {
          created_at?: string
          id?: string
          specialty?: string
          text?: string
        }
        Relationships: []
      }
      predictions: {
        Row: {
          astrologer_id: string
          check_in_due_at: string
          created_at: string
          id: string
          outcome: Database["public"]["Enums"]["prediction_outcome"]
          text: string
          user_id: string | null
          verified_at: string | null
        }
        Insert: {
          astrologer_id: string
          check_in_due_at?: string
          created_at?: string
          id?: string
          outcome?: Database["public"]["Enums"]["prediction_outcome"]
          text: string
          user_id?: string | null
          verified_at?: string | null
        }
        Update: {
          astrologer_id?: string
          check_in_due_at?: string
          created_at?: string
          id?: string
          outcome?: Database["public"]["Enums"]["prediction_outcome"]
          text?: string
          user_id?: string | null
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "predictions_astrologer_id_fkey"
            columns: ["astrologer_id"]
            isOneToOne: false
            referencedRelation: "astrologers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "predictions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      share_cards: {
        Row: {
          created_at: string
          id: string
          image_url: string | null
          prediction_id: string
          share_count: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          prediction_id: string
          share_count?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          prediction_id?: string
          share_count?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "share_cards_prediction_id_fkey"
            columns: ["prediction_id"]
            isOneToOne: false
            referencedRelation: "predictions"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string
          id: string
          renews_at: string | null
          started_at: string
          tier: Database["public"]["Enums"]["subscription_tier"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          renews_at?: string | null
          started_at?: string
          tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          renews_at?: string | null
          started_at?: string
          tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          dob: string | null
          id: string
          name: string | null
          place_of_birth: string | null
          role: Database["public"]["Enums"]["user_role"]
          tob: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          dob?: string | null
          id: string
          name?: string | null
          place_of_birth?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          tob?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          dob?: string | null
          id?: string
          name?: string | null
          place_of_birth?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          tob?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      register_share: {
        Args: { _image_url?: string; _prediction_id: string }
        Returns: {
          created_at: string
          id: string
          image_url: string | null
          prediction_id: string
          share_count: number
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "share_cards"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      resolve_prediction: {
        Args: {
          _outcome: Database["public"]["Enums"]["prediction_outcome"]
          _prediction_id: string
        }
        Returns: {
          astrologer_id: string
          check_in_due_at: string
          created_at: string
          id: string
          outcome: Database["public"]["Enums"]["prediction_outcome"]
          text: string
          user_id: string | null
          verified_at: string | null
        }
        SetofOptions: {
          from: "*"
          to: "predictions"
          isOneToOne: true
          isSetofReturn: false
        }
      }
    }
    Enums: {
      circle_score_type: "trust_confirmation" | "daily_energy"
      mood_type: "happy" | "neutral" | "sad"
      prediction_outcome: "pending" | "true" | "false"
      subscription_tier: "free" | "verified_plus"
      user_role: "user" | "astrologer"
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
    Enums: {
      circle_score_type: ["trust_confirmation", "daily_energy"],
      mood_type: ["happy", "neutral", "sad"],
      prediction_outcome: ["pending", "true", "false"],
      subscription_tier: ["free", "verified_plus"],
      user_role: ["user", "astrologer"],
    },
  },
} as const
