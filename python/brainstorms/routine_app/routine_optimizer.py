from datetime import datetime, timedelta
import operator

# --- 1. Modelagem de Dados ---

class Usuario:
    def __init__(self, cronotipo, horas_sono, nivel_vicio_redes):
        self.cronotipo = cronotipo
        self.horas_sono = horas_sono
        self.nivel_vicio_redes = nivel_vicio_redes 

class Tarefa:
    def __init__(self, nome, duracao_min, tipo_foco, peso, nivel_dopamina, bloco_preferencial='nenhum'):
        self.nome = nome
        self.duracao_min = duracao_min
        self.tipo_foco = tipo_foco
        self.nivel_dopamina = nivel_dopamina
        self.peso = peso 
        self.bloco_preferencial = bloco_preferencial

class BlocoFixo:
    def __init__(self, inicio, fim, nome):
        self.inicio = inicio
        self.fim = fim
        self.nome = nome

# --- 2. Funções Auxiliares de Tempo e Refeições ---

def get_time_for_sort(time_str):
    """Converte string de hora em objeto datetime para ordenação cronológica."""
    try:
        dt = datetime.strptime(time_str, "%H:%M")
    except ValueError:
        dt = datetime.strptime("00:00", "%H:%M") 
    
    if dt.hour < 6:
        dt += timedelta(days=1)
        
    return dt

def parse_time_str(time_str):
    """Converte 'HH:MM' para objeto datetime."""
    return datetime.strptime(time_str, "%H:%M")

def get_refeicoes_padrao(hora_acordar):
    """Gera 4 blocos de refeição espaçados a partir da hora de acordar."""
    refeicoes = []
    
    cafe_inicio = hora_acordar + timedelta(minutes=30)
    refeicoes.append(BlocoFixo(cafe_inicio.strftime("%H:%M"), 
                               (cafe_inicio + timedelta(minutes=30)).strftime("%H:%M"), 
                               "Café da Manhã ☕"))
    
    almoco_inicio = hora_acordar + timedelta(hours=5)
    refeicoes.append(BlocoFixo(almoco_inicio.strftime("%H:%M"), 
                               (almoco_inicio + timedelta(minutes=45)).strftime("%H:%M"), 
                               "Almoço 🍽️"))

    lanche_inicio = almoco_inicio + timedelta(hours=4)
    refeicoes.append(BlocoFixo(lanche_inicio.strftime("%H:%M"), 
                               (lanche_inicio + timedelta(minutes=30)).strftime("%H:%M"), 
                               "Lanche da Tarde 🍎"))
    
    jantar_inicio = lanche_inicio + timedelta(hours=3)
    refeicoes.append(BlocoFixo(jantar_inicio.strftime("%H:%M"), 
                               (jantar_inicio + timedelta(minutes=45)).strftime("%H:%M"), 
                               "Jantar 🍲"))
    
    return refeicoes

# --- 3. Lógica Principal de Otimização ---

