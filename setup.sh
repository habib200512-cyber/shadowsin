#!/bin/bash
# ShadowSin - Setup automático
# Ejecutar con: bash setup.sh

echo "🌙 ShadowSin Setup"
echo "=================="

# 1. Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# 2. Verificar que existe .env
if [ ! -f ".env" ]; then
  echo ""
  echo "⚠️  No existe el archivo .env"
  echo "   Copiando .env.example a .env..."
  cp .env.example .env
  echo ""
  echo "❗ IMPORTANTE: Abrí el archivo .env y completá todas las variables."
  echo "   Luego volvé a correr: bash setup.sh"
  echo ""
  open -a TextEdit .env 2>/dev/null || true
  exit 1
fi

# 3. Generar Prisma client
echo "🔧 Generando Prisma client..."
npx prisma generate

# 4. Push schema a la base de datos
echo "🗄️  Creando tablas en la base de datos..."
npx prisma db push

echo ""
echo "✅ Setup completo!"
echo "   Corriendo: npm run dev"
echo ""
npm run dev
