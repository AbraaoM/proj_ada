# AGENTS.md — Sistema de Cuidado da Filha

## Identidade do projeto
App pessoal para ajudar a cuidar da minha filha.
Foco em simplicidade, clareza, beleza e uso diário no celular.

## Stack obrigatória
- Next.js (App Router) + TypeScript + Tailwind CSS
- Banco: Neon (Postgres serverless)
- Driver: `@neondatabase/serverless`
- Deploy alvo: Vercel

## Localização padrão
- Cidade: Pindamonhangaba, SP, Brasil
- Coordenadas: latitude -22.9239, longitude -45.4617
- Permitir trocar a cidade depois

## Design
- Estilo visual inspirado no Notion: limpo, respirado, tipografia forte e hierarquia clara.
- Paleta: preto, branco e tons de cinza. Apenas **uma** cor de destaque.
- Evitar gradientes, sombras pesadas, excesso de cores e elementos decorativos desnecessários.
- Preferir fonte Inter (ou similar) e grid de 4px.
- UI **mobile-first** e totalmente responsiva (celular, tablet e desktop).
- Priorizar beleza e polimento visual: espaçamento generoso, alinhamento preciso, hierarquia tipográfica clara e microinterações sutis.
- Componentes devem parecer cuidados e intencionais, não genéricos.

## Regras de trabalho
- Sempre comece features não-triviais em Plan Mode (`/plan`) e espere aprovação antes de editar arquivos.
- Use as skills do Neon e o Neon MCP para criar projetos, branches, tabelas e rodar SQL.
- Use as skills de design (notion-ui / frontend-design) para manter consistência visual e beleza.
- Nunca invente connection strings. Sempre obtenha via MCP ou peça o usuário.
- Prefira Server Components quando possível.
- Não adicione dependências sem necessidade clara.
- Nunca commite arquivos `.env*` ou segredos.
- Preferir diffs pequenos e revisáveis.
- Testar responsividade em diferentes tamanhos de tela durante o desenvolvimento.

## Testes
- Aplique TDD quando fizer sentido (escrever o teste antes da implementação).
- Use Vitest para testes unitários e de integração.
- Use Playwright para testes E2E dos fluxos principais (incluindo verificação visual básica).
- Rode os testes relevantes antes de considerar uma feature pronta.
- Mantenha cobertura razoável nas partes críticas (lógica de negócio e fluxos principais).

## O que evitar
- Complexidade desnecessária na primeira versão
- Autenticação (por enquanto)
- Estilos elaborados ou fora da paleta definida
- Layouts que quebrem em celular
- Dependências extras sem justificativa clara