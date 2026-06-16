import { AnswerRecord, ExamAttempt, MasteryLevel, Question } from "@/lib/types";

const DAY = 24 * 60 * 60 * 1000;

export function calculateMastery(records: AnswerRecord[], latestCorrect: boolean): MasteryLevel {
  const sorted = [...records].sort(
    (a, b) => new Date(a.answeredAt).getTime() - new Date(b.answeredAt).getTime()
  );
  const wrongCount = sorted.filter((record) => !record.correct).length + (latestCorrect ? 0 : 1);
  if (wrongCount >= 2 && !latestCorrect) return "baixo";

  const correctDays = new Set(
    sorted
      .filter((record) => record.correct)
      .map((record) => new Date(record.answeredAt).toISOString().slice(0, 10))
  );
  if (latestCorrect) correctDays.add(new Date().toISOString().slice(0, 10));

  if (correctDays.size >= 3) return "dominado";
  if (correctDays.size >= 2) return "bom";
  if (latestCorrect || correctDays.size === 1) return "medio";
  return "baixo";
}

export function calculateNextReview(correct: boolean, responseTimeSeconds: number, attempts: number, mastery: MasteryLevel) {
  const now = Date.now();
  if (!correct && attempts > 1) return new Date(now + 4 * 60 * 60 * 1000).toISOString();
  if (!correct) return new Date(now + DAY).toISOString();
  if (mastery === "dominado") return new Date(now + 30 * DAY).toISOString();
  if (responseTimeSeconds > 75) return new Date(now + 3 * DAY).toISOString();
  return new Date(now + 7 * DAY).toISOString();
}

export function recordAnswer(
  records: AnswerRecord[],
  question: Question,
  selected: "A" | "B" | "C" | "D",
  responseTimeSeconds: number,
  markedForReview: boolean,
  user = "local-user"
) {
  const previous = records.filter((record) => record.questionId === question.id);
  const attempts = previous.length + 1;
  const correct = selected === question.resposta_correta;
  const mastery = calculateMastery(previous, correct);
  const nextReviewAt = calculateNextReview(correct, responseTimeSeconds, attempts, mastery);

  return {
    user,
    questionId: question.id,
    selected,
    correct,
    responseTimeSeconds,
    answeredAt: new Date().toISOString(),
    attempts,
    mastery,
    markedForReview,
    nextReviewAt
  } satisfies AnswerRecord;
}

export function selectNextQuestion(questions: Question[], records: AnswerRecord[]) {
  const active = questions.filter((question) => question.status === "ativa");
  const areaAccuracy = getAreaAccuracy(active, records);
  const now = Date.now();

  return [...active]
    .map((question) => {
      const history = records.filter((record) => record.questionId === question.id);
      const last = history.at(-1);
      const wrongRecently = last && !last.correct ? 60 : 0;
      const weakArea = (areaAccuracy[question.area]?.percentage ?? 100) < 65 ? 28 : 0;
      const neverAnswered = history.length === 0 ? 24 : 0;
      const due = last && new Date(last.nextReviewAt).getTime() <= now ? 22 : 0;
      const staleCorrect = last && last.correct && now - new Date(last.answeredAt).getTime() > 10 * DAY ? 12 : 0;
      const trap = question.pegadinha ? 8 : 0;
      const difficulty = question.dificuldade === "dificil" ? 4 : question.dificuldade === "media" ? 2 : 0;
      return { question, score: wrongRecently + weakArea + neverAnswered + due + staleCorrect + trap + difficulty };
    })
    .sort((a, b) => b.score - a.score || a.question.id.localeCompare(b.question.id))[0]?.question;
}

export function getAreaAccuracy(questions: Question[], records: AnswerRecord[]) {
  const byId = new Map(questions.map((question) => [question.id, question]));
  const result: Record<string, { correct: number; total: number; percentage: number }> = {};

  records.forEach((record) => {
    const question = byId.get(record.questionId);
    if (!question) return;
    result[question.area] ??= { correct: 0, total: 0, percentage: 0 };
    result[question.area].total += 1;
    if (record.correct) result[question.area].correct += 1;
  });

  Object.values(result).forEach((item) => {
    item.percentage = item.total ? Math.round((item.correct / item.total) * 100) : 0;
  });
  return result;
}

export function getDashboardStats(questions: Question[], records: AnswerRecord[], exams: ExamAttempt[]) {
  const total = records.length;
  const correct = records.filter((record) => record.correct).length;
  const percentage = total ? Math.round((correct / total) * 100) : 0;
  const areas = getAreaAccuracy(questions, records);
  const worstArea = Object.entries(areas).sort((a, b) => a[1].percentage - b[1].percentage)[0]?.[0] ?? "Sem dados";
  const bestExam = exams.length ? Math.max(...exams.map((exam) => exam.percentage)) : 0;
  const weak = Object.entries(areas).filter(([, value]) => value.percentage < 70).map(([area]) => area);

  return {
    total,
    correct,
    percentage,
    worstArea,
    bestExam,
    recommendation: weak[0] ? `Revisar ${weak[0]}` : "Fazer um simulado real",
    readiness: getReadiness(percentage, exams)
  };
}

export function getReadiness(overallPercentage: number, exams: ExamAttempt[]) {
  const lastThree = exams.slice(-3);
  if (lastThree.length === 3 && lastThree.every((exam) => exam.percentage >= 85)) return "pronto para prova";
  if (overallPercentage >= 75) return "quase pronto";
  if (overallPercentage >= 65) return "risco alto";
  return "não recomendado";
}

export function buildExam(questions: Question[]) {
  const active = questions.filter((question) => question.status === "ativa");
  const byArea = new Map<string, Question[]>();
  active.forEach((question) => {
    byArea.set(question.area, [...(byArea.get(question.area) ?? []), question]);
  });

  const selected: Question[] = [];
  byArea.forEach((items) => selected.push(...items.slice(0, Math.min(6, items.length))));
  active.forEach((question) => {
    if (selected.length < 40 && !selected.some((item) => item.id === question.id)) selected.push(question);
  });

  return selected.slice(0, 40);
}

export function scoreExam(questions: Question[], answers: Record<string, "A" | "B" | "C" | "D">): ExamAttempt {
  const areaScores: Record<string, { correct: number; total: number }> = {};
  let score = 0;

  questions.forEach((question) => {
    areaScores[question.area] ??= { correct: 0, total: 0 };
    areaScores[question.area].total += 1;
    if (answers[question.id] === question.resposta_correta) {
      score += 1;
      areaScores[question.area].correct += 1;
    }
  });

  const percentage = Math.round((score / questions.length) * 100);
  return {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    score,
    total: questions.length,
    percentage,
    passed: score >= 26,
    areaScores
  };
}
