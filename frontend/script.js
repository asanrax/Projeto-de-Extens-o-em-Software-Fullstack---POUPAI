// Variável global para armazenar as categorias (lidas do localStorage)
let categorias = [];

// Variáveis para armazenar as instâncias dos gráficos
let cashFlowChartInstance = null;
let categoryChartInstance = null;

// ===============================================
// 1. GESTÃO DE CATEGORIAS (Modal e Lista)
// ===============================================

/**
 * Carrega as categorias do localStorage ou usa dados de exemplo.
 */
function carregarCategorias() {
    try {
        const storedCategories = localStorage.getItem('financeiroCategorias');
        categorias = storedCategories ? JSON.parse(storedCategories) : [
            // Categorias de exemplo (default)
            { nome: 'Alimentação', gasto: 1500, orcamento: 1650, tipo: 'Despesa' },
            { nome: 'Transporte', gasto: 1000, orcamento: 900, tipo: 'Despesa' }, 
            { nome: 'Salário', gasto: 5000, orcamento: 5000, tipo: 'Receita' }
        ];
        renderizarCategorias();
        atualizarResumoDashboard();
        atualizarGraficos(); 
    } catch (e) {
        console.error("Erro ao carregar categorias do localStorage:", e);
        categorias = []; 
        renderizarCategorias();
        atualizarResumoDashboard();
    }
}

/**
 * Salva as categorias atuais no localStorage.
 */
function salvarCategorias() {
    localStorage.setItem('financeiroCategorias', JSON.stringify(categorias));
}

/**
 * Abre o modal de adição de categoria.
 */
function abrirModal() {
    document.getElementById('modal').style.display = 'flex'; 
}

/**
 * Fecha o modal de adição de categoria.
 */
function fecharModal() {
    document.getElementById('modal').style.display = 'none';
    // Limpar campos
    document.getElementById('nomeCategoria').value = '';
    document.getElementById('gastoCategoria').value = '';
    document.getElementById('orcamentoCategoria').value = '';
}

/**
 * Adiciona uma nova categoria à lista.
 */
function adicionarCategoria() {
    const nome = document.getElementById('nomeCategoria').value.trim();
    const gasto = parseFloat(document.getElementById('gastoCategoria').value);
    const orcamento = parseFloat(document.getElementById('orcamentoCategoria').value);

    if (!nome || isNaN(gasto) || isNaN(orcamento)) {
        alert('Por favor, preencha todos os campos com valores válidos.');
        return;
    }

    // Lógica para determinar o tipo (Receita vs. Despesa)
    const tipo = nome.toLowerCase().includes('salário') || 
                  nome.toLowerCase().includes('receita') || 
                  nome.toLowerCase().includes('freelance') ? 'Receita' : 'Despesa'; 
    
    categorias.push({ nome, gasto, orcamento, tipo });

    salvarCategorias();
    renderizarCategorias();
    // ESSENCIAL: Estas chamadas atualizam a Renda, Saldo e Gráficos após adicionar o salário/receita.
    atualizarResumoDashboard();
    atualizarGraficos();
    fecharModal();
}

/**
 * Remove uma categoria pelo seu índice.
 */
function removerCategoria(index) {
    if (confirm(`Tem certeza que deseja remover a categoria ${categorias[index].nome}?`)) {
        categorias.splice(index, 1);
        salvarCategorias();
        renderizarCategorias();
        atualizarResumoDashboard();
        atualizarGraficos();
    }
}

/**
 * Renderiza os boxes de categorias na seção 'categoriaGrid'.
 */
function renderizarCategorias() {
    const grid = document.getElementById('categoriaGrid');
    grid.innerHTML = ''; 

    categorias.forEach((item, index) => {
        // Evita divisão por zero
        const percentual = item.orcamento > 0 ? (item.gasto / item.orcamento) * 100 : 0;
        
        // Define a classe de status 
        let statusClass = item.tipo === 'Receita' ? 'neutro' : (percentual > 100 ? 'alerta' : 'ok');

        const progressValue = Math.min(percentual, 100);
        
        const categoriaBox = document.createElement('div');
        categoriaBox.className = `categoria-card ${statusClass}`;
        
        categoriaBox.innerHTML = `
            <h3>${item.nome} (${item.tipo})</h3>
            <p>Gasto: R$ ${item.gasto.toFixed(2).replace('.', ',')}</p>
            <p>Orçamento: R$ ${item.orcamento.toFixed(2).replace('.', ',')}</p>
            <div class="progress-bar-container">
                <progress value="${progressValue.toFixed(1)}" max="100"></progress>
                <span class="percentual">${percentual.toFixed(1)}%</span>
            </div>
            <button onclick="removerCategoria(${index})" class="btn-excluir">X</button>
        `;
        grid.appendChild(categoriaBox);
    });
}


