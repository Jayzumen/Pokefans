import { Github } from "lucide-react";
import Link from "next/link";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";

export default function Footer() {
  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Pokéfans</h3>
            <p className="text-sm text-muted-foreground">
              Your ultimate destination for exploring the world of Pokémon. 
              Discover, learn, and build your perfect team.
            </p>
          </div>
          
          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Explore</h4>
            <div className="space-y-2 text-sm">
              <Link href="/pokedex" className="block text-muted-foreground hover:text-foreground transition-colors">
                Pokédex
              </Link>
              <Link href="/moves" className="block text-muted-foreground hover:text-foreground transition-colors">
                Moves
              </Link>
              <Link href="/abilities" className="block text-muted-foreground hover:text-foreground transition-colors">
                Abilities
              </Link>
              <Link href="/types" className="block text-muted-foreground hover:text-foreground transition-colors">
                Types
              </Link>
            </div>
          </div>
          
          {/* Community */}
          <div className="space-y-4">
            <h4 className="font-semibold">Community</h4>
            <div className="space-y-2 text-sm">
              <Link href="/teams" className="block text-muted-foreground hover:text-foreground transition-colors">
                Teams
              </Link>
              <Link href="/generations/1" className="block text-muted-foreground hover:text-foreground transition-colors">
                Generations
              </Link>
            </div>
          </div>
          
          {/* Connect */}
          <div className="space-y-4">
            <h4 className="font-semibold">Connect</h4>
            <div className="space-y-2 text-sm">
              <Button variant="outline" size="sm" asChild>
                <a
                  href="https://github.com/Jayzumen/pokefans"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github aria-hidden />
                  Source on GitHub
                </a>
              </Button>
              <p className="text-muted-foreground">
                Data from{" "}
                <a
                  href="https://pokeapi.co/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground underline-offset-4 hover:underline"
                >
                  PokeAPI
                </a>
                . Built with{" "}
                <a
                  href="https://nextjs.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground underline-offset-4 hover:underline"
                >
                  Next.js
                </a>{" "}
                and{" "}
                <a
                  href="https://tailwindcss.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground underline-offset-4 hover:underline"
                >
                  Tailwind CSS
                </a>
                .
              </p>
            </div>
          </div>
        </div>
        
        <Separator className="my-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Pokéfans. Pokémon is a trademark of Nintendo, Game Freak and Creatures.</p>
          <p>Built with ❤️ for Pokémon fans everywhere</p>
        </div>
      </div>
    </footer>
  );
}