import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

export async function requireAuth() {
  const user = await getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return user;
}

export async function getUserProfile(userId: string) {
  const supabase = createClient();
  const { data: profile, error } = await (await supabase)
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }

  return profile;
}

export async function requireAdmin() {
  const user = await requireAuth();
  const profile = await getUserProfile(user.id);

  if (!profile || !["admin", "editor"].includes(profile.role)) {
    redirect("/");
  }

  return { user, profile };
}