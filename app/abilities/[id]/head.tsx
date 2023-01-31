export default function GenerationHead({ params }: { params: { id: number } }) {
  return (
    <>
      <title>{params.id}</title>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <meta name="description" content={`Page for the Ability #${params.id}`} />
      <link rel="icon" type="image/svg+xml" href="/pokeball.svg" />
    </>
  );
}
