import type { MathTopic } from "./types";

import basicArithmetic from "./topics/basic-arithmetic";
import fractions from "./topics/fractions";
import decimals from "./topics/decimals";
import percentages from "./topics/percentages";
import geometry from "./topics/geometry";
import introAlgebra from "./topics/intro-algebra";
import wordProblems from "./topics/word-problems";
import timeMeasurement from "./topics/time-measurement";

export const MATH_TOPICS: MathTopic[] = [
  basicArithmetic,
  fractions,
  decimals,
  percentages,
  geometry,
  introAlgebra,
  wordProblems,
  timeMeasurement,
];

export function getTopicById(id: string): MathTopic | undefined {
  return MATH_TOPICS.find((t) => t.id === id);
}
