// =================================================================
// Lógica central do chatbot (processamento de mensagens)
// =================================================================

// ----------------------------------------------------
// Configurações Globais
// ----------------------------------------------------
const CHAT_STORAGE_KEY = 'chat_devsolutions_v1'; 
const BOT_AVATAR_URL = 'img/logo.png'; 
const BOT_NAME = "🤖 Dev Bot";
// ----------------------------------------------------

/**
 * Retorna uma saudação personalizada com base na hora do dia.
 */
function getContextualGreeting() {
    const hour = new Date().getHours();
    let greeting = 'Olá';

    if (hour >= 5 && hour < 12) {
        greeting = 'Bom dia';
    } else if (hour >= 12 && hour < 18) {
        greeting = 'Boa tarde';
    } else {
        greeting = 'Boa noite';
    }

    return greeting;
}

// 🎯 BANCO DE DADOS DE PERGUNTAS E RESPOSTAS (FAQ) DA DEVSOLUTIONS
// -----------------------------------------------------------------
const FAQ_RESPONSES = {
    // A saudação inicial será gerada dinamicamente, mas a chave é mantida para fallback
    "saudacao_inicial": "Eu sou o Dev Bot, seu assistente virtual da DevSolutions. Posso responder sobre nossos Serviços, Orçamento ou Projetos.",
    
    // --- SERVIÇOS ---
    "serviços": "Nós dominamos Software, Hardware, Soluções Web e Business Intelligence. Qual área te interessa mais? Diga: 'Software', 'Hardware', 'Websites' ou 'BI'.",    "servicos": "Nós dominamos Software, Hardware e Soluções Web. Qual área te interessa mais? Diga: 'Software', 'Hardware' ou 'Websites'.",
    "servicos": "Nós dominamos Software, Hardware, Soluções Web e Business Intelligence. Qual área te interessa mais? Diga: 'Software', 'Hardware', 'Websites' ou 'BI'.",
    "software": "Desenvolvemos sistemas sob medida (ERP, CRM, Mobile) com foco em metodologia ágil, performance e escalabilidade.",
    "hardware": "Criamos soluções de Hardware customizado, IoT e Sistemas Embarcados para automação e produtos inteligentes.",
    "sites": "Construímos Websites e E-commerces de alto tráfego com design moderno e otimização para buscas (SEO).",
    "websites": "Construímos Websites e E-commerces de alto tráfego com design moderno e otimização para buscas (SEO).",
    "website": "Construímos Websites e E-commerces de alto tráfego com design moderno e otimização para buscas (SEO).",
    "aplicativos": "Desenvolvemos aplicativos mobile nativos (iOS/Android) e híbridos, focados na experiência do usuário e alta performance.",
    "consultoria": "Oferecemos consultoria especializada em segurança de dados e planejamento de infraestrutura de TI.",
    "projetos": "Para ver nossos trabalhos mais recentes, visite nosso [Portfólio](#portfolio). Você também pode perguntar sobre 'Websites' ou 'Hardware'.",
    "bi": "Oferecemos serviços completos de Business Intelligence (BI), incluindo análise de dados, criação de dashboards e implementação da plataforma **Power BI**.",
    "power bi": "Somos especialistas na implementação do Power BI para transformar seus dados em insights acionáveis e estratégicos.",
    "dashboards": "Desenvolvemos dashboards interativos e relatórios inteligentes, que fornecem uma visão clara da performance do seu negócio.",

    // --- ORÇAMENTO E CONTATO (Aprimorado para WhatsApp/Telefone) ---
    "orçamento": "Nossos projetos são customizados. Para um orçamento detalhado, preencha a seção [Contato](#contact) no nosso site.",
    "orcamento": "Nossos projetos são customizados. Para um orçamento detalhado, preencha a seção [Contato](#contact) no nosso site.",
    "preços": "Os preços dependem da complexidade. Para estimarmos o custo, preencha o formulário em [Contato](#contact).",
    "precos": "Os preços dependem da complexidade. Para estimarmos o custo, preencha o formulário em [Contato](#contact).",
    
    // Chave central para todas as formas de contato (WhatsApp, Telefone, Form)
    "contato": "Você pode usar nosso [formulário de contato](#contact) ou falar com a equipe de vendas em nosso [WhatsApp](https://wa.me/41988939608).",
    "whatsapp": "Nosso contato via [WhatsApp](https://wa.me/41988939608) está disponível para agilizar o seu atendimento. Clique para conversar!",
    "zap": "Nosso contato via [WhatsApp](https://wa.me/41988939608) está disponível para agilizar o seu atendimento. Clique para conversar!",
    "telefone": "Você pode nos ligar no (41) 98893-9608 ou usar o [WhatsApp](https://wa.me/41988939608) para falar com nossa equipe.",
    "número": "Você pode nos ligar no (41) 98893-9608 ou usar o [WhatsApp](https://wa.me/41988939608) para falar com nossa equipe.",
    "falar com humano": "Para falar com nossa equipe de especialistas, use o [formulário de contato](#contact) ou [clique aqui para WhatsApp](https://wa.me/41988939608).",

    // --- SEGURANÇA E PROCESSO ---
    "segurança": "Utilizamos protocolos avançados e metodologia ágil para garantir a segurança de dados e a estabilidade do seu sistema. Nossos projetos são blindados.",
    "seguranca": "Utilizamos protocolos avançados e metodologia ágil para garantir a segurança de dados e a estabilidade do seu sistema. Nossos projetos são blindados.",
    "processo": "Trabalhamos com metodologias ágeis (Scrum/Kanban) para garantir entregas rápidas, transparentes e adaptáveis às suas mudanças.",
    "tecnologia": "Usamos tecnologias de ponta, como React, Node.js, Python e plataformas Cloud (AWS/Azure) para garantir soluções escaláveis.",
    
    // --- GENÉRICAS ---
    "quem é você": "Eu sou o Dev Bot, um assistente de FAQ da DevSolutions. Minha função é responder a perguntas básicas e direcionar você à nossa equipe.",
    "obrigado": "De nada! Estamos aqui para ajudar a impulsionar seu negócio. Use a seção Contato se precisar de mais informações.",
};

