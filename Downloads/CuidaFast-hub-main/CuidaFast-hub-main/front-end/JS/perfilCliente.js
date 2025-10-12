// perfilCliente.js - Gerenciamento do perfil do cliente

document.addEventListener('DOMContentLoaded', function() {
    initProfile();
});

function initProfile() {
    loadUserProfile();
    initEditButtons();
    console.log('Perfil do cliente inicializado');
}

/**
 * Carrega os dados do usuário no perfil
 */
function loadUserProfile() {
    const userData = getUserDataFromStorage();
    
    if (!userData) {
        console.warn('Nenhum dado de usuário encontrado');
        return;
    }

    // Atualizar nome principal
    const profileName = document.querySelector('.profile-info h1');
    if (profileName) {
        profileName.textContent = userData.nome;
    }

    // Atualizar data de cadastro
    const memberSince = document.querySelector('.member-since');
    if (memberSince && userData.dataCadastro) {
        const date = new Date(userData.dataCadastro);
        const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                           'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        const monthName = monthNames[date.getMonth()];
        const year = date.getFullYear();
        
        if (userData.tipo === 'cuidador') {
            memberSince.textContent = `Cuidador desde ${monthName} de ${year}`;
        } else {
            memberSince.textContent = `Membro desde ${monthName} de ${year}`;
        }
    }

    // Atualizar informações pessoais
    updateInfoField('Nome Completo', userData.nome);
    updateInfoField('E-mail', userData.email);
    
    if (userData.telefone) {
        updateInfoField('Telefone', formatPhone(userData.telefone));
    }

    // Atualizar foto do perfil
    if (userData.photoURL) {
        const avatarImages = document.querySelectorAll('.avatar-img, .user-avatar-img, .dropdown-avatar');
        avatarImages.forEach(img => {
            img.src = userData.photoURL;
            img.alt = `Foto de ${userData.nome}`;
        });
    }

    console.log('Perfil carregado para:', userData.nome);
}

/**
 * Atualiza um campo de informação específico
 */
function updateInfoField(labelText, value) {
    const infoItems = document.querySelectorAll('.info-item');
    
    infoItems.forEach(item => {
        const label = item.querySelector('.info-label');
        const valueElement = item.querySelector('.info-value');
        
        if (label && valueElement && label.textContent.trim() === labelText) {
            valueElement.textContent = value;
        }
    });
}

/**
 * Formata número de telefone
 */
function formatPhone(phone) {
    // Remove caracteres não numéricos
    const cleaned = phone.replace(/\D/g, '');
    
    // Formata conforme o padrão brasileiro
    if (cleaned.length === 11) {
        return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 7)}-${cleaned.substring(7)}`;
    } else if (cleaned.length === 10) {
        return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 6)}-${cleaned.substring(6)}`;
    }
    
    return phone;
}

/**
 * Obtém dados do usuário do localStorage
 */
function getUserDataFromStorage() {
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
 * Inicializa botões de edição
 */
function initEditButtons() {
    const editButtons = document.querySelectorAll('.edit-link');
    
    editButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // O link já tem o href correto, apenas adiciona feedback visual
            console.log('Navegando para edição...');
        });
    });
}

/**
 * Inicializa botão de editar avatar
 */
const editAvatarBtn = document.querySelector('.edit-avatar-btn');
if (editAvatarBtn) {
    editAvatarBtn.addEventListener('click', function() {
        alert('Funcionalidade de upload de foto em desenvolvimento');
        // Aqui você pode implementar upload de imagem
    });
}
