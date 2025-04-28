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
      activities: {
        Row: {
          capacidad: number
          centro: string
          created_at: string
          descripcion: string | null
          esexterna: boolean
          estado: string
          fechafin: string
          fechainicio: string
          id: string
          instructor: string
          nombre: string
          participantes: number
          ubicacion: string
          updated_at: string
        }
        Insert: {
          capacidad: number
          centro: string
          created_at?: string
          descripcion?: string | null
          esexterna?: boolean
          estado: string
          fechafin: string
          fechainicio: string
          id?: string
          instructor: string
          nombre: string
          participantes?: number
          ubicacion: string
          updated_at?: string
        }
        Update: {
          capacidad?: number
          centro?: string
          created_at?: string
          descripcion?: string | null
          esexterna?: boolean
          estado?: string
          fechafin?: string
          fechainicio?: string
          id?: string
          instructor?: string
          nombre?: string
          participantes?: number
          ubicacion?: string
          updated_at?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          client_id: string | null
          copilot_id: string | null
          created_at: string
          end_time: string
          id: string
          notes: string | null
          start_time: string
          status: string
          title: string
        }
        Insert: {
          client_id?: string | null
          copilot_id?: string | null
          created_at?: string
          end_time: string
          id?: string
          notes?: string | null
          start_time: string
          status: string
          title: string
        }
        Update: {
          client_id?: string | null
          copilot_id?: string | null
          created_at?: string
          end_time?: string
          id?: string
          notes?: string | null
          start_time?: string
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_copilot_id_fkey"
            columns: ["copilot_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          company: string | null
          copilot_id: string | null
          created_at: string
          email: string
          id: string
          name: string
          phone: string | null
        }
        Insert: {
          company?: string | null
          copilot_id?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          phone?: string | null
        }
        Update: {
          company?: string | null
          copilot_id?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_copilot_id_fkey"
            columns: ["copilot_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          autor: string
          descripcion: string | null
          fechacreacion: string
          fechamodificacion: string
          id: string
          nombre: string
          tamano: number
          tipo: string
          url: string | null
          user_id: string
        }
        Insert: {
          autor: string
          descripcion?: string | null
          fechacreacion?: string
          fechamodificacion?: string
          id?: string
          nombre: string
          tamano: number
          tipo: string
          url?: string | null
          user_id: string
        }
        Update: {
          autor?: string
          descripcion?: string | null
          fechacreacion?: string
          fechamodificacion?: string
          id?: string
          nombre?: string
          tamano?: number
          tipo?: string
          url?: string | null
          user_id?: string
        }
        Relationships: []
      }
      hours_log: {
        Row: {
          client_id: string | null
          copilot_id: string | null
          created_at: string
          date: string
          description: string
          hours: number
          id: string
        }
        Insert: {
          client_id?: string | null
          copilot_id?: string | null
          created_at?: string
          date: string
          description: string
          hours: number
          id?: string
        }
        Update: {
          client_id?: string | null
          copilot_id?: string | null
          created_at?: string
          date?: string
          description?: string
          hours?: number
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hours_log_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hours_log_copilot_id_fkey"
            columns: ["copilot_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      jumps: {
        Row: {
          author: string
          author_id: string | null
          category: string
          created_at: string
          description: string | null
          downloads: number | null
          id: string
          preview_image: string | null
          price: number
          rating: number | null
          title: string
        }
        Insert: {
          author: string
          author_id?: string | null
          category: string
          created_at?: string
          description?: string | null
          downloads?: number | null
          id?: string
          preview_image?: string | null
          price: number
          rating?: number | null
          title: string
        }
        Update: {
          author?: string
          author_id?: string | null
          category?: string
          created_at?: string
          description?: string | null
          downloads?: number | null
          id?: string
          preview_image?: string | null
          price?: number
          rating?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "jumps_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      logs: {
        Row: {
          accion: string
          detalles: string
          entidad_id: string
          entidad_nombre: string | null
          id: string
          timestamp: string
          tipo_entidad: string
          usuario_id: string | null
        }
        Insert: {
          accion: string
          detalles: string
          entidad_id: string
          entidad_nombre?: string | null
          id?: string
          timestamp?: string
          tipo_entidad: string
          usuario_id?: string | null
        }
        Update: {
          accion?: string
          detalles?: string
          entidad_id?: string
          entidad_nombre?: string | null
          id?: string
          timestamp?: string
          tipo_entidad?: string
          usuario_id?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          read: boolean | null
          receiver_id: string | null
          sender_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          read?: boolean | null
          receiver_id?: string | null
          sender_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          read?: boolean | null
          receiver_id?: string | null
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          email: string
          id: string
          name: string
          role: string
        }
        Insert: {
          avatar_url?: string | null
          email: string
          id: string
          name: string
          role: string
        }
        Update: {
          avatar_url?: string | null
          email?: string
          id?: string
          name?: string
          role?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_logs_table_exists: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
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
