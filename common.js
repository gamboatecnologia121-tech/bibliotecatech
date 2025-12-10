const state = {
    user: null,
    role: null,
    livros: []
};

function toast(msg, type = "info") {
    const el = document.getElementById("toast");
    if (!el) return;
    el.textContent = msg;
    el.style.display = "block";
    el.style.borderColor = type === "error" ? "rgba(239,68,68,0.4)" : "var(--border)";
    setTimeout(() => el.style.display = "none", 2500);
}

async function appsScriptRequest(params = {}) {
    if (!APPS_SCRIPT_URL) throw new Error("APPS_SCRIPT_URL não configurada");
    const url = new URL(APPS_SCRIPT_URL);
    let res;
    
    if (params.method === "POST") {
        res = await fetch(APPS_SCRIPT_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(params.body || {})
        });
    } else {
        Object.entries(params.query || {}).forEach(([k, v]) => url.searchParams.append(k, v));
        res = await fetch(url.toString());
    }
    
    if (!res.ok) {
        throw new Error(`Erro na requisição: ${res.status} ${res.statusText}`);
    }
    
    const data = await res.json();
    
    // Verificar se há erro na resposta do Apps Script
    if (data.error) {
        throw new Error(data.error);
    }
    
    return data;
}

// Backend usa "action" e email
async function fetchRole(email) {
    const data = await appsScriptRequest({ query: { action: "getRole", email } });
    return {
        role: data?.role || "user",
        pontos: data?.pontos || 0,
        nivel: data?.nivel || 1
    };
}

async function registrarUsuario(email, nome) {
    return appsScriptRequest({
        method: "POST",
        body: { action: "registrarUsuario", email, nome }
    });
}

async function buscarLivros() {
    const data = await appsScriptRequest({ query: { action: "buscarLivros" } });
    // Backend retorna matriz; mapeia para objetos
    const linhas = data?.livros || [];
    // espera: [id, titulo, autor, "sim"/"nao", link]
    state.livros = linhas.slice(1).map(r => ({
        id: r[0],
        titulo: r[1],
        autor: r[2],
        disponivel: (r[3] || "").toString().toLowerCase() === "sim",
        link: r[4]
    }));
    return state.livros;
}

async function registrarEmprestimo(email, livroId) {
    return appsScriptRequest({
        method: "POST",
        body: { action: "registrarEmprestimo", email, livroId }
    });
}

async function finalizarEmprestimo(email, livroId) {
    return appsScriptRequest({
        method: "POST",
        body: { action: "finalizarEmprestimo", email, livroId }
    });
}

async function listarPerguntasLivro(livroId) {
    const data = await appsScriptRequest({
        query: { action: "listarPerguntasLivro", livroId }
    });
    return data?.perguntas || [];
}

// Admin helpers (compatíveis com backend atual)
async function registrarLivro({ id, titulo, autor, email, link }) {
    return appsScriptRequest({
        method: "POST",
        body: { action: "adicionarLivro", id, titulo, autor, email, link }
    });
}

async function editarLivro({ id, titulo, autor, email, link }) {
    return appsScriptRequest({
        method: "POST",
        body: { action: "editarLivro", id, titulo, autor, email, link }
    });
}

async function excluirLivro({ id, email }) {
    return appsScriptRequest({
        method: "POST",
        body: { action: "excluirLivro", id, email }
    });
}

async function criarPergunta({ livroId, pergunta, resposta, pontos, email }) {
    return appsScriptRequest({
        method: "POST",
        body: { action: "criarPergunta", livroId, pergunta, resposta, pontos, email }
    });
}

async function responderPergunta({ email, livroId, perguntaId, resposta }) {
    return appsScriptRequest({
        method: "POST",
        body: { action: "responderPergunta", email, livroId, perguntaId, resposta }
    });
}

async function buscarRanking() {
    const data = await appsScriptRequest({ query: { action: "ranking" } });
    // Backend retorna matriz: [email, nome, role, pontos, nivel]
    const linhas = data?.ranking || [];
    return linhas.map(r => ({
        email: r[0],
        nome: r[1] || "",
        role: r[2] || "user",
        pontos: r[3] || 0,
        nivel: r[4] || 1
    }));
}

async function buscarNomeUsuario(email) {
    try {
        const ranking = await buscarRanking();
        const usuario = ranking.find(u => u.email === email);
        if (usuario && usuario.nome) {
            return usuario.nome;
        }
        // Fallback: extrair nome do email
        return email.split('@')[0].split('.')[0].charAt(0).toUpperCase() + email.split('@')[0].split('.')[0].slice(1);
    } catch (err) {
        // Fallback: extrair nome do email
        return email.split('@')[0].split('.')[0].charAt(0).toUpperCase() + email.split('@')[0].split('.')[0].slice(1);
    }
}

