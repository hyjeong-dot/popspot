import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
}

export function Input({
    label,
    error,
    hint,
    className = '',
    id,
    ...props
}: InputProps) {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-sm font-medium text-slate-700 mb-1.5"
                >
                    {label}
                </label>
            )}
            <input
                id={inputId}
                className={`
          w-full px-4 py-2.5 rounded-xl border bg-white/50 backdrop-blur-sm
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-offset-0
          ${error
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-slate-200 focus:border-violet-500 focus:ring-violet-500/20 hover:border-slate-300'
                    }
          placeholder:text-slate-400
          ${className}
        `}
                {...props}
            />
            {error && (
                <p className="mt-1.5 text-sm text-red-500">{error}</p>
            )}
            {hint && !error && (
                <p className="mt-1.5 text-sm text-slate-500">{hint}</p>
            )}
        </div>
    );
}
