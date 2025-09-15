// ===== CUIDA FAST - FUNCIONALIDADES DO CLIENTE =====

// Aguardar carregamento do DOM
document.addEventListener('DOMContentLoaded', function() {
    initClientDashboard();
});

// Inicializar dashboard do cliente
function initClientDashboard() {
    initSidebar();
    initUserMenu();
    initNotifications();
    initModals();
    initSearch();
    initQuickActions();
    
    console.log('Client - Dashboard do cliente inicializado');
}

// ===== SIDEBAR =====
function initSidebar() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const userAvatar = document.getElementById('user-avatar'); // <-- peguei o bonequinho aqui
    
    if (sidebarToggle && sidebar && mainContent && userAvatar) {
        // Toggle sidebar
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('open');
            mainContent.classList.toggle('sidebar-open');

            if (sidebar.classList.contains('open')) {
                userAvatar.style.display = "none";   // esconde quando abre
            } else {
                userAvatar.style.display = "block";  // mostra quando fecha
            }
        });
        
        // Fechar sidebar ao clicar fora (mobile)
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 992) {
                if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                    sidebar.classList.remove('open');
                    mainContent.classList.remove('sidebar-open');
                    userAvatar.style.display = "block"; // mostra de volta
                }
            }
        });
        
        // Auto-abrir sidebar em desktop
        function handleResize() {
            if (window.innerWidth > 992) {
                sidebar.classList.add('open');
                mainContent.classList.add('sidebar-open');
                userAvatar.style.display = "none"; // já esconde no desktop
            } else {
                sidebar.classList.remove('open');
                mainContent.classList.remove('sidebar-open');
                userAvatar.style.display = "block"; // mostra no mobile
            }
        }
        
        window.addEventListener('resize', handleResize);
        handleResize(); // Executar na inicialização
    }
}


// ===== USER MENU =====

function initUserMenu() {
    const userMenu = document.getElementById('userMenu');
    const userAvatarBtn = document.getElementById('userAvatarBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (userMenu && userAvatarBtn) {
        // Toggle dropdown
        userAvatarBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            userMenu.classList.toggle('open');
        });
        
        // Fechar dropdown ao clicar fora
        document.addEventListener('click', function() {
            userMenu.classList.remove('open');
        });
        
        if (userMenu.classList.toggle('open') == true {
        userAvatarBtn.addEventListener('click', function() {
            userMenu.classList.remove('open');
        });}
        
        // Prevenir fechamento ao clicar dentro do dropdown
        userMenu.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogout();
        });
    }
}

function handleLogout() {
    if (confirm('Tem certeza que deseja sair?')) {
        // Limpar dados do usuário
        localStorage.removeItem('cuidafast_user');
        localStorage.removeItem('cuidafast_token');
        sessionStorage.removeItem('cuidafast_user');
        sessionStorage.removeItem('cuidafast_token');
        
        // Redirecionar para login
        window.location.href = '../login.html';
    }
}

// ===== NOTIFICAÇÕES =====

function initNotifications() {
    const notificationBtn = document.getElementById('notificationBtn');
    
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function() {
            window.location.href = 'notificacao-cliente.html';
        });
    }
    
    // Simular atualização de notificações
    updateNotificationCount();
    setInterval(updateNotificationCount, 30000); // Atualizar a cada 30 segundos
}

function updateNotificationCount() {
    const badge = document.querySelector('.notification-badge');
    const navBadges = document.querySelectorAll('.nav-badge');
    
    // Simular contagem de notificações
    const notificationCount = Math.floor(Math.random() * 5) + 1;
    const messageCount = Math.floor(Math.random() * 3) + 1;
    
    if (badge) {
        badge.textContent = notificationCount;
        badge.style.display = notificationCount > 0 ? 'block' : 'none';
    }
    
    // Atualizar badges na sidebar
    navBadges.forEach(badge => {
        const link = badge.closest('.nav-link');
        if (link && link.href.includes('mensagens')) {
            badge.textContent = messageCount;
            badge.style.display = messageCount > 0 ? 'block' : 'none';
        } else if (link && link.href.includes('notificacao')) {
            badge.textContent = notificationCount;
            badge.style.display = notificationCount > 0 ? 'block' : 'none';
        }
    });
}

