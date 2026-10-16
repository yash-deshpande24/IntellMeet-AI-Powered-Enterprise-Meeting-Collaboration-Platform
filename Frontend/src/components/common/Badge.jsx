import React from 'react';

// Reusable status and tag badge component
export const Badge = ({
  children,
  variant = 'indigo',
  size = 'md',
  dot = false,
  className = '',
}) => {
  // Color palette styles
  const variantStyles = {
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200/60 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800/60',
    purple: 'bg-purple-50 text-purple-700 border-purple-200/60 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800/60',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60',
    amber: 'bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/60',
    rose: 'bg-rose-50 text-rose-700 border-rose-200/60 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/60',
    slate: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
    cyan: 'bg-cyan-50 text-cyan-700 border-cyan-200/60 dark:bg-cyan-950/60 dark:text-cyan-300 dark:border-cyan-800/60',
  };

  // Pulsing dot colors
  const dotColors = {
    indigo: 'bg-indigo-500',
    purple: 'bg-purple-500',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    slate: 'bg-slate-400',
    cyan: 'bg-cyan-500',
  };

  // Size styles
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  const selectedVariant = variantStyles[variant] || variantStyles.indigo;
  const selectedDotColor = dotColors[variant] || dotColors.indigo;
  const selectedSize = sizeStyles[size] || sizeStyles.md;

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${selectedVariant} ${selectedSize} ${className}`}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${selectedDotColor} animate-pulse`} />
      )}
      {children}
    </span>
  );
};
