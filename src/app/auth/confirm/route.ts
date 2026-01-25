import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

function isSafeRedirect(url: string, allowedHost: string): boolean {
  if (!url || url === '/') {
    // This is a safe redirect
    return true;
  }

  try {
    // Deny protocol-relative URLs
    if (url.startsWith('//')) {
      return false;
    }

    // Allow relative paths (starting with / but not protocol-relative)
    if (url.startsWith('/')) {
      return true;
    }

    // Parse the absolute URL
    const parsedUrl = new URL(url);
    
    // Allow only HTTPS protocol
    if (parsedUrl.protocol !== "https:") {
      return false;
    }

    // Allow only the specified host
    return parsedUrl.hostname.toLowerCase() === allowedHost.toLowerCase();

  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/";

  const allowedHost = request.nextUrl.hostname;

  if (token_hash && type) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (!error) {
      if (isSafeRedirect(next, allowedHost)) {
        redirect(next); // redirect user to specified redirect URL
      } else {
        redirect('/');
      }
    }
  }

  // redirect the user to an error page with some instructions
  redirect("/error");
}