// ===============================================
// 2. ATUALIZAÇÃO DO RESUMO E CARDS
// ===============================================

/**
 * Formatação de moeda para ser usada nos cards.
 */
const formatarMoeda = (valor) => `R$ ${valor.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;

/**
 * Calcula e atualiza os cards de resumo e a seção de resumo de categorias.
 */
function atualizarResumoDashboard() {
    let totalReceitas = 0;
    let totalDespesas = 0;
    let dentroOrcamento = 0;
    let acimaOrcamento = 0;

    categorias.forEach(item => {
        if (item.tipo === 'Receita') {
            totalReceitas += item.gasto;
        } else {
            totalDespesas += item.gasto;
            const percentual = (item.gasto / item.orcamento) * 100;
            if (percentual <= 100) {
                dentroOrcamento++;
            } else {
                acimaOrcamento++;
            }
        }
    });

    const saldoTotal = totalReceitas - totalDespesas;
    // Evita divisão por zero
    const taxaEconomia = totalReceitas > 0 ? (saldoTotal / totalReceitas) * 100 : 0; 
    
    // ⭐️ ATUALIZAÇÃO COM IDs para garantir a sobreposição do HTML Fixo ⭐️
    const saldoElement = document.getElementById('saldoTotal');
    const receitasElement = document.getElementById('totalReceitas');
    const despesasElement = document.getElementById('totalDespesas');
    const economiaElement = document.getElementById('taxaEconomia');
    
    // Verifica se os IDs existem antes de tentar atualizar
    if (saldoElement) saldoElement.textContent = `Saldo Total: ${formatarMoeda(saldoTotal)}`;
    if (receitasElement) receitasElement.textContent = `Receitas: ${formatarMoeda(totalReceitas)}`;
    if (despesasElement) despesasElement.textContent = `Despesas: ${formatarMoeda(totalDespesas)}`;
    if (economiaElement) economiaElement.textContent = `Taxa de Economia: ${taxaEconomia.toFixed(1)}%`;


    // Atualiza o resumo das categorias
    const totalCategoriasElement = document.getElementById('totalCategorias');
    const dentroOrcamentoElement = document.getElementById('dentroOrcamento');
    const acimaOrcamentoElement = document.getElementById('acimaOrcamento');
    
    if (totalCategoriasElement) totalCategoriasElement.textContent = categorias.filter(c => c.tipo === 'Despesa').length;
    if (dentroOrcamentoElement) dentroOrcamentoElement.textContent = dentroOrcamento;
    if (acimaOrcamentoElement) acimaOrcamentoElement.textContent = acimaOrcamento;
    
    atualizarSecaoBudget();
}

/**
 * Atualiza dinamicamente a seção de Controle de Orçamento (Budget).
 */
function atualizarSecaoBudget() {
    const budgetSection = document.querySelector('.budget');
    if (!budgetSection) return; // Se a seção não existir, sai da função.
    
    const despesas = categorias.filter(c => c.tipo === 'Despesa');
    
    let budgetContent = '<h2>Controle de Orçamento</h2>';
    
    despesas.forEach(item => {
        const percentual = item.orcamento > 0 ? (item.gasto / item.orcamento) * 100 : 0;
        const progressValue = Math.min(percentual, 100);
        
        // Define a cor do progress bar 
        const statusClass = percentual > 100 ? 'alerta' : 'ok';

        budgetContent += `
            <div class="budget-item">
                <label>${item.nome}: R$ ${item.gasto.toFixed(2).replace('.', ',')} / R$ ${item.orcamento.toFixed(2).replace('.', ',')}</label>
                <progress value="${progressValue.toFixed(1)}" max="100" class="${statusClass}"></progress> ${percentual.toFixed(1)}%
            </div>
        `;
    });
    
    if (despesas.length === 0) {
        budgetContent += '<p>Adicione categorias de despesa para ver o controle de orçamento.</p>';
    }
    
    budgetSection.innerHTML = budgetContent;
}

// ===============================================
// 3. GRÁFICOS (Chart.js)
// ===============================================

/**
 * Cria ou atualiza os gráficos Chart.js
 */
function atualizarGraficos() {
    const despesas = categorias.filter(c => c.tipo === 'Despesa');
    const receitas = categorias.filter(c => c.tipo === 'Receita');
    
    // --- Dados para o Gráfico de Despesas por Categoria (Doughnut Chart) ---
    const categoryLabels = despesas.map(c => c.nome);
    const categoryData = despesas.map(c => c.gasto);

    // --- Dados para o Gráfico de Fluxo de Caixa (Bar Chart) ---
    const totalReceitas = receitas.reduce((sum, item) => sum + item.gasto, 0);
    const totalDespesas = despesas.reduce((sum, item) => sum + item.gasto, 0);

    // 1. Gráfico de Gastos por Categoria (Doughnut Chart)
    const ctxCategory = document.getElementById('categoryChart')?.getContext('2d');
    if (ctxCategory) {
        if (categoryChartInstance) {
            categoryChartInstance.destroy();
        }
        
        categoryChartInstance = new Chart(ctxCategory, {
            type: 'doughnut',
            data: {
                labels: categoryLabels,
                datasets: [{
                    data: categoryData,
                    // Usei as cores originais da sua versão
                    backgroundColor: [
                        '#333333', '#555555', '#777777', '#999999', '#AAAAAA', '#CCCCCC', '#DDDDDD',
                    ],
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'top' },
                    title: { display: true, text: 'Distribuição dos Gastos' }
                }
            }
        });
    }

    // 2. Gráfico de Fluxo de Caixa Mensal (Bar Chart)
    const ctxCashFlow = document.getElementById('cashFlowChart')?.getContext('2d');
    if (ctxCashFlow) {
        if (cashFlowChartInstance) {
            cashFlowChartInstance.destroy();
        }

        cashFlowChartInstance = new Chart(ctxCashFlow, {
            type: 'bar',
            data: {
                labels: ['Receitas', 'Despesas', 'Saldo'],
                datasets: [{
                    label: 'Valores (R$)',
                    data: [totalReceitas, totalDespesas, totalReceitas - totalDespesas],
                    // Usei as cores originais da sua versão
                    backgroundColor: [
                        '#555555', // Receitas 
                        '#AA0000', // Despesas 
                        '#333333'  // Saldo 
                    ],
                    borderColor: [
                        '#333',
                        '#880000',
                        '#111'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: { y: { beginAtZero: true } },
                plugins: {
                    legend: { display: false },
                    title: { display: true, text: 'Receitas vs Despesas vs Saldo' }
                }
            }
        });
    }
}

// ===============================================
// 4. GESTÃO DE USUÁRIOS (Para Dashboard Administrador)
// ===============================================

/**
 * Carrega os dados dos usuários via API.
 */
async function carregarUsuarios() {
    try {
        const response = await fetch('/api/usuarios');
        if (!response.ok) {
            throw new Error('Erro ao buscar usuários');
        }
        const usuarios = await response.json();
        renderizarDadosUsuarios(usuarios);
    } catch (error) {
        console.error('Erro ao carregar usuários:', error);
        document.getElementById('dadosUsuariosTable').innerHTML = '<p>Erro ao carregar usuários.</p>';
    }
}

/**
 * Renderiza a tabela de dados dos usuários com todas as informações do cadastro.
 */
function renderizarDadosUsuarios(usuarios) {
    const table = document.getElementById('dadosUsuariosTable');
    table.innerHTML = '';

    if (usuarios.length === 0) {
        table.innerHTML = '<p>Nenhum usuário encontrado.</p>';
        return;
    }

    // Criar tabela
    const tableElement = document.createElement('table');
    tableElement.className = 'dados-usuarios-table';
    tableElement.style.width = '100%';
    tableElement.style.borderCollapse = 'collapse';
    tableElement.innerHTML = `
        <thead>
            <tr>
                <th style="border: 1px solid #ddd; padding: 8px;">ID</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Nome</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Email</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Telefone</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Profissão</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Renda Mensal</th>
                <th style="border: 1px solid #ddd; padding: 8px;">% Gasto Sugerido</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Valor Sugerido</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Gasto</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Motivo Juntar</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Benefício</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Objetivo</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Reserva</th>
                <th style="border: 1px solid #ddd; padding: 8px;">CPF</th>
                <th style="border: 1px solid #ddd; padding: 8px;">RG</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Nascimento</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Estado Civil</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Endereço</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Gráfico</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;

    const tbody = tableElement.querySelector('tbody');

    usuarios.forEach((usuario, index) => {
        const id = `#${String(index + 1).padStart(8, '0')}`;
        const valorSugerido = usuario.renda ? (usuario.renda * (usuario.porcentagem / 100)).toFixed(2) : '0.00';

        const row = document.createElement('tr');

        row.innerHTML = `
            <td style="border: 1px solid #ddd; padding: 8px;">${id}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${usuario.nome || ''}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${usuario.email || ''}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${usuario.telefone || ''}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${usuario.profissao || ''}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">R$ ${(usuario.renda || 0).toFixed(2).replace('.', ',')}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${usuario.porcentagem || 0}%</td>
            <td style="border: 1px solid #ddd; padding: 8px;">R$ ${valorSugerido.replace('.', ',')}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${usuario.gasto || ''}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${usuario.motivo_juntar || ''}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${usuario.beneficio || ''}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${usuario.objetivo || ''}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${usuario.reserva || ''}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${usuario.cpf || ''}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${usuario.rg || ''}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${usuario.nascimento || ''}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${usuario.estado_civil || ''}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${usuario.endereco || ''}</td>
            <td style="border: 1px solid #ddd; padding: 8px;"><canvas id="chart-${index}" width="100" height="50"></canvas></td>
        `;

        tbody.appendChild(row);
    });

    table.appendChild(tableElement);

    // Criar gráficos para cada usuário após renderizar a tabela
    usuarios.forEach((usuario, index) => {
        const canvas = document.getElementById(`chart-${index}`);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        // Calcular valores para o gráfico
        const gasto = parseFloat(usuario.gasto) || 0;
        const reserva = parseFloat(usuario.reserva) || 0;
        const renda = parseFloat(usuario.renda) || 0;
        const disponivel = Math.max(0, renda - gasto - reserva);

        // Dados para o doughnut chart
        const data = [gasto, reserva, disponivel];
        const labels = ['Gasto', 'Reserva', 'Disponível'];
        const colors = ['#FF6384', '#36A2EB', '#4BC0C0']; // Cores coloridas

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: false,
                plugins: {
                    legend: { display: false },
                    title: { display: false }
                }
            }
        });
    });
}

