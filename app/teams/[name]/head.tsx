export default async function TeamHead({
  params,
}: {
  params: { name: string };
}) {
  return (
    <>
      <title>{`Team | ${params.name}`}</title>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <meta name="description" content={`Page for team of ${params.name}`} />
      <link rel="icon" type="image/svg+xml" href="/pokeball.svg" />
    </>
  );
}
