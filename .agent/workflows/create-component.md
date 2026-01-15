---
description: Create a new UI component
---
# Create Component

Run this workflow to create a new reusable UI component following the design system.

1. **Determine Component Location**
   - Is it a generic UI primitive? -> `components/ui/`
   - Is it a feature-specific component? -> `components/<feature>/`

2. **Create Component File**
   - Create the file used standard naming (PascalCase), e.g., `MyComponent.tsx`.
   - Use the snippet:
     ```tsx
     import { cn } from "@/lib/utils";

     interface MyComponentProps {
       className?: string;
       children?: React.ReactNode;
     }

     export function MyComponent({ className, children }: MyComponentProps) {
       return (
         <div className={cn("...", className)}>
           {children}
         </div>
       );
     }
     ```

3. **Style with Tokens**
   - Apply Tailwind CSS classes using semantic tokens found in `design-system.md`.
   - Ensure support for dark mode.

4. **Add Unit Test**
   - Create `__tests__/MyComponent.test.tsx` (or colocated test file depending on pref).
   - Write a basic render test.

5. **Export**
   - If in `components/ui`, ensure it's exported from the index if applicable.
