# Guia de Identidade Visual IDECICLO
## Para aplicação em sites HTML/CSS tradicionais

### 📋 Arquivos Essenciais

#### 1. **Logos e Imagens**
```
/public/
├── ideciclo_logo.png          # Logo principal IDECICLO
├── ideciclo-logo.png          # Logo alternativo
├── ideciclo-ciclovia.png      # Imagem decorativa de ciclovia
├── pages_covers/
│   └── ideciclo-navcover.png  # Imagem de capa/hero
└── icones/                    # Ícones SVG dos parâmetros
    ├── qualidade-do-projeto.svg
    ├── conflitos-ao-longo.svg
    ├── seguranca-viaria.svg
    └── [outros 15 ícones]
```

#### 2. **Fontes**
```html
<!-- Adicionar no <head> -->
<link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&family=Lato:wght@300;400;700;900&display=swap" rel="stylesheet">
```

### 🎨 Paleta de Cores

#### Cores Principais
```css
:root {
  /* Cores IDECICLO */
  --ideciclo-red: #CE4831;
  --ideciclo-teal: #6DBFAC;
  --ideciclo-blue: #5AC2E1;
  --ideciclo-yellow: #EFC345;
  --ideciclo-pink: #F5BDBF;
  --ideciclo-green: #69BFAF;
  
  /* Cores de fundo */
  --background-grey: #E5E8E9;
  --text-grey: #334454;
  --custom-grey: #F1F1F1;
  
  /* Cores por categoria */
  --projeto-color: #5AC2E1;
  --seguranca-color: #EFC345;
  --manutencao-color: #F5BDBF;
  --urbanidade-color: #69BFAF;
  
  /* Cores institucionais */
  --ameciclo: #008080;
  --ideciclo: #5050aa;
}
```

### 📝 CSS Base para HTML Tradicional

