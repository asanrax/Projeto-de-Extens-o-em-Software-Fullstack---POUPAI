// Função de Login de Usuário
function login() {
    // 1. Obter valores dos campos de login
    const user = document.getElementById('loginUser').value.trim();
    const pass = document.getElementById('loginPass').value;
    const messageElement = document.getElementById('message');

    // Limpar mensagens anteriores
    messageElement.textContent = '';
    messageElement.style.color = 'red';

    // Validação: Checar se os campos estão vazios
    if (!user || !pass) {
        messageElement.textContent = '⚠️ Por favor, preencha o usuário e a senha.';
        return;
    }

    // 2. Carregar a lista de usuários (a mesma que é usada no cadastro)
    let users;
    try {
        users = JSON.parse(localStorage.getItem('users')) || {};
    } catch (e) {
        users = {};
    }

    // 3. Verificar se o usuário existe
    if (!users.hasOwnProperty(user)) {
        messageElement.textContent = `❌ Usuário ou senha incorretos.`;
        // Para maior segurança, a mensagem de erro não deve especificar se foi o usuário ou a senha.
        return;
    }

    // 4. Verificar se a senha está correta
    // OBS: Como estamos simulando, a senha está salva em texto puro.
    // Em um sistema real, você compararia o hash da senha digitada com o hash salvo no banco de dados.
    if (users[user] === pass) {
        // 5. Sucesso!
        messageElement.textContent = `✅ Login bem-sucedido. Redirecionando...`;
        messageElement.style.color = 'green';

        // Simulação de autenticação (ex: salvar que o usuário está logado)
        localStorage.setItem('currentUser', user);

        // Redireciona após 1 segundo (simulação)
        setTimeout(() => {
             // Redireciona para a página do painel de controle
             window.location.href = 'dashboard.html'; 
        }, 1000);
        
    } else {
        // Senha incorreta
        messageElement.textContent = `❌ Usuário ou senha incorretos.`;
    }
}