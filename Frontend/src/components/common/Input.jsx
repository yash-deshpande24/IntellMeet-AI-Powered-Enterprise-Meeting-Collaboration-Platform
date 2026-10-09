import React, { forwardRef } from 'react';

export const Input = forwardRef(({
  label,
  error,
  helperText,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  type = 'text',
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
        >
          {label}
        </label>
      )}
      <div className="relative rounded-xl shadow-sm">
        {LeftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            <LeftIcon className="w-4 h-4" />
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={`block w-full rounded-xl text-sm transition-all duration-200 
            ${LeftIcon ? 'pl-10' : 'pl-3.5'} 
            ${RightIcon ? 'pr-10' : 'pr-3.5'} 
            py-2.5 bg-white dark:bg-dark-surface 
            border ${error ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-200 dark:border-dark-border focus:border-indigo-500 focus:ring-indigo-500/20'} 
            text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 
            focus:outline-none focus:ring-3 
            disabled:opacity-50 disabled:bg-slate-50 dark:disabled:bg-slate-900 ${className}`}
          {...props}
        />
        {RightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 dark:text-slate-500">
            {RightIcon}
          </div>
        )}
      </div>
      {error && (
        <p className="text-xs text-rose-500 font-medium flex items-center gap-1 mt-1">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
