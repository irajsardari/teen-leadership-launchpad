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
      admin_audit_log: {
        Row: {
          action: string
          admin_id: string
          created_at: string | null
          details: Json | null
          id: string
          ip_address: unknown | null
          resource_id: string | null
          resource_type: string
          user_agent: string | null
        }
        Insert: {
          action: string
          admin_id: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
        }
        Update: {
          action?: string
          admin_id?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      assignments: {
        Row: {
          assignment_type: string
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          instructions: string | null
          is_required: boolean | null
          max_points: number | null
          session_id: string
          title: string
          updated_at: string
        }
        Insert: {
          assignment_type: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          instructions?: string | null
          is_required?: boolean | null
          max_points?: number | null
          session_id: string
          title: string
          updated_at?: string
        }
        Update: {
          assignment_type?: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          instructions?: string | null
          is_required?: boolean | null
          max_points?: number | null
          session_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignments_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "course_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance: {
        Row: {
          course_id: string
          created_at: string
          id: string
          notes: string | null
          recorded_by: string
          session_id: string | null
          status: Database["public"]["Enums"]["attendance_status"]
          student_id: string
          updated_at: string
        }
        Insert: {
          course_id: string
          created_at?: string
          id?: string
          notes?: string | null
          recorded_by: string
          session_id?: string | null
          status: Database["public"]["Enums"]["attendance_status"]
          student_id: string
          updated_at?: string
        }
        Update: {
          course_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          recorded_by?: string
          session_id?: string | null
          status?: Database["public"]["Enums"]["attendance_status"]
          student_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      challengers: {
        Row: {
          age: number | null
          city: string | null
          confidential_info: string | null
          country: string | null
          created_at: string
          email: string | null
          full_name: string | null
          gender: string | null
          guardian_email: string | null
          id: number
          level: string | null
          phone_number: string | null
          referral_source: string | null
          user_id: string
        }
        Insert: {
          age?: number | null
          city?: string | null
          confidential_info?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          gender?: string | null
          guardian_email?: string | null
          id?: number
          level?: string | null
          phone_number?: string | null
          referral_source?: string | null
          user_id: string
        }
        Update: {
          age?: number | null
          city?: string | null
          confidential_info?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          gender?: string | null
          guardian_email?: string | null
          id?: number
          level?: string | null
          phone_number?: string | null
          referral_source?: string | null
          user_id?: string
        }
        Relationships: []
      }
      confidential_records: {
        Row: {
          confidential_info: string | null
          created_at: string
          entity_id: string
          entity_type: string
          id: string
          updated_at: string
        }
        Insert: {
          confidential_info?: string | null
          created_at?: string
          entity_id: string
          entity_type: string
          id?: string
          updated_at?: string
        }
        Update: {
          confidential_info?: string | null
          created_at?: string
          entity_id?: string
          entity_type?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      consent_permissions: {
        Row: {
          consent_id: string
          created_at: string
          granted: boolean
          granted_at: string | null
          id: string
          permission_type: string
          required: boolean
        }
        Insert: {
          consent_id: string
          created_at?: string
          granted?: boolean
          granted_at?: string | null
          id?: string
          permission_type: string
          required?: boolean
        }
        Update: {
          consent_id?: string
          created_at?: string
          granted?: boolean
          granted_at?: string | null
          id?: string
          permission_type?: string
          required?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "consent_permissions_consent_id_fkey"
            columns: ["consent_id"]
            isOneToOne: false
            referencedRelation: "parental_consents"
            referencedColumns: ["id"]
          },
        ]
      }
      course_sessions: {
        Row: {
          course_id: string
          created_at: string
          description: string | null
          duration_minutes: number | null
          id: string
          is_published: boolean | null
          learning_objectives: string[] | null
          lesson_plan: string | null
          session_number: number
          title: string
          updated_at: string
        }
        Insert: {
          course_id: string
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_published?: boolean | null
          learning_objectives?: string[] | null
          lesson_plan?: string | null
          session_number: number
          title: string
          updated_at?: string
        }
        Update: {
          course_id?: string
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_published?: boolean | null
          learning_objectives?: string[] | null
          lesson_plan?: string | null
          session_number?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_sessions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          created_at: string
          description: string | null
          difficulty_level: string | null
          duration_weeks: number | null
          id: string
          is_active: boolean | null
          teacher_id: string | null
          term_name: string
          term_number: number
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          duration_weeks?: number | null
          id?: string
          is_active?: boolean | null
          teacher_id?: string | null
          term_name: string
          term_number: number
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          duration_weeks?: number | null
          id?: string
          is_active?: boolean | null
          teacher_id?: string | null
          term_name?: string
          term_number?: number
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "courses_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      data_classification: {
        Row: {
          column_name: string | null
          created_at: string | null
          data_class: string
          encryption_required: boolean | null
          id: string
          retention_months: number
          table_name: string
        }
        Insert: {
          column_name?: string | null
          created_at?: string | null
          data_class: string
          encryption_required?: boolean | null
          id?: string
          retention_months?: number
          table_name: string
        }
        Update: {
          column_name?: string | null
          created_at?: string | null
          data_class?: string
          encryption_required?: boolean | null
          id?: string
          retention_months?: number
          table_name?: string
        }
        Relationships: []
      }
      enrollments: {
        Row: {
          completed_at: string | null
          course_id: string
          enrolled_at: string
          id: string
          is_active: boolean | null
          progress_percentage: number | null
          student_id: string
        }
        Insert: {
          completed_at?: string | null
          course_id: string
          enrolled_at?: string
          id?: string
          is_active?: boolean | null
          progress_percentage?: number | null
          student_id: string
        }
        Update: {
          completed_at?: string | null
          course_id?: string
          enrolled_at?: string
          id?: string
          is_active?: boolean | null
          progress_percentage?: number | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      materials: {
        Row: {
          content_text: string | null
          created_at: string
          description: string | null
          display_order: number | null
          file_url: string | null
          id: string
          is_downloadable: boolean | null
          material_type: string
          session_id: string
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          content_text?: string | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          file_url?: string | null
          id?: string
          is_downloadable?: boolean | null
          material_type: string
          session_id: string
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          content_text?: string | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          file_url?: string | null
          id?: string
          is_downloadable?: boolean | null
          material_type?: string
          session_id?: string
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "materials_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "course_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      parental_consents: {
        Row: {
          child_user_id: string
          consent_date: string | null
          consent_given: boolean
          created_at: string
          digital_signature: string | null
          id: string
          parent_guardian_email: string
          parent_guardian_name: string
          parent_user_id: string | null
          relationship: string
          updated_at: string
        }
        Insert: {
          child_user_id: string
          consent_date?: string | null
          consent_given?: boolean
          created_at?: string
          digital_signature?: string | null
          id?: string
          parent_guardian_email: string
          parent_guardian_name: string
          parent_user_id?: string | null
          relationship: string
          updated_at?: string
        }
        Update: {
          child_user_id?: string
          consent_date?: string | null
          consent_given?: boolean
          created_at?: string
          digital_signature?: string | null
          id?: string
          parent_guardian_email?: string
          parent_guardian_name?: string
          parent_user_id?: string | null
          relationship?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: number | null
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          lms_role: string | null
          parental_consent_date: string | null
          parental_consent_required: boolean | null
          role: Database["public"]["Enums"]["user_role"]
          safeguarding_concern: boolean | null
          updated_at: string
        }
        Insert: {
          age?: number | null
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          lms_role?: string | null
          parental_consent_date?: string | null
          parental_consent_required?: boolean | null
          role?: Database["public"]["Enums"]["user_role"]
          safeguarding_concern?: boolean | null
          updated_at?: string
        }
        Update: {
          age?: number | null
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          lms_role?: string | null
          parental_consent_date?: string | null
          parental_consent_required?: boolean | null
          role?: Database["public"]["Enums"]["user_role"]
          safeguarding_concern?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      progress_notes: {
        Row: {
          course_id: string
          created_at: string
          id: string
          student_id: string
          teacher_id: string
          text: string
          updated_at: string
        }
        Insert: {
          course_id: string
          created_at?: string
          id?: string
          student_id: string
          teacher_id: string
          text: string
          updated_at?: string
        }
        Update: {
          course_id?: string
          created_at?: string
          id?: string
          student_id?: string
          teacher_id?: string
          text?: string
          updated_at?: string
        }
        Relationships: []
      }
      rate_limit_attempts: {
        Row: {
          action: string
          attempts: number | null
          created_at: string | null
          id: string
          identifier: string
          window_start: string | null
        }
        Insert: {
          action: string
          attempts?: number | null
          created_at?: string | null
          id?: string
          identifier: string
          window_start?: string | null
        }
        Update: {
          action?: string
          attempts?: number | null
          created_at?: string | null
          id?: string
          identifier?: string
          window_start?: string | null
        }
        Relationships: []
      }
      resource_access_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          resource_id: string
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          resource_id: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          resource_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "resource_access_logs_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "teaching_resources"
            referencedColumns: ["id"]
          },
        ]
      }
      resource_links: {
        Row: {
          course_id: string | null
          id: string
          linked_at: string | null
          linked_by: string | null
          resource_id: string
          session_id: string | null
        }
        Insert: {
          course_id?: string | null
          id?: string
          linked_at?: string | null
          linked_by?: string | null
          resource_id: string
          session_id?: string | null
        }
        Update: {
          course_id?: string | null
          id?: string
          linked_at?: string | null
          linked_by?: string | null
          resource_id?: string
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resource_links_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resource_links_linked_by_fkey"
            columns: ["linked_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resource_links_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "teaching_resources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resource_links_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "course_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      resource_shares: {
        Row: {
          created_at: string
          from_teacher_id: string
          id: string
          note: string | null
          resource_id: string
          to_teacher_id: string
        }
        Insert: {
          created_at?: string
          from_teacher_id: string
          id?: string
          note?: string | null
          resource_id: string
          to_teacher_id: string
        }
        Update: {
          created_at?: string
          from_teacher_id?: string
          id?: string
          note?: string | null
          resource_id?: string
          to_teacher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "resource_shares_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "teaching_resources"
            referencedColumns: ["id"]
          },
        ]
      }
      resource_taxonomy: {
        Row: {
          category: string
          id: string
          value: string
        }
        Insert: {
          category: string
          id?: string
          value: string
        }
        Update: {
          category?: string
          id?: string
          value?: string
        }
        Relationships: []
      }
      safeguarding_permissions: {
        Row: {
          granted_at: string | null
          granted_by: string | null
          id: string
          is_active: boolean | null
          role: Database["public"]["Enums"]["safeguarding_role"]
          user_id: string
        }
        Insert: {
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          is_active?: boolean | null
          role: Database["public"]["Enums"]["safeguarding_role"]
          user_id: string
        }
        Update: {
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          is_active?: boolean | null
          role?: Database["public"]["Enums"]["safeguarding_role"]
          user_id?: string
        }
        Relationships: []
      }
      safeguarding_reports: {
        Row: {
          contact_info: string | null
          created_at: string | null
          description: string
          id: string
          report_type: string
          reporter_id: string | null
          status: string | null
          updated_at: string | null
          urgency: string | null
        }
        Insert: {
          contact_info?: string | null
          created_at?: string | null
          description: string
          id?: string
          report_type: string
          reporter_id?: string | null
          status?: string | null
          updated_at?: string | null
          urgency?: string | null
        }
        Update: {
          contact_info?: string | null
          created_at?: string | null
          description?: string
          id?: string
          report_type?: string
          reporter_id?: string | null
          status?: string | null
          updated_at?: string | null
          urgency?: string | null
        }
        Relationships: []
      }
      security_audit_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: unknown | null
          resource_id: string | null
          resource_type: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      session_progress: {
        Row: {
          completed: boolean | null
          completion_date: string | null
          created_at: string
          id: string
          last_accessed: string | null
          session_id: string
          student_id: string
          time_spent_minutes: number | null
          updated_at: string
        }
        Insert: {
          completed?: boolean | null
          completion_date?: string | null
          created_at?: string
          id?: string
          last_accessed?: string | null
          session_id: string
          student_id: string
          time_spent_minutes?: number | null
          updated_at?: string
        }
        Update: {
          completed?: boolean | null
          completion_date?: string | null
          created_at?: string
          id?: string
          last_accessed?: string | null
          session_id?: string
          student_id?: string
          time_spent_minutes?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_progress_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "course_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_progress_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      submissions: {
        Row: {
          assignment_id: string
          content: string | null
          created_at: string
          file_url: string | null
          graded_at: string | null
          id: string
          points_earned: number | null
          status: string | null
          student_id: string
          submitted_at: string | null
          teacher_feedback: string | null
          updated_at: string
        }
        Insert: {
          assignment_id: string
          content?: string | null
          created_at?: string
          file_url?: string | null
          graded_at?: string | null
          id?: string
          points_earned?: number | null
          status?: string | null
          student_id: string
          submitted_at?: string | null
          teacher_feedback?: string | null
          updated_at?: string
        }
        Update: {
          assignment_id?: string
          content?: string | null
          created_at?: string
          file_url?: string | null
          graded_at?: string | null
          id?: string
          points_earned?: number | null
          status?: string | null
          student_id?: string
          submitted_at?: string | null
          teacher_feedback?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "submissions_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      teacher_applications: {
        Row: {
          confidential_info: string | null
          cover_letter: string | null
          created_at: string
          cv_url: string | null
          education: string | null
          email: string
          experience_years: number | null
          full_name: string
          id: string
          phone_number: string | null
          specialization: string | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          confidential_info?: string | null
          cover_letter?: string | null
          created_at?: string
          cv_url?: string | null
          education?: string | null
          email: string
          experience_years?: number | null
          full_name: string
          id?: string
          phone_number?: string | null
          specialization?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          confidential_info?: string | null
          cover_letter?: string | null
          created_at?: string
          cv_url?: string | null
          education?: string | null
          email?: string
          experience_years?: number | null
          full_name?: string
          id?: string
          phone_number?: string | null
          specialization?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      teaching_resources: {
        Row: {
          approval_status: Database["public"]["Enums"]["approval_status"]
          approved_at: string | null
          approved_by: string | null
          audit_meta: Json | null
          created_at: string
          description: string | null
          file_size_bytes: number | null
          id: string
          level: string | null
          owner_id: string
          rejection_reason: string | null
          storage_path: string
          subject: string | null
          tags: string[] | null
          title: string
          type: string | null
          updated_at: string
          visibility: Database["public"]["Enums"]["resource_visibility"]
        }
        Insert: {
          approval_status?: Database["public"]["Enums"]["approval_status"]
          approved_at?: string | null
          approved_by?: string | null
          audit_meta?: Json | null
          created_at?: string
          description?: string | null
          file_size_bytes?: number | null
          id?: string
          level?: string | null
          owner_id: string
          rejection_reason?: string | null
          storage_path: string
          subject?: string | null
          tags?: string[] | null
          title: string
          type?: string | null
          updated_at?: string
          visibility?: Database["public"]["Enums"]["resource_visibility"]
        }
        Update: {
          approval_status?: Database["public"]["Enums"]["approval_status"]
          approved_at?: string | null
          approved_by?: string | null
          audit_meta?: Json | null
          created_at?: string
          description?: string | null
          file_size_bytes?: number | null
          id?: string
          level?: string | null
          owner_id?: string
          rejection_reason?: string | null
          storage_path?: string
          subject?: string | null
          tags?: string[] | null
          title?: string
          type?: string | null
          updated_at?: string
          visibility?: Database["public"]["Enums"]["resource_visibility"]
        }
        Relationships: [
          {
            foreignKeyName: "teaching_resources_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      block_unauthorized_access: {
        Args: { table_name: string }
        Returns: boolean
      }
      can_manage_child_consent: {
        Args: { p_child_user_id: string }
        Returns: boolean
      }
      check_rate_limit: {
        Args: {
          p_action: string
          p_identifier: string
          p_max_attempts?: number
          p_window_minutes?: number
        }
        Returns: boolean
      }
      flag_parental_consent_required: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      generate_secure_file_url: {
        Args: {
          p_bucket_name: string
          p_expires_in?: number
          p_file_path: string
        }
        Returns: string
      }
      get_authenticated_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["user_role"]
      }
      get_confidential_record_secure: {
        Args: { p_record_id: string }
        Returns: {
          confidential_info: string
          created_at: string
          entity_id: string
          entity_type: string
          id: string
          updated_at: string
        }[]
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      grant_safeguarding_access: {
        Args: {
          access_role: Database["public"]["Enums"]["safeguarding_role"]
          target_user_id: string
        }
        Returns: string
      }
      has_safeguarding_access: {
        Args: { check_user_id?: string }
        Returns: boolean
      }
      is_resource_owned_by_user: {
        Args: { res_id: string; user_id: string }
        Returns: boolean
      }
      is_resource_shared_with_user: {
        Args: { res_id: string; user_id: string }
        Returns: boolean
      }
      is_teacher_of_course: {
        Args: { course_id_param: string }
        Returns: boolean
      }
      log_admin_action: {
        Args: {
          p_action: string
          p_details?: Json
          p_resource_id?: string
          p_resource_type: string
        }
        Returns: undefined
      }
      log_file_access: {
        Args: { p_action?: string; p_file_path: string }
        Returns: undefined
      }
      log_sensitive_operation: {
        Args: {
          p_action: string
          p_resource_id?: string
          p_resource_type: string
        }
        Returns: undefined
      }
      secure_form_submission: {
        Args: {
          p_form_type: string
          p_max_attempts?: number
          p_window_minutes?: number
        }
        Returns: boolean
      }
      set_user_role: {
        Args: { _email: string; _role: string }
        Returns: undefined
      }
      submit_parental_consent: {
        Args: {
          p_child_user_id: string
          p_digital_signature: string
          p_parent_guardian_email: string
          p_parent_guardian_name: string
          p_permissions: Json
          p_relationship: string
        }
        Returns: string
      }
      submit_safeguarding_report: {
        Args: {
          p_contact_info?: string
          p_description: string
          p_report_type: string
        }
        Returns: string
      }
      user_owns_challenger_record: {
        Args: { record_user_id: string }
        Returns: boolean
      }
      validate_user_data_access: {
        Args: { record_user_id: string; table_name: string }
        Returns: boolean
      }
      verify_confidential_access: {
        Args: { record_id?: string }
        Returns: boolean
      }
    }
    Enums: {
      approval_status: "pending" | "approved" | "rejected"
      attendance_status: "present" | "absent" | "late" | "excused"
      resource_visibility: "private" | "shared" | "global" | "org"
      safeguarding_role: "safeguarding_officer" | "safeguarding_manager"
      user_role: "admin" | "mentor" | "challenger"
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
      approval_status: ["pending", "approved", "rejected"],
      attendance_status: ["present", "absent", "late", "excused"],
      resource_visibility: ["private", "shared", "global", "org"],
      safeguarding_role: ["safeguarding_officer", "safeguarding_manager"],
      user_role: ["admin", "mentor", "challenger"],
    },
  },
} as const
