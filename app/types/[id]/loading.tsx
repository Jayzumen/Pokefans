import Image from "next/image";
export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="flex items-center justify-center">
          <Image
            src="/pokeball.svg"
            width={100}
            height={100}
            alt="pokeball"
            className="animate-spin"
          />
        </div>
        <h1 className="text-2xl font-semibold">Loading...</h1>
      </div>
    </div>
  );
}