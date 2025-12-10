# BiblioTech - Biblioteca Corporativa

Sistema de biblioteca digital com gamificação, desenvolvido com Firebase Authentication e Google Apps Script como backend.

## 🚀 Funcionalidades

- ✅ Autenticação com Firebase
- ✅ Catálogo de livros
- ✅ Sistema de empréstimos
- ✅ Quiz gamificado com pontuação
- ✅ Ranking de leitores
- ✅ Painel administrativo
- ✅ Sistema de níveis e conquistas

## 📋 Pré-requisitos

- Conta Firebase (para autenticação)
- Google Apps Script configurado como backend
- URL do Google Apps Script configurada em `firebase-config.js`

## 🔧 Configuração

1. Configure o Firebase em `firebase-config.js`
2. Configure a URL do Google Apps Script em `firebase-config.js`
3. Faça o deploy no GitHub Pages

## 📦 Deploy no GitHub Pages

### Passo 1: Criar repositório no GitHub

1. Acesse [GitHub](https://github.com)
2. Crie um novo repositório (ex: `biblioteca-digital`)
3. **Não** inicialize com README, .gitignore ou licença

### Passo 2: Inicializar Git localmente

```bash
# No terminal, na pasta do projeto
git init
git add .
git commit -m "Initial commit"
```

### Passo 3: Conectar ao GitHub

```bash
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
git branch -M main
git push -u origin main
```

### Passo 4: Ativar GitHub Pages

1. No GitHub, vá em **Settings** do repositório
2. Role até **Pages** (no menu lateral)
3. Em **Source**, selecione **Deploy from a branch**
4. Escolha a branch **main** e pasta **/ (root)**
5. Clique em **Save**

### Passo 5: Acessar seu site

Seu site estará disponível em:
```
https://SEU_USUARIO.github.io/SEU_REPOSITORIO/
```

## 📁 Estrutura do Projeto

```
Biblioteca/
├── index.html          # Página de login
├── cadastro.html       # Página de cadastro
├── dashboard.html      # Dashboard do usuário
├── admin.html          # Painel administrativo
├── common.js           # Funções compartilhadas
├── firebase-config.js  # Configuração Firebase e Apps Script
└── styles.css          # Estilos do site
```

## ⚠️ Importante

- Certifique-se de que a URL do Google Apps Script está correta em `firebase-config.js`
- O Google Apps Script deve estar publicado como aplicativo web
- Configure as permissões de acesso no Google Apps Script

## 🔒 Segurança

- As credenciais do Firebase estão no código (normal para frontend)
- A autenticação é feita pelo Firebase
- O backend valida permissões de admin

## 📝 Licença

Este projeto é de uso interno/corporativo.

