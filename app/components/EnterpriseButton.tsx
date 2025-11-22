import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface EnterpriseButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  className?: string;
  fullWidth?: boolean;
}

export function EnterpriseButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  className = '',
  fullWidth = false
}: EnterpriseButtonProps) {
  const variants = {
    primary: 'bg-gradient-to-r from-rose-600 to-purple-600 text-white shadow-lg shadow-rose-500/30 hover:shadow-xl hover:shadow-rose-500/40 hover:from-rose-700 hover:to-purple-700',
    secondary: 'bg-white text-gray-900 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 shadow-md',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 border border-transparent hover:border-gray-200',
    glass: 'bg-white/20 backdrop-blur-xl text-white border-2 border-white/30 hover:bg-white/30 shadow-lg'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <button
      onClick={onClick}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        rounded-xl
        transition-all
        duration-300
        active:scale-95
        disabled:opacity-50
        disabled:cursor-not-allowed
        flex
        items-center
        justify-center
        gap-2
        group
        ${className}
      `}
    >
      {Icon && iconPosition === 'left' && <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />}
      {children}
      {Icon && iconPosition === 'right' && <Icon className="w-5 h-5 transition-transform group-hover:translate-x-1" />}
    </button>
  );
}
