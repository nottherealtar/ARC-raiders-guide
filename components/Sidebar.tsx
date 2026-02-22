'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home, Package, Database, Map, Target,
  List, Calendar, MessageCircle, ChevronDown,
  Crosshair, MessageSquare, FileText, Backpack, Newspaper
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface SidebarItem {
  icon: React.ElementType;
  labelKey: string;
  href?: string;
  children?: { labelKey: string; href: string }[];
  external?: boolean;
}

const mainItems: SidebarItem[] = [
  { icon: Home, labelKey: 'home', href: '/' },
  { icon: Newspaper, labelKey: 'blog', href: '/blogs' },
  { icon: FileText, labelKey: 'guides', href: '/guides' },
  { icon: Backpack, labelKey: 'loadouts', href: '/loadouts' },
  { icon: Package, labelKey: 'marketplace', href: '/marketplace' },
  { icon: MessageSquare, labelKey: 'chats', href: '/chat' },
  { icon: List, labelKey: 'myListings', href: '/listings' },
];

const databaseItems: SidebarItem[] = [
  {
    icon: Database,
    labelKey: 'database',
    children: [
      { labelKey: 'arcs', href: '/arcs' },
      { labelKey: 'items', href: '/items' },
      { labelKey: 'quests', href: '/quests' },
      { labelKey: 'traders', href: '/traders' },
    ]
  },
];

const mapItems: SidebarItem[] = [
  {
    icon: Map,
    labelKey: 'maps',
    children: [
      { labelKey: 'dam', href: '/maps/dam-battlegrounds' },
      { labelKey: 'spaceport', href: '/maps/the-spaceport' },
      { labelKey: 'buriedCity', href: '/maps/buried-city' },
      { labelKey: 'blueGate', href: '/maps/blue-gate' },
      { labelKey: 'stellaMontis', href: '/maps/stella-montis' },
    ]
  },
];

const trackerItems: SidebarItem[] = [
  {
    icon: Crosshair,
    labelKey: 'trackers',
    children: [
      { labelKey: 'blueprintTracker', href: '/trackers/blueprint' },
      { labelKey: 'workshopPlanner', href: '/trackers/workshop-planner' },
      { labelKey: 'skillTree', href: '/skill-tree' },
    ]
  },
];

const otherItems: SidebarItem[] = [
  { icon: Target, labelKey: 'weaponsTierList', href: '/weapons-tier-list' },
  { icon: Calendar, labelKey: 'eventTimer', href: '/events' },
];

const externalItems: SidebarItem[] = [];

const bottomItems: SidebarItem[] = [
  { icon: MessageCircle, labelKey: 'discord', href: 'https://discord.com/invite/tags', external: true },
];

