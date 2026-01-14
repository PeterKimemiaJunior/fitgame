<<<<<<< HEAD
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
 =======
# fitgame
FitGame é um MVP frontend de uma plataforma web gamificada focada em emagrecimento progressivo e criação de hábitos saudáveis, desenvolvida com atenção à realidade alimentar e social de Moçambique.


FitGame – Plataforma Gamificada de Emagrecimento e Hábitos Saudáveis

FitGame é um MVP frontend de uma plataforma web gamificada focada em emagrecimento progressivo e criação de hábitos saudáveis, desenvolvida com atenção à realidade alimentar e social de Moçambique.

O projeto tem como objetivo ajudar utilizadores sedentários a ganhar consistência diária, utilizando planos simples, exercícios leves e elementos de gamificação — sem promessas médicas, dietas rígidas ou soluções milagrosas.

🎯 Objetivo do Projeto

Incentivar hábitos saudáveis de forma gradual e sustentável

Promover consciência alimentar, não obsessão por peso

Validar engajamento e retenção através de gamificação

🧩 Funcionalidades Principais

Cadastro de utilizador (dados básicos)

Cálculo automático de:

IMC (Índice de Massa Corporal)

TMB (Taxa Metabólica Basal)

Necessidade calórica diária

Check-in diário de hábitos

Sistema de pontos e streaks

Persistência de dados via LocalStorage

Interface mobile-first

Feedback visual simples (gráficos em evolução)

🛠️ Stack Técnica

React + Vite

TypeScript (strict mode)

Tailwind CSS v4

Zustand (estado global com persistência)

LocalStorage

Chart.js (visualização de progresso)

Deploy: Vercel

🚫 Fora do Escopo (Deliberadamente)

Backend ou autenticação

Inteligência Artificial avançada

Dietas clínicas ou aconselhamento médico

Promessas de resultados rápidos

📌 Nota Importante

Este projeto tem finalidade educacional e comportamental.
Não substitui acompanhamento médico ou nutricional.
>>>>>>> 49426210ea17adf84bddebd7d5940967d0d8e422
