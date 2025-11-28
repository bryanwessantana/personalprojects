import json
import os
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from typing import List, Tuple, Dict, Any
import random

# --- Constantes e Estruturas de Dados ---

RECOMPENSAS_BAIXA_DOPAMINA = [
    "Meditar por 5 minutos.",
    "Beber um copo d'água e se espreguiçar.",
    "Fazer 10 minutos de alongamento.",
    "Contemplar a natureza (olhar pela janela ou sair na varanda).",
    "Ouvir uma música instrumental com fones de ouvido (sem telas)."
]

@dataclass
class Atividade:
    """Representa uma atividade na rotina do usuário."""
    nome: str
    duracao_minutos: int
    tipo: str  # Ex: 'trabalho', 'estudo', 'exercicio', 'baixa_dopamina', 'refeicao'
    prioridade: int  # 1 (alta/Must) a 3 (baixa/Could)
    recorrencia: str = 'unica'
    energia_necessaria: str = 'media'
    concluido: bool = False 

    def to_dict(self) -> Dict[str, Any]:
        return self.__dict__

    @classmethod
    def from_dict(cls, data: Dict[str, Any]):
        return cls(**data)

@dataclass
class Habito:
    """Representa um hábito a ser rastreado."""
    nome: str
    frequencia_dias: int 
    tipo: str
    streak: int = 0
    ultima_conclusao: datetime = field(default_factory=datetime.now) 
    concluido_hoje: bool = False 

    def to_dict(self) -> Dict[str, Any]:
        data = self.__dict__.copy()
        data['ultima_conclusao'] = data['ultima_conclusao'].isoformat()
        return data

    @classmethod
    def from_dict(cls, data: Dict[str, Any]):
        data['ultima_conclusao'] = datetime.fromisoformat(data['ultima_conclusao'])
        return cls(**data)

# --- Funções de Otimização ---

def aplicar_metodo_pomodoro(atividade: Atividade, pomodoro_min: int = 25, pausa_min: int = 5) -> List[Tuple[str, int]]:
    """Divide uma atividade longa em blocos Pomodoro (25/5)."""
    blocos = []
    tempo_restante = atividade.duracao_minutos
    while tempo_restante > 0:
        if tempo_restante >= pomodoro_min:
            blocos.append(("Foco Pomodoro", pomodoro_min))
            tempo_restante -= pomodoro_min
            if tempo_restante > 0:
                blocos.append(("Pausa Pomodoro (5min - Movimento)", pausa_min))
        else:
            blocos.append((atividade.nome, tempo_restante))
            tempo_restante = 0
    return blocos

def otimizar_por_energia(atividades: List[Atividade], cronotipo: str) -> List[Atividade]:
    """Ordena atividades com base no Cronotipo do usuário (Cotovia, Colibri, Coruja)."""
    
    mapa_energia = {
        'cotovia': {'alta': 1, 'media': 2, 'baixa': 3}, 
        'colibri': {'alta': 2, 'media': 1, 'baixa': 3}, 
        'coruja': {'alta': 3, 'media': 2, 'baixa': 1}  
    }
    
    energia_base = mapa_energia.get(cronotipo.lower(), mapa_energia['colibri'])

    def chave_ordenacao(ativ):
        # 1. Prioriza 'Baixa Dopamina'
        if ativ.tipo == 'baixa_dopamina':
            return (0, ativ.prioridade, ativ.duracao_minutos * -1)
        
        # 2. Aplica a ordem de energia com base no cronotipo
        ordem_energia = energia_base.get(ativ.energia_necessaria, 4) 
        
        return (ordem_energia, ativ.prioridade, ativ.duracao_minutos * -1)

    return sorted([a for a in atividades if not a.concluido], key=chave_ordenacao)


# --- Classe Principal: SistemaRotina ---

