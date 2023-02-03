export default function AbilityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex flex-col justify-center bg-black text-center text-white`}
    >
      {children}
    </div>
  );
}
