export default async function MoveHead({ params }: { params: { id: string } }) {
  return (
    <>
      <title>{`Moves | ${params.id
        .split("-")
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join("-")}`}</title>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <meta
        name="description"
        content={`Page for Pokémon-move ${params.id}}`}
      />
      <link rel="icon" type="image/svg+xml" href="/pokeball.svg" />
    </>
  );
}