class SistemaRotina:
    
    def __init__(self, arquivo_dados='rotina_data_pro.json'):
        self.arquivo_dados = arquivo_dados
        self.atividades: List[Atividade] = []
        self.habitos: List[Habito] = []
        self.hora_acordar: str = "07:00"
        self.hora_dormir: str = "23:00"
        self.cronotipo: str = 'colibri'
        self.carregar_dados()

    # --- Persistência de Dados (Output Limpo) ---

    def salvar_dados(self):
        """Salva a lista de atividades e hábitos no arquivo JSON (sem output no console)."""
        dados = {
            'cronotipo': self.cronotipo,
            'hora_acordar': self.hora_acordar,
            'hora_dormir': self.hora_dormir,
            'atividades': [a.to_dict() for a in self.atividades],
            'habitos': [h.to_dict() for h in self.habitos]
        }
        try:
            with open(self.arquivo_dados, 'w', encoding='utf-8') as f:
                json.dump(dados, f, indent=4)
        except Exception as e:
            print(f"❌ Erro ao salvar dados: {e}")

    def carregar_dados(self):
        """Carrega dados do arquivo JSON."""
        if os.path.exists(self.arquivo_dados):
            try:
                with open(self.arquivo_dados, 'r', encoding='utf-8') as f:
                    dados = json.load(f)
                self.cronotipo = dados.get('cronotipo', 'colibri')
                self.hora_acordar = dados.get('hora_acordar', '07:00')
                self.hora_dormir = dados.get('hora_dormir', '23:00')
                self.atividades = [Atividade.from_dict(d) for d in dados.get('atividades', [])]
                self.habitos = [Habito.from_dict(d) for d in dados.get('habitos', [])]
                print(f"🔄 Dados carregados. Cronotipo: {self.cronotipo.capitalize()}.")
                self.resetar_conclusoes_diarias(silencioso=True)
            except Exception as e:
                print(f"❌ Erro ao carregar dados. Começando com dados vazios. ({e})")
        else:
            print("🆕 Arquivo de dados não encontrado. Começando um novo sistema.")
    
    # --- Criação e Edição (Output Limpo) ---

    def adicionar_atividade(self, nome: str, duracao: int, tipo: str, prioridade: int, recorrencia: str, energia: str):
        """Adiciona uma nova atividade ao sistema."""
        nova_ativ = Atividade(nome, duracao, tipo, prioridade, recorrencia, energia)
        self.atividades.append(nova_ativ)

    def adicionar_habito(self, nome: str, frequencia: int, tipo: str):
        """Adiciona um novo hábito para rastreamento."""
        novo_hab = Habito(nome, frequencia, tipo)
        self.habitos.append(novo_hab)

    # --- Configuração Inicial Interativa (Menos Poluída) ---

    def configuracao_inicial_detalhada(self):
        print("\n--- 🧠 Configuração Comportamental e Horários Fixos ---")
        
        while True:
            crono = input("Qual o seu Cronotipo? (Cotovia/Colibri/Coruja): ").strip().lower()
            if crono in ['cotovia', 'colibri', 'coruja']:
                self.cronotipo = crono
                break
            print("Inválido. Escolha entre Cotovia, Colibri ou Coruja.")

        self.hora_acordar = input("A que horas você acorda? (HH:MM, ex: 07:00): ")
        self.hora_dormir = input("A que horas você pretende dormir? (HH:MM, ex: 23:00): ")

        print("\n--- 🗓️ Adicionar Blocos Fixos Recorrentes (Trabalho, Estudo, Refeições) ---")
        
        blocos_comuns = {
            'T': ('Trabalho (Alto Foco)', 'trabalho', 1, 'alta'),
            'E': ('Estudo (Deep Work)', 'estudo', 1, 'alta'),
            'F': ('Atividade Física', 'exercicio', 1, 'media'),
            'R': ('Refeição Principal', 'refeicao', 1, 'baixa'),
            'B': ('Baixa Dopamina (Leitura, Caminhada)', 'baixa_dopamina', 2, 'baixa')
        }

        while True:
            print("\nTipos de Blocos para adicionar:")
            for key, (name, *_) in blocos_comuns.items():
                print(f"[{key}] {name}")
            
            tipo_escolhido = input("Escolha uma opção acima (T/E/F/R/B) ou 'FIM' para terminar: ").strip().upper()
            
            if tipo_escolhido == 'FIM':
                break
            
            if tipo_escolhido in blocos_comuns:
                nome_base, tipo, prio, energia = blocos_comuns[tipo_escolhido]
                
                nome_custom = input(f"Nome do bloco (ex: '{nome_base}'): ").strip() or nome_base
                duracao = input(f"Duração do bloco (em minutos): ").strip()
                
                try:
                    duracao_int = int(duracao)
                    if duracao_int <= 0:
                        raise ValueError
                except ValueError:
                    print("Duração inválida. Tente novamente.")
                    continue

                self.adicionar_atividade(nome_custom, duracao_int, tipo, prio, 'diaria', energia)
                print(f"Bloco '{nome_custom}' adicionado.")

            else:
                print("Opção inválida. Tente novamente.")
                
        # Adiciona bloco padrão de lazer digital e salva
        self.adicionar_atividade("Lazer Digital (Redes Sociais/Jogos)", 60, 'alta_dopamina', 3, 'diaria', 'baixa')
        self.adicionar_habito("Beber 1L de Água", 7, 'saude')
        self.adicionar_habito("Meditação 10min", 7, 'baixa_dopamina')
        self.salvar_dados()
        print("\n✅ Configuração salva!")
        
    # --- Gestão de Conclusão e Streak ---

    def resetar_conclusoes_diarias(self, silencioso=False):
        """Reseta as flags de conclusão (simula o início de um novo dia)."""
        hoje = datetime.now().date()
        
        for ativ in self.atividades:
            ativ.concluido = False
        
        for hab in self.habitos:
            if hab.concluido_hoje == False and hab.ultima_conclusao.date() == hoje - timedelta(days=1):
                 hab.streak = 0
            hab.concluido_hoje = False

        self.salvar_dados()
        
        if not silencioso:
            print("\n🌞 Conclusões diárias resetadas.")


    def marcar_como_concluido(self, nome: str, tipo: str = 'atividade'):
        """Marca uma atividade ou hábito como concluído, atualiza o streak e sugere recompensa."""
        if tipo == 'atividade':
            for ativ in self.atividades:
                if ativ.nome.lower() == nome.lower() and not ativ.concluido:
                    ativ.concluido = True
                    print(f"🎉 '{ativ.nome}' CONCLUÍDA!")
                    
                    if ativ.prioridade == 1 and ativ.tipo not in ['baixa_dopamina', 'refeicao']:
                        recompensa = random.choice(RECOMPENSAS_BAIXA_DOPAMINA)
                        print(f"🧠 RECOMPENSA DE FOCO: Sugestão: **{recompensa}**")
                        
                    self.salvar_dados()
                    return
            print(f"❌ '{nome}' não encontrada ou já concluída.")
        
        elif tipo == 'habito':
            hoje = datetime.now().date()
            for hab in self.habitos:
                if hab.nome.lower() == nome.lower():
                    if hab.concluido_hoje:
                         print(f"Hábito '{hab.nome}' já foi concluído hoje.")
                         return
                         
                    hab.concluido_hoje = True
                    ultima_data = hab.ultima_conclusao.date()
                    
                    if ultima_data == hoje - timedelta(days=1):
                        hab.streak += 1
                        print(f"🔥 STREAK! '{hab.nome}': {hab.streak} dias seguidos.")
                    elif ultima_data < hoje:
                        hab.streak = 1 
                        print(f"✅ Hábito '{hab.nome}' concluído. Novo STREAK (1 dia).")
                    
                    hab.ultima_conclusao = datetime.now()
                    self.salvar_dados()
                    return
            print(f"❌ Hábito '{nome}' não encontrado.")

    # --- Geração de Rotina e Agendamento ---

    def criar_rotina_agendada(self) -> List[Tuple[str, str, str]]:
        """Gera a rotina final (Time Blocking) com otimizações, Pomodoro e Buffer."""
        
        atividades_pendentes = [a for a in self.atividades if not a.concluido]
        atividades_otimizadas = otimizar_por_energia(atividades_pendentes, self.cronotipo)
        rotina_sugerida = []
        
        try:
            agora = datetime.strptime(self.hora_acordar, "%H:%M")
        except ValueError:
            return [("00:00", "00:00", "Erro: Horário de acordar inválido.")]

        for atividade in atividades_otimizadas:
            
            if rotina_sugerida and rotina_sugerida[-1][2].startswith(("Foco Pomodoro", "BLOCO DE LAZER")):
                 pausa_minutos = 10
                 hora_inicio_pausa = agora.strftime("%H:%M")
                 agora += timedelta(minutes=pausa_minutos)
                 hora_fim_pausa = agora.strftime("%H:%M")
                 rotina_sugerida.append((hora_inicio_pausa, hora_fim_pausa, "PAUSA GERAL (10min)"))

            if atividade.duracao_minutos > 60 and atividade.tipo in ['trabalho', 'estudo']:
                blocos_pomodoro = aplicar_metodo_pomodoro(atividade)
                for nome_bloco, duracao_bloco in blocos_pomodoro:
                    hora_inicio = agora.strftime("%H:%M")
                    agora += timedelta(minutes=duracao_bloco)
                    hora_fim = agora.strftime("%H:%M")
                    rotina_sugerida.append((hora_inicio, hora_fim, f"{nome_bloco} - {atividade.nome}"))
                
                if atividade.prioridade == 1 and atividade.energia_necessaria == 'alta':
                    hora_inicio_buffer = agora.strftime("%H:%M")
                    agora += timedelta(minutes=15)
                    hora_fim_buffer = agora.strftime("%H:%M")
                    rotina_sugerida.append((hora_inicio_buffer, hora_fim_buffer, "BUFFER DE TRANSIÇÃO (15min)"))

            elif atividade.tipo == 'alta_dopamina':
                limite_dopamina = min(60, atividade.duracao_minutos) 
                hora_inicio = agora.strftime("%H:%M")
                agora += timedelta(minutes=limite_dopamina)
                hora_fim = agora.strftime("%H:%M")
                rotina_sugerida.append((hora_inicio, hora_fim, f"LAZER DIGITAL (Máx. {limite_dopamina}min) - {atividade.nome}"))
                
            else:
                hora_inicio = agora.strftime("%H:%M")
                agora += timedelta(minutes=atividade.duracao_minutos)
                hora_fim = agora.strftime("%H:%M")
                rotina_sugerida.append((hora_inicio, hora_fim, f"{atividade.nome} (Energia: {atividade.energia_necessaria.capitalize()})"))


        # Bloco de Relaxamento e Sono
        hora_fim_rotina_str = rotina_sugerida[-1][1] if rotina_sugerida else self.hora_acordar
        try:
            hora_dormir_dt = datetime.strptime(self.hora_dormir, "%H:%M")
            hora_fim_rotina_dt = datetime.strptime(hora_fim_rotina_str, "%H:%M")
            if hora_dormir_dt < datetime.strptime(self.hora_acordar, "%H:%M"):
                hora_dormir_dt += timedelta(days=1)
                
            rotina_sugerida.append((hora_fim_rotina_str, hora_dormir_dt.strftime("%H:%M"), "ROTINA NOTURNA E HIGIENE DO SONO"))
                
            hora_desligar_telas = (hora_dormir_dt - timedelta(hours=1)).strftime("%H:%M")
            print(f"\n📢 **ALERTA DE HIGIENE DO SONO:** Desligue telas às {hora_desligar_telas}.")

        except ValueError:
            pass
            
        return rotina_sugerida

    # --- Relatórios e Monitoramento ---
    
    def exibir_agenda(self, rotina_agendada: List[Tuple[str, str, str]]):
        """Exibe a agenda de forma formatada."""
        print("\n" + "="*70)
        print("## ✅ Agenda Otimizada | Cronotipo: {}".format(self.cronotipo.capitalize()))
        print("{:<8} | {:<8} | {}".format("INÍCIO", "FIM", "ATIVIDADE"))
        print("-" * 70)
        for inicio, fim, nome in rotina_agendada:
            print("{:<8} | {:<8} | {}".format(inicio, fim, nome))
        print("="*70)

    def exibir_backlog(self):
        """Exibe tarefas não agendadas (Backlog) usando a Priorização MoSCoW."""
        backlog = sorted([a for a in self.atividades if not a.concluido and a.recorrencia == 'unica'], key=lambda x: x.prioridade)
        
        moscow_map = {1: 'MUST', 2: 'SHOULD', 3: 'COULD'}
        
        if backlog:
            print("\n## 📥 Backlog Priorizado (MoSCoW):")
            for i, ativ in enumerate(backlog, 1):
                 moscow_label = moscow_map.get(ativ.prioridade, 'WONT')
                 print(f"**{i}.** [{moscow_label}] {ativ.nome} | Duração: {ativ.duracao_minutos}min")
        else:
            print("\n📥 Seu Backlog está vazio. Excelente!")
            
    def gerar_relatorio_diario(self):
        """Gera um relatório de desempenho do dia."""
        atividades_recorrentes = [a for a in self.atividades if a.recorrencia == 'diaria']
        total_atividades = len(atividades_recorrentes)
        concluidas = sum(1 for a in atividades_recorrentes if a.concluido)
        percentual_ativ = (concluidas / total_atividades) * 100 if total_atividades else 0

        total_habitos = len(self.habitos)
        habitos_concluidos = sum(1 for h in self.habitos if h.concluido_hoje)
        percentual_hab = (habitos_concluidos / total_habitos) * 100 if total_habitos else 0

        print("\n" + "📊"*5 + " RELATÓRIO DE PROGRESSO " + "📊"*5)
        print(f"✅ Atividades Recorrentes: {concluidas}/{total_atividades} ({percentual_ativ:.1f}%)")
        print(f"🎯 Hábitos Concluídos: {habitos_concluidos}/{total_habitos} ({percentual_hab:.1f}%)")
        
        print("\n**DETALHE DO STREAK:**")
        for hab in self.habitos:
            status = "✅" if hab.concluido_hoje else "❌"
            print(f"    - {status} {hab.nome}: **{hab.streak}** dias.")
        
        if percentual_ativ < 70 or percentual_hab < 70:
            print("\n💡 Dica de Otimização: Considere revisar seu Cronotipo ou reduzir o número de tarefas MUST para o dia. Flexibilidade é a chave para a consistência.")
        else:
            print("\n🌟 EXCELENTE PROGRESSO! Mantenha o foco.")
        print("="*50)


