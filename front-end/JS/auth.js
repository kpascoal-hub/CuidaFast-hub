// auth.js - Sistema de autenticação e gerenciamento de usuário

/**
 * Carrega os dados do usuário do localStorage
 * @returns {Object|null} Dados do usuário ou null se não estiver logado
 */
function getUserData() {
    try {
        const userData = localStorage.getItem('cuidafast_user');
        if (userData) {
            return JSON.parse(userData);
        }
    } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
    }
    return null;
}

/**
 * Verifica se o usuário está logado
 * @returns {boolean}
 */
function isLoggedIn() {
    return localStorage.getItem('cuidafast_isLoggedIn') === 'true' && getUserData() !== null;
}

/**
 * Atualiza os dados do usuário no localStorage
 * @param {Object} userData - Novos dados do usuário
 */
function updateUserData(userData) {
    try {
        localStorage.setItem('cuidafast_user', JSON.stringify(userData));
        console.log('Dados do usuário atualizados:', userData);
    } catch (error) {
        console.error('Erro ao atualizar dados do usuário:', error);
    }
}

/**
 * Faz logout do usuário
 */
function logout() {
    localStorage.removeItem('cuidafast_user');
    localStorage.removeItem('cuidafast_isLoggedIn');
    localStorage.removeItem('cuidafast_token');
    sessionStorage.clear();
    window.location.href = '../../index.html';
}

/**
 * Carrega e exibe o nome do usuário no header
 */
function loadUserNameInHeader() {
    const user = getUserData();
    if (!user) return;

    // Atualizar nome no botão do perfil
    const headerUserName = document.getElementById('headerUserName');
    if (headerUserName) {
        headerUserName.textContent = user.nome;
    }

    // Atualizar nome no dropdown
    const dropdownUserInfo = document.querySelector('.dropdown-user-info h4');
    if (dropdownUserInfo) {
        dropdownUserInfo.textContent = user.nome;
    }

    // Atualizar tipo de conta no dropdown
    const dropdownAccountType = document.querySelector('.dropdown-user-info p');
    if (dropdownAccountType && user.tipo) {
        if (user.tipo === 'cliente') {
            dropdownAccountType.textContent = 'Cliente Premium';
        } else if (user.tipo === 'cuidador') {
            dropdownAccountType.textContent = 'Cuidador Profissional';
        }
    }

    // Atualizar foto do perfil se disponível
    if (user.photoURL) {
        const avatarImages = document.querySelectorAll('.user-avatar-img, .dropdown-avatar');
        avatarImages.forEach(img => {
            img.src = user.photoURL;
        });
    }

    console.log('Nome do usuário carregado no header:', user.nome);
}

/**
 * Carrega e exibe os dados do usuário no perfil
 */
function loadUserDataInProfile() {
    const user = getUserData();
    if (!user) return;

    // Atualizar nome principal do perfil
    const profileTitle = document.querySelector('.profile-info h1');
    if (profileTitle) {
        profileTitle.textContent = user.nome;
    }

    // Atualizar nome completo nas informações
    const nomeCompletoValue = document.querySelector('.info-item .info-label:contains("Nome Completo") + .info-value');
    if (nomeCompletoValue) {
        nomeCompletoValue.textContent = user.nome;
    }

    // Buscar pelo label e atualizar o valor correspondente
    const infoItems = document.querySelectorAll('.info-item');
    infoItems.forEach(item => {
        const label = item.querySelector('.info-label');
        const value = item.querySelector('.info-value');
        
        if (label && value) {
            const labelText = label.textContent.trim();
            
            if (labelText === 'Nome Completo') {
                value.textContent = user.nome;
            } else if (labelText === 'E-mail') {
                value.textContent = user.email;
            } else if (labelText === 'Telefone' && user.telefone) {
                value.textContent = user.telefone;
            }
        }
    });

    // Atualizar foto do perfil
    const avatarImg = document.querySelector('.profile-avatar .avatar-img');
    if (avatarImg && user.photoURL) {
        avatarImg.src = user.photoURL;
    }

    console.log('Dados do usuário carregados no perfil:', user.nome);
}

/**
 * Carrega o nome de boas-vindas na home
 */
function loadWelcomeName() {
    const user = getUserData();
    if (!user) return;

    const welcomeNameEl = document.getElementById('welcomeName');
    if (welcomeNameEl) {
        welcomeNameEl.textContent = user.primeiroNome || user.nome.split(' ')[0];
    }

    console.log('Nome de boas-vindas carregado:', user.primeiroNome);
}

/**
 * Inicializa o sistema de autenticação na página
 */
function initAuth() {
    // Carregar dados do usuário no header (presente em todas as páginas)
    loadUserNameInHeader();

    // Carregar dados específicos da página
    if (document.querySelector('.profile-container')) {
        // Estamos na página de perfil
        loadUserDataInProfile();
    }

    if (document.getElementById('welcomeName')) {
        // Estamos na home
        loadWelcomeName();
    }

    // Configurar botão de logout
    const logoutButtons = document.querySelectorAll('#headerLogoutBtn, #logoutBtn, [data-action="logout"]');
    logoutButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('Tem certeza que deseja sair?')) {
                logout();
            }
        });
    });

    console.log('Sistema de autenticação inicializado');
}

// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuth);
} else {
    initAuth();
}

// Exportar funções para uso global
window.CuidaFastAuth = {
    getUserData,
    isLoggedIn,
    updateUserData,
    logout,
    loadUserNameInHeader,
    loadUserDataInProfile,
    loadWelcomeName,
    initAuth
};
