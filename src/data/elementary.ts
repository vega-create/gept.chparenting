export interface VocabItem {
  en: string; zh: string; pos: string; ex: string;
}
export interface GrammarPoint {
  title: string; explain: string; examples: string[]; tip: string;
}
export interface ListenQ {
  text: string; opts: string[]; ans: number; zh: string;
}
export interface ReadingSection {
  passage: string; questions: { q: string; opts: string[]; ans: number }[];
}
export interface QuizQ {
  s: string; opts: string[]; ans: number;
}
export interface Unit {
  id: number; title: string; icon: string; color: string;
  vocab: VocabItem[]; grammar: GrammarPoint[];
  listening: ListenQ[];
  reading: ReadingSection | ReadingSection[];
  quiz: QuizQ[];
}

import { unit1 } from "./units/unit1";
import { unit2 } from "./units/unit2";
import { unit3 } from "./units/unit3";
import { unit4 } from "./units/unit4";
import { unit5 } from "./units/unit5";
import { unit6 } from "./units/unit6";
import { unit7 } from "./units/unit7";
import { unit8 } from "./units/unit8";
import { unit9 } from "./units/unit9";
import { unit10 } from "./units/unit10";
import { unit11 } from "./units/unit11";
import { unit12 } from "./units/unit12";
import { unit13 } from "./units/unit13";
import { unit14 } from "./units/unit14";
import { unit15 } from "./units/unit15";
import { unit16 } from "./units/unit16";
import { unit17 } from "./units/unit17";
import { unit18 } from "./units/unit18";
import { unit19 } from "./units/unit19";
import { unit20 } from "./units/unit20";

export const UNITS: Unit[] = [
  unit1, unit2, unit3, unit4, unit5,
  unit6, unit7, unit8, unit9, unit10,
  unit11, unit12, unit13, unit14, unit15,
  unit16, unit17, unit18, unit19, unit20,
];
