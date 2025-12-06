import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}
export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl p-px bg-gradient-to-b from-white/20 to-transparent shadow-lg',
          className
        )}
        {...props}
      >
        <div className="rounded-[15px] h-full w-full bg-white/60 dark:bg-black/20 backdrop-blur-xl">
          {children}
        </div>
      </div>
    );
  }
);
GlassCard.displayName = 'GlassCard';
export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };