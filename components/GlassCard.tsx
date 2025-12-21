'use client';

import { ReactNode } from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    className?: string;
}

export default function GlassCard({ children, className = '', ...props }: GlassCardProps) {
    return (
        <div
            className={`bg-card/80 backdrop-blur-lg rounded-xl border border-border shadow-lg transition-colors duration-300 ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}
