import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppSidebar } from './app-sidebar';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { Sparkles } from 'lucide-react';

const Layout = () => {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="bg-transparent">
                <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 glass-card border-0 px-4 mb-4">
                    <SidebarTrigger className="-ml-1 hover:bg-purple-100/50 transition-colors" />
                    <Separator orientation="vertical" className="mr-2 h-4 bg-gradient-to-b from-purple-200 to-pink-200" />
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-purple-600" />
                        <h1 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Patient Management System
                        </h1>
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 custom-scrollbar">
                    <Outlet />
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default Layout;
