'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'


function redirectWithError(message: string): never {
  console.error("Authentication Error:", message);
  redirect("/error");
}

export async function login(formData: FormData) {
  const supabase = await createClient()

  const emailValue = formData.get("email");
  const passwordValue = formData.get("password");

  if (!emailValue || !passwordValue) {
    redirectWithError("Email and password are required.");
  }

  const password = String(passwordValue).trim();
  if (password.length < 8) {
    redirectWithError("Password must be at least 8 characters long.");
  }
  const email = String(emailValue).trim();

  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (authError) {
    redirectWithError("Authentication failed: " + authError.message);
  }
  if (!authData.user) {
    redirectWithError("Authentication failed. No user data returned.");
  }

  const { error: updateError } = await supabase
    .from('student_profiles_private')
    .update({
      last_login_at: new Date().toISOString()
    })
    .eq('user_id', authData.user.id)

  if (updateError) {
    console.error("Failed to update last_login_at:", updateError);
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const emailValue = formData.get("email");
  const passwordValue = formData.get("password");

  if (!emailValue || !passwordValue) {
    redirectWithError("Email and password are required.");
  }

  const password = String(passwordValue).trim();
  if (password.length < 8) {
    redirectWithError("Password must be at least 8 characters long.");
  }
  const email = String(emailValue).trim();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: 'https://inspirit-for-student.vercel.app',
      data: { role: 'student'}
    }
  })

  if (error) {
    redirectWithError("Signup failed: " + error.message);
  }

  revalidatePath('/', 'layout')
  redirect('/signup/guide')
}

export async function logout() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    redirect('/error');
  }

  revalidatePath('/login', 'layout');
  redirect('/login');
}

