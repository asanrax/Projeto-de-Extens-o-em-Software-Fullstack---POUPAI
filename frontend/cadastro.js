// ===================================================================
// FUNÇÃO DE CADASTRO (CRIA/ATUALIZA O LOCALSTORAGE)
// ===================================================================
function register() {
    const user = document.getElementById('registerUser').value.trim();
    const pass = document.getElementById('registerPass').value;
    const confirmPass = document.getElementById('confirmPass').value;
    const messageElement = document.getElementById('message');

    // Limpa e prepara o feedback
    messageElement.textContent = '';
    messageElement.style.color = 'red';

    if (!user || !pass || !confirmPass) {
        messageElement.textContent = '⚠️ Todos os campos de cadastro devem ser preenchidos.';
        return;
    }

    if (pass !== confirmPass) {
        messageElement.textContent = '❌ A senha e a confirmação de senha não coincidem.';
        return;
    }

    // Tenta carregar usuários existentes ou inicializa um objeto vazio ({})
    let users = JSON.parse(localStorage.getItem('users')) || {};
    
    // Verifica se o usuário já existe
    if (users.hasOwnProperty(user)) {
        messageElement.textContent = `❌ O usuário "${user}" já está cadastrado.`;
        return;
    }

    // Armazena o novo usuário
    users[user] = pass;
    
    // Salva a lista atualizada no localStorage
    try {
        localStorage.setItem('users', JSON.stringify(users));
        
        messageElement.textContent = `✅ Usuário "${user}" cadastrado com sucesso! Redirecionando...`;
        messageElement.style.color = 'green';
        
        // Limpa campos
        document.getElementById('registerUser').value = '';
        document.getElementById('registerPass').value = '';
        document.getElementById('confirmPass').value = '';
        
        // Redireciona para metas.html após 2 segundos
        setTimeout(() => {
             window.location.href = 'metas.html';
        }, 2000);

    } catch (e) {
        messageElement.textContent = '❌ Erro ao salvar o usuário. Tente novamente.';
    }
}

// ===================================================================
// FUNÇÃO DE LOGIN (LÊ O LOCALSTORAGE)
// ===================================================================
function login() {
    const user = document.getElementById('loginUser').value.trim();
    const pass = document.getElementById('loginPass').value;
    const messageElement = document.getElementById('message');

    // Limpa e prepara o feedback
    messageElement.textContent = '';
    messageElement.style.color = 'red';

    if (!user || !pass) {
        messageElement.textContent = '⚠️ Por favor, preencha o usuário e a senha.';
        return;
    }

    // Carrega a lista de usuários do localStorage
    let users = JSON.parse(localStorage.getItem('users')) || {};

    // Verifica login
    if (!users.hasOwnProperty(user) || users[user] !== pass) {
        messageElement.textContent = `❌ Usuário ou senha incorretos.`;
        return;
    }

    // Sucesso!
    messageElement.textContent = `✅ Login bem-sucedido. Redirecionando...`;
    messageElement.style.color = 'green';
    
    // Salva o usuário logado (simulação de sessão)
    localStorage.setItem('currentUser', user);

    // Redireciona para dashboard.html após 1 segundo
    setTimeout(() => {
         window.location.href = 'dashboard.html';
    }, 1000);
}