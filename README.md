# Control

> Desktop virtual compartilhado com interface inspirada no Windows.

![screenshot do projeto](.github/preview.png)

## 🚀 Sobre

Control é uma plataforma web onde usuários podem criar desktops virtuais
para organizar links, arquivos e pastas de forma visual e intuitiva.
Desktops podem ser compartilhados entre usuários em tempo real.

## ✨ Funcionalidades

- Criação de desktops virtuais com wallpaper customizável
- Arrastar e soltar ícones com sincronização de posição
- Pastas com navegação recursiva
- Links com favicon automático
- Múltiplos desktops por usuário
- Interface com filtros de aparência (blur, escuridão, saturação)
- Suporte a internacionalização (PT-BR / EN)

## 🛠️ Stack

**Frontend**
- React + Vite + TypeScript
- TailwindCSS
- i18next

**Backend**
- Node.js + Express
- Prisma ORM
- PostgreSQL

## 📦 Rodando localmente

### Pré-requisitos
- Node.js 18+
- PostgreSQL rodando localmente ou via Supabase

### Instalação

\`\`\`bash
# Clone o repositório
git clone https://github.com/seu-usuario/control.git
cd control

# Instale as dependências raiz
npm install

# Configure as variáveis de ambiente
cp server/.env.example server/.env
# edite o server/.env com suas credenciais
\`\`\`

### Banco de dados

\`\`\`bash
cd server
npx prisma migrate deploy
npx prisma generate
\`\`\`

### Rodando

\`\`\`bash
# Na raiz do projeto
npm run dev
\`\`\`

Acesse http://localhost:5173

## 🔑 Variáveis de ambiente

Crie um `server/.env` baseado no `server/.env.example`:

\`\`\`env
DATABASE_URL=postgresql://user:password@localhost:5432/control
JWT_SECRET=seu_secret_aqui
JWT_REFRESH_SECRET=seu_refresh_secret_aqui
PORT=3000
\`\`\`

## 📁 Estrutura do projeto

\`\`\`
control/
├── client/          # Frontend React
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── types/
└── server/          # Backend Express
    ├── src/
    │   ├── controllers/
    │   ├── middlewares/
    │   ├── routes/
    │   ├── services/
    │   └── types/
    └── prisma/
        └── schema.prisma
\`\`\`