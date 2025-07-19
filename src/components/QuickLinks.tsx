import Link from "next/link";
import { dexLinks } from "@/assets/constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowRight, Book, Zap, Shield, Layers, Users, Gamepad2 } from "lucide-react";

const iconMap = {
  "Pokédex": Book,
  "Generation-Dex": Layers,
  "Move-Dex": Zap,
  "Ability-Dex": Shield,
  "Type-Dex": Gamepad2,
};

export default function QuickLinks() {
  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Explore Everything Pokémon
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Dive deep into the world of Pokémon with our comprehensive databases and tools
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {dexLinks.map((link) => {
            const Icon = iconMap[link.name as keyof typeof iconMap] || Book;
            return (
              <Card key={link.id} className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{link.name}</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    {link.name === "Pokédex" && "Complete database of all Pokémon with detailed information"}
                    {link.name === "Generation-Dex" && "Explore Pokémon organized by their generations"}
                    {link.name === "Move-Dex" && "Comprehensive list of all Pokémon moves and attacks"}
                    {link.name === "Ability-Dex" && "Database of all Pokémon abilities and their effects"}
                    {link.name === "Type-Dex" && "Learn about type effectiveness and relationships"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full group-hover:bg-primary group-hover:text-primary-foreground">
                    <Link href={link.path} className="flex items-center justify-center">
                      Explore
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {/* Teams Section */}
        <Card className="bg-gradient-to-r from-primary/10 to-chart-2/10 border-primary/20">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-primary/20">
                <Users className="w-8 h-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl">Build Your Dream Team</CardTitle>
            <CardDescription className="text-lg">
              Create and manage your perfect Pokémon team. Share with friends and see what others have built.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button size="lg" asChild>
              <Link href="/teams" className="flex items-center">
                View Teams
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}