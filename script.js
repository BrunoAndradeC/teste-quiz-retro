// Configurações do Telegram
const TELEGRAM_TOKEN = '8332064581:AAHsM3tcSj27MdVHoRzF8Nb8EI697CcgIas';
const CHAT_ID = '1753839424';

const perguntas = [
    { q: "Onde foi o nosso primeiro beijo?", opts: ["Pátio do batista", "Atrás do batista", "Sala do batista"], ans: 1 },
    { q: "Qual foi o menu do dia quando conheceu minha mãe?", opts: ["Macarrão com frango assado", "Strogonoff", "Bife à milanesa"], ans: 0 },
    { q: "Qual a nossa especialidade na cozinha?", opts: ["Pudim", "Escondidinho", "Strogonoff"], ans: 2 }
];

// 2. MOTOR DE SOM
function tocarSom(tipo) {
    try {
        const context = new (window.AudioContext || window.webkitAudioContext)();
        const osc = context.createOscillator();
        const gain = context.createGain();
        osc.connect(gain);
        gain.connect(context.destination);

        if (tipo === 'acerto') {
            osc.type = 'square';
            osc.frequency.setValueAtTime(440, context.currentTime);
            osc.frequency.exponentialRampToValueAtTime(880, context.currentTime + 0.1);
        } else {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(200, context.currentTime);
            osc.frequency.exponentialRampToValueAtTime(50, context.currentTime + 0.2);
        }

        gain.gain.setValueAtTime(0.1, context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.2);
        osc.start();
        osc.stop(context.currentTime + 0.2);
    } catch (e) {
        console.log("Som bloqueado pelo navegador até o primeiro clique.");
    }
}

// 3. LÓGICA DAS FASES
function proximaFase(f) {
    const conteudo = document.getElementById('conteudo');
    const feedback = document.getElementById('feedback');
    feedback.innerText = "";

    if (f <= perguntas.length) {
        let p = perguntas[f-1];
        let html = `<h2>FASE ${f}</h2><p>${p.q}</p>`;
        p.opts.forEach((opt, i) => {
            html += `<button onclick="verificar(${f}, ${i})">${opt}</button>`;
        });
        conteudo.innerHTML = html;
    } else {
        document.getElementById('titulo').innerText = "FINAL BOSS";
        conteudo.innerHTML = `
            <p>VOCÊ ACEITA SE CASAR COMIGO?</p>
            <button onclick="tocarSom('acerto'); aceitar()">SIM</button>
            <button onclick="tocarSom('erro'); recusar()">NÃO</button>
        `;
    }
}

function verificar(fase, escolha) {
    if (escolha === perguntas[fase-1].ans) {
        tocarSom('acerto');
        proximaFase(fase + 1);
    } else {
        tocarSom('erro');
        document.getElementById('feedback').innerText = "GAME OVER! 🎮 Tente de novo!";
    }
}

// 4. AÇÕES FINAIS
function recusar() {
    alert("Você não tem essa escolha 👍");
}

function aceitar() {
    // CORREÇÃO: Usando os nomes exatos das variáveis do topo
    const mensagem = encodeURIComponent("ELA DISSE SIM! 💍💖");
    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${mensagem}`;

    // Notifica o Telegram
    fetch(url)
        .then(res => console.log("Notificação enviada!"))
        .catch(err => console.error("Erro ao avisar o noivo:", err));

    window.open('https://www.youtube.com/watch?v=g8z-qP34-1Y', '_blank');

    // Altera a tela final
    document.getElementById('game-box').innerHTML = `
        <h1 style="color: #FF0000;">VICTORY! ❤️</h1>
        <p>Missão Cumprida!</p>
        <p>Te amo para sempre!</p>
    `;
}