#### Arquivo: `ideciclo-styles.css`
```css
/* Importar fontes */
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&family=Lato:wght@300;400;700;900&display=swap');

/* Variáveis de cores */
:root {
  --ideciclo-red: #CE4831;
  --ideciclo-teal: #6DBFAC;
  --ideciclo-blue: #5AC2E1;
  --ideciclo-yellow: #EFC345;
  --ideciclo-pink: #F5BDBF;
  --ideciclo-green: #69BFAF;
  --background-grey: #E5E8E9;
  --text-grey: #334454;
  --custom-grey: #F1F1F1;
}

/* Reset e base */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: var(--text-grey);
  line-height: 1.6;
  background-color: white;
}

/* Container responsivo */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Navbar IDECICLO */
.ideciclo-navbar {
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  border-bottom: 2px solid var(--ideciclo-teal);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 80px;
}

.navbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 2rem;
}

.navbar-logo img {
  height: 64px;
  filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.1));
}

.navbar-nav {
  display: flex;
  gap: 2rem;
  list-style: none;
}

.navbar-nav a {
  text-decoration: none;
  color: var(--text-grey);
  font-weight: 500;
  padding: 0.5rem 1.5rem;
  border-radius: 25px;
  transition: all 0.3s ease;
}

.navbar-nav a:hover {
  background-color: var(--ideciclo-yellow);
  color: var(--text-grey);
}

.navbar-nav a.active {
  background-color: var(--ideciclo-red);
  color: white;
  box-shadow: 0px 4px 8px rgba(0,0,0,0.2);
}

/* Cards IDECICLO */
.ideciclo-card {
  background: white;
  border-radius: 40px;
  box-shadow: 0px 6px 8px rgba(0, 0, 0, 0.25);
  padding: 2rem;
  transition: all 0.3s ease;
  position: relative;
}

.ideciclo-card:hover {
  transform: translateY(-2px);
  box-shadow: 0px 8px 12px rgba(0, 0, 0, 0.3);
}

/* Botões IDECICLO */
.ideciclo-button {
  background: var(--ideciclo-blue);
  color: white;
  border: none;
  border-radius: 40px;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0px 6px 8px rgba(0, 0, 0, 0.25);
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
  text-align: center;
}

.ideciclo-button:hover {
  transform: translateY(-1px);
  box-shadow: 0px 8px 12px rgba(0, 0, 0, 0.3);
}

.ideciclo-button.yellow {
  background: var(--ideciclo-yellow);
  color: var(--text-grey);
}

.ideciclo-button.red {
  background: var(--ideciclo-red);
}

.ideciclo-button.teal {
  background: var(--ideciclo-teal);
}

/* Cards de categoria com ícones */
.categoria-card {
  width: 234px;
  min-height: 150px;
  border-radius: 40px;
  box-shadow: 0px 6px 8px rgba(0, 0, 0, 0.25);
  position: relative;
  padding: 2rem 1rem 1rem;
  text-align: center;
  margin-top: 80px;
}

.categoria-card .icon {
  position: absolute;
  top: -80px;
  left: 50%;
  transform: translateX(-50%);
  width: 104px;
  height: 108px;
}

.categoria-projeto {
  background-color: var(--ideciclo-blue);
}

.categoria-seguranca {
  background-color: var(--ideciclo-yellow);
}

.categoria-manutencao {
  background-color: var(--ideciclo-pink);
}

.categoria-urbanidade {
  background-color: var(--ideciclo-green);
}

/* Hero Section */
.hero-section {
  background-image: url('/pages_covers/ideciclo-navcover.png');
  background-size: cover;
  background-position: center;
  height: 52vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  margin-top: 80px;
}

.hero-content h1 {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}

.hero-content p {
  font-size: 1.2rem;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
}

/* Footer */
.ideciclo-footer {
  background: var(--ideciclo);
  color: white;
  padding: 3rem 0;
  margin-top: 3rem;
  position: relative;
  overflow: hidden;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 2rem;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.footer-logo img {
  height: 48px;
}

.footer-info h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.footer-info p {
  color: rgba(255,255,255,0.8);
  font-size: 0.9rem;
}

/* Responsividade */
@media (max-width: 768px) {
  .navbar-nav {
    display: none;
  }
  
  .hero-content h1 {
    font-size: 2rem;
  }
  
  .categoria-card {
    width: 100%;
    max-width: 300px;
  }
  
  .footer-content {
    flex-direction: column;
    text-align: center;
  }
}

/* Utilitários */
.text-center { text-align: center; }
.mt-1 { margin-top: 0.25rem; }
.mt-2 { margin-top: 0.5rem; }
.mt-4 { margin-top: 1rem; }
.mb-4 { margin-bottom: 1rem; }
.p-4 { padding: 1rem; }
.flex { display: flex; }
.flex-col { flex-direction: column; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
.gap-4 { gap: 1rem; }
.gap-8 { gap: 2rem; }
.rounded-lg { border-radius: 0.5rem; }
.shadow-md { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
```

### 🏗️ Estrutura HTML Base

#### Arquivo: `index.html`
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IDECICLO - Índice de Desenvolvimento Cicloviário</title>
    <link rel="stylesheet" href="ideciclo-styles.css">
    <link rel="icon" href="/favicon.ico">