function SidebarSection({ items, expanded }: { items: SidebarItem[]; expanded: boolean }) {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const toggleMenu = (labelKey: string) => {
    setOpenMenus(prev =>
      prev.includes(labelKey) ? prev.filter(l => l !== labelKey) : [...prev, labelKey]
    );
  };

  const isActive = (href: string) => pathname === href;
  const isChildActive = (children: { href: string }[]) =>
    children.some(child => pathname === child.href);

  return (
    <div className="space-y-1">
      {items.map((item) => {
        const Icon = item.icon;
        const hasChildren = item.children && item.children.length > 0;
        const isOpen = openMenus.includes(item.labelKey) || (hasChildren && isChildActive(item.children!));
        const active = item.href ? isActive(item.href) : false;
        const label = t.sidebar[item.labelKey as keyof typeof t.sidebar] ?? item.labelKey;
        const labelClasses = expanded
          ? "flex-1 min-w-0 text-right text-base truncate"
          : "hidden";

        if (hasChildren) {
          return (
            <div key={item.labelKey}>
              <button
                onClick={() => toggleMenu(item.labelKey)}
                className={cn(
                  "w-full flex items-center rounded-lg transition-colors h-11 px-3 gap-3 justify-start",
                  "text-sidebar-foreground hover:text-foreground hover:bg-sidebar-accent",
                  isChildActive(item.children!) && "text-primary"
                )}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className={labelClasses}>
                  {label}
                </span>
                {expanded && (
                  <ChevronDown className={cn(
                    "w-4 h-4 transition-transform",
                    isOpen && "rotate-180"
                  )} />
                )}
              </button>

              {expanded && isOpen && (
                <div
                  className="mr-8 mt-1 space-y-1 overflow-hidden transition-[max-height] duration-300 ease-out"
                  style={{ maxHeight: isOpen ? item.children!.length * 44 : 0 }}
                >
                  {item.children!.map((child) => {
                    const childLabel = t.sidebar[child.labelKey as keyof typeof t.sidebar] ?? child.labelKey;
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          "block px-3 py-1.5 text-sm rounded-lg transition-colors text-right",
                          isActive(child.href)
                            ? "text-primary bg-sidebar-accent"
                            : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
                        )}
                      >
                        {childLabel}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        }

        if (item.external) {
          return (
            <a
              key={item.labelKey}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center rounded-lg transition-colors h-11 px-3 gap-3 justify-start",
                active ? "text-primary bg-sidebar-accent" : "text-sidebar-foreground hover:text-foreground hover:bg-sidebar-accent"
              )}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className={labelClasses}>{label}</span>
            </a>
          );
        }

        return (
          <Link
            key={item.labelKey}
            href={item.href!}
            className={cn(
              "flex items-center rounded-lg transition-colors h-11 px-3 gap-3 justify-start",
              active ? "text-primary bg-sidebar-accent" : "text-sidebar-foreground hover:text-foreground hover:bg-sidebar-accent"
            )}
          >
            <Icon className="w-5 h-5 shrink-0" />
            <span className={labelClasses}>{label}</span>
          </Link>
        );
      })}
    </div>
  );
}

export function Sidebar() {
  const [expanded, setExpanded] = useState(false);

  return (
    <aside
      className={cn(
        "fixed right-0 top-14 bottom-0 bg-sidebar border-l border-sidebar-border z-40",
        "transition-all duration-300 ease-out overflow-hidden",
        expanded ? "w-64" : "w-16"
      )}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div className="relative flex flex-col h-full min-h-0 py-4">
        {/* Game icon at top */}
        <div className="px-2 mb-4 relative z-20 bg-sidebar">
          <Link
            href="/"
            className={cn(
              "flex w-full items-center rounded-lg h-11 px-2 gap-2 transition-colors justify-start",
              "text-primary hover:bg-sidebar-accent transition-colors"
            )}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded bg-primary/20 text-primary shrink-0">
              <span className="text-sm font-bold">3RB</span>
            </div>
            <span
              className={cn(
                "text-base font-medium truncate whitespace-nowrap transition-opacity duration-200 flex-1 min-w-0",
                expanded ? "opacity-100" : "opacity-0 pointer-events-none"
              )}
            >
              3RB
            </span>
          </Link>
        </div>
        <div className="mx-3 mb-4 border-b border-sidebar-border relative z-10" />

        {/* Main + secondary sections */}
        <div
          className={cn(
            "px-2 space-y-3 flex-1 min-h-0 pb-6 relative z-10",
            expanded ? "overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" : "overflow-hidden"
          )}
        >
          <SidebarSection items={mainItems} expanded={expanded} />

          <SidebarSection items={databaseItems} expanded={expanded} />

          <SidebarSection items={mapItems} expanded={expanded} />

          <SidebarSection items={trackerItems} expanded={expanded} />

          <SidebarSection items={otherItems} expanded={expanded} />

          <SidebarSection items={externalItems} expanded={expanded} />
        </div>

        {/* Bottom section - Fixed at bottom */}
        <div className="px-2 pb-4 pt-4 border-t border-sidebar-border bg-sidebar relative z-20">
          <SidebarSection items={bottomItems} expanded={expanded} />
        </div>
      </div>
    </aside>
  );
}