# --- Funções do Menu Interativo ---

def coletar_nova_atividade(sistema: 'SistemaRotina'):
    """Função interativa para adicionar uma única atividade ou hábito customizado."""
    print("\n--- Adicionar Nova Atividade/Hábito Customizado ---")
    escolha = input("Adicionar [A]tividade ou [H]ábito? ").strip().upper()
    
    if escolha == 'A':
        nome = input("Nome da Atividade: ").strip()
        duracao_str = input("Duração (em minutos): ").strip()
        tipo = input("Tipo (trabalho, estudo, baixa_dopamina, etc.): ").strip().lower()
        prioridade_str = input("Prioridade (1=Must/Alta, 3=Could/Baixa): ").strip()
        energia = input("Nível de Energia (alta/media/baixa): ").strip().lower()
        
        try:
            duracao = int(duracao_str)
            prioridade = int(prioridade_str)
            if 1 <= prioridade <= 3:
                sistema.adicionar_atividade(nome, duracao, tipo, prioridade, 'diaria', energia)
                print(f"✅ Atividade '{nome}' adicionada.")
            else:
                print("❌ Prioridade inválida (use 1, 2 ou 3).")
        except ValueError:
            print("❌ Duração ou Prioridade devem ser números inteiros.")
            
    elif escolha == 'H':
        nome = input("Nome do Hábito: ").strip()
        frequencia_str = input("Frequência (dias/semana, ex: 7 para diário): ").strip()
        tipo = input("Tipo do Hábito: ").strip().lower()
        try:
            frequencia = int(frequencia_str)
            sistema.adicionar_habito(nome, frequencia, tipo)
            print(f"✅ Hábito '{nome}' adicionado.")
        except ValueError:
            print("❌ Frequência deve ser um número inteiro.")
    else:
        print("Opção inválida.")
        
