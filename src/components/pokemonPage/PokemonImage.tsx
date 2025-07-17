"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PokemonTypes } from "@/assets/constants";
import { PokemonData, Variety } from "@/types/pokemonTypes";
import { AiOutlineHeart } from "react-icons/ai";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { auth } from "@/lib/auth";
import { db } from "@/lib/firebase";

export default function PokemonImage({ pokemon }: { pokemon: PokemonData }) {
  const [isSaved, setIsSaved] = useState(false);
  const [userName, setUsername] = useState("");

  const compareId = async (id: string) => {
    if (!id) return;
    const userRef = doc(db, "Users", id);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      setUsername(userSnap.data()?.username);
    }
  };

  useEffect(() => {
    compareId(auth.currentUser?.uid as string);
    if (userName) {
      const userRef = doc(db, "Teams", userName);
      getDoc(userRef).then((docSnap) => {
        if (!docSnap.exists()) {
          setDoc(userRef, {});
        }
      });
      collection(db, "Teams", userName, "pokemonTeam");
    }
  }, [userName]);

  // Check if visited Pokemon is already saved
  useEffect(() => {
    if (userName) {
      const docRef = doc(db, "Teams", userName, "pokemonTeam", pokemon.name);
      getDoc(docRef).then((docSnap) => {
        if (docSnap.exists()) {
          setIsSaved(true);
        } else {
          setIsSaved(false);
        }
      });
    }
  }, [userName, pokemon]);

  const handleClick = async () => {
    if (!userName) {
      toast("You need to be logged in to save a Pokémon to your Team");
      return;
    }
    if (isSaved) {
      const docRef = doc(db, "Teams", userName, "pokemonTeam", pokemon.name);
      await deleteDoc(docRef);
      setIsSaved(false);
      toast(`${pokemon.name} removed from your Team`);
    } else {
      const pokemonTeamRef = collection(db, "Teams", userName, "pokemonTeam");
      const querySnapshot = await getDocs(pokemonTeamRef);
      if (querySnapshot.size < 6) {
        const docRef = doc(db, "Teams", userName, "pokemonTeam", pokemon.name);
        await setDoc(docRef, {
          id: pokemon.id,
          name: pokemon.name,
          types: pokemon.types,
          sprite: pokemon.sprites.other["official-artwork"].front_default,
          stats: pokemon.stats,
        });
        setIsSaved(true);
        toast(`${pokemon.name} added to your Team`);
      } else {
        toast("You can only have 6 Pokémon in your Team");
      }
    }
  };

  const englishGenus = pokemon.speciesData.genera.find(
    (genus: any) => genus.language.name === "en",
  );

  const varieties = pokemon.speciesData.varieties.filter(
    (variety: Variety) => variety.is_default !== true,
  );

  return (
    <>
      <div className="mx-auto mt-4 flex flex-col md:w-[80%] lg:flex-row lg:justify-between">
        <div className="flex flex-col">
          <p className="text-2xl font-semibold">
            #
            {pokemon.id < 10
              ? `00${pokemon.id}`
              : pokemon.id < 100
                ? `0${pokemon.id}`
                : pokemon.id}
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
              alt={pokemon.name}
            />
            <button
              aria-label="save to firestore btn"
              onClick={handleClick}
              className="ml-60"
            >
              {isSaved ? (
                <AiOutlineHeart className="h-12 w-12 rounded-full bg-red-500 text-white shadow-md shadow-black" />
              ) : (
                <AiOutlineHeart className="h-12 w-12" />
              )}
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
