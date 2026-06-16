import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Mic, BookOpen, Brain, Sparkles, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useApp } from "@/context/AppContext";

const items = [
  { title: "Início", url: "/", icon: Home },
  { title: "Banco de Fonemas", url: "/fonemas", icon: Mic },
  { title: "Vocabulário", url: "/vocabulario", icon: BookOpen },
  { title: "Memória Auditiva", url: "/memoria", icon: Brain },
  { title: "Trava-Línguas", url: "/desafios", icon: Sparkles },
  { title: "Personalizar", url: "/personalizar", icon: Settings },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { mascot } = useApp();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-3 px-2 py-3">
          <div
            className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-3xl"
            style={{ background: "var(--primary-soft)" }}
            aria-hidden="true"
          >
            {mascot.emoji}
          </div>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="font-display text-lg font-bold leading-tight">Comunicar+</p>
            <p className="truncate text-xs text-muted-foreground">{mascot.name}</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm">Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={item.title}
                      className="h-12 text-base"
                    >
                      <Link to={item.url}>
                        <item.icon className="!h-5 !w-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