// ===== MODAIS =====

function initModals() {
    initFindCuidadorModal();
}

function initFindCuidadorModal() {
    const findCuidadorBtn = document.getElementById('findCuidadorBtn');
    const findCuidadorModal = document.getElementById('findCuidadorModal');
    const closeFindCuidadorModal = document.getElementById('closeFindCuidadorModal');
    const findCuidadorForm = document.getElementById('findCuidadorForm');
    
    // Abrir modal
    if (findCuidadorBtn && findCuidadorModal) {
        findCuidadorBtn.addEventListener('click', function() {
            openModal(findCuidadorModal);
            
            // Definir data mínima como hoje
            const dateInput = document.getElementById('serviceDate');
            if (dateInput) {
                const today = new Date().toISOString().split('T')[0];
                dateInput.min = today;
                dateInput.value = today;
            }
        });
    }
    
    // Fechar modal
    if (closeFindCuidadorModal && findCuidadorModal) {
        closeFindCuidadorModal.addEventListener('click', function() {
            closeModal(findCuidadorModal);
        });
    }
    
    // Processar formulário
    if (findCuidadorForm) {
        findCuidadorForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFindCuidador();
        });
    }
}

async function handleFindCuidador() {
    const serviceType = document.getElementById('serviceType').value;
    const serviceDate = document.getElementById('serviceDate').value;
    const serviceTime = document.getElementById('serviceTime').value;
    const serviceDuration = document.getElementById('serviceDuration').value;
    
    if (!serviceType || !serviceDate || !serviceTime || !serviceDuration) {
        showAlert('Por favor, preencha todos os campos.', 'error');
        return;
    }
    
    try {
        // Simular busca de cuidadores
        showAlert('Buscando cuidadores disponíveis...', 'info');
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Fechar modal
        closeModal(document.getElementById('findCuidadorModal'));
        
        // Simular redirecionamento para página de resultados
        showAlert('Encontramos 12 cuidadores disponíveis! Redirecionando...', 'success');
        
        setTimeout(() => {
            // Em produção, redirecionar para página de resultados
            console.log('Redirecionando para resultados da busca...');
        }, 2000);
        
    } catch (error) {
        console.error('Erro ao buscar cuidadores:', error);
        showAlert('Erro ao buscar cuidadores. Tente novamente.', 'error');
    }
}

// ===== BUSCA =====

function initSearch() {
    const searchInput = document.getElementById('searchInput');
    
    if (searchInput) {
        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            const query = this.value.trim();
            
            if (query.length >= 3) {
                searchTimeout = setTimeout(() => {
                    performSearch(query);
                }, 500);
            }
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const query = this.value.trim();
                if (query.length >= 3) {
                    performSearch(query);
                }
            }
        });
    }
}

function performSearch(query) {
    console.log('Buscando por:', query);
    
    // Simular busca
    showAlert(`Buscando por "${query}"...`, 'info');
    
    // Em produção, fazer chamada à API e mostrar resultados
    setTimeout(() => {
        showAlert(`Encontrados resultados para "${query}"`, 'success');
    }, 1000);
}

// ===== AÇÕES RÁPIDAS =====

function initQuickActions() {
    const inTimeBtn = document.getElementById('inTimeBtn');
    
    if (inTimeBtn) {
        inTimeBtn.addEventListener('click', function() {
            window.location.href = 'in-time.html';
        });
    }
    
    // Inicializar outros botões de ação rápida
    initAppointmentActions();
    initCaregiverActions();
}