def calcular_rotina(usuario, tarefas, blocos_trabalho_fixo, blocos_refeicao_custom):
    
    rotina_final_proc = []
    
    # 3.1. Configuração Cronobiológica
    hora_acordar_str = "06:00" if usuario.cronotipo == "matutino" else "08:00"
    hora_acordar = parse_time_str(hora_acordar_str)
    
    # Geração dos blocos de refeição e combinação de TODOS os fixos
    blocos_refeicao = blocos_refeicao_custom if blocos_refeicao_custom else get_refeicoes_padrao(hora_acordar)
    todos_blocos_fixos = blocos_trabalho_fixo + blocos_refeicao
    todos_blocos_fixos.sort(key=lambda x: parse_time_str(x.inicio))
    
    # Define o início do 1º bloco fixo e o fim do último
    primeiro_bloco_inicio = parse_time_str(todos_blocos_fixos[0].inicio) if todos_blocos_fixos else parse_time_str("23:59")
    fim_ultimo_bloco = parse_time_str(todos_blocos_fixos[-1].fim) if todos_blocos_fixos else parse_time_str("00:00")
    
    
    # --- A. Acordar e Desintoxicação ---
    
    rotina_final_proc.append((hora_acordar_str, "☀️ **Acordar** (Duração: 0 min)"))
    temp_time = hora_acordar
    minutos_desintoxicacao = 60 + (usuario.nivel_vicio_redes * 15)
    
    tempo_fim_desintoxicacao = temp_time + timedelta(minutes=minutos_desintoxicacao)
    
    # Aloca Desintoxicação
    if tempo_fim_desintoxicacao > primeiro_bloco_inicio:
        rotina_final_proc.append((temp_time.strftime("%H:%M"), f"🧘‍♂️ **Desintoxicação** (Duração: {int((primeiro_bloco_inicio - temp_time).total_seconds() / 60)} min)"))
        tempo_fim_desintoxicacao = primeiro_bloco_inicio
    else:
        rotina_final_proc.append((temp_time.strftime("%H:%M"), f"🧘‍♂️ **Desintoxicação de Dopamina** (Duração: {minutos_desintoxicacao} min)"))
    
    
    # --- B. INSERÇÃO CRÍTICA: Blocos Fixos (Trabalho e Refeições) ---
    for bloco in todos_blocos_fixos:
        duracao = int((parse_time_str(bloco.fim) - parse_time_str(bloco.inicio)).total_seconds() / 60)
        rotina_final_proc.append((bloco.inicio, f"💼 **{bloco.nome}** (Duração: {duracao} min)"))

    
    # --- C. Agendamento Preferencial e Separação de Livres ---
    
    tasks_desintoxicacao = [t for t in tarefas if t.bloco_preferencial == 'desintoxicacao']
    tasks_recompensa_pref = [t for t in tarefas if t.bloco_preferencial == 'recompensa']
    # As tarefas livres são aquelas sem preferência de bloco específica.
    tarefas_livres = [t for t in tarefas if t.bloco_preferencial == 'nenhum'] 
    
    # C.1. Agendamento das tarefas preferenciais durante a Desintoxicação
    if tasks_desintoxicacao:
        current_slot_time = hora_acordar
        for t in tasks_desintoxicacao:
            if (current_slot_time + timedelta(minutes=t.duracao_min)) <= tempo_fim_desintoxicacao:
                rotina_final_proc.append((current_slot_time.strftime("%H:%M"), 
                               f"🧘 {t.nome} (Duração: {t.duracao_min} min)"))
                current_slot_time += timedelta(minutes=t.duracao_min)
            
    # --- D. Alocação de Tarefas Livres (Prioridade nos slots vazios) ---
    
    # 1. Definir os slots de tempo *disponíveis*
    slots_tempo_livre = []
    eventos_chave = sorted([
        (parse_time_str(b.inicio), parse_time_str(b.fim)) 
        for b in todos_blocos_fixos
    ], key=lambda x: x[0])
    
    tempo_sequencial_atual = tempo_fim_desintoxicacao
    
    # Encontra as lacunas entre blocos fixos
    for inicio_bloco, fim_bloco in eventos_chave:
        if inicio_bloco > tempo_sequencial_atual + timedelta(minutes=1):
            slots_tempo_livre.append((tempo_sequencial_atual, inicio_bloco))
        tempo_sequencial_atual = max(tempo_sequencial_atual, fim_bloco)
    
    # Adiciona o slot final (até 23:00 para alocação)
    slots_tempo_livre.append((tempo_sequencial_atual, parse_time_str("23:00")))
    
    # 2. Alocar tarefas livres (sem preferência)
    tarefas_livres_ordenadas = sorted(
        tarefas_livres, 
        key=operator.attrgetter('peso', 'duracao_min'), 
        reverse=True
    )
    
    for t in tarefas_livres_ordenadas:
        for i, (slot_inicio, slot_fim) in enumerate(slots_tempo_livre):
            slot_duracao = (slot_fim - slot_inicio).total_seconds() / 60
            
            if t.duracao_min <= slot_duracao:
                rotina_final_proc.append((slot_inicio.strftime("%H:%M"), 
                                        f"🏃 {t.nome} (Duração: {t.duracao_min} min)"))
                
                # Atualiza o tempo do slot
                novo_slot_inicio = slot_inicio + timedelta(minutes=t.duracao_min)
                slots_tempo_livre[i] = (novo_slot_inicio, slot_fim)
                break 
    
    
    # --- E. Agendamento Bloco de Recompensa (Preferenciais e Alta Dopamina) ---
    
    hora_recompensa_inicio = fim_ultimo_bloco + timedelta(minutes=15) 
    tempo_sequencial_noite = hora_recompensa_inicio
    limite_dopamina = 60 # Limite de 60 min para alta dopamina
    
    rotina_final_proc.append((hora_recompensa_inicio.strftime("%H:%M"), "🎯 LOG_RECOMPENSA_START"))

    # E.1. Alocar tarefas preferenciais 'recompensa' (EX: Academia)
    tasks_noite_ordenadas = sorted(
        tasks_recompensa_pref,
        key=operator.attrgetter('peso'), 
        reverse=True
    )
    
    for t in tasks_noite_ordenadas:
        rotina_final_proc.append((tempo_sequencial_noite.strftime("%H:%M"), 
                                  f"🏆 {t.nome} (Duração: {t.duracao_min} min)"))
        tempo_sequencial_noite += timedelta(minutes=t.duracao_min)

    # E.2. Alocar tarefas de Alta Dopamina (baixa prioridade)
    # Filtra tarefas com alta dopamina, mas que NÃO foram marcadas para o bloco de recompensa (E.1)
    tasks_alta_dopamina = [t for t in tarefas if t.nivel_dopamina >= 5 and t.bloco_preferencial != 'recompensa']

    for t in tasks_alta_dopamina:
        if t.duracao_min <= limite_dopamina:
             rotina_final_proc.append((tempo_sequencial_noite.strftime("%H:%M"), 
                               f"📱 {t.nome} (Duração: {t.duracao_min} min)"))
             tempo_sequencial_noite += timedelta(minutes=t.duracao_min)
             limite_dopamina -= t.duracao_min

    # --- F. Cálculo de Deitar e Finalização ---
    
    ultima_atividade_fim = tempo_sequencial_noite
    hora_dormir_real = ultima_atividade_fim + timedelta(minutes=30) 
    
    rotina_final_proc.append((hora_dormir_real.strftime("%H:%M"), f"😴 **Deitar** (Duração: 0 min)"))

    # Ordenação final
    rotina_ordenada = sorted(rotina_final_proc, key=lambda x: get_time_for_sort(x[0]))
    
    # Retorna os dois itens necessários para o processamento visual
    return rotina_ordenada, todos_blocos_fixos

