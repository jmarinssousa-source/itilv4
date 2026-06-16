export type Area =
  | "Conceitos-chave de gerenciamento de serviços"
  | "Quatro dimensões do gerenciamento de serviços"
  | "Sistema de valor de serviço"
  | "Princípios orientadores"
  | "Cadeia de valor de serviço"
  | "Práticas ITIL";

export type Difficulty = "facil" | "media" | "dificil";
export type BloomLevel = "lembrar" | "entender" | "aplicar" | "analisar";
export type QuestionStatus = "ativa" | "inativa";
export type MasteryLevel = "baixo" | "medio" | "bom" | "dominado";

export type Question = {
  id: string;
  area: Area;
  subarea: string;
  dificuldade: Difficulty;
  nivel_bloom: BloomLevel;
  tipo: "multipla_escolha";
  enunciado: string;
  alternativa_a: string;
  alternativa_b: string;
  alternativa_c: string;
  alternativa_d: string;
  resposta_correta: "A" | "B" | "C" | "D";
  explicacao_curta: string;
  explicacao_completa: string;
  pegadinha: string;
  dica_prova: string;
  conceitos_relacionados: string[];
  status: QuestionStatus;
};

export type AnswerRecord = {
  user: string;
  questionId: string;
  selected: "A" | "B" | "C" | "D";
  correct: boolean;
  responseTimeSeconds: number;
  answeredAt: string;
  attempts: number;
  mastery: MasteryLevel;
  markedForReview: boolean;
  nextReviewAt: string;
};

export type ExamAttempt = {
  id: string;
  date: string;
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  areaScores: Record<string, { correct: number; total: number }>;
};

export type TrapCard = {
  id: string;
  title: string;
  conceito_principal: string;
  como_confunde: string;
  exemplo_pergunta: string;
  dica_memorizacao: string;
};

export type Flashcard = {
  id: string;
  frente: string;
  verso: string;
  exemplo: string;
  dica_prova: string;
  area: Area;
};
