import * as React from "react"
import {
    LayoutDashboard,
    UserPlus,
    Users,
    Search,
    LogOut,
    Activity,
    ChevronRight,
    ChevronsUpDown,
    User2,
    Sparkles,
} from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const menuItems = [
    {
        title: "Dashboard",
        icon: LayoutDashboard,
        url: "/dashboard",
        gradient: "from-purple-500 to-pink-500",
    },
    {
        title: "Add Patient",
        icon: UserPlus,
        url: "/add-patient",
        gradient: "from-green-500 to-teal-500",
    },
    {
        title: "Manage Patients",
        icon: Users,
        url: "/manage-patients",
        gradient: "from-blue-500 to-cyan-500",
    },
    {
        title: "Search Patients",
        icon: Search,
        url: "/search-patients",
        gradient: "from-orange-500 to-red-500",
    },
]

export function AppSidebar({ ...props }) {
    const location = useLocation()
    const navigate = useNavigate()
    const { logout, user } = useAuth()

    const handleLogout = () => {
        logout()
        navigate("/login")
    }

    return (
        <Sidebar collapsible="icon" className="glass border-r-0" {...props}>
            <SidebarHeader className="border-b border-white/20">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="hover:bg-white/50 transition-all">
                            <a href="/dashboard" className="flex items-center gap-2">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 shadow-lg">
                                    <Activity className="size-4 text-white" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                        MediCare
                                    </span>
                                    <span className="truncate text-xs text-slate-500">
                                        Patient Management
                                    </span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent className="px-2">
                <SidebarGroup>
                    <SidebarGroupLabel className="text-slate-500 px-2">
                        <Sparkles className="h-3 w-3 inline mr-1" />
                        Navigation
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="space-y-1">
                            {menuItems.map((item) => {
                                const isActive = location.pathname === item.url
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive}
                                            tooltip={item.title}
                                            className={`
                        transition-all duration-300 hover-lift
                        ${isActive
                                                    ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg`
                                                    : 'hover:bg-white/50'
                                                }
                      `}
                                        >
                                            <a href={item.url} className="flex items-center gap-3">
                                                <item.icon className={isActive ? "text-white" : "text-slate-600"} />
                                                <span className={isActive ? "font-semibold" : ""}>{item.title}</span>
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="border-t border-white/20">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    size="lg"
                                    className="data-[state=open]:bg-white/50 hover:bg-white/50 transition-all"
                                >
                                    <div className="flex aspect-square size-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 shadow-lg">
                                        <User2 className="size-4 text-white" />
                                    </div>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold text-slate-700">
                                            {user?.name || "Doctor"}
                                        </span>
                                        <span className="truncate text-xs text-slate-500">
                                            {user?.email || "doctor@medicare.com"}
                                        </span>
                                    </div>
                                    <ChevronsUpDown className="ml-auto size-4 text-slate-500" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-xl glass-card border-0"
                                side="bottom"
                                align="end"
                                sideOffset={4}
                            >
                                <DropdownMenuItem
                                    onClick={handleLogout}
                                    className="cursor-pointer hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
