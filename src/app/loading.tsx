import Image from "next/image";
export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Image
        src="/pokeball.svg"
        width={100}
        height={100}
        alt="pokeball"
        className="animate-spin"
      />
      <h1 className="text-2xl font-semibold">Loading...</h1>
    </div>
  );
}
