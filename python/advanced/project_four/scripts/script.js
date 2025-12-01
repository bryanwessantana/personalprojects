document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar');
    const modal = document.getElementById('modalAgendamento');
    const inputTitulo = document.getElementById('tituloEvento');
    
    // Pegando os novos elementos
    const inputInicio = document.getElementById('horaInicio');
    const inputFim = document.getElementById('horaFim');
    
    const btnSalvar = document.getElementById('btnSalvar');
    const btnCancelar = document.getElementById('btnCancelar');

    let dataSelecaoAtual = null; // Guardamos apenas a DATA (dia) agora

    let meusEventos = JSON.parse(localStorage.getItem('agendaEventos')) || [];

    // --- FUNÇÃO AUXILIAR PARA FORMATAR HORA (HH:MM) ---
    function formatarHora(dataObjeto) {
        // Pega horas e minutos e garante que tenha 2 dígitos (ex: 09:05)
        const horas = String(dataObjeto.getHours()).padStart(2, '0');
        const minutos = String(dataObjeto.getMinutes()).padStart(2, '0');
        return `${horas}:${minutos}`;
    }

    function salvarLocalmente() {
        localStorage.setItem('agendaEventos', JSON.stringify(meusEventos));
    }

    function fecharModal() {
        modal.classList.add('hidden');
        inputTitulo.value = '';
        inputInicio.value = '';
        inputFim.value = '';
        dataSelecaoAtual = null;
    }

    // --- ABRIR MODAL AGORA PREENCHE OS HORÁRIOS ---
    function abrirModal(info) {
        modal.classList.remove('hidden');
        inputTitulo.focus();

        // Salva a data base (Ex: "2023-10-25") para usarmos ao salvar
        dataSelecaoAtual = info.startStr.split('T')[0];

        // Preenche os inputs com o horário que foi arrastado no calendário
        inputInicio.value = formatarHora(info.start);
        inputFim.value = formatarHora(info.end);
    }

    function verificarConflito(novoInicio, novoFim) {
        let inicioCheck = new Date(novoInicio).getTime();
        let fimCheck = new Date(novoFim).getTime();

        for (let evento of meusEventos) {
            let evtInicio = new Date(evento.start).getTime();
            let evtFim = new Date(evento.end).getTime();

            if (inicioCheck < evtFim && fimCheck > evtInicio) {
                return true;
            }
        }
        return false;
    }

    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'timeGridWeek',
        locale: 'pt-br',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek'
        },
        events: meusEventos,
        selectable: true,
        editable: true,
        
        select: function(info) {
            // Não verificamos conflito aqui ainda, pois o usuário pode mudar o horário no modal
            abrirModal(info);
        },

        eventClick: function(info) {
            if (confirm(`Deseja remover o evento '${info.event.title}'?`)) {
                info.event.remove();
                meusEventos = meusEventos.filter(e => e.start !== info.event.startStr);
                salvarLocalmente();
            }
        }
    });

    calendar.render();

    btnCancelar.addEventListener('click', () => {
        fecharModal();
        calendar.unselect();
    });

    // --- SALVAR AGORA USA OS INPUTS DE HORA ---
    btnSalvar.addEventListener('click', () => {
        const titulo = inputTitulo.value;
        const horaInicio = inputInicio.value;
        const horaFim = inputFim.value;

        if (titulo && dataSelecaoAtual && horaInicio && horaFim) {
            
            // Monta as datas completas (Dia + Hora do input)
            // Formato ISO: YYYY-MM-DDTHH:MM
            const startISO = `${dataSelecaoAtual}T${horaInicio}`;
            const endISO = `${dataSelecaoAtual}T${horaFim}`;

            // Validação 1: O fim não pode ser antes do início
            if (new Date(endISO) <= new Date(startISO)) {
                alert("O horário de fim deve ser maior que o de início.");
                return;
            }

            // Validação 2: Verificar conflito com os NOVOS horários
            if (verificarConflito(startISO, endISO)) {
                alert("❌ Esse horário já está ocupado por outro evento!");
                return;
            }

            const novoEvento = {
                title: titulo,
                start: startISO,
                end: endISO
            };

            calendar.addEvent(novoEvento);
            meusEventos.push(novoEvento);
            salvarLocalmente();
            fecharModal();
            calendar.unselect();

        } else {
            alert("Por favor, preencha todos os campos.");
        }
    });
});