# Plano de Implementação - Hotsite IDECICLO

## Visão Geral
Site de relatório para exibição dos dados de auditoria cicloviária de Camboriú e Balneário Camboriú, com visualização interativa, metodologia e exportação em PDF.

## Estrutura de Arquivos Proposta

```
hotsite/
├── index.html                 # Página principal
├── via.html                   # Template da página de via individual
├── metodologia.html           # Página da metodologia
├── assets/
│   ├── css/
│   │   ├── main.css          # Estilos principais
│   │   └── print.css         # Estilos para PDF
│   ├── js/
│   │   ├── main.js           # Funcionalidades principais
│   │   ├── map.js            # Controle do mapa
│   │   ├── search.js         # Sistema de busca
│   │   └── pdf-export.js     # Exportação PDF
│   └── images/               # Imagens das estruturas
│       ├── [nome-gpx]-1.jpg
│       ├── [nome-gpx]-2.jpg
│       └── ...
├── data/
│   ├── processed-data.json   # Dados processados do ciclomputador
│   └── vias-metadata.json    # Metadados das vias
├── content/
│   ├── metodologia.md        # Texto da metodologia
│   ├── sobre.md              # Texto sobre o projeto
│   └── descricoes-vias.md    # Descrições contextuais das vias
└── libs/                     # Bibliotecas externas
    ├── leaflet/              # Para mapas
    ├── jspdf/                # Para exportação PDF
    └── marked/               # Para renderizar markdown
```

## Fases de Implementação

### Fase 1: Estrutura Base e Dados
**Objetivo**: Preparar a base do projeto e processar os dados

**Tarefas**:
1. Criar estrutura de pastas
2. Processar dados do `src/result/data.json` para formato web
3. Criar arquivo de metadados das vias (coordenadas, cidades, tipologias)
4. Configurar bibliotecas (Leaflet, jsPDF, Marked)
5. Criar template HTML base com header/footer comum

**Arquivos fonte**:
- `src/result/data.json` (dados processados)
- Arquivos GPX da pasta `src/gpx-files/` (para coordenadas)

### Fase 2: Página Principal
**Objetivo**: Lista interativa de vias com filtros e busca

**Tarefas**:
1. Criar layout da página principal
2. Implementar lista de vias com informações básicas
3. Adicionar filtros por cidade
4. Implementar busca por nome da via
5. Exibir nota média, tipologia e extensão
6. Links para páginas individuais

**Funcionalidades**:
- Filtro dropdown por cidade (Camboriú/Balneário Camboriú)
- Campo de busca em tempo real
- Cards das vias com informações resumidas
- Ordenação por nota, nome ou extensão

### Fase 3: Páginas Individuais das Vias
**Objetivo**: Detalhamento completo de cada via

**Tarefas**:
1. Criar template da página individual
2. Implementar mapa interativo com destaque da via
3. Configurar estilos diferentes por tipologia:
   - Ciclovias: linha contínua verde espessa
   - Ciclofaixas: linha tracejada azul média
   - Compartilhadas: linha pontilhada laranja fina
4. Exibir formulário de campo completo
5. Mostrar notas categorizadas
6. Integrar galeria de imagens (até 4 por estrutura)

**Dados exibidos**:
- Mapa com traçado da via
- Todas as informações coletadas em campo
- Notas por categoria e nota final
- Galeria de fotos
- Dados brutos do GPX

### Fase 4: Página de Metodologia
**Objetivo**: Explicar a metodologia de avaliação

**Tarefas**:
1. Criar página da metodologia
2. Implementar árvore de cálculo interativa
3. Exibir descrição de cada parâmetro
4. Mostrar pesos e fórmulas de cálculo
5. Integrar conteúdo do arquivo markdown

**Conteúdo**:
- Árvore hierárquica dos critérios
- Descrição detalhada de cada parâmetro
- Fórmulas de cálculo das notas
- Contexto sobre a importância de cada critério

### Fase 5: Sistema de Exportação PDF
**Objetivo**: Gerar relatórios em PDF de cada via

**Tarefas**:
1. Configurar jsPDF com templates
2. Criar layout de 2 páginas por estrutura:
   - Página 1: Mapa, informações básicas, notas
   - Página 2: Detalhes técnicos, fotos, dados brutos
3. Implementar botão de exportação
4. Otimizar para impressão

### Fase 6: Refinamentos e Otimizações
**Objetivo**: Melhorar UX e performance

**Tarefas**:
1. Otimizar carregamento de dados
2. Implementar loading states
3. Adicionar responsividade mobile
4. Melhorar acessibilidade
5. Testes em diferentes navegadores

## Arquivos Fonte Identificados

### Dados Principais
- `src/result/data.json`: Dados processados de todas as vias
- `src/gpx-files/*.gpx`: Coordenadas GPS das rotas

### Conteúdo Textual (a criar)
- `content/metodologia.md`: Explicação da metodologia
- `content/sobre.md`: Sobre o IDECICLO e o projeto
- `content/descricoes-vias.md`: Contexto específico de cada via

### Imagens (a organizar)
- Padrão de nomenclatura: `[nome-gpx]-[1-4].jpg`
- Exemplo: `2024-04-09_10-15-35-1.jpg`

## Tecnologias Utilizadas

- **HTML5/CSS3/JavaScript**: Base do frontend
- **Leaflet**: Mapas interativos
- **jsPDF**: Exportação para PDF
- **Marked**: Renderização de markdown
- **CSS Grid/Flexbox**: Layout responsivo

## Considerações Técnicas

1. **Performance**: Lazy loading para imagens e dados
2. **SEO**: Meta tags e estrutura semântica
3. **Acessibilidade**: ARIA labels e navegação por teclado
4. **Compatibilidade**: Suporte a navegadores modernos
5. **Responsividade**: Design mobile-first

## Próximos Passos

1. Confirmar estrutura proposta
2. Iniciar Fase 1 com processamento dos dados
3. Criar arquivos de conteúdo em markdown
4. Organizar imagens conforme padrão estabelecido