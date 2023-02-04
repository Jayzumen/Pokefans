export default async function TypeHead({ params }: { params: { id: string } }) {
  return (
    <>
      {/* 
      make the first letter of params.id capitalized
       */}
      <title>{`Type | ${
        params.id[0].toUpperCase() + params.id.slice(1)
      }`}</title>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <meta name="description" content={`Page for Type  #${params.id}}`} />
      <link rel="icon" type="image/svg+xml" href="/pokeball.svg" />
    </>
  );
}
