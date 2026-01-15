import { cn } from "@/lib/utils";

interface PageLayoutProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  /** Optional badge/label next to title */
  badge?: React.ReactNode;
  /** Parent section for breadcrumbs (e.g. "Fleet") */
  parent?: string;
  /** Compact mode reduces vertical spacing */
  compact?: boolean;
}

export function PageLayout({
  title,
  description,
  actions,
  children,
  badge,
  parent,
  compact = false,
}: PageLayoutProps) {
  return (
    <div className={cn("space-y-6", compact && "space-y-4")}>
      {/* Standardized Header Block */}
      <header className="relative flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            {parent && (
              <>
                <span className="text-muted-foreground hover:text-foreground cursor-pointer text-lg font-medium tracking-tight transition-colors">
                  {parent}
                </span>
                <span className="text-muted-foreground/40 text-lg">/</span>
              </>
            )}
            <h1 className="text-foreground text-3xl font-bold tracking-tight">
              {title}
            </h1>
            {badge && (
              <span className="bg-primary/10 text-primary border-primary/20 ml-1 rounded-md border px-2 py-0.5 text-xs font-semibold tracking-wide">
                {badge}
              </span>
            )}
          </div>
          {description && (
            <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex shrink-0 items-center gap-3">{actions}</div>
        )}
      </header>

      {/* Main Content Area */}
      <div className="relative">{children}</div>
    </div>
  );
}