// Palavras-chave que disparam a saudação inicial
const SAUDACAO_KEYWORDS = ["ola", "olá", "oi", "bom dia", "boa tarde", "boa noite", "ajuda"];

// Palavras irrelevantes que serão ignoradas na busca (Stop Words)
const STOP_WORDS = [
    "a", "o", "as", "os", "de", "da", "do", "das", "dos", "e", "ou", "mas", "se", "nao", "não", 
    "um", "uma", "uns", "umas", "em", "no", "na", "nos", "nas", "para", "por", "que", "qual", "como",
    "me", "mim", "meu", "minha", "você", "teu", "sua", "o que", "onde", "quando", "quem", "por que",
    "é", "e", "estou", "eu", "queria", "gostaria", "saber", "posso", "preciso", "fazer", "tem", "disso",
    "aquilo", "este", "esse", "quero"
];
// -----------------------------------------------------------------


// FUNÇÃO PRINCIPAL DE PROCESSAMENTO
function processUserMessage(prompt) {
    const cleanPrompt = prompt.toLowerCase().trim();
    let answer;
    
    // Remove pontuação e filtra as Stop Words
    const rawWords = cleanPrompt.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").split(/\s+/);
    const userWords = rawWords.filter(word => word.length > 0 && !STOP_WORDS.includes(word));
    
    // 1. VERIFICAÇÃO DE SAUDAÇÃO (Com palavras-chave)
    const isGreeting = SAUDACAO_KEYWORDS.some(keyword => cleanPrompt.startsWith(keyword) || cleanPrompt === keyword);
    
    if (isGreeting) {
        // Gera a resposta de saudação contextualizada
        const contextualGreeting = getContextualGreeting();
        const baseAnswer = FAQ_RESPONSES["saudacao_inicial"];
        answer = `${contextualGreeting}! ${baseAnswer}`;
    } else {
        // 2. Lógica de busca de palavras-chave
        let bestMatch = null;
        let highestWordOverlap = 0; 

        for (const key in FAQ_RESPONSES) {
            if (key === "saudacao_inicial") continue;
            
            const keyWords = key.split(/\s+/); 
            let currentOverlap = 0; 
            
            keyWords.forEach(kw => {
                // Prioriza correspondência exata ou parcial
                if (userWords.includes(kw) || cleanPrompt.includes(kw)) {
                    currentOverlap++;
                }
            });
            
            if (currentOverlap > 0 && currentOverlap > highestWordOverlap) {
                highestWordOverlap = currentOverlap;
                bestMatch = key;
            }
        }

        if (bestMatch) {
            answer = FAQ_RESPONSES[bestMatch];
        } else {
            // 3. Resposta padrão
            answer = "Desculpe, eu sou o Dev Bot e não consegui encontrar uma resposta exata. Tente me perguntar sobre 'Serviços' ou 'Orçamento', ou diga 'contato' para falar com um humano.";
        }
    }

    return answer;
}