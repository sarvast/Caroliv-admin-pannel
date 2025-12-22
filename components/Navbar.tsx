'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();



    const isActive = (path: string) => pathname?.startsWith(path);

    return (
        <nav className="bg-card/80 backdrop-blur-lg border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">

                    {/* Header Row: Logo & Mobile Actions */}
                    <div className="flex w-full md:w-auto justify-between items-center">
                        <h1 className="text-2xl font-bold text-foreground">Caroliv Admin</h1>
                        <div className="flex md:hidden items-center gap-3">
                            <ThemeToggle />

                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex items-center space-x-2 sm:space-x-4 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 no-scrollbar">
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

                    </div>
                </div>
            </div>
        </nav >
    );
}
