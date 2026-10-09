import React from 'react';

export const Card = ({
  children,
  className = '',
  hover = false,
  glass = false,
  onClick,
  ...props
}) => {
  const baseClasses = 'rounded-2xl transition-all duration-200 border';
  const surfaceClasses = glass
    ? 'glass-card'
    : 'bg-white dark:bg-dark-card border-slate-200/80 dark:border-dark-border shadow-soft dark:shadow-soft-dark';

  const hoverClasses = hover
    ? 'hover:-translate-y-0.5 hover:shadow-lg dark:hover:border-indigo-500/40 hover:border-indigo-200 cursor-pointer'
    : '';

  return (
    <div
      onClick={onClick}
      className={`${baseClasses} ${surfaceClasses} ${hoverClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
