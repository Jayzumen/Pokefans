import React from "react";
import Link from "next/link";
import { dexLinks } from "@/assets/constants";

function PageLinks() {
  return (
    <div className="mx-auto my-4 flex max-w-[50%] flex-wrap justify-center gap-4 text-xl font-semibold text-black">
      <Link
        className="min-w-[200px] rounded-lg bg-slate-400 py-2  transition hover:bg-slate-500"
        href={"/teams"}
      >
        Teams
      </Link>
      {dexLinks.map((link) => (
        <Link
          className="min-w-[200px] rounded-lg bg-slate-400 py-2 transition hover:bg-slate-500"
          key={link.id}
          href={link.path}
        >
          {link.name}
        </Link>
      ))}
    </div>
  );
}

export default PageLinks;