def exibir_e_marcar_conclusao(sistema: 'SistemaRotina'):
    """Exibe atividades/hábitos pendentes e permite marcar como concluído."""
    
    atividades_pendentes = [a for a in sistema.atividades if not a.concluido]
    habitos_pendentes = [h for h in sistema.habitos if not h.concluido_hoje]

    if not atividades_pendentes and not habitos_pendentes:
        print("\n🎉 Nada pendente! Você completou tudo.")
        return

    print("\n--- 📝 Marcar Tarefa como Concluída ---")
    
    if atividades_pendentes:
        print("Atividades Pendentes:")
        for i, a in enumerate(atividades_pendentes):
            print(f"[{i+1}A] {a.nome} ({a.duracao_minutos}min)")

    if habitos_pendentes:
        print("\nHábitos Pendentes:")
        for i, h in enumerate(habitos_pendentes):
            print(f"[{i+1}H] {h.nome} (Streak: {h.streak})")
        
    escolha = input("\nDigite o código (ex: 1A para Atividade, 1H para Hábito) ou 'V' para voltar: ").strip().upper()

    if escolha == 'V':
        return
        
    try:
        tipo = escolha[-1]
        indice = int(escolha[:-1]) - 1
        
        if tipo == 'A' and 0 <= indice < len(atividades_pendentes):
            nome = atividades_pendentes[indice].nome
            sistema.marcar_como_concluido(nome, 'atividade')
            
        elif tipo == 'H' and 0 <= indice < len(habitos_pendentes):
            nome = habitos_pendentes[indice].nome
            sistema.marcar_como_concluido(nome, 'habito')
            
        else:
            print("❌ Código inválido.")
            
    except (ValueError, IndexError):
        print("❌ Formato de código inválido.")


