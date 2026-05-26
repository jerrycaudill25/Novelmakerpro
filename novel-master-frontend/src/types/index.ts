// src/types/index.ts

export interface User {
  user_id: number;
  username: string;
  display_name: string;
  email: string;
  tier: 'free' | 'pro' | 'enterprise';
  role: 'basic' | 'pro' | 'super-pro' | 'master';
  bio: string;
  avatar_url: string | null;
  storage_used_mb: number;
  storage_limit_mb: number;
  is_verified: boolean;
  created_at: string;
  last_active: string;
}

export interface Project {
  project_id: number;
  title: string;
  description: string;
  format_type: 'novel' | 'short_story' | 'screenplay' | 'poem' | 'series' | 'commercial' | 'song' | 'custom';
  genre_tags: string;
  word_count: number;
  status: 'draft' | 'editing' | 'reviewing' | 'published' | 'archived';
  visibility: 'private' | 'followers' | 'public' | 'unlisted';
  cover_image_url: string | null;
  file_count: number;
  ai_audit_score: number | null;
  created_at: string;
  updated_at: string;
}

export interface ManuscriptFile {
  file_id: number;
  project_id: number;
  filename: string;
  display_name: string;
  file_path: string;
  file_size_bytes: number;
  mime_type: string;
  word_count: number;
  sort_order: number;
  is_ai_processed: boolean;
  version_number: number;
  created_at: string;
}

export interface CommunityPost {
  post_id: number;
  author_id: number;
  title: string;
  body_text: string;
  excerpt_text: string;
  project_id: number | null;
  file_id: number | null;
  like_count: number;
  comment_count: number;
  share_count: number;
  view_count: number;
  ai_audit_score: number | null;
  ai_badge_type: 'Gold' | 'Silver' | 'Bronze' | null;
  visibility: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  created_at: string;
  is_following?: boolean;
  user_reaction?: string | null;
}

export interface Comment {
  comment_id: number;
  post_id: number;
  parent_id: number | null;
  author_id: number;
  body_text: string;
  file_id: number | null;
  line_number: number | null;
  selected_text: string | null;
  is_ai_generated: boolean;
  like_count: number;
  is_edited: boolean;
  created_at: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  replies?: Comment[];
  reply_count?: number;
}

export interface WritingCircle {
  circle_id: number;
  name: string;
  description: string;
  owner_id: number;
  visibility: 'public' | 'private' | 'invite_only';
  max_members: number;
  requires_approval: boolean;
  member_count: number;
  my_role: 'owner' | 'moderator' | 'member' | null;
  created_at: string;
}

export interface AIFeedback {
  score: number;
  badge: string | null;
  violations: Array<{
    pattern: string;
    count: number;
    examples: string[];
  }>;
  status: 'flagged' | 'clean';
  cadence: number;
  penalty: number;
}

export interface UserPreferences {
  default_visibility: 'private' | 'followers' | 'public' | 'unlisted';
  allow_comments: boolean;
  allow_downloads: boolean;
  email_notifications: boolean;
  ai_assist_level: 'minimal' | 'standard' | 'aggressive';
}

export type ReactionType = 'Like' | 'Love' | 'Inspired' | 'Helpful' | 'Masterpiece';

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'circle_invite' | 'ai_complete';
  message: string;
  read: boolean;
  created_at: string;
  actor?: {
    user_id: number;
    display_name: string;
    avatar_url: string | null;
  };
  resource_id?: number;
}

/* ═════════════════════════════════════════════════════════════════════════════
   PHASE 3 EXTENSIONS — Lorebook, RAG, Prose Learning Feedback Loop
   ═════════════════════════════════════════════════════════════════════════════ */

export interface Character {
  character_id: number;
  project_id: number;
  name: string;
  role_type: 'protagonist' | 'antagonist' | 'supporting' | 'minor';
  raw_data: string;
  extracted_facts: Record<string, string>;
  physical_traits: string;
  personality_traits: string;
  backstory: string;
  goals: string;
  relationships: Array<{ target: string; type: string }>;
  created_at: string;
  updated_at: string;
}

export interface WorldLore {
  lore_id: number;
  project_id: number;
  category: 'magic_system' | 'geography' | 'history' | 'culture' | 'technology' | 'rules' | 'timeline';
  title: string;
  content: string;
  importance: 1 | 2 | 3;
  created_at: string;
  updated_at: string;
}

export interface AISettings {
  learning_enabled: boolean;
  banned_word_overrides: string[];
  prose_style_profile: string | null;
  updated_at: string;
}

export interface StylePreference {
  preference_id: number;
  original_pattern: string;
  corrected_pattern: string;
  context: string;
  confidence_score: number;
  is_active: number;
  created_at: string;
}

export interface StyleSummary {
  total_corrections: number;
  active_corrections: number;
  average_confidence: number;
  top_patterns: Array<{
    original_pattern: string;
    corrected_pattern: string;
    freq: number;
  }>;
}

export interface RAGContext {
  context: string;
  style_prompt: string;
  characters_used: Array<{ name: string; role: string }>;
  lore_used: Array<{ title: string; category: string }>;
  scene_request: string;
}
