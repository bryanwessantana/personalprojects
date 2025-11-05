// Press F12, click on "Console" copy and paste this code below,
// then press "Enter" to run the code
let nomeDoHeroi = "Aetherion";
let xpDoHeroi = 8500;

let nivelDoHeroi;

if (xpDoHeroi < 1000) {
    nivelDoHeroi = "Ferro";
} else if (xpDoHeroi >= 1001 && xpDoHeroi <= 2000) {
    nivelDoHeroi = "Bronze";
} else if (xpDoHeroi >= 2001 && xpDoHeroi <= 5000) {
    nivelDoHeroi = "Prata";
} else if (xpDoHeroi >= 5001 && xpDoHeroi <= 7000) {
    nivelDoHeroi = "Ouro";
} else if (xpDoHeroi >= 7001 && xpDoHeroi <= 8000) {
    nivelDoHeroi = "Platina";
} else if (xpDoHeroi >= 8001 && xpDoHeroi <= 9000) {
    nivelDoHeroi = "Ascendente";
} else if (xpDoHeroi >= 9001 && xpDoHeroi <= 10000) {
    nivelDoHeroi = "Imortal";
} else {
    nivelDoHeroi = "Radiante";
}

console.log(`O Herói de nome **${nomeDoHeroi}** está no nível de **${nivelDoHeroi}**`);

console.log("\n--- Classificando Múltiplos Heróis ---");

const herois = [
    { nome: "Kale", xp: 500 },
    { nome: "Lyra", xp: 1500 },
    { nome: "Pylos", xp: 4500 },
    { nome: "Elgar", xp: 7000 },
    { nome: "Darken", xp: 8001 },
    { nome: "Selene", xp: 10000 },
    { nome: "Nova", xp: 15000 }
];

for (let heroi of herois) {
    let nivelAtual;

    if (heroi.xp < 1000) {
        nivelAtual = "Ferro";
    } else if (heroi.xp >= 1001 && heroi.xp <= 2000) {
        nivelAtual = "Bronze";
    } else if (heroi.xp >= 2001 && heroi.xp <= 5000) {
        nivelAtual = "Prata";
    } else if (heroi.xp >= 5001 && heroi.xp <= 7000) {
        nivelAtual = "Ouro";
    } else if (heroi.xp >= 7001 && heroi.xp <= 8000) {
        nivelAtual = "Platina";
    } else if (heroi.xp >= 8001 && heroi.xp <= 9000) {
        nivelAtual = "Ascendente";
    } else if (heroi.xp >= 9001 && heroi.xp <= 10000) {
        nivelAtual = "Imortal";
    } else {
        nivelAtual = "Radiante";
    }

    console.log(`O Herói de nome ${heroi.nome} (XP: ${heroi.xp}) está no nível de ${nivelAtual}`);
}