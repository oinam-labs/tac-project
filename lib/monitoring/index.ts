// import { createClient } from "@/lib/supabase/client"; // Reserved for monitoring

export interface MetricData {
  name: string;
  value: number;
  tags?: Record<string, string>;
  timestamp?: Date;
}

export interface PerformanceMetric {
  operation: string;
  duration: number;
  success: boolean;
  metadata?: Record<string, unknown>;
}

export function trackMetric(metric: MetricData): void {
  if (process.env.NODE_ENV === "development") {
    console.log("[Metric]", metric.name, metric.value, metric.tags);
  }
}

export function trackPerformance(metric: PerformanceMetric): void {
  if (process.env.NODE_ENV === "development") {
    console.log(
      "[Performance]",
      metric.operation,
      `${metric.duration}ms`,
      metric.success,
    );
  }
}

export function trackError(
  error: Error,
  context?: Record<string, unknown>,
): void {
  console.error("[Error]", error.message, context);
}

export function trackEvent(name: string, data?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "development") {
    console.log("[Event]", name, data);
  }
}

export function setUserContext(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  userId: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  email?: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  organizationId?: string,
): void {
  // No-op for now unless we add another monitoring service
}

export function clearUserContext(): void {
  // No-op
}

export function withPerformanceTracking<T>(
  operation: string,
  fn: () => Promise<T>,
): Promise<T> {
  const startTime = Date.now();

  return fn()
    .then((result) => {
      trackPerformance({
        operation,
        duration: Date.now() - startTime,
        success: true,
      });
      return result;
    })
    .catch((error) => {
      trackPerformance({
        operation,
        duration: Date.now() - startTime,
        success: false,
        metadata: { error: error.message },
      });
      throw error;
    });
}

export class HealthChecker {
  private checks: Map<string, () => Promise<boolean>> = new Map();

  register(name: string, check: () => Promise<boolean>): void {
    this.checks.set(name, check);
  }

  async runAll(): Promise<
    Record<string, { status: "ok" | "error"; latency: number }>
  > {
    const results: Record<string, { status: "ok" | "error"; latency: number }> =
      {};

    await Promise.all(
      Array.from(this.checks.entries()).map(async ([name, check]) => {
        const start = Date.now();
        try {
          const ok = await check();
          results[name] = {
            status: ok ? "ok" : "error",
            latency: Date.now() - start,
          };
        } catch {
          results[name] = {
            status: "error",
            latency: Date.now() - start,
          };
        }
      }),
    );

    return results;
  }
}

export const healthChecker = new HealthChecker();
