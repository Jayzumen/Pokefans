export default function PokemonHead({ params }: { params: { id: number } }) {
  return (
    <>
      <title>{params.id}</title>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <meta
        name="description"
        content={`Page for Pokémon with #${params.id}`}
      />
      <link rel="icon" type="image/svg+xml" href="/pokeball.svg" />
    </>
  );
}
