/**
 * Database types for Supabase tables
 * These types match the schema defined in the design document
 */

export type SectionType = 'skill' | 'experience' | 'project' | 'certification' | 'achievement';

export interface SkillMetadata {
  category: 'frontend' | 'backend' | 'tools' | 'other';
  proficiency: number; // 0-100
  icon?: string;
}

export interface ExperienceMetadata {
  company: string;
  location?: string;
  technologies: string[];
}

export interface ProjectMetadata {
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  tags: string[];
}

export interface CertificationMetadata {
  issuer: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface AchievementMetadata {
  icon: string;
  category: string;
}

export type SectionMetadata =
  | SkillMetadata
  | ExperienceMetadata
  | ProjectMetadata
  | CertificationMetadata
  | AchievementMetadata;

export interface Section {
  id: string;
  type: SectionType;
  title: string;
  description: string;
  metadata: SectionMetadata;
  image_url?: string;
  start_date?: string;
  end_date?: string;
  display_order: number;
  is_featured: boolean;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface Setting {
  id: string;
  key: string;
  value: Record<string, any>;
  description?: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  password_hash: string;
  role: string;
  two_fa_enabled: boolean;
  two_fa_secret?: string;
  last_login?: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id?: string;
  action: 'create' | 'update' | 'delete';
  table_name: string;
  record_id?: string;
  old_data?: Record<string, any>;
  new_data?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface AnalyticsEvent {
  id: string;
  event_type: string;
  event_data?: Record<string, any>;
  session_id?: string;
  created_at: string;
}

/**
 * Database schema type for Supabase client
 */
export interface Database {
  public: {
    Tables: {
      sections: {
        Row: Section;
        Insert: Omit<Section, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Section, 'id' | 'created_at' | 'updated_at'>>;
      };
      settings: {
        Row: Setting;
        Insert: Omit<Setting, 'id' | 'updated_at'>;
        Update: Partial<Omit<Setting, 'id' | 'updated_at'>>;
      };
      users: {
        Row: User;
        Insert: Omit<User, 'id' | 'created_at'>;
        Update: Partial<Omit<User, 'id' | 'created_at'>>;
      };
      audit_logs: {
        Row: AuditLog;
        Insert: Omit<AuditLog, 'id' | 'created_at'>;
        Update: Partial<Omit<AuditLog, 'id' | 'created_at'>>;
      };
      analytics_events: {
        Row: AnalyticsEvent;
        Insert: Omit<AnalyticsEvent, 'id' | 'created_at'>;
        Update: Partial<Omit<AnalyticsEvent, 'id' | 'created_at'>>;
      };
    };
  };
}
