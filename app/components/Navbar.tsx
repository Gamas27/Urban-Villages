"use client";

import * as React from "react";
import Link from "next/link";
import { ConnectButton } from "@mysten/dapp-kit";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import { cn } from "./ui/utils";

export default function Navbar() {
  return (
    <NavigationMenu className="max-w-full justify-between p-4 bg-white border-b border-gray-200">
      <NavigationMenuList className="flex w-full justify-between items-center">
        <div className="flex items-center space-x-6">
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/" className="flex items-center space-x-2 font-semibold text-lg text-gray-900">
                Urban Villages
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <NavigationMenuLink asChild className={cn(navigationMenuTriggerStyle(), "text-gray-900")}>
              <Link href="/" className="text-gray-900">Home</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink asChild className={cn(navigationMenuTriggerStyle(), "text-gray-900")}>
              <Link href="/cork" className="text-gray-900">Cork Collective</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink asChild className={cn(navigationMenuTriggerStyle(), "text-gray-900")}>
              <Link href="/test-walrus" className="text-gray-900">Test Walrus</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </div>

        <NavigationMenuItem className="flex ml-auto">
          <ConnectButton />
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
