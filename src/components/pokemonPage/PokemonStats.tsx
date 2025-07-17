"use client";

import { PokemonData } from "@/types/pokemonTypes";
import React from "react";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from "chart.js";
import { Radar } from "react-chartjs-2";

ChartJS.register(RadialLinearScale, LineElement, PointElement, Filler, Tooltip);

export default function PokemonStats({ pokemon }: { pokemon: PokemonData }) {
  const totalStats = pokemon.stats.reduce((tot, arr) => {
    return tot + arr.base_stat;
  }, 0);

  const data = {
    labels: ["HP", "Attack", "Def", "Speed", "Sp Def", "Sp Atk"],
    datasets: [
      {
        data: [
          pokemon.stats[0].base_stat,
          pokemon.stats[1].base_stat,
          pokemon.stats[2].base_stat,
          pokemon.stats[5].base_stat,
          pokemon.stats[4].base_stat,
          pokemon.stats[3].base_stat,
        ],
        backgroundColor: "rgba(35, 255, 223, 0.5)",
        borderColor: "#aaaaaa",
        borderWidth: 1,
        pointBackgroundColor: "rgba(35, 255, 223, 1)",
      },
    ],
  };
  const options = {
    responsive: true,
    scales: {
      r: {
        min: 0,
        max: 255,
        angleLines: {
          color: "white",
        },
        grid: {
          color: "white",
        },
        pointLabels: {
          color: "rgba(56, 189, 248, 1)",
        },
        ticks: {
          color: "white",
          stepSize: 25,
          backdropColor: "rgba(51, 65, 85,1)",
        },
      },
    },
  };

  return (
    <div className="px-2 pb-4">
      <p className="my-4 text-3xl">Base stats</p>
      <div className="flex h-[350px] justify-center ">
        <Radar data={data} options={options} />
      </div>
      <p className="">Total</p>
      <p className="text-sky-400">{totalStats}</p>
    </div>
  );
}
