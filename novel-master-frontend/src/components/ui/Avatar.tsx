// src/components/ui/Avatar.tsx
interface AvatarProps {
  src?: string | null;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizes = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-14 h-14 text-lg',
  xl: 'w-20 h-20 text-2xl',
};

export function Avatar({ src, alt = '', size = 'md', className = '' }: AvatarProps) {
  const initials = alt
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${sizes[size]} rounded-full object-cover border-2 border-border ${className}`}
        loading="lazy"
      />
    );
  }

  return (
    <div
      className={`
        ${sizes[size]} rounded-full bg-primary/20 border-2 border-primary/30
        flex items-center justify-center text-primary-light font-semibold
        ${className}
      `}
    >
      {initials}
    </div>
  );
}
