// src/components/ui/Badge.tsx
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'gold' | 'silver' | 'bronze';
  size?: 'sm' | 'md';
}

const variants = {
  default: 'bg-surface-hover text-text-secondary',
  primary: 'bg-primary/20 text-primary-light border border-primary/30',
  success: 'bg-success/20 text-success border border-success/30',
  warning: 'bg-warning/20 text-warning border border-warning/30',
  danger: 'bg-danger/20 text-danger border border-danger/30',
  gold: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  silver: 'bg-slate-400/20 text-slate-300 border border-slate-400/30',
  bronze: 'bg-orange-600/20 text-orange-400 border border-orange-600/30',
};

export function Badge({ children, variant = 'default', size = 'sm' }: BadgeProps) {
  return (
    <span className={`
      inline-flex items-center gap-1 rounded-lg font-medium
      ${size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm'}
      ${variants[variant]}
    `}>
      {children}
    </span>
  );
}
