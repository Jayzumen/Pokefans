export default async function AbilityHead({
  params,
}: {
  params: { id: string };
}) {
  return (
    <>
      <title>{`Ability | ${params.id
        .split("-")
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join("-")}`}</title>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <meta name="description" content={`Page for the Ability ${params.id}`} />
      <link rel="icon" type="image/svg+xml" href="/pokeball.svg" />
    </>
  );
}