# --- 4. Funções de Visualização (Com Correção de Sobreposição) ---

def is_time_occupied(start_time, end_time, blocos_fixos):
    """Verifica se o intervalo (start_time, end_time) está total ou parcialmente ocupado por um bloco fixo."""
    for bloco in blocos_fixos:
        bloco_inicio = parse_time_str(bloco.inicio)
        bloco_fim = parse_time_str(bloco.fim)
        
        # Ocupado se: o bloco fixo começa antes do fim do intervalo E termina depois do início do intervalo.
        if (bloco_inicio < end_time and bloco_fim > start_time):
            return True
    return False


def processar_rotina_visual(rotina_logica, blocos_fixos):
    """
    Transforma a rotina lógica em uma lista visual final,
    removendo sobreposições e inserindo Tempo Livre APENAS em slots vazios.
    """
    
    rotina_visual = []
    
    # 1. Limpeza do Log e Preparação da Lista
    palavras_chave_log = ["LOG_", "START", "END", "PREFERÊNCIA", "PICO DE FOCO", "Queda de Energia", "Desintoxicação"]
    rotina_limpa = [
        (hora, atividade) 
        for hora, atividade in rotina_logica 
        if not any(keyword in atividade for keyword in palavras_chave_log)
    ]
    
    tempo_anterior = None
    
    for hora_str, atividade in rotina_limpa:
        hora_inicio = parse_time_str(hora_str)
        duracao_min = 0
        
        # 2. Determinar Duração e Hora de Término
        if 'Duração:' in atividade:
            try:
                duracao_str = atividade.split('Duração: ')[1].split(' min')[0].strip()
                duracao_min = int(duracao_str)
            except:
                duracao_min = 0 
        
        hora_fim = hora_inicio + timedelta(minutes=duracao_min)
        
        # 3. Inserir Bloco de Pausa/Tempo Livre (SE O SLOT ESTIVER LIVRE)
        if tempo_anterior and (hora_inicio - tempo_anterior).total_seconds() / 60 >= 15:
            pausa_inicio = tempo_anterior
            pausa_fim = hora_inicio
            pausa_duracao = int((pausa_fim - pausa_inicio).total_seconds() / 60)
            
            # CHECAGEM CRÍTICA: Insere Tempo Livre SOMENTE se não houver sobreposição com blocos fixos.
            if not is_time_occupied(pausa_inicio, pausa_fim, blocos_fixos):
                rotina_visual.append({
                    "inicio": pausa_inicio.strftime("%H:%M"), 
                    "fim": pausa_fim.strftime("%H:%M"), 
                    "atividade": f"⏳ Tempo Livre / Pausa (Autonomia: {pausa_duracao} min)"
                })
            
        # 4. Adicionar Item Formatado
        atividade_limpa = atividade.replace('**', '').split(' (Duração:')[0].strip()
        
        if 'Deitar' in atividade_limpa:
            atividade_final = '😴 ' + atividade_limpa
        elif 'Acordar' in atividade_limpa:
            atividade_final = '☀️ ' + atividade_limpa
        else:
            atividade_final = f"{atividade_limpa} ({duracao_min} min)"

        rotina_visual.append({
            "inicio": hora_inicio.strftime("%H:%M"), 
            "fim": hora_fim.strftime("%H:%M"), 
            "atividade": atividade_final
        })
        
        tempo_anterior = hora_fim

    return rotina_visual

