"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface BottomNavButtonProps {
  href: string;
  label: string;
  icon: React.ReactNode;
}

export const BottomNavButton = ({
  href,
  label,
  icon,
}: BottomNavButtonProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex flex-col items-center justify-center gap-1 p-2 text-xs transition-all duration-200 ease-in-out transform ${
        isActive
          ? "text-white"
          : "text-neutral-400 hover:text-blue-600 hover:-translate-y-1"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};
