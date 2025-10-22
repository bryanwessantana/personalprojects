const dataAlvo = new Date("Sep 12, 2026 00:00:00").getTime(); 

let countdownInterval;

countdownInterval = setInterval(function() {

    const dataAtual = new Date().getTime();
    const distance = dataAlvo - dataAtual;

    const umSegundo = 1000;
    const umMinuto = umSegundo * 60;
    const umaHora = umMinuto * 60;
    const umDia = umaHora * 24;

    const dias = Math.floor(distance / umDia);
    const horas = Math.floor((distance % umDia) / umaHora);
    const minutos = Math.floor((distance % umaHora) / umMinuto);
    const segundos = Math.floor((distance % umMinuto) / umSegundo);

    const formatarTempo = (valor) => valor < 10 ? '0' + valor : valor;

    document.getElementById("dias").innerText = formatarTempo(dias);
    document.getElementById("horas").innerText = formatarTempo(horas);
    document.getElementById("minutos").innerText = formatarTempo(minutos);
    document.getElementById("segundos").innerText = formatarTempo(segundos);
    
    if (distance < 0) {
        clearInterval(countdownInterval);
        
        document.getElementById("dias").innerText = "00";
        document.getElementById("horas").innerText = "00";
        document.getElementById("minutos").innerText = "00";
        document.getElementById("segundos").innerText = "00";
    }
}, 1000);