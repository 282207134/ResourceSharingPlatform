import { createSupabaseServerClient } from './supabase';
import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  username: string;
  email: string;
  points: number;
  avatar_url?: string | null;
  bio?: string | null;
  is_verified?: boolean;
  is_premium?: boolean;
  created_at?: string;
  updated_at?: string;
}

export const userDb = {
  async createUser(username: string, email: string, password: string) {
    const supabase = await createSupabaseServerClient();
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Failed to create user');

    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        username,
        email,
        points: 100,
      })
      .select()
      .single();

    if (userError) throw userError;

    await supabase.from('points_history').insert({
      user_id: authData.user.id,
      points_change: 100,
      balance_after: 100,
      description: '新用户注册奖励',
      transaction_type: 'reward',
    });

    return userData;
  },

  async findByUsername(username: string) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async findByEmail(email: string) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async findById(id: string) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async updatePoints(userId: string, points: number) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from('users')
      .update({ points })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getStats(userId: string) {
    const supabase = await createSupabaseServerClient();
    
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    const { count: postsCount } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('author_id', userId);

    const { count: resourcesCount } = await supabase
      .from('resources')
      .select('*', { count: 'exact', head: true })
      .eq('author_id', userId);

    const { data: likesData } = await supabase
      .from('posts')
      .select('likes_count')
      .eq('author_id', userId);

    const likesReceived = likesData?.reduce((sum, post) => sum + post.likes_count, 0) || 0;

    return {
      ...user,
      posts_count: postsCount || 0,
      resources_count: resourcesCount || 0,
      likes_received: likesReceived,
      followers_count: 0,
    };
  },
};

