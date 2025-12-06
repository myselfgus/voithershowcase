import React from 'react';
import { Button, type ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
const NeumorphicButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          'bg-healthos-porcelain text-healthos-ink shadow-[5px_5px_10px_#d8dade,_-5px_-5px_10px_#ffffff] dark:shadow-[5px_5px_10px_#1a1c23,_-5px_-5px_10px_#2a2e39]',
          'hover:text-healthos-prism-end transition-all duration-200 active:shadow-neumo-inset',
          className
        )}
        {...props}
      >
        {children}
      </Button>
    );
  }
);
NeumorphicButton.displayName = 'NeumorphicButton';
export { NeumorphicButton };