import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import Team from "./components/Team";

interface TeamPageProps {
  name: string;
}

export async function generateStaticParams() {
  const q = collection(db, "Teams");
  const querySnapshot = await getDocs(q);
  const params: TeamPageProps[] = [];
  querySnapshot.forEach((doc) => {
    params.push({ name: doc.id });
  });
  return params;
}

export default async function TeamPage({
  params,
}: {
  params: { name: string };
}) {
  const name = params.name;

  return (
    <div className="mx-4 mt-28 mb-4 min-h-screen">
      <h1 className="text-5xl font-semibold underline">My Team</h1>
      <Team name={name} />
    </div>
  );
}
