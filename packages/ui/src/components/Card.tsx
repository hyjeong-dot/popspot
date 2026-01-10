import React from 'react';

export interface CardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({
    children,
    className = '',
    hover = false,
    padding = 'md'
}: CardProps) {
    const paddingStyles = {
        none: '',
        sm: 'p-3',
        md: 'p-5',
        lg: 'p-8',
    };

    return (
        <div
            className={`
        bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-xl shadow-slate-200/50
        ${hover ? 'transition-all duration-300 hover:shadow-2xl hover:shadow-violet-500/10 hover:-translate-y-1' : ''}
        ${paddingStyles[padding]}
        ${className}
      `}
        >
            {children}
        </div>
    );
}
