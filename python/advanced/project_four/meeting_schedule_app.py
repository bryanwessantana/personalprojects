# Appointment/Meeting Scheduling Application:

# Python/DB: Implements availability checking and time slot 
# booking, ensuring no overlapping appointments.

# Front-end: An interactive calendar (can be with a JS library 
# like FullCalendar) to select available dates and times.

# ------------------------------------------------------------------------------------------- #
from datetime import datetime

class Agenda:
    def __init__(self):
        self.compromissos = []

    def verificar_conflito(self, novo_inicio, novo_fim):
        """
        Retorna True se houver conflito, False se estiver livre.
        """
        for evento in self.compromissos:
            inicio_existente = evento['inicio']
            fim_existente = evento['fim']

            # Lógica de Overlap (Igual ao Javascript)
            # (NovoInicio < FimExistente) E (NovoFim > InicioExistente)
            if (novo_inicio < fim_existente) and (novo_fim > inicio_existente):
                return True 
        
        return False

    def agendar(self, titulo, data_str, hora_inicio_str, hora_fim_str):
        formato = "%d/%m/%Y %H:%M"

        try:
            # 1. Converter strings para objetos datetime reais
            # Assumimos que o evento começa e termina no mesmo dia
            dt_inicio = datetime.strptime(f"{data_str} {hora_inicio_str}", formato)
            dt_fim = datetime.strptime(f"{data_str} {hora_fim_str}", formato)

            # 2. Validação Básica: O fim não pode ser antes do início
            if dt_fim <= dt_inicio:
                print(f"⚠️ Erro: O horário de fim ({hora_fim_str}) deve ser maior que o início ({hora_inicio_str}).")
                return False

            # 3. Verificar conflito com outros eventos
            if self.verificar_conflito(dt_inicio, dt_fim):
                print(f"❌ Erro: O horário {hora_inicio_str}-{hora_fim_str} conflita com outro agendamento.")
                return False
            
            # 4. Se passou, salva
            novo_evento = {
                'titulo': titulo,
                'inicio': dt_inicio,
                'fim': dt_fim
            }
            self.compromissos.append(novo_evento)
            print(f"✅ Sucesso: '{titulo}' agendado em {data_str} das {hora_inicio_str} às {hora_fim_str}.")
            return True

        except ValueError:
            print("Erro de formato! Use DD/MM/AAAA para data e HH:MM para hora.")
            return False

    def listar_agenda(self):
        print("\n--- 📅 Sua Agenda ---")
        if not self.compromissos:
            print("Nenhum compromisso agendado.")
        else:
            # Ordena por horário antes de mostrar
            agenda_ordenada = sorted(self.compromissos, key=lambda x: x['inicio'])
            for evento in agenda_ordenada:
                print(f"{evento['inicio'].strftime('%d/%m %H:%M')} - {evento['fim'].strftime('%H:%M')} | {evento['titulo']}")
        print("-------------------")

# --- Interface Interativa no Terminal ---
# Isso simula o comportamento do usuário digitando os dados, igual no HTML
if __name__ == "__main__":
    minha_agenda = Agenda()

    while True:
        print("\n1. Novo Agendamento")
        print("2. Ver Agenda")
        print("3. Sair")
        opcao = input("Escolha: ")

        if opcao == '1':
            titulo = input("Título do evento: ")
            data = input("Data (DD/MM/AAAA): ")
            inicio = input("Hora Início (HH:MM): ")
            fim = input("Hora Fim (HH:MM): ")
            
            minha_agenda.agendar(titulo, data, inicio, fim)

        elif opcao == '2':
            minha_agenda.listar_agenda()

        elif opcao == '3':
            print("Saindo...")
            break
        else:
            print("Opção inválida.")