</head>
<body>
    <!-- Navbar -->
    <nav class="ideciclo-navbar">
        <div class="navbar-content">
            <div class="navbar-logo">
                <a href="/">
                    <img src="/ideciclo_logo.png" alt="IDECICLO">
                </a>
            </div>
            <ul class="navbar-nav">
                <li><a href="/" class="active">Início</a></li>
                <li><a href="/avaliacao">Avaliação</a></li>
                <li><a href="/ranking">Ranking</a></li>
            </ul>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero-section">
        <div class="hero-content">
            <h1>IDECICLO</h1>
            <p>Índice de Desenvolvimento Cicloviário</p>
        </div>
    </section>

    <!-- Main Content -->
    <main class="container">
        <!-- Cards de ação -->
        <section class="flex justify-center gap-8 mt-4">
            <a href="/manual.pdf" class="categoria-card categoria-seguranca">
                <img src="/icones/qualidade-do-projeto.svg" class="icon" alt="">
                <h3>Manual do Ideciclo</h3>
                <p>E confira como funciona</p>
            </a>
            
            <a href="/formulario.pdf" class="categoria-card categoria-projeto">
                <img src="/icones/conflitos-ao-longo.svg" class="icon" alt="">
                <h3>Formulário de avaliação</h3>
                <p>Baixe aqui e avalie sua cidade</p>
            </a>
        </section>
    </main>

    <!-- Footer -->
    <footer class="ideciclo-footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-logo">
                    <img src="/ideciclo-logo.png" alt="IDECICLO">
                    <div class="footer-info">
                        <h3>IDECICLO</h3>
                        <p>Índice de Desenvolvimento Cicloviário</p>
                    </div>
                </div>
                <div class="footer-info">
                    <h4>Desenvolvido por</h4>
                    <p><strong>Ameciclo</strong></p>
                    <p>Associação Metropolitana de Ciclistas do Recife</p>
                </div>
            </div>
        </div>
    </footer>
</body>
</html>
```

### 📱 CSS Responsivo Adicional

#### Arquivo: `responsive.css`
```css
/* Mobile First */
@media (max-width: 640px) {
  .container {
    padding: 0 1rem;
  }
  
  .hero-section {
    height: 40vh;
  }
  
  .categoria-card {
    width: 100%;
    margin: 80px auto 0;
  }
  
  .navbar-content {
    padding: 0 1rem;
  }
}

/* Tablet */
@media (min-width: 641px) and (max-width: 1024px) {
  .categoria-card {
    width: 280px;
  }
}

/* Desktop */
@media (min-width: 1025px) {
  .container {
    padding: 0 2rem;
  }
}
```

### 🎯 Componentes Específicos

#### Sistema de Badges/Scores
```css
.score-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.875rem;
}

.score-excelente {
  background: #4CAF50;
  color: white;
}

.score-bom {
  background: #8BC34A;
  color: white;
}

.score-regular {
  background: #FFC107;
  color: #333;
}

.score-ruim {
  background: #FF9800;
  color: white;
}

.score-pessimo {
  background: #F44336;
  color: white;
}
```

### 📋 Checklist de Implementação

#### ✅ Arquivos Obrigatórios
- [ ] `ideciclo-styles.css` (CSS principal)
- [ ] `responsive.css` (responsividade)
- [ ] `/ideciclo_logo.png` (logo principal)
- [ ] `/pages_covers/ideciclo-navcover.png` (hero image)
- [ ] Pasta `/icones/` com 18 SVGs dos parâmetros

#### ✅ Configurações
- [ ] Fontes Google (Open Sans + Lato)
- [ ] Variáveis CSS com paleta de cores
- [ ] Meta viewport para responsividade
- [ ] Favicon configurado

#### ✅ Componentes Essenciais
- [ ] Navbar com logo e navegação
- [ ] Hero section com imagem de fundo
- [ ] Cards com bordas arredondadas (40px)
- [ ] Botões com sombras e hover effects
- [ ] Footer institucional
- [ ] Sistema de badges para scores

### 🔄 Migração do Site Atual

#### Para adaptar seu site verde existente:

1. **Substituir paleta de cores:**
   ```css
   /* Trocar */
   --primary-green: #2E7D32;
   --secondary-green: #4CAF50;
   
   /* Por */
   --ideciclo-teal: #6DBFAC;
   --ideciclo-blue: #5AC2E1;
   ```

2. **Atualizar componentes:**
   - Cards: adicionar `border-radius: 40px`
   - Botões: adicionar sombras e hover effects
   - Navbar: incluir logo IDECICLO e cores específicas

3. **Substituir imagens:**
   - Logo: usar `ideciclo_logo.png`
   - Hero: usar `ideciclo-navcover.png`
   - Ícones: usar SVGs da pasta `/icones/`

### 📞 Suporte

Para dúvidas sobre implementação, consulte:
- **Ameciclo**: contato@ameciclo.org
- **Documentação completa**: Manual do IDECICLO
- **Repositório**: [GitHub do projeto]