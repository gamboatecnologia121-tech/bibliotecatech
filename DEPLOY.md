# 🚀 Guia de Deploy - GitHub Pages

## Passo a Passo

### 1️⃣ Criar Repositório no GitHub

1. Acesse [github.com](https://github.com) e faça login
2. Clique no botão **"+"** no canto superior direito → **"New repository"**
3. Preencha:
   - **Repository name**: `biblioteca-digital` (ou outro nome)
   - **Description**: "Sistema de biblioteca corporativa"
   - **Público** ou **Privado** (sua escolha)
   - ⚠️ **NÃO marque** "Add a README file", "Add .gitignore" ou "Choose a license"
4. Clique em **"Create repository"**

### 2️⃣ Preparar o Projeto Localmente

Abra o terminal/PowerShell na pasta do projeto e execute:

```bash
# Inicializar Git (se ainda não foi feito)
git init

# Adicionar todos os arquivos
git add .

# Fazer o primeiro commit
git commit -m "Initial commit - BiblioTech"
```

### 3️⃣ Conectar ao GitHub

```bash
# Substitua SEU_USUARIO e SEU_REPOSITORIO pelos seus dados
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git

# Renomear branch para main (se necessário)
git branch -M main

# Enviar para o GitHub
git push -u origin main
```

**Nota**: Se pedir login, use um Personal Access Token em vez da senha.

### 4️⃣ Ativar GitHub Pages

1. No GitHub, vá até seu repositório
2. Clique em **"Settings"** (Configurações)
3. No menu lateral, role até **"Pages"**
4. Em **"Source"**, selecione:
   - Branch: **main**
   - Folder: **/ (root)**
5. Clique em **"Save"**

### 5️⃣ Acessar seu Site

Aguarde alguns minutos e acesse:
```
https://SEU_USUARIO.github.io/SEU_REPOSITORIO/
```

Exemplo: `https://joaosilva.github.io/biblioteca-digital/`

## ✅ Verificações Importantes

Antes de fazer o deploy, verifique:

- [ ] A URL do Google Apps Script está correta em `firebase-config.js`
- [ ] O Google Apps Script está publicado como aplicativo web
- [ ] As permissões do Google Apps Script estão configuradas corretamente
- [ ] O Firebase está configurado corretamente

## 🔄 Atualizar o Site

Sempre que fizer alterações:

```bash
git add .
git commit -m "Descrição das mudanças"
git push
```

O GitHub Pages atualiza automaticamente em alguns minutos.

## 🆘 Problemas Comuns

### Erro 404
- Verifique se o GitHub Pages está ativado
- Aguarde alguns minutos após ativar
- Verifique se o arquivo `index.html` está na raiz

### Firebase não funciona
- Verifique se o domínio está autorizado no Firebase Console
- Vá em Firebase Console → Authentication → Settings → Authorized domains
- Adicione: `SEU_USUARIO.github.io`

### Google Apps Script não responde
- Verifique se o script está publicado
- Verifique as permissões de acesso
- Teste a URL diretamente no navegador

## 📞 Suporte

Se tiver problemas, verifique:
1. Console do navegador (F12) para erros
2. Network tab para ver requisições falhando
3. Logs do Google Apps Script

