'use client';

import { ReactNode } from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    className?: string;
}

export function GlassCard({ children, className = '', ...props }: GlassCardProps) {
    return (
        <div
            className={`glass rounded-xl shadow-lg transition-colors duration-300 ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}
