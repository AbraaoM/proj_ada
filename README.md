# Sistema de Cuidado da Filha

App para ver o clima em Pindamonhangaba e a recomendação de roupa do dia. O histórico fica no Neon (Postgres).

Precisa de Node.js 20.9 ou mais recente.

## Desenvolvimento

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

O clima vem da API pública do Open-Meteo e funciona sem configuração. Sem `DATABASE_URL`, a página abre e o histórico fica indisponível.

Para ligar o histórico, crie `.env.local` na raiz:

```bash
DATABASE_URL=postgresql://usuario:senha@host/banco?sslmode=require
```

A connection string sai do painel do Neon. Não commite esse arquivo.

Depois crie a tabela uma vez. No SQL Editor do Neon, rode o conteúdo de `db/0000_spotty_nextwave.sql`.

Reinicie o `npm run dev` se ele já estiver aberto.

## Produção

O deploy é na Vercel, com o mesmo banco Neon.

1. Crie o projeto na Vercel a partir deste repositório.
2. Em **Settings → Environment Variables**, defina `DATABASE_URL` com a connection string do Neon.
3. Faça o deploy. A Vercel roda o build sozinha.

A tabela precisa existir antes do primeiro uso. Se ainda não rodou `db/0000_spotty_nextwave.sql` nesse banco, rode agora no SQL Editor do Neon.

Para ver o build de produção na sua máquina:

```bash
npm run build
npm start
```

O app sobe em [http://localhost:3000](http://localhost:3000) e lê o mesmo `.env.local`.
