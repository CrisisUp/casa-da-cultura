#!/usr/bin/env bash
set -e

echo "=== Verificando ambiente da Casa da Cultura ==="

# 1. Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Instale o Node.js v18+."
    exit 1
fi

# 2. Verificar se .env existe
if [ ! -f ".env" ]; then
    echo "⚠️ Arquivo .env não encontrado. Criando padrão..."
    echo 'DATABASE_URL="postgresql://postgres:postgres@localhost:5432/casa_cultura?schema=public"' > .env
    echo 'AUTH_SECRET="casa-da-cultura-secret-key-change-in-production"' >> .env
    echo 'AUTH_URL="http://localhost:3000"' >> .env
fi

# 3. Subir banco via Docker se Docker estiver instalado
if command -v docker &> /dev/null; then
    echo "🐳 Verificando Docker e PostgreSQL..."
    if ! docker ps -a --format '{{.Names}}' | grep -q "casa_cultura_db"; then
        echo "🚀 Iniciando container PostgreSQL..."
        docker compose up -d
    else
        echo "✅ Container PostgreSQL já existe. Garantindo que está rodando..."
        docker start casa_cultura_db || true
    fi
else
    echo "⚠️ Docker não encontrado. Certifique-se de que o PostgreSQL está rodando localmente na porta 5432."
fi

# 4. Instalar dependências se necessário
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
fi

# 5. Executar Prisma Generate e Push
echo "🗄️ Configurando banco de dados..."
npx prisma generate
npx prisma db push --accept-data-loss || true

# 6. Iniciar aplicação
echo "✨ Iniciando aplicação em http://localhost:3000 ..."
npm run dev
