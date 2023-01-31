export default function PokemonHead({ params }: { params: { name: string } }) {
  return (
    <>
      <title>
        {params.name.charAt(0).toUpperCase() + params.name.slice(1)}
      </title>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <meta name="description" content={`Page for ${params.name}`} />
      <link rel="icon" type="image/svg+xml" href="/pokeball.svg" />
    </>
  );
}
