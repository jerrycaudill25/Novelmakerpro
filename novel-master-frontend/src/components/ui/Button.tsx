// src/components/ui/Button.tsx
import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  fullWidth?: boolean;
}

const variants = {
  primary: 'bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/25',
  secondary: 'bg-surface hover:bg-surface-hover text-text-primary border border-border',
  ghost: 'hover:bg-surface-hover text-text-secondary hover:text-text-primary',
  danger: 'bg-danger/20 hover:bg-danger/30 text-danger border border-danger/30',
  outline: 'border border-border hover:border-primary/50 text-text-primary hover:text-primary',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
  icon: 'p-2.5',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', isLoading, fullWidth, children, disabled, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.02 }}
        className={`
          relative inline-flex items-center justify-center gap-2 rounded-xl font-medium
          transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
          ${variants[variant]}
          ${sizes[size]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
