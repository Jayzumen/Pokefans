import { Chain } from "@/types/pokemonTypes";

export default function EvoCheck({
  species,
  index,
}: {
  species: Chain[];
  index: string;
}) {
  const newSpecies = species.filter((s) => s.evolution_details.length !== 0);

  const currentSpecies = newSpecies.filter((s) => s.species.name === index);

  if (currentSpecies.length !== 0) {
    const evoDetail = currentSpecies[0].evolution_details[0];
    if (evoDetail.min_level && evoDetail.needs_overworld_rain) {
      return <div>min Lvl. {evoDetail.min_level} while it rains</div>;
    }
    if (evoDetail.turn_upside_down && evoDetail.min_level) {
      return <div>Lvl. {evoDetail.min_level} holding 3DS upside down</div>;
    }
    if (evoDetail.min_level && evoDetail.party_type) {
      return (
        <div>
          Lvl. {evoDetail.min_level} with a{" "}
          <span className="capitalize">{evoDetail.party_type.name}</span> Type
          Pokémon in your Team
        </div>
      );
    }
    if (evoDetail.trigger.name === "take-damage") {
      return (
        <div>
          Travel to Dusty Bowl after taking 49 HP damage without fainting
        </div>
      );
    }
    if (evoDetail.trigger.name === "recoil-damage") {
      return <div>Get 294 recoil damage in one battle without fainting</div>;
    }
    if (evoDetail.trigger.name === "shed") {
      return (
        <div>
          <div>Lvl. 20</div> Have free space in Pokémon Team and a Pokéball in
          inventory
        </div>
      );
    }
    if (evoDetail.gender && evoDetail.min_level) {
      return (
        <div>
          Lvl. {evoDetail.min_level} if
          <span> {evoDetail.gender === 1 ? "Female" : "Male"}</span>
        </div>
      );
    }
    if (evoDetail.gender && evoDetail.item) {
      return (
        <div>
          Give<span className="capitalize"> {evoDetail.item.name}</span> if
          Pokémon is {evoDetail.gender === 1 ? "Female" : "Male"}
        </div>
      );
    }
    if (evoDetail.gender) {
      return <div>Gender: {evoDetail.gender === 1 ? "Female" : "Male"}</div>;
    }
    if (evoDetail.trigger.name === "three-critical-hits") {
      return <div>Make 3 critical hits in one battle</div>;
    }
    if (evoDetail.min_happiness && evoDetail.time_of_day) {
      return (
        <div>
          Level-Up with a Happiness of<span> {evoDetail.min_happiness} </span>
          at<span className="capitalize"> {evoDetail.time_of_day}</span>
        </div>
      );
    }
    if (evoDetail.known_move_type && evoDetail.min_affection) {
      return (
        <div>
          Level-Up with a
          <span className="capitalize"> {evoDetail.known_move_type.name} </span>
          Move and an Affection of<span> {evoDetail.min_affection}</span>
        </div>
      );
    }
    if (evoDetail.held_item && evoDetail.trigger.name === "trade") {
      return (
        <div>
          Trade while holding
          <span className="capitalize"> {evoDetail.held_item.name}</span>
        </div>
      );
    }
    if (evoDetail.min_level && evoDetail.relative_physical_stats === 0) {
      return (
        <div>
          ATK = DEF at Lvl. <span>{evoDetail.min_level}</span>
        </div>
      );
    }
    if (evoDetail.min_level && evoDetail.relative_physical_stats === 1) {
      return (
        <div>
          ATK {">"} DEF at Lvl. <span>{evoDetail.min_level}</span>
        </div>
      );
    }
    if (evoDetail.min_level && evoDetail.relative_physical_stats === -1) {
      return (
        <div>
          ATK {"<"} DEF at Lvl. <span>{evoDetail.min_level}</span>
        </div>
      );
    }
    if (evoDetail.held_item) {
      return (
        <div>
          Level-Up with
          <span className="capitalize"> {evoDetail.held_item.name}</span>
        </div>
      );
    }
    if (evoDetail.item) {
      return (
        <div>
          Use <span className="capitalize">{evoDetail.item.name}</span>
        </div>
      );
    }
    if (evoDetail.known_move) {
      return (
        <div>
          Level-Up with
          <span className="capitalize"> {evoDetail.known_move.name} </span>
          learned
        </div>
      );
    }
    if (evoDetail.known_move_type) {
      return (
        <div>
          Level-Up with a
          <span className="capitalize"> {evoDetail.known_move_type.name} </span>
          move
        </div>
      );
    }
    if (evoDetail.location) {
      return (
        <div>
          Level-Up at
          <span className="capitalize"> {evoDetail.location.name} </span>
        </div>
      );
    }
    if (evoDetail.min_affection) {
      return (
        <div>
          Level-Up with a Affection of
          <span> {evoDetail.min_affection} </span>
        </div>
      );
    }
    if (evoDetail.min_beauty) {
      return (
        <div>
          Level-Up with a Beauty of
          <span> {evoDetail.min_beauty} </span>
        </div>
      );
    }
    if (evoDetail.min_happiness) {
      return (
        <div>
          Level-Up with a Happiness of
          <span> {evoDetail.min_happiness} </span>
        </div>
      );
    }
    if (evoDetail.min_level) {
      return (
        <div>
          Lvl. <span> {evoDetail.min_level} </span>
        </div>
      );
    }
    if (evoDetail.needs_overworld_rain) {
      return <div>Level-Up while it rains</div>;
    }
    if (evoDetail.party_species) {
      return (
        <div>
          Level-Up with a
          <span className="capitalize"> {evoDetail.party_species.name} </span>
          in your Party
        </div>
      );
    }
    if (evoDetail.party_type) {
      return (
        <div>
          Level-Up with a
          <span className="capitalize"> {evoDetail.party_type.name} </span>
          Pokémon in your Party
        </div>
      );
    }
    if (evoDetail.relative_physical_stats) {
      return (
        <div>
          Level-Up with a<span> {evoDetail.relative_physical_stats} </span>
          difference in physical stats
        </div>
      );
    }
    if (evoDetail.time_of_day) {
      return (
        <div>
          Level-Up during
          <span className="capitalize"> {evoDetail.time_of_day} </span>
        </div>
      );
    }
    if (evoDetail.trade_species) {
      return (
        <div>
          Trade with
          <span className="capitalize"> {evoDetail.trade_species.name} </span>
        </div>
      );
    }
    if (evoDetail.trigger.name === "trade") {
      return <div>Trade</div>;
    }
  }

  return null;
}
