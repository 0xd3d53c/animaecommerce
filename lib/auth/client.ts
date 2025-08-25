"use client";

import { createClient } from "@/lib/supabase/client";

export const getCurrentUser = async () => {
    const supabase = createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    return user;
};