function initAppointmentActions() {
    // Botões de reagendar
    document.querySelectorAll('.appointment-actions .btn-outline').forEach(btn => {
        btn.addEventListener('click', function() {
            const appointmentItem = this.closest('.appointment-item');
            const caregiverName = appointmentItem.querySelector('h4').textContent;
            
            if (confirm(`Reagendar compromisso com ${caregiverName}?`)) {
                showAlert('Redirecionando para reagendamento...', 'info');
                // Em produção, redirecionar para página de reagendamento
            }
        });
    });
    
    // Botões de mensagem
    document.querySelectorAll('.appointment-actions .btn-primary').forEach(btn => {
        btn.addEventListener('click', function() {
            const appointmentItem = this.closest('.appointment-item');
            const caregiverName = appointmentItem.querySelector('h4').textContent;
            
            showAlert(`Abrindo conversa com ${caregiverName}...`, 'info');
            setTimeout(() => {
                window.location.href = 'mensagens.html';
            }, 1000);
        });
    });
}

function initCaregiverActions() {
    // Botões de contratar cuidador
    document.querySelectorAll('.caregiver-card .btn-primary').forEach(btn => {
        btn.addEventListener('click', function() {
            const caregiverCard = this.closest('.caregiver-card');
            const caregiverName = caregiverCard.querySelector('h4').textContent;
            
            showAlert(`Iniciando contratação de ${caregiverName}...`, 'info');
            
            // Simular processo de contratação
            setTimeout(() => {
                if (confirm(`Contratar ${caregiverName}?`)) {
                    showAlert('Redirecionando para contratação...', 'success');
                    // Em produção, redirecionar para página de contratação
                }
            }, 1000);
        });
    });
}

// ===== UTILITÁRIOS =====

function openModal(modal) {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Focar no primeiro input
    const firstInput = modal.querySelector('input, select, textarea');
    if (firstInput) {
        setTimeout(() => firstInput.focus(), 100);
    }
}

function closeModal(modal) {
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

function showAlert(message, type = 'info') {
    // Usar a função global do main.js se disponível
    if (window.CuidaFast && window.CuidaFast.showAlert) {
        window.CuidaFast.showAlert(message, type);
        return;
    }
    
    // Fallback simples
    alert(message);
}

// ===== DADOS SIMULADOS =====

// Simular carregamento de dados do usuário
function loadUserData() {
    // Em produção, carregar dados reais da API
    const userData = {
        name: 'João Silva',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
        stats: {
            appointments: 12,
            favorites: 5,
            rating: 4.8,
            spent: 1240
        }
    };
    
    return userData;
}

// Simular carregamento de atividades recentes
function loadRecentActivities() {
    return [
        {
            type: 'completed',
            title: 'Serviço concluído',
            description: 'Maria Santos cuidou da sua mãe por 4 horas',
            time: 'Há 2 horas',
            icon: 'check-circle'
        },
        {
            type: 'scheduled',
            title: 'Novo agendamento',
            description: 'Agendamento com Ana Costa para amanhã às 14h',
            time: 'Há 5 horas',
            icon: 'calendar-plus'
        },
        {
            type: 'review',
            title: 'Avaliação enviada',
            description: 'Você avaliou Carlos Oliveira com 5 estrelas',
            time: 'Ontem',
            icon: 'star'
        }
    ];
}

// ===== VERIFICAÇÃO DE AUTENTICAÇÃO =====

function checkAuthentication() {
    const token = localStorage.getItem('cuidafast_token') || sessionStorage.getItem('cuidafast_token');
    const user = localStorage.getItem('cuidafast_user') || sessionStorage.getItem('cuidafast_user');
    
    if (!token || !user) {
        // Redirecionar para login se não estiver autenticado
        window.location.href = '../login.html';
        return false;
    }
    
    return true;
}

// Verificar autenticação na inicialização
document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
});

// ===== EXPORTAR FUNÇÕES =====

window.CuidaFastClient = {
    openModal: openModal,
    closeModal: closeModal,
    showAlert: showAlert,
    loadUserData: loadUserData,
    loadRecentActivities: loadRecentActivities,
    handleLogout: handleLogout
};