# --- 5. Interface (Terminal) para Coleta Dinâmica de Dados ---
# ... (Funções de Coleta Mantidas) ...

def coletar_tarefas():
    tarefas = []
    # Incluído 'recompensa' como bloco preferencial
    opcoes_bloco = {'1': 'desintoxicacao', '2': 'almoco_queda', '3': 'pico_foco', '4': 'recompensa', '5': 'nenhum'}
    
    print("\n--- Adicionar Tarefas Flexíveis ---")
    while True:
        nome = input("Nome da Tarefa (ou 'sair'): ").strip()
        if nome.lower() == 'sair':
            break
        
        try:
            duracao = int(input("Duração (minutos): "))
            tipo_foco = input("Tipo de Foco (alto/baixo): ").lower()
            peso = int(input("Peso/Prioridade (1-10): "))
            
            print("\nOnde prefere agendar esta tarefa? (Opcional)")
            print("1: Desintoxicação | 2: Queda de Energia")
            print("3: Pico de Foco | 4: Recompensa | 5: Nenhum (Otimizar)")
            
            escolha_bloco = input("Escolha (1-5): ")
            bloco_pref = opcoes_bloco.get(escolha_bloco, 'nenhum')

            nome_lower = nome.lower()
            if any(keyword in nome_lower for keyword in ["social", "tiktok", "instagram", "jogo"]):
                nivel_dopamina = 5
            elif any(keyword in nome_lower for keyword in ["academia", "treino", "exercicio"]):
                nivel_dopamina = 1
            else:
                nivel_dopamina = 2
                
            tarefas.append(Tarefa(nome, duracao, tipo_foco, peso, nivel_dopamina, bloco_pref))
            print(f"Tarefa '{nome}' adicionada. Bloco preferencial: {bloco_pref.upper()}")
        except ValueError:
            print("Entrada inválida. Por favor, use números para duração e peso.")
            
    return tarefas

