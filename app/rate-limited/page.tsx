import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function RateLimitedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="w-16 h-16 rounded-full bg-warning/10 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-warning" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Too Many Requests
        </h1>
        <p className="text-muted-foreground mb-6">
          You&apos;ve made too many requests in a short period. Please wait a moment before trying again.
        </p>
        <div className="space-y-3">
          <Button asChild className="w-full">
            <Link href="/">Go to Homepage</Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/track">Try Tracking Again</Link>
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-6">
          If you believe this is an error, please contact support.
        </p>
      </div>
    </div>
  );
}
