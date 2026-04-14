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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id?: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      ingredients: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      ingredients_recipes: {
        Row: {
          ingredient_id: number
          quantity: string
          recipe_id: number
          unit: Database["public"]["Enums"]["IngredientUnit"] | null
        }
        Insert: {
          ingredient_id: number
          quantity: string
          recipe_id: number
          unit?: Database["public"]["Enums"]["IngredientUnit"] | null
        }
        Update: {
          ingredient_id?: number
          quantity?: string
          recipe_id?: number
          unit?: Database["public"]["Enums"]["IngredientUnit"] | null
        }
        Relationships: [
          {
            foreignKeyName: "ingredients_recipes_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ingredients_recipes_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      planning: {
        Row: {
          date: string
          id: number
          note: string | null
          recipe_id: number | null
          type: number
          user_id: string
        }
        Insert: {
          date: string
          id?: number
          note?: string | null
          recipe_id?: number | null
          type: number
          user_id: string
        }
        Update: {
          date?: string
          id?: number
          note?: string | null
          recipe_id?: number | null
          type?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "planning_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      recipes: {
        Row: {
          category_id: number | null
          content: string | null
          created_at: string
          description: string | null
          has_image: boolean
          id: number
          name: string
          nb_persons: number
          owner_id: string | null
        }
        Insert: {
          category_id?: number | null
          content?: string | null
          created_at?: string
          description?: string | null
          has_image?: boolean
          id?: number
          name: string
          nb_persons: number
          owner_id?: string | null
        }
        Update: {
          category_id?: number | null
          content?: string | null
          created_at?: string
          description?: string | null
          has_image?: boolean
          id?: number
          name?: string
          nb_persons?: number
          owner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recipes_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      shopping_list: {
        Row: {
          created_at: string
          id: number
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          user_id?: string | null
        }
        Relationships: []
      }
      shopping_list_recipe: {
        Row: {
          created_at: string
          id: number
          ingredient_id: number | null
          ingredient_name: string | null
          quantity: string | null
          shopping_list_id: number
          unit: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          ingredient_id?: number | null
          ingredient_name?: string | null
          quantity?: string | null
          shopping_list_id: number
          unit?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          ingredient_id?: number | null
          ingredient_name?: string | null
          quantity?: string | null
          shopping_list_id?: number
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shopping_list_recipe_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shopping_list_recipe_shopping_list_id_fkey"
            columns: ["shopping_list_id"]
            isOneToOne: false
            referencedRelation: "shopping_list"
            referencedColumns: ["id"]
          },
        ]
      }
      steps_recipes: {
        Row: {
          created_at: string
          id: number
          recipe_id: number
          step: string
        }
        Insert: {
          created_at?: string
          id?: number
          recipe_id: number
          step: string
        }
        Update: {
          created_at?: string
          id?: number
          recipe_id?: number
          step?: string
        }
        Relationships: [
          {
            foreignKeyName: "steps_recipes_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      unit_conversions: {
        Row: {
          factor: number
          from_unit: string
          id: number
          ingredient_id: number | null
          to_unit: string
        }
        Insert: {
          factor: number
          from_unit: string
          id?: number
          ingredient_id?: number | null
          to_unit: string
        }
        Update: {
          factor?: number
          from_unit?: string
          id?: number
          ingredient_id?: number | null
          to_unit?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_and_insert_shopping_list: {
        Args: { p_dates: string[]; p_user_id: string }
        Returns: number
      }
      get_favorite_recipes:
        | {
            Args: never
            Returns: {
              recipe_id: number
            }[]
          }
        | {
            Args: { user_uuid: string }
            Returns: {
              category_id: string
              category_name: string
              data: string
              id: number
              nb_persons: number
              recipe_name: string
            }[]
          }
    }
    Enums: {
      IngredientUnit:
        | "cl"
        | "kg"
        | "g"
        | "c.a.s"
        | "c.a.c"
        | "l"
        | "ml"
        | "sachet"
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
      IngredientUnit: ["cl", "kg", "g", "c.a.s", "c.a.c", "l", "ml", "sachet"],
    },
  },
} as const
