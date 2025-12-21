'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export function useAuth() {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('admin_token');

        if (!token && pathname !== '/admin/login') {
            router.push('/admin/login');
            setIsLoading(false);
            return;
        }

        setIsAuthenticated(!!token);
        setIsLoading(false);
    }, [pathname, router]);

    const logout = () => {
        localStorage.removeItem('admin_token');
        setIsAuthenticated(false);
        router.push('/admin/login');
    };

    return { isAuthenticated, isLoading, logout };
}
