import React from 'react';

export interface LoadingProps {
    size?: 'sm' | 'md' | 'lg';
    text?: string;
}

export function Loading({ size = 'md', text }: LoadingProps) {
    const sizes = {
        sm: 'h-5 w-5',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
    };

    return (
        <div className="flex flex-col items-center justify-center gap-3">
            <div className="relative">
                <div
                    className={`${sizes[size]} rounded-full border-2 border-violet-200 animate-spin`}
                    style={{
                        borderTopColor: 'rgb(139 92 246)',
                    }}
                />
            </div>
            {text && (
                <p className="text-sm text-slate-500 animate-pulse">{text}</p>
            )}
        </div>
    );
}
