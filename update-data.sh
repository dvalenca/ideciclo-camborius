#!/bin/bash

echo "🔄 Atualizando análises de dados do IDECICLO..."
echo ""

echo "📊 1/6 - Compilando obstáculos..."
node compile-obstacles.js

echo ""
echo "📏 2/6 - Compilando larguras..."
node compile-widths.js

echo ""
echo "📐 3/6 - Compilando larguras por tipologia..."
node compile-widths-by-typology.js

echo ""
echo "📋 4/6 - Compilando padrões de largura..."
node compile-width-standards.js

echo ""
echo "🗂️  5/6 - Processando dados para o hotsite..."
cd data
node process-data.js

echo ""
echo "📍 6/6 - Processando waypoints GPX..."
node process-gpx.js

cd ..
echo ""
echo "✅ Todos os dados foram atualizados com sucesso!"
