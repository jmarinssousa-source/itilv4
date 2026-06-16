# ITIL 4 Trainer Brasil

Plataforma web em português do Brasil para treino da certificação ITIL 4 Foundation. O projeto usa Next.js, TypeScript, Tailwind CSS e dados locais com estrutura preparada para futura autenticação e banco remoto.

## Funcionalidades

- Dashboard com progresso, melhor simulado, pior área e recomendação de estudo.
- Treino contínuo com gabarito comentado, explicação curta/completa, dica de prova e pegadinha.
- Simulado real com 40 questões, cronômetro de 60 minutos, revisão marcada e resultado por área.
- Revisão de erros com refazer, marcar como dominada e comparação entre conceitos confundidos.
- Módulo de pegadinhas clássicas da ITIL 4 Foundation.
- Flashcards objetivos para fixação.
- Painel de desempenho com prontidão para prova.
- Painel administrativo para cadastrar, editar, excluir, ativar/desativar, importar CSV e ver estatísticas.
- Banco inicial com 40 questões autorais, sem questões oficiais, dumps ou vazadas.

## Como rodar

```bash
pnpm install
pnpm dev
```

Se preferir npm, também funciona:

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`.

## Estrutura

```text
app/
components/
data/
lib/
```

Os dados ficam em `data/questions.ts`, `data/traps.ts` e `data/flashcards.ts`. A lógica de seleção inteligente, domínio e repetição espaçada fica em `lib/trainingEngine.ts`.
