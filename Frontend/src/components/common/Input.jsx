import React, { forwardRef } from 'react';

// Reusable Form Input with label, error message, helper text, and icons
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
  // Generate input ID if not provided
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
        >
          {label}
        </label>
      )}

      {/* Input container */}
      <div className="relative rounded-xl shadow-sm">
        {/* Optional Left Icon */}
        {LeftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            <LeftIcon className="w-4 h-4" />
          </div>
        )}

        {/* Input field */}
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

        {/* Optional Right Icon / Action */}
        {RightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 dark:text-slate-500">
            {RightIcon}
          </div>
        )}
      </div>

      {/* Validation Error Message */}
      {error && (
        <p className="text-xs text-rose-500 font-medium flex items-center gap-1 mt-1">
          {error}
        </p>
      )}

      {/* Helper Text */}
      {helperText && !error && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
