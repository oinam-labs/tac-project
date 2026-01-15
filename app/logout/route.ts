/**
 * @fileoverview Logout API Route
 * @module app/logout/route
 *
 * Handles user logout by invalidating the session and redirecting to login.
 * This route exists to support direct navigation to /logout URL.
 *
 * @security
 * - Invalidates server-side session
 * - Clears authentication cookies
 * - Redirects to login page
 */

import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const supabase = await createClient();

  // Sign out the user
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Logout error:", error.message);
  }

  // Always redirect to login, even if sign-out had issues
  // The middleware will handle session validation
  return NextResponse.redirect(new URL("/login", requestUrl.origin));
}

export async function POST(request: Request) {
  // Also support POST for form submissions
  return GET(request);
}
