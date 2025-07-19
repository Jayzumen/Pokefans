import { Button } from "./ui/button";
import Link from "next/link";
import { ArrowRight, Sparkles, Zap } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-bg" />
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid-16" />
      
      {/* Floating elements */}
      <div className="absolute top-20 left-10 floating-animation">
        <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
          <Zap className="w-8 h-8 text-white" />
        </div>
      </div>
      <div className="absolute top-40 right-20 floating-animation" style={{ animationDelay: '2s' }}>
        <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="absolute bottom-40 left-20 floating-animation" style={{ animationDelay: '4s' }}>
        <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="mb-6">
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium">
            <Sparkles className="w-4 h-4 mr-2" />
            Discover the World of Pokémon
          </span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Welcome to{" "}
          <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
            Pokéfans
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
          Your ultimate destination for exploring Pokémon, building teams, and discovering 
          everything about your favorite creatures.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6" asChild>
            <Link href="/pokedex" className="flex items-center">
              Explore Pokédex
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
          
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-6" asChild>
            <Link href="/teams">View Teams</Link>
          </Button>
        </div>
        
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-white">
          <div className="text-center">
            <div className="text-3xl font-bold">1000+</div>
            <div className="text-white/80">Pokémon</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">800+</div>
            <div className="text-white/80">Moves</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">300+</div>
            <div className="text-white/80">Abilities</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">18</div>
            <div className="text-white/80">Types</div>
          </div>
        </div>
      </div>
    </section>
  );
}