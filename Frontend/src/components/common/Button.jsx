import React from 'react';
import { Loader2 } from 'lucide-react';

// Reusable Button Component with variant styles and loading state
export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  className = '',
  type = 'button',
  onClick,
  ...props
}) => {
  // Base button styling
  const baseClasses =
    'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  // Size variations
  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-5 py-3 gap-2.5',
    icon: 'p-2.5 rounded-xl',
  };

  // Color & theme variations
  const variantClasses = {
    primary:
      'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow-glow-primary focus:ring-indigo-500 border border-transparent',
    secondary:
      'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-slate-400 border border-slate-200/60 dark:border-slate-700/60',
    outline:
      'border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 focus:ring-indigo-500 bg-transparent',
    ghost:
      'hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-600 dark:text-slate-300 focus:ring-slate-400 bg-transparent',
    danger:
      'bg-rose-600 hover:bg-rose-700 text-white shadow-sm hover:shadow-md focus:ring-rose-500 border border-transparent',
    glass:
      'bg-white/80 dark:bg-slate-800/80 backdrop-blur-md hover:bg-white dark:hover:bg-slate-800 text-slate-800 dark:text-white border border-slate-200/50 dark:border-slate-700/50 shadow-sm',
    gradient:
      'bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md hover:shadow-glow-primary border border-transparent',
  };

  const selectedSize = sizeClasses[size] || sizeClasses.md;
  const selectedVariant = variantClasses[variant] || variantClasses.primary;

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseClasses} ${selectedSize} ${selectedVariant} ${className}`}
      {...props}
    >
      {/* Show spinner when loading, or left icon if provided */}
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        LeftIcon && <LeftIcon className="w-4 h-4 flex-shrink-0" />
      )}

      <span>{children}</span>

      {/* Show right icon if not loading */}
      {!isLoading && RightIcon && <RightIcon className="w-4 h-4 flex-shrink-0" />}
    </button>
  );
};
