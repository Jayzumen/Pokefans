"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PokemonTypes } from "@/assets/constants";
import { PokemonData, Variety } from "@/types/pokemonTypes";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../auth-provider";
import { getTeam, toggleTeamMember } from "@/lib/teams";
import { formatDexNumber } from "@/lib/pokemon";

export default function PokemonImage({ pokemon }: { pokemon: PokemonData }) {
  const { user, profile } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  // Check whether this Pokémon is already in the signed-in user's team.
  useEffect(() => {
    if (!user) {
      setIsSaved(false);
      return;
    }
    let active = true;
    getTeam(user.uid)
      .then((team) => {
        if (active) {
          setIsSaved(!!team?.members.some((m) => m.id === pokemon.id));
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [user, pokemon.id]);

  const handleClick = async () => {
    if (!user || !profile) {
      toast("Sign in to save Pokémon to your team.");
      return;
    }
    setBusy(true);
    try {
      const result = await toggleTeamMember(user.uid, profile.username, {
        id: pokemon.id,
        name: pokemon.name,
        types: pokemon.types.map((t) => t.type.name),
        bst: pokemon.stats.reduce((sum, s) => sum + s.base_stat, 0),
      });
      if (result === "full") {
        toast("Your team already has 6 Pokémon. Remove one first.");
      } else {
        setIsSaved(result === "added");
        toast(
          result === "added"
            ? `${pokemon.name} added to your team`
            : `${pokemon.name} removed from your team`,
        );
      }
    } catch {
      toast.error("Couldn't update your team. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const englishGenus = pokemon.speciesData.genera.find(
    (genus) => genus.language.name === "en",
  );

  const varieties = pokemon.speciesData.varieties.filter(
    (variety: Variety) => variety.is_default !== true,
  );

  return (
    <>
      <div className="mx-auto mt-4 flex flex-col md:w-[80%] lg:flex-row lg:justify-between">
        <div className="flex flex-col">
          <p className="text-2xl font-semibold">
            {formatDexNumber(pokemon.id)}
          </p>
          <p className="my-2 text-5xl font-bold capitalize">{pokemon.name}</p>
          {englishGenus && <span>The {englishGenus?.genus}</span>}
          <div className="mt-4 flex justify-center gap-4">
            {pokemon.types.map((type) => {
              const matchingType = PokemonTypes.filter(
                (pokemonType) => pokemonType.name === type.type.name,
              )[0];
              return (
                <Link
                  key={type.type.name}
                  href={`/types/${type.type.name}`}
                  style={{ backgroundColor: matchingType?.color }}
                  className="rounded-full p-2 shadow-md shadow-black transition hover:opacity-80"
                >
                  <Image
                    src={`/typeImages/${type.type.name}.svg`}
                    alt={type.type.name}
                    height={50}
                    width={50}
                  />
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mx-auto flex flex-col items-center justify-center pb-2">
          <div>
            <Image
              priority
              src={pokemon.sprites.other["official-artwork"].front_default}
              width={475}
              height={475}
              alt={`${pokemon.name} official artwork`}
            />
            <button
              type="button"
              aria-label={
                isSaved
                  ? `Remove ${pokemon.name} from your team`
                  : `Add ${pokemon.name} to your team`
              }
              aria-pressed={isSaved}
              onClick={handleClick}
              disabled={busy}
              className={`ml-60 flex h-12 w-12 items-center justify-center rounded-full transition-[background-color,transform] duration-200 hover:scale-110 active:scale-95 disabled:opacity-50 ${
                isSaved
                  ? "bg-red-500 text-white shadow-md shadow-black/30"
                  : "bg-white/40 hover:bg-white/60"
              }`}
            >
              <Heart
                aria-hidden
                className="h-7 w-7"
                fill={isSaved ? "currentColor" : "none"}
              />
            </button>
          </div>

          {pokemon.is_default &&
            pokemon.sprites.other["official-artwork"].front_shiny && (
              <div className="mx-auto my-2 flex flex-col items-center">
                <p className="text-xl font-semibold">Other Forms:</p>
                <p className="mt-2 text-xl">Shiny:</p>
                <Image
                  height={200}
                  width={200}
                  src={pokemon.sprites.other["official-artwork"].front_shiny}
                  alt={pokemon.name + " shiny"}
                  title={pokemon.name + " shiny"}
                />

                {varieties.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xl">Other:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {varieties.map((variety) => (
                        <Link
                          key={variety.pokemon.name}
                          href={`/pokemon/${variety.pokemon.name}`}
                        >
                          <Image
                            height={200}
                            width={200}
                            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${
                              variety.pokemon.url.split("/")[6]
                            }.png`}
                            alt={variety.pokemon.name}
                            title={variety.pokemon.name}
                          />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
        </div>
      </div>
    </>
  );
}
