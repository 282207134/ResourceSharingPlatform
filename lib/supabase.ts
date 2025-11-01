import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export function createSupabaseClient() {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
  });
}

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch (error) {
          // The `set` method was called from a Server Component.
        }
      },
    },
  });
}

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          username: string;
          email: string;
          points: number;
          avatar_url: string | null;
          bio: string | null;
          role: 'user' | 'admin';
          is_verified: boolean;
          is_premium: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          username: string;
          email: string;
          points?: number;
          avatar_url?: string | null;
          bio?: string | null;
          role?: 'user' | 'admin';
          is_verified?: boolean;
          is_premium?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          email?: string;
          points?: number;
          avatar_url?: string | null;
          bio?: string | null;
          role?: 'user' | 'admin';
          is_verified?: boolean;
          is_premium?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      posts: {
        Row: {
          id: number;
          title: string;
          content: string;
          author_id: string;
          category_id: number | null;
          points_required: number;
          is_premium: boolean;
          is_published: boolean;
          views_count: number;
          likes_count: number;
          comments_count: number;
          tags: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          title: string;
          content: string;
          author_id: string;
          category_id?: number | null;
          points_required?: number;
          is_premium?: boolean;
          is_published?: boolean;
          views_count?: number;
          likes_count?: number;
          comments_count?: number;
          tags?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          title?: string;
          content?: string;
          author_id?: string;
          category_id?: number | null;
          points_required?: number;
          is_premium?: boolean;
          is_published?: boolean;
          views_count?: number;
          likes_count?: number;
          comments_count?: number;
          tags?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      resources: {
        Row: {
          id: number;
          title: string;
          description: string | null;
          file_url: string;
          file_type: string;
          file_size: number | null;
          thumbnail_url: string | null;
          author_id: string;
          category_id: number | null;
          points_required: number;
          is_premium: boolean;
          is_published: boolean;
          views_count: number;
          likes_count: number;
          downloads_count: number;
          tags: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          title: string;
          description?: string | null;
          file_url: string;
          file_type: string;
          file_size?: number | null;
          thumbnail_url?: string | null;
          author_id: string;
          category_id?: number | null;
          points_required?: number;
          is_premium?: boolean;
          is_published?: boolean;
          views_count?: number;
          likes_count?: number;
          downloads_count?: number;
          tags?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          title?: string;
          description?: string | null;
          file_url?: string;
          file_type?: string;
          file_size?: number | null;
          thumbnail_url?: string | null;
          author_id?: string;
          category_id?: number | null;
          points_required?: number;
          is_premium?: boolean;
          is_published?: boolean;
          views_count?: number;
          likes_count?: number;
          downloads_count?: number;
          tags?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: number;
          name: string;
          description: string | null;
          icon: string | null;
          color: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          description?: string | null;
          icon?: string | null;
          color?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          description?: string | null;
          icon?: string | null;
          color?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
      };
      likes: {
        Row: {
          id: number;
          user_id: string;
          post_id: number | null;
          resource_id: number | null;
          comment_id: number | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          post_id?: number | null;
          resource_id?: number | null;
          comment_id?: number | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          user_id?: string;
          post_id?: number | null;
          resource_id?: number | null;
          comment_id?: number | null;
          created_at?: string;
        };
      };
      purchases: {
        Row: {
          id: number;
          user_id: string;
          post_id: number | null;
          resource_id: number | null;
          points_spent: number;
          created_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          post_id?: number | null;
          resource_id?: number | null;
          points_spent: number;
          created_at?: string;
        };
        Update: {
          id?: number;
          user_id?: string;
          post_id?: number | null;
          resource_id?: number | null;
          points_spent?: number;
          created_at?: string;
        };
      };
      points_history: {
        Row: {
          id: number;
          user_id: string;
          points_change: number;
          balance_after: number;
          description: string;
          transaction_type: string;
          reference_id: number | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          points_change: number;
          balance_after: number;
          description: string;
          transaction_type: string;
          reference_id?: number | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          user_id?: string;
          points_change?: number;
          balance_after?: number;
          description?: string;
          transaction_type?: string;
          reference_id?: number | null;
          created_at?: string;
        };
      };
      comments: {
        Row: {
          id: number;
          content: string;
          author_id: string;
          post_id: number | null;
          resource_id: number | null;
          parent_id: number | null;
          is_published: boolean;
          likes_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          content: string;
          author_id: string;
          post_id?: number | null;
          resource_id?: number | null;
          parent_id?: number | null;
          is_published?: boolean;
          likes_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          content?: string;
          author_id?: string;
          post_id?: number | null;
          resource_id?: number | null;
          parent_id?: number | null;
          is_published?: boolean;
          likes_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};
