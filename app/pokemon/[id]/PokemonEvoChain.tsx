import { Chain, EvolutionChain } from "@/types/pokemonTypes";
import Image from "next/image";
import Link from "next/link";
import EvoCheck from "./EvoCheck";
import { AiOutlineArrowRight } from "react-icons/ai";

export default function PokemonEvoChain({
  evoChainData,
}: {
  evoChainData: EvolutionChain;
}) {
  let evoChain: Chain | undefined;
  if (evoChainData) {
    evoChain = evoChainData.chain;
  }

  if (evoChain && evoChain.evolves_to.length === 0) {
    return null;
  }

  let species: Chain[] = [];
  if (evoChain) {
    species = [
      evoChain,
      ...evoChain.evolves_to,
      ...evoChain.evolves_to[0].evolves_to,
    ];
  }

  return (
    <>
      {evoChain && (
        <div className="flex flex-col justify-center">
          <p className="py-2 text-3xl">Evolutions</p>
          <div>
            <div>
              {/* if second Pokemon can evolve into more than one */}
              {evoChain.evolves_to[0].evolves_to.length > 1 && (
                <div className="mx-auto flex max-w-[800px] flex-col items-center">
                  <div className="flex justify-center">
                    <Link
                      className="transition hover:scale-105"
                      href={`/pokemon/${evoChain.species.name}`}
                    >
                      <Image
                        height={150}
                        width={150}
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${
                          evoChain.species.url.split("/")[6]
                        }.png`}
                        alt={evoChain.species.name}
                      />
                    </Link>
                  </div>
                  <span className="rotate-90">
                    <AiOutlineArrowRight height={24} width={24} />
                  </span>
                  <div className="min-h-[40px] max-w-[150px]">
                    <EvoCheck
                      species={species}
                      index={evoChain.evolves_to[0].species.name}
                    />
                  </div>
                  <div className="flex justify-center">
                    <Link
                      className="transition hover:scale-105"
                      href={`/pokemon/${evoChain.evolves_to[0].species.name}`}
                    >
                      <Image
                        height={150}
                        width={150}
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${
                          evoChain.evolves_to[0].species.url.split("/")[6]
                        }.png`}
                        alt={evoChain.evolves_to[0].species.name}
                      />
                    </Link>
                  </div>
                  <div className="flex flex-wrap justify-center">
                    {evoChain.evolves_to[0].evolves_to.map(
                      (evolution, index) => {
                        return (
                          <div key={index} className="m-4">
                            <div className="flex flex-col items-center">
                              <span className="rotate-90">
                                <AiOutlineArrowRight className="h-4 w-4" />
                              </span>
                              <div className="min-h-[80px] max-w-[150px]">
                                <EvoCheck
                                  species={species}
                                  index={evolution.species.name}
                                />
                              </div>
                            </div>
                            <div className="flex justify-center">
                              <Link
                                className="transition hover:scale-105"
                                key={index}
                                href={`/pokemon/${evolution.species.name}`}
                              >
                                <Image
                                  height={150}
                                  width={150}
                                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${
                                    evolution.species.url.split("/")[6]
                                  }.png`}
                                  alt={evolution.species.name}
                                />
                              </Link>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              )}
            </div>
            {/* if the first pokemon can evolve into more than one on the same level */}
            {evoChain.evolves_to.length > 1 && (
              <div className="flex flex-col items-center">
                <div className="flex justify-center">
                  <Link
                    className="transition hover:scale-105"
                    href={`/pokemon/${evoChain.species.name}`}
                  >
                    <Image
                      height={150}
                      width={150}
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${
                        evoChain.species.url.split("/")[6]
                      }.png`}
                      alt={evoChain.species.name}
                    />
                  </Link>
                </div>
                <div className="flex max-w-[800px] flex-wrap justify-center">
                  {evoChain.evolves_to.map((evolution, index) => {
                    return (
                      <div key={index} className="m-4">
                        <div className="flex flex-col items-center">
                          <span className="rotate-90 ">
                            <AiOutlineArrowRight height={24} width={24} />
                          </span>
                          <div className="min-h-[80px] max-w-[150px]">
                            <EvoCheck
                              species={species}
                              index={evolution.species.name}
                            />
                          </div>
                        </div>
                        <div className="flex justify-center">
                          <Link
                            className="transition hover:scale-105"
                            key={index}
                            href={`/pokemon/${evolution.species.name}`}
                          >
                            <Image
                              height={150}
                              width={150}
                              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${
                                evolution.species.url.split("/")[6]
                              }.png`}
                              alt={evolution.species.name}
                            />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {evoChain.evolves_to[1].evolves_to[0] && (
                  <div className="flex max-w-[800px] flex-wrap justify-center">
                    {evoChain.evolves_to.map((evolution, index) => {
                      if (evoChain?.evolves_to[1].evolves_to[0]) {
                        species.push(...evoChain.evolves_to[1].evolves_to);
                      }
                      return (
                        <div key={index} className="m-4">
                          <div className="flex flex-col items-center">
                            <span className="rotate-90">
                              <AiOutlineArrowRight height={24} width={24} />
                            </span>
                            <div className="min-h-[80px] max-w-[150px]">
                              <EvoCheck
                                species={species}
                                index={evolution.evolves_to[0].species.name}
                              />
                            </div>
                          </div>
                          <div className="flex justify-center">
                            <Link
                              className="transition hover:scale-105"
                              key={index}
                              href={`/pokemon/${evolution.evolves_to[0].species.name}`}
                            >
                              <Image
                                height={150}
                                width={150}
                                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${
                                  evolution.evolves_to[0].species.url.split(
                                    "/"
                                  )[6]
                                }.png`}
                                alt={evolution.evolves_to[0].species.name}
                              />
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
            {/* Normal Evolution Chain */}
            {evoChain.evolves_to.length === 1 &&
              evoChain.evolves_to[0].evolves_to.length <= 1 && (
                <div className="mx-auto flex max-w-[700px] flex-col justify-center gap-4 md:flex-row">
                  <div className="flex items-center justify-center">
                    <Link
                      className="transition hover:scale-105"
                      href={`/pokemon/${evoChain.species.name}`}
                    >
                      <Image
                        height={150}
                        width={150}
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${
                          evoChain.species.url.split("/")[6]
                        }.png`}
                        alt={evoChain.species.name}
                      />
                    </Link>
                  </div>

                  <div className="md:flex md:items-center">
                    <div className="mr-2 flex flex-col items-center gap-2">
                      <span className="rotate-90 md:rotate-0">
                        <AiOutlineArrowRight height={24} width={24} />
                      </span>
                      {evoChain.evolves_to[0].evolution_details[0] && (
                        <div className="mx-auto max-w-[150px]">
                          <EvoCheck
                            species={species}
                            index={evoChain.evolves_to[0].species.name}
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex justify-center">
                      <Link
                        className="transition hover:scale-105"
                        href={`/pokemon/${evoChain.evolves_to[0].species.name}`}
                      >
                        <Image
                          height={150}
                          width={150}
                          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${
                            evoChain.evolves_to[0].species.url.split("/")[6]
                          }.png`}
                          alt={evoChain.evolves_to[0].species.name}
                        />
                      </Link>
                    </div>
                  </div>

                  {evoChain.evolves_to[0].evolves_to.length > 0 && (
                    <div className="md:flex md:items-center ">
                      <div className="mr-2 flex flex-col items-center gap-2">
                        <span className="rotate-90 md:rotate-0">
                          <AiOutlineArrowRight height={24} width={24} />
                        </span>
                        {evoChain.evolves_to[0].evolves_to[0]
                          .evolution_details[0] && (
                          <div className="mx-auto max-w-[150px]">
                            <EvoCheck
                              species={species}
                              index={
                                evoChain.evolves_to[0].evolves_to[0].species
                                  .name
                              }
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex justify-center">
                        <Link
                          className="transition hover:scale-105"
                          href={`/pokemon/${evoChain.evolves_to[0].evolves_to[0].species.name}`}
                        >
                          <Image
                            height={150}
                            width={150}
                            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${
                              evoChain.evolves_to[0].evolves_to[0].species.url.split(
                                "/"
                              )[6]
                            }.png`}
                            alt={
                              evoChain.evolves_to[0].evolves_to[0].species.name
                            }
                          />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}
          </div>
        </div>
      )}
    </>
  );
}