def menu_principal():
    """Menu principal de execução do sistema."""
    sistema = SistemaRotina()

    # Se o sistema não tiver atividades, força a configuração inicial.
    if not sistema.atividades:
        print("Bem-vindo! Parece que esta é a primeira vez. Precisamos da sua configuração inicial.")
        sistema.configuracao_inicial_detalhada()
        
    while True:
        print("\n" + "="*40)
        print("🤖 Assistente de Rotina PRO")
        print("="*40)
        print("[1] Gerar e Exibir Rotina Otimizada")
        print("[2] Adicionar Nova Atividade/Hábito (Customizado)")
        print("[3] Marcar Tarefa como Concluída")
        print("[4] Ver Relatório de Progresso e Streaks")
        print("[5] Ver Backlog (Tarefas Não Agendadas)")
        print("[0] Sair e Salvar Dados")
        print("-" * 40)
        
        escolha = input("Escolha uma opção: ").strip()
        
        if escolha == '1':
            rotina_do_dia = sistema.criar_rotina_agendada()
            sistema.exibir_agenda(rotina_do_dia)
            
        elif escolha == '2':
            coletar_nova_atividade(sistema) # Permite adicionar customizado
            
        elif escolha == '3':
            exibir_e_marcar_conclusao(sistema)
            
        elif escolha == '4':
            sistema.gerar_relatorio_diario()
            
        elif escolha == '5':
            sistema.exibir_backlog()
            
        elif escolha == '0':
            sistema.salvar_dados()
            print("👋 Dados salvos. Saindo do sistema.")
            break
            
        else:
            print("Opção inválida. Tente novamente.")

if __name__ == "__main__":
    menu_principal()