"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { dexLinks } from "@/assets/constants";
import { auth, getCurrentUser, signOutUser } from "../lib/auth";
import { doc, getDoc } from "firebase/firestore";
import { usePathname } from "next/navigation";
import { db } from "@/lib/firebase";
import { Button } from "./ui/button";
import { ModeToggle } from "./mode-toggle";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Menu, User, LogOut, Users, Zap } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

function Navbar() {
  const [userData, setUserData] = useState(
    auth.currentUser ? (auth.currentUser.uid as string) : "",
  );
  const [username, setUsername] = useState("");

  const path = usePathname();

  useEffect(() => {
    getCurrentUser().then(async (user) => {
      setUserData(user);
      if (user) {
        const userRef = doc(db, "Users", user);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUsername(userSnap.data()?.username);
        }
      }
    });
  }, [path]);

  return (
    <header className="fixed top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
            Pokéfans
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent">
                  Pokédex
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {dexLinks.map((link) => (
                      <NavigationMenuLink key={link.id} asChild>
                        <Link
                          href={link.path}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">
                            {link.name}
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Explore {link.name.toLowerCase()} and discover amazing Pokémon
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <Button variant="ghost" asChild>
            <Link href="/teams" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Teams</span>
            </Link>
          </Button>
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          <ModeToggle />
          
          {/* User Menu */}
          {userData ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{username}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      Pokémon Trainer
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={`/teams/${username}`} className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>My Team</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={signOutUser}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          )}

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Navigation</SheetTitle>
                  <SheetDescription>
                    Explore the world of Pokémon
                  </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Pokédex</h4>
                    {dexLinks.map((link) => (
                      <Button key={link.id} variant="ghost" className="w-full justify-start" asChild>
                        <Link href={link.path}>{link.name}</Link>
                      </Button>
                    ))}
                  </div>
                  <Button variant="ghost" className="justify-start" asChild>
                    <Link href="/teams">
                      <Users className="mr-2 h-4 w-4" />
                      Teams
                    </Link>
                  </Button>
                  {!userData && (
                    <Button asChild>
                      <Link href="/login">Sign In</Link>
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;