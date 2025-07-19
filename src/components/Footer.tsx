import { SiNextdotjs, SiTailwindcss } from "react-icons/si";
import { BsGithub } from "react-icons/bs";
import { TbPokeball } from "react-icons/tb";
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
            <div className="flex space-x-2">
              <Button size="icon" variant="ghost" asChild>
                <Link href="https://github.com/Jayzumen/pokefans" target="_blank" rel="noreferrer">
                  <BsGithub className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="icon" variant="ghost" asChild>
                <Link href="https://pokeapi.co/" target="_blank" rel="noreferrer">
                  <TbPokeball className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="icon" variant="ghost" asChild>
                <Link href="https://nextjs.org/" target="_blank" rel="noreferrer">
                  <SiNextdotjs className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="icon" variant="ghost" asChild>
                <Link href="https://tailwindcss.com/" target="_blank" rel="noreferrer">
                  <SiTailwindcss className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        <Separator className="my-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; 2024 Pokéfans. All rights reserved.</p>
          <p>Built with ❤️ for Pokémon fans everywhere</p>
        </div>
      </div>
    </footer>
  );
}