export const postDb = {
  async create(postData: {
    title: string;
    content: string;
    author_id: string;
    category_id?: number;
    points_required?: number;
    is_premium?: boolean;
    tags?: string[];
  }) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from('posts')
      .insert(postData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getList(options: {
    page?: number;
    limit?: number;
    category_id?: number;
    author_id?: string;
    search?: string;
    sort?: 'latest' | 'popular' | 'views';
  } = {}) {
    const {
      page = 1,
      limit = 20,
      category_id,
      author_id,
      search,
      sort = 'latest',
    } = options;

    const supabase = await createSupabaseServerClient();
    const offset = (page - 1) * limit;

    let query = supabase
      .from('posts')
      .select(`
        *,
        users!posts_author_id_fkey(username, avatar_url),
        categories(name, color)
      `)
      .eq('is_published', true)
      .range(offset, offset + limit - 1);

    if (category_id) {
      query = query.eq('category_id', category_id);
    }

    if (author_id) {
      query = query.eq('author_id', author_id);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
    }

    if (sort === 'popular') {
      query = query.order('likes_count', { ascending: false });
    } else if (sort === 'views') {
      query = query.order('views_count', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;

    if (error) throw error;

    return data?.map(post => ({
      ...post,
      author_name: post.users?.username,
      author_avatar: post.users?.avatar_url,
      category_name: post.categories?.name,
      category_color: post.categories?.color,
    }));
  },

  async getById(id: number, userId?: string) {
    const supabase = await createSupabaseServerClient();
    
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        users!posts_author_id_fkey(username, avatar_url, is_verified),
        categories(name, color)
      `)
      .eq('id', id)
      .eq('is_published', true)
      .single();

    if (error) throw error;

    await supabase.rpc('increment_post_views', { post_id: id });

    if (userId) {
      const { data: likeData } = await supabase
        .from('likes')
        .select('id')
        .eq('user_id', userId)
        .eq('post_id', id)
        .single();

      const { data: purchaseData } = await supabase
        .from('purchases')
        .select('id')
        .eq('user_id', userId)
        .eq('post_id', id)
        .single();

      return {
        ...data,
        author_name: data.users?.username,
        author_avatar: data.users?.avatar_url,
        author_verified: data.users?.is_verified,
        category_name: data.categories?.name,
        category_color: data.categories?.color,
        is_liked: !!likeData,
        is_purchased: !!purchaseData,
      };
    }

    return {
      ...data,
      author_name: data.users?.username,
      author_avatar: data.users?.avatar_url,
      author_verified: data.users?.is_verified,
      category_name: data.categories?.name,
      category_color: data.categories?.color,
      is_liked: false,
      is_purchased: false,
    };
  },

  async update(id: number, updateData: any) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from('posts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: number) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) throw error;
  },
};

export const resourceDb = {
  async create(resourceData: {
    title: string;
    description?: string;
    file_url: string;
    file_type: string;
    file_size?: number;
    thumbnail_url?: string;
    author_id: string;
    category_id?: number;
    points_required?: number;
    is_premium?: boolean;
    tags?: string[];
  }) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from('resources')
      .insert(resourceData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getList(options: {
    page?: number;
    limit?: number;
    category_id?: number;
    author_id?: string;
    file_type?: string;
    search?: string;
    sort?: 'latest' | 'popular' | 'downloads';
  } = {}) {
    const {
      page = 1,
      limit = 20,
      category_id,
      author_id,
      file_type,
      search,
      sort = 'latest',
    } = options;

    const supabase = await createSupabaseServerClient();
    const offset = (page - 1) * limit;

    let query = supabase
      .from('resources')
      .select(`
        *,
        users!resources_author_id_fkey(username, avatar_url),
        categories(name, color)
      `)
      .eq('is_published', true)
      .range(offset, offset + limit - 1);

    if (category_id) {
      query = query.eq('category_id', category_id);
    }

    if (author_id) {
      query = query.eq('author_id', author_id);
    }

    if (file_type) {
      query = query.eq('file_type', file_type);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    if (sort === 'popular') {
      query = query.order('likes_count', { ascending: false });
    } else if (sort === 'downloads') {
      query = query.order('downloads_count', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;

    if (error) throw error;

    return data?.map(resource => ({
      ...resource,
      author_name: resource.users?.username,
      author_avatar: resource.users?.avatar_url,
      category_name: resource.categories?.name,
      category_color: resource.categories?.color,
    }));
  },

  async getById(id: number, userId?: string) {
    const supabase = await createSupabaseServerClient();
    
    const { data, error } = await supabase
      .from('resources')
      .select(`
        *,
        users!resources_author_id_fkey(username, avatar_url, is_verified),
        categories(name, color)
      `)
      .eq('id', id)
      .eq('is_published', true)
      .single();

    if (error) throw error;

    await supabase.rpc('increment_resource_views', { resource_id: id });

    if (userId) {
      const { data: likeData } = await supabase
        .from('likes')
        .select('id')
        .eq('user_id', userId)
        .eq('resource_id', id)
        .single();

      const { data: purchaseData } = await supabase
        .from('purchases')
        .select('id')
        .eq('user_id', userId)
        .eq('resource_id', id)
        .single();

      return {
        ...data,
        author_name: data.users?.username,
        author_avatar: data.users?.avatar_url,
        author_verified: data.users?.is_verified,
        category_name: data.categories?.name,
        category_color: data.categories?.color,
        is_liked: !!likeData,
        is_purchased: !!purchaseData,
      };
    }

    return {
      ...data,
      author_name: data.users?.username,
      author_avatar: data.users?.avatar_url,
      author_verified: data.users?.is_verified,
      category_name: data.categories?.name,
      category_color: data.categories?.color,
      is_liked: false,
      is_purchased: false,
    };
  },
};

export const likeDb = {
  async toggle(userId: string, targetType: 'post' | 'resource' | 'comment', targetId: number) {
    const supabase = await createSupabaseServerClient();
    
    const column = `${targetType}_id`;
    
    const { data: existingLike } = await supabase
      .from('likes')
      .select('id')
      .eq('user_id', userId)
      .eq(column, targetId)
      .single();

    if (existingLike) {
      await supabase
        .from('likes')
        .delete()
        .eq('user_id', userId)
        .eq(column, targetId);

      await supabase.rpc(`decrement_${targetType}_likes`, { [`${targetType}_id`]: targetId });

      return { liked: false };
    } else {
      await supabase.from('likes').insert({
        user_id: userId,
        [column]: targetId,
      });

      await supabase.rpc(`increment_${targetType}_likes`, { [`${targetType}_id`]: targetId });

      return { liked: true };
    }
  },
};

export const pointsHistoryDb = {
  async add(data: {
    user_id: string;
    points_change: number;
    balance_after: number;
    description: string;
    transaction_type: string;
    reference_id?: number;
  }) {
    const supabase = await createSupabaseServerClient();
    const { data: result, error } = await supabase
      .from('points_history')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  async getUserHistory(userId: string, page = 1, limit = 20) {
    const supabase = await createSupabaseServerClient();
    const offset = (page - 1) * limit;

    const { data, error } = await supabase
      .from('points_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return data;
  },
};

export const categoryDb = {
  async getAll() {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')
      .order('name');

    if (error) throw error;
    return data;
  },

  async getById(id: number) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },
};
