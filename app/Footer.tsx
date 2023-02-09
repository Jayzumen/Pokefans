import { SiVite, SiTailwindcss } from "react-icons/si";
import { BsGithub } from "react-icons/bs";
import { TbPokeball } from "react-icons/tb";

export default function Footer() {
  return (
    <footer className="flex flex-col justify-center py-4 text-center">
      <ul className="my-6 flex justify-center gap-8 text-3xl text-gray-200 ">
        <li>
          <a
            href="https://github.com/Jayzumen/pokefans"
            target="_blank"
            rel="noreferrer"
          >
            <BsGithub className="transform transition duration-300 ease-in-out hover:scale-110 hover:text-white" />
          </a>
        </li>
        <li>
          <a href="https://pokeapi.co/" target="_blank" rel="noreferrer">
            <TbPokeball className="transform transition duration-300 ease-in-out hover:scale-110 hover:text-white" />
          </a>
        </li>
        <li>
          <a href="https://vitejs.dev/" target="_blank" rel="noreferrer">
            <SiVite className="transform transition duration-300 ease-in-out hover:scale-110 hover:text-white" />
          </a>
        </li>
        <li>
          <a href="https://tailwindcss.com/" target="_blank" rel="noreferrer">
            <SiTailwindcss className="transform transition duration-300 ease-in-out hover:scale-110 hover:text-white" />
          </a>
        </li>
      </ul>

      <p className="text-center text-xs text-gray-400">
        &copy; 2022 Pokéfans. All rights reserved.
      </p>
    </footer>
  );
}