def coletar_blocos_fixos():
    blocos = []
    print("\n--- Adicionar Horários Fixos (Trabalho, Aulas) ---")
    while True:
        nome = input("Nome do Bloco Fixo (ou 'fim'): ").strip()
        if nome.lower() == 'fim':
            break
        inicio = input("Hora de Início (HH:MM): ").strip()
        fim = input("Hora de Fim (HH:MM): ").strip()
        try:
            parse_time_str(inicio)
            parse_time_str(fim)
            blocos.append(BlocoFixo(inicio, fim, nome))
        except ValueError:
            print("Formato de hora inválido. Use HH:MM.")
            
    blocos_refeicao_custom = None
    print("\n--- Configuração de Refeições (4 refeições) ---")
    
    escolha_refeicao = input("Usar horários Padrão (P) ou Customizar (C)? ").lower()
    
    if escolha_refeicao == 'c':
        blocos_refeicao_custom = []
        refeicoes = ["Café da Manhã ☕", "Almoço 🍽️", "Lanche da Tarde 🍎", "Jantar 🍲"]
        for nome_refeicao in refeicoes:
            while True:
                inicio = input(f"Início do {nome_refeicao} (HH:MM): ").strip()
                fim = input(f"Fim do {nome_refeicao} (HH:MM): ").strip()
                try:
                    parse_time_str(inicio)
                    parse_time_str(fim)
                    blocos_refeicao_custom.append(BlocoFixo(inicio, fim, nome_refeicao))
                    break
                except ValueError:
                    print("Formato de hora inválido. Use HH:MM.")
    
    return blocos, blocos_refeicao_custom


def main():
    print("="*50)
    print("       OTIMIZADOR DE ROTINA (PYTHON - FINAL)     ")
    print("="*50)

    cronotipo = input("Seu Cronotipo (matutino/vespertino): ").lower()
    if cronotipo not in ["matutino", "vespertino"]:
        cronotipo = "matutino"
    
    try:
        horas_sono = float(input("Meta de Horas de Sono (ex: 7.5): "))
        nivel_vicio_redes = int(input("Nível de Vício em Redes (1=baixo, 5=alto): "))
    except ValueError:
        horas_sono = 8
        nivel_vicio_redes = 3
        
    usuario = Usuario(cronotipo, horas_sono, nivel_vicio_redes)

    blocos_trabalho_fixo, blocos_refeicao_custom = coletar_blocos_fixos()
    tarefas = coletar_tarefas()
        
    # Chamada atualizada
    rotina_gerada, blocos_para_visual = calcular_rotina(usuario, tarefas, blocos_trabalho_fixo, blocos_refeicao_custom)
    
    # Processamento visual usando a lista de blocos fixos
    rotina_visual = processar_rotina_visual(rotina_gerada, blocos_para_visual)


    print("\n" + "#"*70)
    print(f"** ROTINA OTIMIZADA PARA CRONOTIPO: {usuario.cronotipo.upper()} **")
    print("#"*70)

    print(f"| {'Início':<6} | {'Fim':<4} | {'Duração':<7} | Atividade")
    print("|--------|------|---------|----------")
    
    for item in rotina_visual:
        try:
            duracao = int((parse_time_str(item['fim']) - parse_time_str(item['inicio'])).total_seconds() / 60)
        except:
             duracao = '-'
             
        print(f"| {item['inicio']:<6} | {item['fim']:<4} | {str(duracao):>4} min | {item['atividade']}")
    
    print("#"*70)

if __name__ == "__main__":
    main()