import React from 'react';

// Reusable user avatar with image fallback to initials and online status indicator
export const Avatar = ({
  src,
  name = 'User',
  size = 'md',
  status,
  className = '',
}) => {
  // Dimension classes
  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg font-semibold',
  };

  // Status indicator colors
  const statusColors = {
    online: 'bg-emerald-500 ring-white dark:ring-dark-card',
    busy: 'bg-rose-500 ring-white dark:ring-dark-card',
    away: 'bg-amber-500 ring-white dark:ring-dark-card',
    offline: 'bg-slate-400 ring-white dark:ring-dark-card',
  };

  // Extract initials from user name (e.g., Alex Vance -> AV)
  const getInitials = (fullName) => {
    if (!fullName) return 'U';
    return fullName
      .split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const selectedSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={`relative inline-block flex-shrink-0 ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={`${selectedSize} rounded-xl object-cover ring-2 ring-transparent`}
        />
      ) : (
        <div
          className={`${selectedSize} rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-medium shadow-sm`}
        >
          {getInitials(name)}
        </div>
      )}

      {/* Online / status badge dot */}
      {status && (
        <span
          className={`absolute bottom-0 right-0 block w-2.5 h-2.5 rounded-full ring-2 ${
            statusColors[status] || statusColors.online
          }`}
        />
      )}
    </div>
  );
};
