import { createSupabaseServerClient } from './supabase';

export interface User {
  id: string;
  username: string;
  email: string;
  points: number;
  avatar_url?: string;
  role?: 'user' | 'admin';
  is_verified?: boolean;
  is_premium?: boolean;
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const supabase = await createSupabaseServerClient();
    
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !authUser) {
      return null;
    }

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (userError) {
      return null;
    }

    return {
      id: userData.id,
      username: userData.username,
      email: userData.email,
      points: userData.points,
      avatar_url: userData.avatar_url,
      role: userData.role,
      is_verified: userData.is_verified,
      is_premium: userData.is_premium,
    };
  } catch (error) {
    console.error('获取当前用户失败:', error);
    return null;
  }
}

export async function signIn(email: string, password: string) {
  const supabase = await createSupabaseServerClient();
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  const { data: userData } = await supabase
    .from('users')
    .select('*')
    .eq('id', data.user.id)
    .single();

  return userData;
}

export async function signUp(email: string, password: string, username: string) {
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
      role: 'user',
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
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('未登录');
  }
  return user;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
}

export function validatePassword(password: string): boolean {
  return password.length >= 6;
}

export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === 'admin';
}

export async function requireAdmin(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('未登录');
  }
  if (user.role !== 'admin') {
    throw new Error('需要管理员权限');
  }
  return user;
}
