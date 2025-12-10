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
    try {
        const data = await appsScriptRequest({ query: { action: "buscarLivros" } });
        // Backend retorna matriz; mapeia para objetos
        const linhas = data?.livros || [];
        
        console.log("Dados brutos recebidos do backend:", linhas.slice(0, 3));
        
        // espera: [id, titulo, autor, "sim"/"nao", link]
        state.livros = linhas.slice(1).map((r, index) => {
            if (!r || r.length < 4) {
                console.warn(`Linha ${index + 1} inválida:`, r);
                return null;
            }
            
            const valorDisponibilidade = r[3];
            const disponivelStr = (valorDisponibilidade !== null && valorDisponibilidade !== undefined) 
                                ? String(valorDisponibilidade).toLowerCase().trim() 
                                : "";
            
            // Lógica invertida: marca como INDISPONÍVEL apenas se for explicitamente "não"
            // Por padrão (incluindo valores vazios), considera como DISPONÍVEL (mais permissivo)
            const indisponivel = disponivelStr === "nao" || 
                                disponivelStr === "não" || 
                                disponivelStr === "n" || 
                                disponivelStr === "0" || 
                                disponivelStr === "false" || 
                                disponivelStr === "no" || 
                                disponivelStr === "emprestado" ||
                                disponivelStr === "indisponivel" ||
                                disponivelStr === "indisponível";
            
            // Se estiver vazio ou não for explicitamente indisponível, está disponível
            const disponivel = disponivelStr === "" || !indisponivel;
            
            return {
                id: String(r[0] || "").trim(), // Garantir que ID seja string
                titulo: r[1] || "",
                autor: r[2] || "",
                disponivel: disponivel,
                link: r[4] || ""
            };
        }).filter(l => l !== null); // Remover linhas inválidas
        
        // Debug: log dos primeiros livros para verificar
        console.log(`Total de livros carregados: ${state.livros.length}`);
        if (state.livros.length > 0) {
            console.log("=== DEBUG DISPONIBILIDADE ===");
            state.livros.slice(0, 5).forEach((l, idx) => {
                const linhaOriginal = linhas[idx + 1];
                console.log(`Livro ${idx + 1}:`, {
                    id: l.id,
                    titulo: l.titulo,
                    disponivel: l.disponivel,
                    valorOriginalColuna3: linhaOriginal?.[3],
                    tipoValor: typeof linhaOriginal?.[3],
                    arrayCompleto: linhaOriginal
                });
            });
            console.log(`Livros disponíveis: ${state.livros.filter(l => l.disponivel).length} de ${state.livros.length}`);
        }
        
        return state.livros;
    } catch (err) {
        console.error("Erro ao buscar livros:", err);
        toast("Erro ao carregar livros: " + (err.message || "Erro desconhecido"), "error");
        return [];
    }
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

