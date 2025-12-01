/* --- JAVASCRIPT LOGIC --- */

/**
 * Função para analisar a string CSV e retornar cabeçalhos e dados.
 * (Mantida a lógica original de parsing)
 */
function parseCSV(csvString) {
    // Divide a string em linhas
    const lines = csvString.trim().split('\n');
    
    if (lines.length === 0) return { headers: [], data: [] }; 

    // O cabeçalho é a primeira linha
    const headers = lines[0].split(',').map(h => h.trim());

    // As linhas restantes são os dados
    const data = [];
    for (let i = 1; i < lines.length; i++) {
        // Divide cada linha em células
        const cells = lines[i].split(',').map(c => c.trim());
        // Garante que a linha tenha o mesmo número de colunas do cabeçalho
        if (cells.length === headers.length) {
            data.push(cells);
        }
    }

    return { headers, data };
}

/**
 * Função para renderizar a tabela no container.
 * (Lógica original mantida)
 */
function renderTable(headers, data) {
    const container = document.getElementById('table-container');
    container.innerHTML = ''; // Limpa o conteúdo anterior
    
    if (data.length === 0) {
         container.innerHTML = '<p style="color: orange; text-align: center;">O arquivo CSV está vazio ou contém apenas o cabeçalho.</p>';
         return;
    }

    const table = document.createElement('table');
    table.className = 'data-table';
    
    // Cria o Cabeçalho (Header Row)
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Cria o Corpo da Tabela (Data Rows)
    const tbody = document.createElement('tbody');
    data.forEach(rowCells => {
        const tr = document.createElement('tr');
        rowCells.forEach(cellText => {
            const td = document.createElement('td');
            td.textContent = cellText;
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    // Insere a tabela no container
    container.appendChild(table);
}

// --- Nova Lógica de Upload ---
document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('csv-file');
    const container = document.getElementById('table-container');

    // Evento disparado quando o usuário seleciona um arquivo
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        
        if (!file) {
            container.innerHTML = '<p>Aguardando upload do arquivo CSV...</p>';
            return;
        }

        // Verifica se o tipo de arquivo é CSV (uma segurança extra)
        if (!file.name.endsWith('.csv')) {
             container.innerHTML = '<p style="color: red; text-align: center;">Erro: Por favor, selecione um arquivo com a extensão .csv.</p>';
             return;
        }

        const reader = new FileReader();

        // Esta função é executada após a leitura do arquivo ser concluída
        reader.onload = function(e) {
            const csvText = e.target.result;
            
            try {
                // 1. Analisa os dados
                const { headers, data } = parseCSV(csvText);
                
                // 2. Renderiza a tabela
                renderTable(headers, data);
            } catch (error) {
                console.error("Erro ao processar CSV:", error);
                 container.innerHTML = '<p style="color: red; text-align: center;">Erro ao ler o arquivo CSV. Verifique o formato.</p>';
            }
        };

        // Começa a ler o conteúdo do arquivo como uma string de texto
        container.innerHTML = '<p style="text-align: center;">Processando...</p>';
        reader.readAsText(file);
    });

    // Código de execução principal original removido, pois agora depende do upload.
    // O container já mostra a mensagem de "Aguardando..." por padrão.
});