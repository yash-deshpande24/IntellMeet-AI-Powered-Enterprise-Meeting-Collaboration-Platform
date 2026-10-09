import React from 'react';

export const Avatar = ({
  src,
  name = 'User',
  size = 'md',
  status,
  className = '',
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg font-semibold',
  };

  const statusColors = {
    online: 'bg-emerald-500 ring-white dark:ring-dark-card',
    busy: 'bg-rose-500 ring-white dark:ring-dark-card',
    away: 'bg-amber-500 ring-white dark:ring-dark-card',
    offline: 'bg-slate-400 ring-white dark:ring-dark-card',
  };

  const getInitials = (n) => {
    return n
      ? n
          .split(' ')
          .map((part) => part[0])
          .slice(0, 2)
          .join('')
          .toUpperCase()
      : 'U';
  };

  return (
    <div className={`relative inline-block flex-shrink-0 ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={`${sizeClasses[size] || sizeClasses.md} rounded-xl object-cover ring-2 ring-transparent`}
        />
      ) : (
        <div
          className={`${sizeClasses[size] || sizeClasses.md} rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-medium shadow-sm`}
        >
          {getInitials(name)}
        </div>
      )}
      {status && (
        <span
          className={`absolute bottom-0 right-0 block w-2.5 h-2.5 rounded-full ring-2 ${statusColors[status] || statusColors.online}`}
        />
      )}
    </div>
  );
};
