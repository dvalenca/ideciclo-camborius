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
- CSS3 com identidade visual IDECICLO
- JavaScript (Vanilla)
- Mapbox GL JS
- Chart.js
- jsPDF
- Google Fonts (Open Sans + Lato)

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
│   ├── css/                # Estilos com identidade IDECICLO
│   ├── js/                 # Scripts
│   ├── data/               # Dados JSON
│   ├── images/             # Imagens das estruturas
│   ├── icones/             # Ícones SVG dos parâmetros
│   ├── ideciclo_logo.png   # Logo principal IDECICLO
│   ├── ideciclo-logo.png   # Logo alternativo
│   ├── ideciclo-navcover.png # Imagem hero
│   └── favicon.ico         # Favicon IDECICLO
├── content/                # Conteúdo em Markdown
├── libs/                   # Bibliotecas externas
├── temporary/              # Arquivos da nova identidade
├── NEW_VISUAL_ID_GUIDELINE.md # Guia da identidade visual
└── *.html                  # Outras páginas
```

## 🎨 Identidade Visual

O projeto agora utiliza a identidade visual oficial do IDECICLO com:

- **Paleta de cores oficial**: Vermelho, Verde-azulado, Azul, Amarelo, Rosa e Verde
- **Tipografia**: Open Sans (corpo) + Lato (títulos)
- **Componentes**: Cards arredondados (40px), botões com sombras, badges de score
- **Ícones**: 18 SVGs dos parâmetros de avaliação
- **Logo**: Marca oficial IDECICLO

Consulte o arquivo `NEW_VISUAL_ID_GUIDELINE.md` para detalhes completos.

## 📈 Deploy

Este projeto está configurado para deploy automático na Vercel. Qualquer push para a branch `main` irá disparar um novo deploy.

## 📄 Licença

GNU General Public License v3.0 - veja o arquivo LICENSE para detalhes.