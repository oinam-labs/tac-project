import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Rate limiting configuration for different route patterns
 */
const RATE_LIMIT_CONFIG = {
  api: { maxRequests: 60, windowMs: 60000 },
  auth: { maxRequests: 5, windowMs: 60000 },
  public: { maxRequests: 30, windowMs: 60000 },
};

/**
 * In-memory rate limit store (edge-compatible)
 * For production, consider using Upstash Redis or similar
 */
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(
  identifier: string,
  config: { maxRequests: number; windowMs: number }
): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const existing = rateLimitStore.get(identifier);

  if (!existing || now > existing.resetTime) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + config.windowMs });
    return { allowed: true, remaining: config.maxRequests - 1, resetIn: config.windowMs };
  }

  existing.count++;
  return {
    allowed: existing.count <= config.maxRequests,
    remaining: Math.max(0, config.maxRequests - existing.count),
    resetIn: existing.resetTime - now,
  };
}

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const clientIp = getClientIp(request);

  // Apply rate limiting to API routes
  if (pathname.startsWith("/api/")) {
    const config = pathname.includes("/auth") ? RATE_LIMIT_CONFIG.auth : RATE_LIMIT_CONFIG.api;
    const result = checkRateLimit(`${clientIp}:${pathname}`, config);

    if (!result.allowed) {
      return new NextResponse(
        JSON.stringify({ error: "Too many requests", retryAfter: Math.ceil(result.resetIn / 1000) }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "X-RateLimit-Limit": config.maxRequests.toString(),
            "X-RateLimit-Remaining": result.remaining.toString(),
            "X-RateLimit-Reset": Math.ceil(result.resetIn / 1000).toString(),
            "Retry-After": Math.ceil(result.resetIn / 1000).toString(),
          },
        }
      );
    }
  }

  // Apply rate limiting to public tracking page
  if (pathname === "/track") {
    const result = checkRateLimit(`${clientIp}:/track`, RATE_LIMIT_CONFIG.public);
    if (!result.allowed) {
      return NextResponse.redirect(new URL("/rate-limited", request.url));
    }
  }

  // Block common attack patterns
  const blockedPatterns = [
    /\.\.\//, // Path traversal
    /<script/i, // XSS attempts
    /\$\{.*\}/, // Template injection
    /\0/, // Null byte injection
  ];

  const url = decodeURIComponent(pathname);
  for (const pattern of blockedPatterns) {
    if (pattern.test(url)) {
      return new NextResponse("Forbidden", { status: 403 });
    }
  }

  // Update Supabase session and continue
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
