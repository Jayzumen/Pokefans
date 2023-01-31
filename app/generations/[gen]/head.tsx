export default function GenerationHead({
  params,
}: {
  params: { gen: string };
}) {
  return (
    <>
      <title>{`Generation ${params.gen}`}</title>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <meta
        name="description"
        content={`Generation ${params.gen} of the Pokemon franchise.`}
      />
      <link rel="icon" type="image/svg+xml" href="/pokeball.svg" />
    </>
  );
}
