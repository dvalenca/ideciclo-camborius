# Kit de Identidade Visual IDECICLO
## Para sites HTML/CSS tradicionais

### 📁 Estrutura dos Arquivos

```
temporary/
├── ideciclo-styles.css        # CSS principal com toda identidade visual
├── index.html                 # Exemplo de implementação
├── README.md                  # Este arquivo
├── images/                    # Imagens principais
│   ├── ideciclo_logo.png      # Logo principal
│   ├── ideciclo-logo.png      # Logo alternativo
│   ├── ideciclo-navcover.png  # Imagem hero/capa
│   └── favicon.ico            # Ícone do site
└── icones/                    # Ícones SVG dos parâmetros (18 arquivos)
    ├── qualidade-do-projeto.svg
    ├── conflitos-ao-longo.svg
    ├── seguranca-viaria.svg
    └── [outros 15 ícones]
```

### 🚀 Como Usar

#### 1. **Copie os arquivos para seu projeto:**
```bash
# Copie todos os arquivos desta pasta para seu projeto
cp -r temporary/* /caminho/do/seu/projeto/
```

#### 2. **Inclua o CSS no seu HTML:**
```html
<link rel="stylesheet" href="ideciclo-styles.css">
```

#### 3. **Use as classes CSS:**
```html
<!-- Navbar -->
<nav class="ideciclo-navbar">...</nav>

<!-- Cards -->
<div class="ideciclo-card">...</div>

<!-- Botões -->
<button class="ideciclo-button">Clique aqui</button>

<!-- Cards de categoria -->
<a href="#" class="categoria-card categoria-projeto">...</a>
```

### 🎨 Paleta de Cores Disponível

```css
--ideciclo-red: #CE4831      /* Vermelho principal */
--ideciclo-teal: #6DBFAC     /* Verde-azulado */
--ideciclo-blue: #5AC2E1     /* Azul claro */
--ideciclo-yellow: #EFC345   /* Amarelo */
--ideciclo-pink: #F5BDBF     /* Rosa claro */
--ideciclo-green: #69BFAF    /* Verde */
--text-grey: #334454         /* Cinza do texto */
--background-grey: #E5E8E9   /* Cinza de fundo */
```

### 📱 Componentes Incluídos

- **Navbar responsiva** com logo IDECICLO
- **Hero section** com imagem de fundo
- **Cards** com bordas arredondadas (40px)
- **Botões** com sombras e hover effects
- **Sistema de badges** para scores/classificações
- **Footer** institucional
- **Grid responsivo** para diferentes telas

### 🔧 Personalização

#### Para adaptar ao seu site atual:

1. **Substitua suas cores:**
   - Troque variáveis CSS no `:root`
   - Mantenha a estrutura de classes

2. **Ajuste componentes:**
   - Modifique `.ideciclo-card` para seus cards
   - Adapte `.ideciclo-button` para seus botões
   - Customize `.ideciclo-navbar` conforme necessário

3. **Responsividade:**
   - Media queries já incluídas
   - Breakpoints: 768px (mobile) e 1024px (tablet)

### 📞 Suporte

- **Ameciclo**: contato@ameciclo.org
- **Manual IDECICLO**: Consulte documentação completa
- **Licença**: Ferramenta aberta e replicável