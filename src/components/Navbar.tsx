"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu, User } from "lucide-react";
import { useAuth } from "./auth-provider";
import { Button } from "./ui/button";
import { ModeToggle } from "./mode-toggle";
import { PokeballIcon } from "./icons";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/pokedex", label: "Pokédex", match: "/pokedex" },
  { href: "/generations/1", label: "Generations", match: "/generations" },
  { href: "/types", label: "Types", match: "/types" },
  { href: "/moves", label: "Moves", match: "/moves" },
  { href: "/abilities", label: "Abilities", match: "/abilities" },
  { href: "/teams", label: "Teams", match: "/teams" },
];

function Logo() {
  return (
    <Link
      href="/"
      className="group flex items-center gap-2 rounded-full pr-2 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      <span className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground transition-transform duration-500 ease-out group-hover:rotate-[200deg] motion-reduce:transition-none">
        <PokeballIcon className="size-5" />
      </span>
      <span className="text-[15px] font-semibold tracking-[-0.02em]">
        Pokéfans
      </span>
    </Link>
  );
}

export default function Navbar() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const username = profile?.username ?? "";
  const isActive = (match: string) => pathname.startsWith(match);

  const handleSignOut = async () => {
    // Loaded on demand so Firebase stays out of the shared bundle.
    const { signOutUser } = await import("@/lib/auth");
    await signOutUser();
    router.refresh();
  };

  return (
    <header className="fixed inset-x-0 top-3 z-50 px-3">
      <nav
        aria-label="Main"
        className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 rounded-full border bg-background/75 py-2 pr-2 pl-3 shadow-md backdrop-blur-xl backdrop-saturate-150"
      >
        <Logo />

        {/* Desktop links */}
        <ul className="hidden items-center gap-0.5 lg:flex">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.match);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative rounded-full px-3.5 py-2 text-sm font-medium outline-none transition-colors duration-200 focus-visible:ring-[3px] focus-visible:ring-ring/50",
                    active
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <ModeToggle />

          {user ? (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="Account menu"
                  className="rounded-full outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  <Avatar className="size-9">
                    <AvatarFallback className="bg-primary font-semibold text-primary-foreground">
                      {(username || user.email || "?").charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel className="font-normal">
                  <p className="font-medium">{username || "Choose a username"}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={username ? `/teams/${username}` : "/login"}>
                    <User />
                    My team
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm" className="h-9 rounded-full px-4">
              <Link href="/login">Sign in</Link>
            </Button>
          )}

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full lg:hidden"
                aria-label="Open menu"
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>Explore the world of Pokémon</SheetDescription>
              </SheetHeader>
              <ul className="grid gap-1 px-4">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={isActive(link.match) ? "page" : undefined}
                      className={cn(
                        "flex h-12 items-center rounded-xl px-4 text-base font-medium transition-colors",
                        isActive(link.match)
                          ? "bg-foreground text-background"
                          : "hover:bg-accent",
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
