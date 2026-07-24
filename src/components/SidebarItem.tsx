"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export type NavItem = {
  name: string;
  path?: string;
  subItems?: NavItem[];
};

interface SidebarItemProps {
  item: NavItem;
  isSidebarOpen: boolean;
  level?: number;
}

export default function SidebarItem({
  item,
  isSidebarOpen,
  level = 0,
}: SidebarItemProps) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);

  const hasChildren = item.subItems && item.subItems.length > 0;

  const isActive = item.path === pathname;

  const hasActiveChild = (node: NavItem): boolean => {
    if (node.path === pathname) return true;

    return (
      node.subItems?.some((child) => hasActiveChild(child)) ?? false
    );
  };

  const active = hasActiveChild(item);

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => setExpanded(!expanded)}
          style={{ paddingLeft: `${level * 16 + 16}px` }}
          className={`flex items-center justify-between w-full py-3 pr-4 rounded-md transition
            ${
              active
                ? "bg-blue-500 text-white"
                : "hover:bg-blue-300 hover:text-white"
            }`}
        >
          {isSidebarOpen ? item.name : item.name[0]}

          {isSidebarOpen && (
            <span
              className={`transition-transform ${
                expanded ? "rotate-90" : ""
              }`}
            >
              ▶
            </span>
          )}
        </button>

        {expanded &&
          isSidebarOpen &&
          item.subItems!.map((child) => (
            <SidebarItem
              key={child.name}
              item={child}
              level={level + 1}
              isSidebarOpen={isSidebarOpen}
            />
          ))}
      </div>
    );
  }

  return (
    <Link
      href={item.path!}
      style={{ paddingLeft: `${level * 16 + 16}px` }}
      className={`block py-3 pr-4 rounded-md transition
        ${
          isActive
            ? "bg-blue-400 text-white font-semibold"
            : "hover:bg-blue-300 hover:text-white"
        }`}
    >
      {isSidebarOpen ? item.name : item.name[0]}
    </Link>
  );
}