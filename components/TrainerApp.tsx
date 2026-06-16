"use client";

import { useEffect, useMemo, useState } from "react";
import { flashcards } from "@/data/flashcards";
import { questions as seedQuestions } from "@/data/questions";
import { trapCards } from "@/data/traps";
import {
  buildExam,
  getAreaAccuracy,
  getDashboardStats,
  recordAnswer,
  scoreExam,
  selectNextQuestion
} from "@/lib/trainingEngine";
import { AnswerRecord, ExamAttempt, Question } from "@/lib/types";

type Mode = "dashboard" | "treino" | "simulado" | "revisao" | "pegadinhas" | "flashcards" | "desempenho" | "admin";
type Choice = "A" | "B" | "C" | "D";

const STORAGE_KEY = "itil4-trainer-brasil-state-v1";

const modeLabels: Record<Mode, string> = {
  dashboard: "Início",
  treino: "Treinar agora",
  simulado: "Simulado real",
  revisao: "Revisar meus erros",
  pegadinhas: "Pegadinhas da prova",
  flashcards: "Flashcards",
  desempenho: "Meu desempenho",
  admin: "Admin"
};

export function TrainerApp() {
  const [mode, setMode] = useState<Mode>("dashboard");
  const [questions, setQuestions] = useState<Question[]>(seedQuestions);
  const [records, setRecords] = useState<AnswerRecord[]>([]);
  const [exams, setExams] = useState<ExamAttempt[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    const parsed = JSON.parse(saved) as { questions?: Question[]; records?: AnswerRecord[]; exams?: ExamAttempt[] };
    setQuestions(parsed.questions?.length ? parsed.questions : seedQuestions);
    setRecords(parsed.records ?? []);
    setExams(parsed.exams ?? []);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ questions, records, exams }));
  }, [questions, records, exams]);

  const stats = useMemo(() => getDashboardStats(questions, records, exams), [questions, records, exams]);

  return (
    <main className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-success">Preparação ITIL 4 Foundation</p>
              <h1 className="text-3xl font-bold text-ink sm:text-4xl">ITIL 4 Trainer Brasil</h1>
            </div>
            <div className="rounded-md bg-mist px-4 py-3 text-sm text-slate-700">
              Prova: 40 questões, 60 minutos, aprovação com 26 acertos.
            </div>
          </div>
          <nav className="flex gap-2 overflow-x-auto pb-1">
            {(Object.keys(modeLabels) as Mode[]).map((item) => (
              <button
                key={item}
                onClick={() => setMode(item)}
                className={`focus-ring whitespace-nowrap rounded-md px-3 py-2 text-sm font-semibold transition ${
                  mode === item ? "bg-ink text-white" : "bg-mist text-ink hover:bg-slate-200"
                }`}
              >
                {modeLabels[item]}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {mode === "dashboard" && <Dashboard stats={stats} setMode={setMode} records={records} exams={exams} />}
        {mode === "treino" && <TrainingMode questions={questions} records={records} setRecords={setRecords} />}
        {mode === "simulado" && <ExamMode questions={questions} setExams={setExams} />}
        {mode === "revisao" && <ReviewMode questions={questions} records={records} setRecords={setRecords} setMode={setMode} />}
        {mode === "pegadinhas" && <TrapMode />}
        {mode === "flashcards" && <FlashcardMode />}
        {mode === "desempenho" && <PerformanceMode questions={questions} records={records} exams={exams} />}
        {mode === "admin" && <AdminMode questions={questions} setQuestions={setQuestions} records={records} />}
      </section>
    </main>
  );
}

function Dashboard({
  stats,
  setMode,
  records,
  exams
}: {
  stats: ReturnType<typeof getDashboardStats>;
  setMode: (mode: Mode) => void;
  records: AnswerRecord[];
  exams: ExamAttempt[];
}) {
  const actions: { label: string; mode: Mode }[] = [
    { label: "Treinar agora", mode: "treino" },
    { label: "Simulado real", mode: "simulado" },
    { label: "Revisar meus erros", mode: "revisao" },
    { label: "Pegadinhas da prova", mode: "pegadinhas" },
    { label: "Flashcards", mode: "flashcards" },
    { label: "Meu desempenho", mode: "desempenho" }
  ];

  return (
    <div className="grid gap-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        {actions.map((action) => (
          <button
            key={action.mode}
            onClick={() => setMode(action.mode)}
            className="focus-ring rounded-md bg-ink px-4 py-4 text-left font-semibold text-white transition hover:bg-ocean"
          >
            {action.label}
          </button>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Acerto geral" value={`${stats.percentage}%`} detail={`${stats.correct} acertos em ${stats.total} respostas`} />
        <StatCard label="Questões respondidas" value={String(records.length)} detail="Histórico local do usuário" />
        <StatCard label="Melhor simulado" value={`${stats.bestExam}%`} detail={`${exams.length} simulados finalizados`} />
        <StatCard label="Pior área" value={stats.worstArea} detail="Prioridade do treino inteligente" />
      </div>
      <section className="rounded-md border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-bold">Meta atual de estudo</h2>
        <p className="mt-2 text-slate-700">{stats.recommendation}</p>
        <div className="mt-4 inline-flex rounded-md bg-mist px-3 py-2 text-sm font-semibold text-ink">
          Indicador de prontidão: {stats.readiness}
        </div>
      </section>
    </div>
  );
}

function TrainingMode({
  questions,
  records,
  setRecords
}: {
  questions: Question[];
  records: AnswerRecord[];
  setRecords: React.Dispatch<React.SetStateAction<AnswerRecord[]>>;
}) {
  const [currentId, setCurrentId] = useState(() => selectNextQuestion(questions, records)?.id ?? questions[0]?.id);
  const [selected, setSelected] = useState<Choice | null>(null);
  const [startedAt, setStartedAt] = useState(Date.now());
  const [marked, setMarked] = useState(false);

  const question = questions.find((item) => item.id === currentId) ?? questions[0];
  const revealed = selected !== null;

  function answer(choice: Choice) {
    if (revealed || !question) return;
    setSelected(choice);
    setRecords((prev) => [...prev, recordAnswer(prev, question, choice, Math.round((Date.now() - startedAt) / 1000), marked)]);
  }

  function next() {
    const nextQuestion = selectNextQuestion(questions, records);
    setCurrentId(nextQuestion?.id ?? questions[0]?.id);
    setSelected(null);
    setMarked(false);
    setStartedAt(Date.now());
  }

  if (!question) return <EmptyState title="Sem questões ativas" text="Ative ou cadastre questões no painel administrativo." />;

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
      <QuestionPanel question={question} selected={selected} onAnswer={answer} revealed={revealed} />
      <aside className="grid content-start gap-4">
        <label className="flex items-center gap-3 rounded-md border border-slate-200 bg-white p-4">
          <input type="checkbox" checked={marked} onChange={(event) => setMarked(event.target.checked)} />
          <span className="font-semibold">Marcar para revisão</span>
        </label>
        {revealed && (
          <div className="rounded-md border border-slate-200 bg-white p-4">
            <ResultBadge ok={selected === question.resposta_correta} />
            <InfoBlock title="Gabarito comentado" text={`Resposta ${question.resposta_correta}. ${question.explicacao_curta}`} />
            <InfoBlock title="Explicação completa" text={question.explicacao_completa} />
            <InfoBlock title="Dica de prova" text={question.dica_prova} />
            <InfoBlock title="Pegadinha relacionada" text={question.pegadinha} />
            <button onClick={next} className="focus-ring mt-4 w-full rounded-md bg-success px-4 py-3 font-semibold text-white">
              Próxima questão
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}

function ExamMode({ questions, setExams }: { questions: Question[]; setExams: React.Dispatch<React.SetStateAction<ExamAttempt[]>> }) {
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Choice>>({});
  const [marked, setMarked] = useState<Record<string, boolean>>({});
  const [secondsLeft, setSecondsLeft] = useState(60 * 60);
  const [result, setResult] = useState<ExamAttempt | null>(null);

  useEffect(() => {
    if (!examQuestions.length || result) return;
    const timer = window.setInterval(() => setSecondsLeft((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [examQuestions.length, result]);

  useEffect(() => {
    if (secondsLeft === 0 && examQuestions.length && !result) finish();
  });

  function start() {
    setExamQuestions(buildExam(questions));
    setIndex(0);
    setAnswers({});
    setMarked({});
    setSecondsLeft(60 * 60);
    setResult(null);
  }

  function finish() {
    const scored = scoreExam(examQuestions, answers);
    setResult(scored);
    setExams((prev) => [...prev, scored]);
  }

  if (!examQuestions.length) {
    return (
      <section className="rounded-md border border-slate-200 bg-white p-6">
        <h2 className="text-2xl font-bold">Simulado real</h2>
        <p className="mt-2 text-slate-700">40 questões, 60 minutos, livro fechado e aprovação com 26 acertos.</p>
        <button onClick={start} className="focus-ring mt-5 rounded-md bg-ink px-5 py-3 font-semibold text-white">
          Iniciar simulado
        </button>
      </section>
    );
  }

  if (result) {
    return <ExamResult result={result} questions={examQuestions} answers={answers} onRestart={start} />;
  }

  const question = examQuestions[index];
  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
      <section className="rounded-md border border-slate-200 bg-white p-5">
        <div className="mb-4 flex flex-col justify-between gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center">
          <div>
            <p className="font-semibold text-ocean">Questão {index + 1} de {examQuestions.length}</p>
            <h2 className="text-xl font-bold">Simulado ITIL 4 Foundation</h2>
          </div>
          <div className={`rounded-md px-4 py-2 font-mono text-lg font-bold ${secondsLeft < 300 ? "bg-danger text-white" : "bg-mist"}`}>
            {minutes}:{seconds}
          </div>
        </div>
        <QuestionPanel
          question={question}
          selected={answers[question.id] ?? null}
          onAnswer={(choice) => setAnswers((prev) => ({ ...prev, [question.id]: choice }))}
          revealed={false}
        />
        <div className="mt-5 flex flex-wrap gap-3">
          <button disabled={index === 0} onClick={() => setIndex(index - 1)} className="focus-ring rounded-md bg-mist px-4 py-2 font-semibold disabled:opacity-40">
            Voltar
          </button>
          <button disabled={index === examQuestions.length - 1} onClick={() => setIndex(index + 1)} className="focus-ring rounded-md bg-mist px-4 py-2 font-semibold disabled:opacity-40">
            Avançar
          </button>
          <button onClick={finish} className="focus-ring rounded-md bg-success px-4 py-2 font-semibold text-white">
            Finalizar
          </button>
        </div>
      </section>
      <aside className="rounded-md border border-slate-200 bg-white p-4">
        <label className="mb-4 flex items-center gap-3">
          <input
            type="checkbox"
            checked={Boolean(marked[question.id])}
            onChange={(event) => setMarked((prev) => ({ ...prev, [question.id]: event.target.checked }))}
          />
          <span className="font-semibold">Marcar questão para revisão</span>
        </label>
        <div className="grid grid-cols-5 gap-2">
          {examQuestions.map((item, itemIndex) => (
            <button
              key={item.id}
              onClick={() => setIndex(itemIndex)}
              className={`focus-ring rounded-md px-2 py-2 text-sm font-bold ${
                itemIndex === index ? "bg-ink text-white" : answers[item.id] ? "bg-success text-white" : marked[item.id] ? "bg-yellow-100" : "bg-mist"
              }`}
            >
              {itemIndex + 1}
            </button>
          ))}
        </div>
      </aside>
    </div>
  );
}

function ReviewMode({
  questions,
  records,
  setRecords,
  setMode
}: {
  questions: Question[];
  records: AnswerRecord[];
  setRecords: React.Dispatch<React.SetStateAction<AnswerRecord[]>>;
  setMode: (mode: Mode) => void;
}) {
  const wrong = records.filter((record) => !record.correct);
  const latestWrong = [...wrong].reverse();

  if (!latestWrong.length) return <EmptyState title="Nenhum erro registrado" text="Faça um treino ou simulado para criar sua lista de revisão." />;

  return (
    <div className="grid gap-4">
      {latestWrong.map((record) => {
        const question = questions.find((item) => item.id === record.questionId);
        if (!question) return null;
        return (
          <section key={`${record.questionId}-${record.answeredAt}`} className="rounded-md border border-slate-200 bg-white p-5">
            <p className="text-sm font-semibold text-danger">Você marcou {record.selected}; correto: {question.resposta_correta}</p>
            <h2 className="mt-1 text-lg font-bold">{question.enunciado}</h2>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <InfoBlock title="Explicação" text={question.explicacao_completa} />
              <InfoBlock title="Pegadinha" text={question.pegadinha} />
              <InfoBlock title="Conceitos confundidos" text={question.conceitos_relacionados.join(" x ")} />
              <InfoBlock title="Próxima revisão" text={new Date(record.nextReviewAt).toLocaleString("pt-BR")} />
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <button onClick={() => setMode("treino")} className="focus-ring rounded-md bg-ink px-4 py-2 font-semibold text-white">
                Refazer
              </button>
              <button
                onClick={() => setRecords((prev) => prev.map((item) => (item === record ? { ...item, mastery: "dominado", markedForReview: false } : item)))}
                className="focus-ring rounded-md bg-success px-4 py-2 font-semibold text-white"
              >
                Marcar como dominada
              </button>
            </div>
          </section>
        );
      })}
    </div>
  );
}

function TrapMode() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {trapCards.map((card) => (
        <article key={card.id} className="rounded-md border border-slate-200 bg-white p-5">
          <h2 className="text-xl font-bold">{card.title}</h2>
          <InfoBlock title="Conceito principal" text={card.conceito_principal} />
          <InfoBlock title="Como a prova confunde" text={card.como_confunde} />
          <InfoBlock title="Exemplo de pergunta" text={card.exemplo_pergunta} />
          <InfoBlock title="Dica de memorização" text={card.dica_memorizacao} />
        </article>
      ))}
    </div>
  );
}

function FlashcardMode() {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = flashcards[index];

  return (
    <section className="mx-auto max-w-2xl rounded-md border border-slate-200 bg-white p-6">
      <p className="font-semibold text-ocean">{card.area}</p>
      <div className="mt-4 min-h-64 rounded-md bg-mist p-6">
        <p className="text-sm font-semibold uppercase tracking-wide">{flipped ? "Verso" : "Frente"}</p>
        <h2 className="mt-3 text-2xl font-bold">{flipped ? card.verso : card.frente}</h2>
        {flipped && (
          <div className="mt-4 grid gap-3">
            <InfoBlock title="Exemplo" text={card.exemplo} />
            <InfoBlock title="Dica de prova" text={card.dica_prova} />
          </div>
        )}
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <button onClick={() => setFlipped(!flipped)} className="focus-ring rounded-md bg-ink px-4 py-2 font-semibold text-white">
          Virar cartão
        </button>
        <button
          onClick={() => {
            setIndex((index + 1) % flashcards.length);
            setFlipped(false);
          }}
          className="focus-ring rounded-md bg-success px-4 py-2 font-semibold text-white"
        >
          Próximo
        </button>
      </div>
    </section>
  );
}

function PerformanceMode({ questions, records, exams }: { questions: Question[]; records: AnswerRecord[]; exams: ExamAttempt[] }) {
  const stats = getDashboardStats(questions, records, exams);
  const areas = getAreaAccuracy(questions, records);
  const wrongCounts = records.filter((record) => !record.correct).reduce<Record<string, number>>((acc, record) => {
    acc[record.questionId] = (acc[record.questionId] ?? 0) + 1;
    return acc;
  }, {});
  const mostWrong = Object.entries(wrongCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div className="grid gap-5">
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Questões respondidas" value={String(records.length)} detail="Treinos registrados" />
        <StatCard label="Acerto geral" value={`${stats.percentage}%`} detail={stats.readiness} />
        <StatCard label="Temas fracos" value={Object.values(areas).filter((area) => area.percentage < 70).length.toString()} detail="Abaixo de 70%" />
        <StatCard label="Temas dominados" value={records.filter((record) => record.mastery === "dominado").length.toString()} detail="Questões dominadas" />
      </div>
      <section className="rounded-md border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-bold">Percentual por área</h2>
        <div className="mt-4 grid gap-3">
          {Object.entries(areas).map(([area, item]) => (
            <ProgressRow key={area} label={area} value={item.percentage} detail={`${item.correct}/${item.total}`} />
          ))}
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-md border border-slate-200 bg-white p-5">
          <h2 className="text-xl font-bold">Evolução por simulado</h2>
          <div className="mt-4 grid gap-2">
            {exams.map((exam, index) => <ProgressRow key={exam.id} label={`Simulado ${index + 1}`} value={exam.percentage} detail={`${exam.score}/${exam.total}`} />)}
            {!exams.length && <p className="text-slate-600">Nenhum simulado finalizado ainda.</p>}
          </div>
        </div>
        <div className="rounded-md border border-slate-200 bg-white p-5">
          <h2 className="text-xl font-bold">Questões mais erradas</h2>
          <div className="mt-4 grid gap-3">
            {mostWrong.map(([id, count]) => (
              <p key={id} className="rounded-md bg-mist p-3 text-sm">
                <strong>{id}</strong> - {count} erro(s): {questions.find((item) => item.id === id)?.subarea}
              </p>
            ))}
            {!mostWrong.length && <p className="text-slate-600">Sem erros registrados.</p>}
          </div>
        </div>
      </section>
    </div>
  );
}

function AdminMode({
  questions,
  setQuestions,
  records
}: {
  questions: Question[];
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
  records: AnswerRecord[];
}) {
  const [filter, setFilter] = useState("todas");
  const [draft, setDraft] = useState("");
  const visible = questions.filter((question) => filter === "todas" || question.area === filter || question.status === filter);

  function addSimpleQuestion() {
    const id = `Q${String(questions.length + 1).padStart(3, "0")}`;
    setQuestions((prev) => [
      ...prev,
      {
        id,
        area: "Práticas ITIL",
        subarea: "Nova questão",
        dificuldade: "media",
        nivel_bloom: "entender",
        tipo: "multipla_escolha",
        enunciado: draft || "Nova questão autoral",
        alternativa_a: "Alternativa A",
        alternativa_b: "Alternativa B",
        alternativa_c: "Alternativa C",
        alternativa_d: "Alternativa D",
        resposta_correta: "A",
        explicacao_curta: "Explicação curta.",
        explicacao_completa: "Explicação completa.",
        pegadinha: "Pegadinha relacionada.",
        dica_prova: "Dica de prova.",
        conceitos_relacionados: ["conceito"],
        status: "ativa"
      }
    ]);
    setDraft("");
  }

  function importCsv(text: string) {
    const rows = text.split(/\r?\n/).filter(Boolean).slice(1);
    const imported = rows.map((row, index) => {
      const [enunciado, a, b, c, d, correta] = row.split(",");
      return {
        ...seedQuestions[0],
        id: `CSV${Date.now()}-${index}`,
        enunciado: enunciado?.trim() || "Questão importada",
        alternativa_a: a?.trim() || "A",
        alternativa_b: b?.trim() || "B",
        alternativa_c: c?.trim() || "C",
        alternativa_d: d?.trim() || "D",
        resposta_correta: (["A", "B", "C", "D"].includes(correta?.trim()) ? correta.trim() : "A") as Choice
      };
    });
    setQuestions((prev) => [...prev, ...imported]);
  }

  return (
    <div className="grid gap-5">
      <section className="rounded-md border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-bold">Painel administrativo</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Enunciado da nova questão"
            className="focus-ring rounded-md border border-slate-300 px-3 py-2"
          />
          <button onClick={addSimpleQuestion} className="focus-ring rounded-md bg-ink px-4 py-2 font-semibold text-white">
            Cadastrar questão
          </button>
        </div>
        <textarea
          onBlur={(event) => event.target.value.trim() && importCsv(event.target.value)}
          placeholder="Importar CSV ao sair do campo: enunciado,a,b,c,d,correta"
          className="focus-ring mt-3 min-h-24 w-full rounded-md border border-slate-300 px-3 py-2"
        />
        <select value={filter} onChange={(event) => setFilter(event.target.value)} className="focus-ring mt-3 rounded-md border border-slate-300 px-3 py-2">
          <option value="todas">Todas</option>
          <option value="ativa">Ativas</option>
          <option value="inativa">Inativas</option>
          {Array.from(new Set(questions.map((question) => question.area))).map((area) => (
            <option key={area} value={area}>{area}</option>
          ))}
        </select>
      </section>
      <div className="grid gap-3">
        {visible.map((question) => {
          const mistakes = records.filter((record) => record.questionId === question.id && !record.correct).length;
          return (
            <article key={question.id} className="rounded-md border border-slate-200 bg-white p-4">
              <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                <div>
                  <p className="text-sm font-semibold text-ocean">{question.id} - {question.area} - {question.status}</p>
                  <h3 className="font-bold">{question.enunciado}</h3>
                  <p className="mt-1 text-sm text-slate-600">Erros registrados: {mistakes}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setQuestions((prev) => prev.map((item) => item.id === question.id ? { ...item, status: item.status === "ativa" ? "inativa" : "ativa" } : item))}
                    className="focus-ring rounded-md bg-mist px-3 py-2 text-sm font-semibold"
                  >
                    Ativar/desativar
                  </button>
                  <button
                    onClick={() => setQuestions((prev) => prev.filter((item) => item.id !== question.id))}
                    className="focus-ring rounded-md bg-danger px-3 py-2 text-sm font-semibold text-white"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function QuestionPanel({
  question,
  selected,
  onAnswer,
  revealed
}: {
  question: Question;
  selected: Choice | null;
  onAnswer: (choice: Choice) => void;
  revealed: boolean;
}) {
  const alternatives: { key: Choice; text: string }[] = [
    { key: "A", text: question.alternativa_a },
    { key: "B", text: question.alternativa_b },
    { key: "C", text: question.alternativa_c },
    { key: "D", text: question.alternativa_d }
  ];

  return (
    <section className="rounded-md border border-slate-200 bg-white p-5">
      <p className="text-sm font-semibold text-ocean">{question.area} / {question.subarea}</p>
      <h2 className="mt-2 text-xl font-bold">{question.enunciado}</h2>
      <div className="mt-5 grid gap-3">
        {alternatives.map((alternative) => {
          const isCorrect = revealed && alternative.key === question.resposta_correta;
          const isWrong = revealed && selected === alternative.key && selected !== question.resposta_correta;
          return (
            <button
              key={alternative.key}
              onClick={() => onAnswer(alternative.key)}
              className={`focus-ring rounded-md border px-4 py-3 text-left transition ${
                isCorrect
                  ? "border-success bg-green-50"
                  : isWrong
                    ? "border-danger bg-red-50"
                    : selected === alternative.key
                      ? "border-ocean bg-blue-50"
                      : "border-slate-200 bg-white hover:bg-mist"
              }`}
            >
              <strong>{alternative.key}.</strong> {alternative.text}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function ExamResult({
  result,
  questions,
  answers,
  onRestart
}: {
  result: ExamAttempt;
  questions: Question[];
  answers: Record<string, Choice>;
  onRestart: () => void;
}) {
  return (
    <div className="grid gap-5">
      <section className={`rounded-md border p-6 ${result.passed ? "border-success bg-green-50" : "border-danger bg-red-50"}`}>
        <h2 className="text-2xl font-bold">{result.passed ? "Aprovado" : "Não aprovado"}</h2>
        <p className="mt-2 text-lg">
          {result.score} acertos, {result.total - result.score} erros, {result.percentage}%.
        </p>
        <button onClick={onRestart} className="focus-ring mt-4 rounded-md bg-ink px-4 py-2 font-semibold text-white">
          Novo simulado
        </button>
      </section>
      <section className="rounded-md border border-slate-200 bg-white p-5">
        <h3 className="text-xl font-bold">Desempenho por área</h3>
        <div className="mt-4 grid gap-3">
          {Object.entries(result.areaScores).map(([area, item]) => (
            <ProgressRow key={area} label={area} value={Math.round((item.correct / item.total) * 100)} detail={`${item.correct}/${item.total}`} />
          ))}
        </div>
      </section>
      <section className="rounded-md border border-slate-200 bg-white p-5">
        <h3 className="text-xl font-bold">Plano de revisão baseado nos erros</h3>
        <div className="mt-4 grid gap-3">
          {questions.filter((question) => answers[question.id] !== question.resposta_correta).map((question) => (
            <p key={question.id} className="rounded-md bg-mist p-3 text-sm">
              <strong>{question.subarea}:</strong> {question.pegadinha}
            </p>
          ))}
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <section className="rounded-md border border-slate-200 bg-white p-5">
      <p className="text-sm font-semibold text-slate-600">{label}</p>
      <p className="mt-2 text-2xl font-bold text-ink">{value}</p>
      <p className="mt-1 text-sm text-slate-600">{detail}</p>
    </section>
  );
}

function InfoBlock({ title, text }: { title: string; text: string }) {
  return (
    <div className="mt-3">
      <p className="text-sm font-bold text-ink">{title}</p>
      <p className="mt-1 text-sm leading-6 text-slate-700">{text}</p>
    </div>
  );
}

function ResultBadge({ ok }: { ok: boolean }) {
  return <div className={`rounded-md px-3 py-2 font-bold ${ok ? "bg-green-100 text-success" : "bg-red-100 text-danger"}`}>{ok ? "Você acertou" : "Você errou"}</div>;
}

function ProgressRow({ label, value, detail }: { label: string; value: number; detail: string }) {
  return (
    <div>
      <div className="mb-1 flex justify-between gap-3 text-sm">
        <span className="font-semibold">{label}</span>
        <span>{detail}</span>
      </div>
      <div className="h-3 rounded-md bg-mist">
        <div className="h-3 rounded-md bg-success" style={{ width: `${Math.min(100, value)}%` }} />
      </div>
    </div>
  );
}

function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <section className="rounded-md border border-slate-200 bg-white p-8 text-center">
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="mt-2 text-slate-700">{text}</p>
    </section>
  );
}
