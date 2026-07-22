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
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      audit_log: {
        Row: {
          acao: string
          created_at: string
          dados: Json | null
          entidade: string
          entidade_id: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          acao: string
          created_at?: string
          dados?: Json | null
          entidade: string
          entidade_id?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          acao?: string
          created_at?: string
          dados?: Json | null
          entidade?: string
          entidade_id?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      companies: {
        Row: {
          ativo: boolean
          cnpj: string
          created_at: string
          id: string
          nome: string
        }
        Insert: {
          ativo?: boolean
          cnpj: string
          created_at?: string
          id?: string
          nome: string
        }
        Update: {
          ativo?: boolean
          cnpj?: string
          created_at?: string
          id?: string
          nome?: string
        }
        Relationships: []
      }
      copper_bars: {
        Row: {
          auxiliary_code: string
          created_at: string
          id: string
          material: string
          name: string
          notes: string | null
          original_length_mm: number
        }
        Insert: {
          auxiliary_code: string
          created_at?: string
          id?: string
          material: string
          name: string
          notes?: string | null
          original_length_mm: number
        }
        Update: {
          auxiliary_code?: string
          created_at?: string
          id?: string
          material?: string
          name?: string
          notes?: string | null
          original_length_mm?: number
        }
        Relationships: []
      }
      copper_movements: {
        Row: {
          bar_id: string | null
          client: string | null
          created_at: string
          id: string
          length_mm: number
          notes: string | null
          pco: string | null
          piece_id: string | null
          responsible: string | null
          type: string
        }
        Insert: {
          bar_id?: string | null
          client?: string | null
          created_at?: string
          id?: string
          length_mm: number
          notes?: string | null
          pco?: string | null
          piece_id?: string | null
          responsible?: string | null
          type: string
        }
        Update: {
          bar_id?: string | null
          client?: string | null
          created_at?: string
          id?: string
          length_mm?: number
          notes?: string | null
          pco?: string | null
          piece_id?: string | null
          responsible?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "copper_movements_bar_id_fkey"
            columns: ["bar_id"]
            isOneToOne: false
            referencedRelation: "copper_bars"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "copper_movements_piece_id_fkey"
            columns: ["piece_id"]
            isOneToOne: false
            referencedRelation: "copper_pieces"
            referencedColumns: ["id"]
          },
        ]
      }
      copper_pieces: {
        Row: {
          bar_id: string | null
          created_at: string
          current_length_mm: number
          id: string
          notes: string | null
          status: string
        }
        Insert: {
          bar_id?: string | null
          created_at?: string
          current_length_mm: number
          id?: string
          notes?: string | null
          status?: string
        }
        Update: {
          bar_id?: string | null
          created_at?: string
          current_length_mm?: number
          id?: string
          notes?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "copper_pieces_bar_id_fkey"
            columns: ["bar_id"]
            isOneToOne: false
            referencedRelation: "copper_bars"
            referencedColumns: ["id"]
          },
        ]
      }
      count_items: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          observacao: string | null
          origem: Database["public"]["Enums"]["item_origin"]
          photo_id: string | null
          product_id: string
          qty_contada: number
          round_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          observacao?: string | null
          origem?: Database["public"]["Enums"]["item_origin"]
          photo_id?: string | null
          product_id: string
          qty_contada?: number
          round_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          observacao?: string | null
          origem?: Database["public"]["Enums"]["item_origin"]
          photo_id?: string | null
          product_id?: string
          qty_contada?: number
          round_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "count_items_photo_id_fkey"
            columns: ["photo_id"]
            isOneToOne: false
            referencedRelation: "count_photos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "count_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "count_items_round_id_fkey"
            columns: ["round_id"]
            isOneToOne: false
            referencedRelation: "count_rounds"
            referencedColumns: ["id"]
          },
        ]
      }
      count_photos: {
        Row: {
          created_at: string
          id: string
          ocr_result: Json | null
          ocr_status: Database["public"]["Enums"]["ocr_status"]
          round_id: string
          storage_path: string
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          ocr_result?: Json | null
          ocr_status?: Database["public"]["Enums"]["ocr_status"]
          round_id: string
          storage_path: string
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          ocr_result?: Json | null
          ocr_status?: Database["public"]["Enums"]["ocr_status"]
          round_id?: string
          storage_path?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "count_photos_round_id_fkey"
            columns: ["round_id"]
            isOneToOne: false
            referencedRelation: "count_rounds"
            referencedColumns: ["id"]
          },
        ]
      }
      count_rounds: {
        Row: {
          contador_id: string | null
          count_id: string
          created_at: string
          finalizado_em: string | null
          id: string
          rodada: number
          status: Database["public"]["Enums"]["round_status"]
        }
        Insert: {
          contador_id?: string | null
          count_id: string
          created_at?: string
          finalizado_em?: string | null
          id?: string
          rodada: number
          status?: Database["public"]["Enums"]["round_status"]
        }
        Update: {
          contador_id?: string | null
          count_id?: string
          created_at?: string
          finalizado_em?: string | null
          id?: string
          rodada?: number
          status?: Database["public"]["Enums"]["round_status"]
        }
        Relationships: [
          {
            foreignKeyName: "count_rounds_count_id_fkey"
            columns: ["count_id"]
            isOneToOne: false
            referencedRelation: "counts"
            referencedColumns: ["id"]
          },
        ]
      }
      counts: {
        Row: {
          created_at: string
          criado_por: string | null
          finalizado_em: string | null
          id: string
          nome: string
          observacao: string | null
          snapshot_id: string | null
          status: Database["public"]["Enums"]["count_status"]
          tipo: Database["public"]["Enums"]["count_type"]
        }
        Insert: {
          created_at?: string
          criado_por?: string | null
          finalizado_em?: string | null
          id?: string
          nome: string
          observacao?: string | null
          snapshot_id?: string | null
          status?: Database["public"]["Enums"]["count_status"]
          tipo: Database["public"]["Enums"]["count_type"]
        }
        Update: {
          created_at?: string
          criado_por?: string | null
          finalizado_em?: string | null
          id?: string
          nome?: string
          observacao?: string | null
          snapshot_id?: string | null
          status?: Database["public"]["Enums"]["count_status"]
          tipo?: Database["public"]["Enums"]["count_type"]
        }
        Relationships: [
          {
            foreignKeyName: "counts_snapshot_id_fkey"
            columns: ["snapshot_id"]
            isOneToOne: false
            referencedRelation: "stock_snapshots"
            referencedColumns: ["id"]
          },
        ]
      }
      divergence_items: {
        Row: {
          ajustado_em: string | null
          ajustado_por: string | null
          ajuste_sugerido: number
          company_id: string
          diferenca: number
          id: string
          observacao: string | null
          product_id: string
          qty_contada: number
          report_id: string
          saldo_sistema: number
          status: Database["public"]["Enums"]["divergence_status"]
          updated_at: string
        }
        Insert: {
          ajustado_em?: string | null
          ajustado_por?: string | null
          ajuste_sugerido?: number
          company_id: string
          diferenca?: number
          id?: string
          observacao?: string | null
          product_id: string
          qty_contada?: number
          report_id: string
          saldo_sistema?: number
          status?: Database["public"]["Enums"]["divergence_status"]
          updated_at?: string
        }
        Update: {
          ajustado_em?: string | null
          ajustado_por?: string | null
          ajuste_sugerido?: number
          company_id?: string
          diferenca?: number
          id?: string
          observacao?: string | null
          product_id?: string
          qty_contada?: number
          report_id?: string
          saldo_sistema?: number
          status?: Database["public"]["Enums"]["divergence_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "divergence_items_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "divergence_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "divergence_items_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "divergence_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      divergence_reports: {
        Row: {
          count_id: string
          gerado_em: string
          gerado_por: string | null
          id: string
          snapshot_id: string
        }
        Insert: {
          count_id: string
          gerado_em?: string
          gerado_por?: string | null
          id?: string
          snapshot_id: string
        }
        Update: {
          count_id?: string
          gerado_em?: string
          gerado_por?: string | null
          id?: string
          snapshot_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "divergence_reports_count_id_fkey"
            columns: ["count_id"]
            isOneToOne: false
            referencedRelation: "counts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "divergence_reports_snapshot_id_fkey"
            columns: ["snapshot_id"]
            isOneToOne: false
            referencedRelation: "stock_snapshots"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          ativo: boolean
          categoria: string | null
          cod_auxiliar: string | null
          codigo: string
          created_at: string
          descricao: string
          fabricante: string | null
          id: string
          localizacao: string | null
          unidade: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          categoria?: string | null
          cod_auxiliar?: string | null
          codigo: string
          created_at?: string
          descricao: string
          fabricante?: string | null
          id?: string
          localizacao?: string | null
          unidade?: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          categoria?: string | null
          cod_auxiliar?: string | null
          codigo?: string
          created_at?: string
          descricao?: string
          fabricante?: string | null
          id?: string
          localizacao?: string | null
          unidade?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          nome: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          nome: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          nome?: string
          updated_at?: string
        }
        Relationships: []
      }
      stock_snapshot_items: {
        Row: {
          company_id: string
          id: string
          product_id: string
          qty: number
          snapshot_id: string
        }
        Insert: {
          company_id: string
          id?: string
          product_id: string
          qty?: number
          snapshot_id: string
        }
        Update: {
          company_id?: string
          id?: string
          product_id?: string
          qty?: number
          snapshot_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stock_snapshot_items_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_snapshot_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_snapshot_items_snapshot_id_fkey"
            columns: ["snapshot_id"]
            isOneToOne: false
            referencedRelation: "stock_snapshots"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_snapshots: {
        Row: {
          confirmed_at: string | null
          created_at: string
          created_by: string | null
          id: string
          observacao: string | null
          snapshot_date: string
          status: Database["public"]["Enums"]["snapshot_status"]
        }
        Insert: {
          confirmed_at?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          observacao?: string | null
          snapshot_date?: string
          status?: Database["public"]["Enums"]["snapshot_status"]
        }
        Update: {
          confirmed_at?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          observacao?: string | null
          snapshot_date?: string
          status?: Database["public"]["Enums"]["snapshot_status"]
        }
        Relationships: []
      }
      tool_loans: {
        Row: {
          actual_return_date: string | null
          client: string | null
          created_at: string
          employee: string
          expected_return_date: string | null
          id: string
          loan_date: string
          notes: string | null
          pco: string | null
          proof_image_url: string | null
          status: string
          tool_id: string | null
        }
        Insert: {
          actual_return_date?: string | null
          client?: string | null
          created_at?: string
          employee: string
          expected_return_date?: string | null
          id?: string
          loan_date?: string
          notes?: string | null
          pco?: string | null
          proof_image_url?: string | null
          status?: string
          tool_id?: string | null
        }
        Update: {
          actual_return_date?: string | null
          client?: string | null
          created_at?: string
          employee?: string
          expected_return_date?: string | null
          id?: string
          loan_date?: string
          notes?: string | null
          pco?: string | null
          proof_image_url?: string | null
          status?: string
          tool_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tool_loans_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "tools"
            referencedColumns: ["id"]
          },
        ]
      }
      tool_movements: {
        Row: {
          client: string | null
          condition: string | null
          created_at: string
          employee: string | null
          id: string
          pco: string | null
          tool_id: string | null
          type: string
        }
        Insert: {
          client?: string | null
          condition?: string | null
          created_at?: string
          employee?: string | null
          id?: string
          pco?: string | null
          tool_id?: string | null
          type: string
        }
        Update: {
          client?: string | null
          condition?: string | null
          created_at?: string
          employee?: string | null
          id?: string
          pco?: string | null
          tool_id?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "tool_movements_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "tools"
            referencedColumns: ["id"]
          },
        ]
      }
      tools: {
        Row: {
          acquisition_date: string | null
          brand: string
          category: string
          condition: string
          created_at: string
          id: string
          model: string | null
          name: string
          notes: string | null
          patrimony_number: string | null
          photo_url: string | null
          serial_number: string | null
          specifications: string | null
          status: string
          value: number | null
        }
        Insert: {
          acquisition_date?: string | null
          brand: string
          category: string
          condition: string
          created_at?: string
          id?: string
          model?: string | null
          name: string
          notes?: string | null
          patrimony_number?: string | null
          photo_url?: string | null
          serial_number?: string | null
          specifications?: string | null
          status?: string
          value?: number | null
        }
        Update: {
          acquisition_date?: string | null
          brand?: string
          category?: string
          condition?: string
          created_at?: string
          id?: string
          model?: string | null
          name?: string
          notes?: string | null
          patrimony_number?: string | null
          photo_url?: string | null
          serial_number?: string | null
          specifications?: string | null
          status?: string
          value?: number | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
      has_any_role: {
        Args: {
          _roles: Database["public"]["Enums"]["app_role"][]
          _user_id: string
        }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "gestor" | "conferente" | "contador"
      count_status:
        | "rascunho"
        | "em_contagem"
        | "aguardando_revisao"
        | "finalizada"
        | "cancelada"
      count_type: "geral" | "diaria"
      divergence_status: "pendente" | "em_andamento" | "ajustado" | "ignorado"
      item_origin: "manual" | "foto"
      ocr_status: "pendente" | "processando" | "concluido" | "erro"
      round_status: "aberta" | "finalizada"
      snapshot_status: "rascunho" | "confirmado"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      app_role: ["admin", "gestor", "conferente", "contador"],
      count_status: [
        "rascunho",
        "em_contagem",
        "aguardando_revisao",
        "finalizada",
        "cancelada",
      ],
      count_type: ["geral", "diaria"],
      divergence_status: ["pendente", "em_andamento", "ajustado", "ignorado"],
      item_origin: ["manual", "foto"],
      ocr_status: ["pendente", "processando", "concluido", "erro"],
      round_status: ["aberta", "finalizada"],
      snapshot_status: ["rascunho", "confirmado"],
    },
  },
} as const
