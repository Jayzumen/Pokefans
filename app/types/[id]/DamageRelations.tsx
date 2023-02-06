import { PokemonTypes } from "@/assets/constants";
import { TypeData } from "@/types/typeTypes";
import Image from "next/image";
import Link from "next/link";

export default function DamageRelations({ typeData }: { typeData: TypeData }) {
  return (
    <div className="mx-auto max-w-[1500px] rounded-md bg-slate-500 p-2">
      <p className="mt-4 mb-2 text-2xl font-bold">Damage Relations:</p>
      <div className="mx-auto flex max-w-[1200px] flex-col justify-center gap-4 px-4 text-center md:flex-row md:justify-between">
        <section className="mx-auto flex flex-col gap-4 md:w-[50%]">
          <p className="text-2xl font-semibold">Offense:</p>
          <p className="text-xl font-semibold">Double Damage To:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {typeData.damage_relations?.double_damage_to?.map((type) => {
              const matchingType = PokemonTypes.filter(
                (typ) => typ.name === type.name
              )[0];
              return (
                <Link
                  href={`/types/${type.name}`}
                  key={type.name}
                  style={{ backgroundColor: matchingType?.color }}
                  className="rounded-full p-2 transition hover:opacity-80"
                >
                  <Image
                    src={`/typeImages/${type.name}.svg`}
                    alt={type.name}
                    height={50}
                    width={50}
                  />
                </Link>
              );
            })}
          </div>
          <p className="text-xl font-semibold">Half Damage To:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {typeData.damage_relations?.half_damage_to?.map((type) => {
              const matchingType = PokemonTypes.filter(
                (typ) => typ.name === type.name
              )[0];
              return (
                <Link
                  href={`/types/${type.name}`}
                  key={type.name}
                  style={{ backgroundColor: matchingType?.color }}
                  className="rounded-full p-2 transition hover:opacity-80"
                >
                  <Image
                    src={`/typeImages/${type.name}.svg`}
                    alt={type.name}
                    height={50}
                    width={50}
                  />
                </Link>
              );
            })}
          </div>
          <p className="text-xl font-semibold">No Damage To:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {typeData.damage_relations?.no_damage_to.length > 0 ? (
              typeData.damage_relations?.no_damage_to?.map((type) => {
                const matchingType = PokemonTypes.filter(
                  (typ) => typ.name === type.name
                )[0];
                return (
                  <Link
                    href={`/types/${type.name}`}
                    key={type.name}
                    style={{ backgroundColor: matchingType?.color }}
                    className="rounded-full p-2 transition hover:opacity-80"
                  >
                    <Image
                      src={`/typeImages/${type.name}.svg`}
                      alt={type.name}
                      height={50}
                      width={50}
                    />
                  </Link>
                );
              })
            ) : (
              <p className="text-lg font-medium">None</p>
            )}
          </div>
        </section>
        <section className="mx-auto flex flex-col gap-4 md:w-[50%]">
          <p className="text-2xl font-semibold">Defense:</p>
          <p className="text-xl font-semibold">Double Damage From:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {typeData.damage_relations?.double_damage_from?.map((type) => {
              const matchingType = PokemonTypes.filter(
                (typ) => typ.name === type.name
              )[0];
              return (
                <Link
                  href={`/types/${type.name}`}
                  key={type.name}
                  style={{ backgroundColor: matchingType?.color }}
                  className="rounded-full p-2 transition hover:opacity-80"
                >
                  <Image
                    src={`/typeImages/${type.name}.svg`}
                    alt={type.name}
                    height={50}
                    width={50}
                  />
                </Link>
              );
            })}
          </div>

          <p className="text-xl font-semibold">Half Damage From:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {typeData.damage_relations?.half_damage_from?.map((type) => {
              const matchingType = PokemonTypes.filter(
                (typ) => typ.name === type.name
              )[0];
              return (
                <Link
                  href={`/types/${type.name}`}
                  key={type.name}
                  style={{ backgroundColor: matchingType?.color }}
                  className="rounded-full p-2 transition hover:opacity-80"
                >
                  <Image
                    src={`/typeImages/${type.name}.svg`}
                    alt={type.name}
                    height={50}
                    width={50}
                  />
                </Link>
              );
            })}
          </div>

          <p className="text-xl font-semibold">Immune to:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {typeData.damage_relations?.no_damage_from.length > 0 ? (
              typeData.damage_relations?.no_damage_from?.map((type) => {
                const matchingType = PokemonTypes.filter(
                  (typ) => typ.name === type.name
                )[0];
                return (
                  <Link
                    href={`/types/${type.name}`}
                    key={type.name}
                    style={{ backgroundColor: matchingType?.color }}
                    className="rounded-full p-2 transition hover:opacity-80"
                  >
                    <Image
                      src={`/typeImages/${type.name}.svg`}
                      alt={type.name}
                      height={50}
                      width={50}
                    />
                  </Link>
                );
              })
            ) : (
              <p className="text-lg font-medium">None</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
