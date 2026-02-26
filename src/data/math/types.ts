/* ─── Math Section Type Definitions ─── */

export interface MathConcept {
  title: string;
  explanation: string;
  examples: { question: string; steps: string[]; answer: string }[];
}

export interface MathPractice {
  question: string;
  options: string[];
  answer: number; // index of correct option
  explanation: string;
}

export interface MathChallenge {
  timeLimit: number; // seconds
  generateProblem: () => { question: string; answer: number };
}

export interface MathTopic {
  id: string;
  title: string;
  icon: string;
  grade: string;
  color: string;
  border: string;
  concepts: MathConcept[];
  practices: MathPractice[];
  challenge: MathChallenge;
}
