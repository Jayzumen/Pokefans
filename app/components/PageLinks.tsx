import React from "react";
import Link from "next/link";
import { dexLinks } from "@/assets/constants";

function PageLinks() {
  return (
    <div className="mx-auto my-4 flex max-w-[50%] flex-wrap justify-center gap-4 text-xl font-semibold ">
      <Link
        className="min-w-[230px] rounded-lg bg-rose-700 py-4 transition hover:bg-rose-800"
        href={"/teams"}
      >
        Teams
      </Link>
      {dexLinks.map((link) => (
        <Link
          className="min-w-[230px] rounded-lg bg-rose-700 py-4 transition hover:bg-rose-800"
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
