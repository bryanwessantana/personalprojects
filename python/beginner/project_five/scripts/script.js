/* --- JAVASCRIPT LOGIC --- */
        
// 1. Dados CSV em formato de String (hardcoded no JavaScript)
// Linhas separadas por \n (quebra de linha), colunas separadas por vírgula.
const CSV_STRING = `Country,Capital,Population (Millions),Continent
Brazil,Brasília,214,South America
Canada,Ottawa,38,North America
Japan,Tokyo,125,Asia
Nigeria,Abuja,211,Africa
France,Paris,67,Europe
Germany,Berlin,83,Europe`;

function parseCSV(csvString) {
    // Divide a string em linhas
    const lines = csvString.trim().split('\n');
    
    // CORREÇÃO DE SINTAXE: Adicionando o array vazio para 'data'
    if (lines.length === 0) return { headers: [], data: [] }; 

    // CORREÇÃO DE SINTAXE: Adicionando o separador ',' e as aspas
    const headers = lines[0].split(',');

    // As linhas restantes são os dados
    const data = [];
    for (let i = 1; i < lines.length; i++) {
        // Divide cada linha em células
        const cells = lines[i].split(',');
        // Garante que a linha tenha o mesmo número de colunas do cabeçalho
        if (cells.length === headers.length) {
            data.push(cells);
        }
    }

    return { headers, data };
}

function renderTable(headers, data) {
    const container = document.getElementById('table-container');
    
    // 1. Cria o elemento Tabela
    const table = document.createElement('table');
    table.className = 'data-table';
    
    // 2. Cria o Cabeçalho (Header Row)
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText.trim();
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // 3. Cria o Corpo da Tabela (Data Rows)
    const tbody = document.createElement('tbody');
    data.forEach(rowCells => {
        const tr = document.createElement('tr');
        rowCells.forEach(cellText => {
            const td = document.createElement('td');
            td.textContent = cellText.trim();
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    // 4. Insere a tabela no container
    container.innerHTML = ''; // Limpa "Loading data..."
    container.appendChild(table);
}

// --- Execução Principal ---
document.addEventListener('DOMContentLoaded', () => {
    const { headers, data } = parseCSV(CSV_STRING);
    if (data.length > 0) {
        renderTable(headers, data);
    } else {
        document.getElementById('table-container').innerHTML = '<p style="color: red;">Error: Could not parse or find data.</p>';
    }
});