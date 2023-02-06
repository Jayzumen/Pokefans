export default async function MoveHead({ params }: { params: { id: string } }) {
  return (
    <>
      <title>
        {`Pokémon Moves |
        ${params?.id.charAt(0).toUpperCase() + params?.id.slice(1)}`}
      </title>

      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <meta
        name="description"
        content={`Page for Pokémon-move ${params.id}}`}
      />
      <link rel="icon" type="image/svg+xml" href="/pokeball.svg" />
    </>
  );
}
