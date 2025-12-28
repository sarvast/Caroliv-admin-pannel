'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { logout } = useAuth();



    const isActive = (path: string) => pathname?.startsWith(path);

    return (
        <nav className="glass border-b-0 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">

                    {/* Header Row: Logo & Mobile Actions */}
                    <div className="flex w-full md:w-auto justify-between items-center">
                        <h1 className="text-2xl font-bold text-foreground">Caloriv Admin</h1>
                        <div className="flex md:hidden items-center gap-3">
                            <ThemeToggle />
                            <button
                                onClick={logout}
                                className="px-3 py-1.5 text-xs font-medium text-red-500 bg-red-100 hover:bg-red-200 dark:bg-red-900/20 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                            >
                                Log
                            </button>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex items-center space-x-2 sm:space-x-4 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 no-scrollbar">
                        <Link
                            href="/admin/dashboard"
                            className={`whitespace-nowrap px-4 py-2 rounded-lg font-medium transition-all ${isActive('/admin/dashboard')
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                                }`}
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/admin/exercises"
                            className={`whitespace-nowrap px-4 py-2 rounded-lg font-medium transition-all ${isActive('/admin/exercises')
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                                }`}
                        >
                            Exercises
                        </Link>
                        <Link
                            href="/admin/foods"
                            className={`whitespace-nowrap px-4 py-2 rounded-lg font-medium transition-all ${isActive('/admin/foods')
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                                }`}
                        >
                            Foods
                        </Link>
                        <Link
                            href="/admin/users"
                            className={`whitespace-nowrap px-4 py-2 rounded-lg font-medium transition-all ${isActive('/admin/users')
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                                }`}
                        >
                            Users
                        </Link>
                        <Link
                            href="/admin/updates"
                            className={`whitespace-nowrap px-4 py-2 rounded-lg font-medium transition-all ${isActive('/admin/updates')
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                                }`}
                        >
                            App Updates
                        </Link>
                        <Link
                            href="/admin/approvals"
                            className={`whitespace-nowrap px-4 py-2 rounded-lg font-medium transition-all ${isActive('/admin/approvals')
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                                }`}
                        >
                            Approvals
                        </Link>
                        <Link
                            href="/admin/promotions"
                            className={`whitespace-nowrap px-4 py-2 rounded-lg font-medium transition-all ${isActive('/admin/promotions')
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                                }`}
                        >
                            Promotions
                        </Link>
                        <Link
                            href="/admin/announcements"
                            className={`whitespace-nowrap px-4 py-2 rounded-lg font-medium transition-all ${isActive('/admin/announcements')
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                                }`}
                        >
                            Announcements
                        </Link>
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-3">
                        <ThemeToggle />
                        <button
                            onClick={logout}
                            className="px-4 py-2 text-sm font-medium text-red-500 bg-red-100 hover:bg-red-200 dark:bg-red-900/20 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav >
    );
}
