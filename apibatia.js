export default async function handler(req, res) {
  // ── CORS ─────────────────────────────────────────────────────────────
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  // ── GROQ API KEY ──────────────────────────────────────────────────────
  // FIX: era process.env.gsk_... (errado). Agora usa env var corretamente.
  // Configure em: Vercel Dashboard → Project → Settings → Environment Variables
  // Nome: GROQ_API_KEY | Valor: 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
  const GROQ_KEY = process.env.GROQ_API_KEY || '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';

  if (!GROQ_KEY || GROQ_KEY.length < 10) {
    return res.status(500).json({ error: 'GROQ_API_KEY não configurada no servidor.' });
  }

  try {
    const { messages, model: reqModel } = req.body;

    // ── VALIDAÇÃO ─────────────────────────────────────────────────────
    if (!Array.isArray(messages) || messages.length === 0)
      return res.status(400).json({ error: 'messages deve ser array não vazio' });
    if (messages.length > 80)
      return res.status(400).json({ error: 'Limite de 80 mensagens por sessão' });

    for (const msg of messages) {
      if (!msg.role || !msg.content) return res.status(400).json({ error: 'Mensagem inválida' });
      if (!['user', 'assistant'].includes(msg.role)) return res.status(400).json({ error: 'Role inválido' });
      if (typeof msg.content !== 'string') return res.status(400).json({ error: 'Content deve ser string' });
      if (msg.content.length > 10000) return res.status(400).json({ error: 'Mensagem muito longa (máx 10k chars)' });
    }

    const totalChars = JSON.stringify(messages).length;
    if (totalChars > 60000) return res.status(413).json({ error: 'Payload excede limite (60k chars)' });

    // ── MODELO ────────────────────────────────────────────────────────
    const ALLOWED = [
      'llama-3.3-70b-versatile',
      'llama3-70b-8192',
      'deepseek-r1-distill-llama-70b',
      'qwen-qwq-32b',
      'llama-3.1-8b-instant',
    ];
    const model = ALLOWED.includes(reqModel) ? reqModel : 'llama-3.3-70b-versatile';

    // ── SYSTEM PROMPT ─────────────────────────────────────────────────
    const SYSTEM = `Você é BAT-IA, o sistema de IA da BatCaverna — desenvolvido por Bruce Wayne.

━━━ IDENTIDADE ━━━
• Engenheiro de software sênior com 20+ anos de experiência
• Tom: direto, técnico, preciso — sem rodeios
• Você é exclusivamente o BatComputer da BatCaverna
• Trate o usuário como parceiro de missão

━━━ EXPERTISE MÁXIMA ━━━
Linguagens: JavaScript/TypeScript, Python, Rust, Go, C/C++, Java, Kotlin, Swift, PHP, SQL, Bash, Dart
Frontend: React, Next.js, Vue, Svelte, HTML5, CSS3/SCSS, Tailwind, PWA, Web APIs, animações
Backend: Node.js, Bun, Deno, FastAPI, Django, Express, NestJS, REST, GraphQL, WebSockets
DB: PostgreSQL, MySQL, SQLite, MongoDB, Redis, Supabase, Prisma, Drizzle
Infra: Docker, Kubernetes, GitHub Actions, AWS, GCP, Vercel, Railway, Nginx, Linux
Segurança: OWASP Top 10, XSS, CSRF, SQLi, JWT, OAuth2, bcrypt, argon2
IA/ML: LLMs, RAG, embeddings, OpenAI, Groq, Anthropic, LangChain

━━━ REGRAS DE RESPOSTA ━━━
1. SEMPRE use blocos de código com linguagem: \`\`\`javascript\\ncode\`\`\`
2. Para bugs: mostre o problema → explique o porquê → dê a solução corrigida
3. Para arquitetura: considere escalabilidade, segurança e manutenibilidade
4. Respostas diretas: simples → 2-5 linhas + código; complexo → seções claras
5. Mencione trade-offs quando relevante
6. Sinalize código inseguro (🔒) ou antipadrão (⚠️) e corrija
7. Prefira ES2024+, Python 3.12+, padrões modernos

━━━ FORMATO ━━━
• Markdown: **negrito**, \`inline\`, blocos de código, listas
• Emojis técnicos: 🔒 segurança | ⚡ performance | ⚠️ cuidado | ✅ correto | ❌ errado
• Nunca use linguagem corporativa genérica
• Responda em português do Brasil`;

    // ── CHAMADA GROQ ──────────────────────────────────────────────────
    const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_KEY}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.3,
        max_tokens: 4096,
        top_p: 0.9,
        stream: false,
        messages: [{ role: 'system', content: SYSTEM }, ...messages],
      }),
    });

    if (!resp.ok) {
      const errText = await resp.text().catch(() => '');
      console.error('[BAT-IA] Groq error:', resp.status, errText);
      if (resp.status === 429) return res.status(429).json({ error: 'Limite de requisições. Aguarde alguns segundos.' });
      if (resp.status === 401) return res.status(401).json({ error: 'API key inválida. Verifique GROQ_API_KEY no Vercel.' });
      return res.status(resp.status).json({ error: `Erro Groq: ${resp.status}` });
    }

    const data = await resp.json();
    const reply = data?.choices?.[0]?.message?.content;

    if (!reply || typeof reply !== 'string')
      return res.status(500).json({ error: 'Resposta inválida da IA' });

    return res.status(200).json({
      reply,
      model: data?.model ?? model,
      tokens: data?.usage?.total_tokens ?? null,
    });

  } catch (err) {
    console.error('[BAT-IA] Internal error:', err?.message || err);
    return res.status(500).json({ error: 'Erro interno. Verifique os logs do servidor.' });
  }
}