/**
 * Atualiza o gráfico pequeno dos usuários com gastos e lucro.
 */
function atualizarGraficoUsuarios(usuarios) {
    const ctx = document.getElementById('usersChart')?.getContext('2d');
    if (!ctx) return;

    // Calcular totais de gastos e lucros dos usuários
    let totalGastos = 0;
    let totalLucros = 0;

    usuarios.forEach(usuario => {
        if (usuario.gasto) {
            totalGastos += parseFloat(usuario.gasto) || 0;
        }
        if (usuario.renda && usuario.porcentagem) {
            const lucro = usuario.renda * (usuario.porcentagem / 100);
            totalLucros += lucro;
        }
    });

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Gastos', 'Lucros'],
            datasets: [{
                data: [totalGastos, totalLucros],
                backgroundColor: ['#FF6384', '#36A2EB'],
                hoverOffset: 4
            }]
        },
        options: {
            responsive: false,
            plugins: {
                legend: { display: false },
                title: { display: false }
            }
        }
    });
}

// ===============================================
// 5. UTILIDADES E INICIALIZAÇÃO
// ===============================================

/**
 * Carrega o nome do usuário logado e exibe no header.
 */
function carregarNomeUsuario() {
    const userNameDisplay = document.getElementById('userNameDisplay');
    const currentUser = localStorage.getItem('currentUser'); 
    
    if (userNameDisplay) {
        // Exibe o primeiro nome ou 'Visitante'
        userNameDisplay.textContent = currentUser ? currentUser.split(' ')[0] : 'Visitante';
    }
}

/**
 * Limpa a sessão (localStorage).
 * Tornada acessível globalmente para uso no onclick do HTML.
 */
function logout() {
    localStorage.removeItem('currentUser'); 
    localStorage.removeItem('perfil_logado'); 
    alert('Sessão encerrada com sucesso!');
    // Redireciona para a página de login/índice
    window.location.href = 'index.html'; 
}

// Funções utilitárias (mantidas para compatibilidade, embora possam não ser usadas nesta página)
function fecharSidebar() {}
function handleOutsideClick(event) {}
document.addEventListener('click', handleOutsideClick);
function toggleOutros(selectId, inputId) {}
function habilitarBotao() {}
function validarCadastro() { return true; }


// Garante que as funções de carregamento sejam executadas após o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', () => {
    carregarCategorias();
    carregarNomeUsuario();
    carregarUsuarios(); // Carregar usuários para o dashboard administrador
});
