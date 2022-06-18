import { PlayerSide } from "./enums.js";

function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min)) + min; // Максимум не включается, минимум включается
}

function getOpponentSide (side) {
  if (side === PlayerSide.FIRST) { return PlayerSide.SECOND; }
  return PlayerSide.FIRST;
}

export { getRandomInt, getOpponentSide };
