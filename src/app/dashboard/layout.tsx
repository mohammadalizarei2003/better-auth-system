import { AppSidebar } from '@/core/components/app-sidebar'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/core/components/ui/breadcrumb'
import { Separator } from '@/core/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/core/components/ui/sidebar'
import { getCurrentUser } from '@/core/helpers/authHelpers'
import React from 'react'

interface DashboardLayoutInterface {
    children: React.ReactNode;
}

const DashboardLayout = async ({ children }: DashboardLayoutInterface) => {
    const user = await getCurrentUser();
    
    return <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b">
                <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator
                        orientation="vertical"
                        className="mr-2 data-[orientation=vertical]:h-4"
                    />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink href="#">
                                    Building Your Application
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>
            <main className='p-5'>
                {children}
            </main>
        </SidebarInset>
    </SidebarProvider>

}

export default DashboardLayout