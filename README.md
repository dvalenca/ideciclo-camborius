# IDECICLO - Hotsite

Site de relatório para visualização dos dados de auditoria cicloviária de Camboriú e Balneário Camboriú.

## 🚴‍♂️ Sobre o Projeto

O IDECICLO é um sistema de auditoria cicloviária que avalia a qualidade da infraestrutura para ciclistas nas cidades de Camboriú e Balneário Camboriú. Este hotsite apresenta os resultados da análise de forma interativa e visual.

## 🌐 Demo

Acesse o site em: [URL será gerada após deploy na Vercel]

## 📊 Funcionalidades

- Dashboard com estatísticas gerais
- Visualização de estruturas cicloviárias avaliadas
- Comparação entre as duas cidades
- Metodologia detalhada
- Mapas interativos
- Relatórios em PDF

## 🛠️ Tecnologias

- HTML5
- CSS3
- JavaScript (Vanilla)
- Mapbox GL JS
- Chart.js
- jsPDF

## 🚀 Como executar localmente

```bash
# Clone o repositório
git clone [URL_DO_REPOSITORIO]

# Entre no diretório
cd ideciclo-hotsite

# Execute um servidor local
python3 -m http.server 3000

# Ou use o npm
npm run dev
```

Acesse `http://localhost:3000`

## 📁 Estrutura do Projeto

```
├── index.html              # Página principal
├── assets/
│   ├── css/                # Estilos
│   ├── js/                 # Scripts
│   ├── data/               # Dados JSON
│   └── images/             # Imagens
├── content/                # Conteúdo em Markdown
├── libs/                   # Bibliotecas externas
└── *.html                  # Outras páginas
```

## 📈 Deploy

Este projeto está configurado para deploy automático na Vercel. Qualquer push para a branch `main` irá disparar um novo deploy.

## 📄 Licença

MIT License - veja o arquivo LICENSE para detalhes.