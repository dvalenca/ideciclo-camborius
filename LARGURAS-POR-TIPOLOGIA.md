# Análise de Larguras por Tipologia e Direção

Este documento apresenta a análise detalhada das larguras das estruturas cicloviárias separadas por **tipologia** (Ciclovia, Ciclofaixa, Compartilhada) e **direção de fluxo** (Bidirecional, Unidirecional).

## 📊 Tabelas de Resultados

### Larguras por Tipologia e Direção

| Tipologia | Direção | Estruturas | Extensão (m) | Média por Estrutura | Média Ponderada (km) |
|-----------|---------|------------|--------------|---------------------|----------------------|
| **Calçada Compartilhada** | Bidirecional | 9 | 3.220 | **210.33 cm** | **170.68 cm** |
| **Ciclofaixa** | Bidirecional | 72 | 72.729 | **168.99 cm** | **166.10 cm** |
| **Ciclofaixa** | Unidirecional no Fluxo | 2 | 4.980 | **155.00 cm** | **155.00 cm** |
| **Ciclovia** | Bidirecional | 24 | 25.710 | **212.08 cm** | **203.22 cm** |
| **Ciclovia** | Bidirecional com Mão Inglesa | 2 | 380 | **250.50 cm** | **264.87 cm** |

---

### Resumo por Tipologia

| Tipologia | Estruturas | Extensão (m) | Média por Estrutura | Média Ponderada (km) |
|-----------|------------|--------------|---------------------|----------------------|
| **Calçada Compartilhada** | 9 | 3.220 | **210.33 cm** | **170.68 cm** |
| **Ciclofaixa** | 74 | 77.709 | **168.61 cm** | **165.39 cm** |
| **Ciclovia** | 26 | 26.090 | **215.04 cm** | **204.12 cm** |

---

### Resumo por Direção

| Direção | Estruturas | Extensão (m) | Média por Estrutura | Média Ponderada (km) |
|---------|------------|--------------|---------------------|----------------------|
| **Bidirecional** | 107 | 102.009 | **181.19 cm** | **175.51 cm** |
| **Bidirecional com Mão Inglesa** | 2 | 380 | **250.50 cm** | **264.87 cm** |
| **Unidirecional no Fluxo** | 2 | 4.980 | **155.00 cm** | **155.00 cm** |

---

## 🔍 Diferença entre as Médias

### Média por Estrutura
Calcula a média aritmética simples das larguras de todas as estruturas:
```
Média = Soma das larguras / Número de estruturas
```

**Exemplo:** Se temos 3 estruturas com 100cm, 200cm e 300cm:
- Média = (100 + 200 + 300) / 3 = **200 cm**

### Média Ponderada por Km
Calcula a média considerando o peso da extensão de cada estrutura:
```
Média Ponderada = Soma (largura × extensão) / Extensão total
```

**Exemplo:** Se temos:
- Estrutura A: 100cm × 1000m = 100.000
- Estrutura B: 200cm × 100m = 20.000
- Média Ponderada = 120.000 / 1.100m = **109 cm**

A estrutura A tem mais peso no cálculo por ser mais extensa.

---

## 💡 Insights Principais

### Por Tipologia

1. **Ciclovias são mais largas**
   - Média: 215.04 cm (por estrutura) | 204.12 cm (ponderada)
   - Diferença de **46.43 cm** em relação às ciclofaixas

2. **Ciclofaixas são mais estreitas**
   - Média: 168.61 cm (por estrutura) | 165.39 cm (ponderada)
   - Representam **66.7%** das estruturas (74 de 111)
   - Concentram **72.5%** da extensão total (77.7 km de 107.4 km)

3. **Calçadas Compartilhadas têm largura intermediária**
   - Média: 210.33 cm (por estrutura) | 170.68 cm (ponderada)
   - Média ponderada menor indica que estruturas mais largas são mais curtas

### Por Direção

1. **Bidirecionais dominam**
   - 96.4% das estruturas (107 de 111)
   - 95% da extensão total (102 km de 107.4 km)
   - Média: 181.19 cm

2. **Unidirecionais são mais estreitas**
   - Apenas 2 estruturas (ciclofaixas)
   - Média: 155.00 cm
   - **26.19 cm** mais estreitas que bidirecionais

3. **Mão Inglesa são as mais largas**
   - 2 estruturas (ciclovias)
   - Média: 250.50 cm (estrutura) | 264.87 cm (ponderada)
   - Necessitam mais espaço para acomodar fluxos opostos

---

## 🛠️ Como Gerar

### Script: `compile-widths-by-typology.js`

```bash
node compile-widths-by-typology.js
```

### Arquivo Gerado
`assets/data/widths-by-typology.json`

### Estrutura do JSON

```json
[
  {
    "typology": "Ciclofaixa",
    "direction": "Bidirecional",
    "count": 72,
    "totalLength": "72754.00",
    "avgWidthByStructure": "166.94",
    "avgWidthByKm": "165.57"
  }
]
```

---

## 📈 Uso no Dashboard

### Gráfico de Barras Agrupadas
```javascript
// Comparar médias por tipologia
const typologies = ['Ciclofaixa', 'Ciclovia', 'Compartilhada'];
const avgByStructure = [166.62, 218.33, 197.40];
const avgByKm = [164.89, 205.08, 168.26];
```

### Gráfico de Pizza
```javascript
// Distribuição de extensão por tipologia
const extensions = {
  'Ciclofaixa': 77734,
  'Ciclovia': 26400,
  'Compartilhada': 3235
};
```

### Tabela Comparativa
Exibir lado a lado as duas médias para evidenciar diferenças.

---

## 🎯 Recomendações Técnicas

### Larguras Mínimas Recomendadas

| Tipo | Direção | Largura Mínima | Situação Atual |
|------|---------|----------------|----------------|
| Ciclofaixa | Unidirecional | 120 cm | ✅ 155 cm (adequado) |
| Ciclofaixa | Bidirecional | 200 cm | ⚠️ 166 cm (abaixo) |
| Ciclovia | Unidirecional | 150 cm | - |
| Ciclovia | Bidirecional | 250 cm | ⚠️ 215 cm (abaixo) |

### Estruturas Críticas
- **2 estruturas** com menos de 100 cm
- **21 estruturas** entre 100-150 cm (inadequadas para bidirecional)
- **Ciclofaixas bidirecionais** estão 33 cm abaixo do recomendado

---

## 🔄 Atualização

```bash
node compile-widths-by-typology.js
```

---

## 📝 Notas Técnicas

- **Tipologia** extraída do campo `tipo_da_via` (Ciclovia, Ciclofaixa, Ciclorrota, Calçada compartilhada)
- **Direção** do campo `flow_direction` do rated-data.json
- **Largura** em centímetros (cm)
- **Extensão** em metros (m)
- Média ponderada considera o peso da extensão de cada estrutura
