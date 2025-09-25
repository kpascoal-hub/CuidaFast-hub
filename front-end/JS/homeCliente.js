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



// ===== EXPORTAR FUNÇÕES =====

window.CuidaFastClient = {
    openModal: openModal,
    closeModal: closeModal,
    showAlert: showAlert,
    loadUserData: loadUserData,
    loadRecentActivities: loadRecentActivities,
    handleLogout: handleLogout
};

// ===== HOME CLIENTE (página específica) =====
// Código migrado do inline script de front-end/HTML/homeCliente.html
// Mantido em namespace para evitar colisões com funções globais existentes aqui.

(function() {
  const HomeCliente = {
    init() {
      this.initSidebar();
      this.loadUserData();
      this.loadCaregivers();
      this.initFilters();
      this.initCategorySelection();
      this.initLoadMore();
      this.initLogout();
      console.log('HomeCliente inicializada');
    },

    // Sidebar desta página (usa ids: menuToggle, clientSidebar, sidebarOverlay)
    initSidebar() {
      const menuToggle = document.getElementById('menuToggle');
      const sidebar = document.getElementById('clientSidebar');
      const overlay = document.getElementById('sidebarOverlay');
      if (!menuToggle || !sidebar || !overlay) return;

      menuToggle.addEventListener('click', () => {
        sidebar.classList.add('open');
        overlay.classList.add('active');
      });

      overlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
      });

      const navLinks = sidebar.querySelectorAll('.nav-link');
      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          if (window.innerWidth <= 768) {
            sidebar.classList.remove('open');
            overlay.classList.remove('active');
          }
        });
      });
    },

    loadUserData() {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const defaultUser = { name: 'João Silva', firstName: 'João' };
      const user = { ...defaultUser, ...userData };

      const userNameEl = document.getElementById('userName');
      const welcomeNameEl = document.getElementById('welcomeName');
      if (userNameEl) userNameEl.textContent = user.name;
      if (welcomeNameEl) welcomeNameEl.textContent = user.firstName;
    },

    loadCaregivers() {
      const caregivers = [
        { id: 1, name: 'Sarah Johnson', specialty: 'Cuidadora de Idosos', rating: 4.9, reviews: 127, experience: '5 anos', distance: '2.3 km', price: 35, image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face' },
        { id: 2, name: 'Jennifer Lopez', specialty: 'Pet sitter e Cuidadora de Idosos', rating: 4.8, reviews: 93, experience: '3 anos', distance: '1.8 km', price: 28, image: 'https://s2.glbimg.com/XcrPi1OFnbbUybFQK52JC_0Jjrs=/smart/e.glbimg.com/og/ed/f/original/2019/01/19/jlo_50163141_329600424430635_8889962438239638413_n.jpg' },
        { id: 3, name: 'Emily Rodriguez', specialty: 'Cuidadora de Idosos', rating: 4.9, reviews: 156, experience: '7 anos', distance: '3.1 km', price: 42, image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face' },
        { id: 4, name: 'David Thompson', specialty: 'Cuidador Especializado', rating: 4.7, reviews: 84, experience: '4 anos', distance: '2.7 km', price: 38, image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face' },
        { id: 5, name: 'Maria Santos', specialty: 'Cuidado Infantil', rating: 4.8, reviews: 112, experience: '6 anos', distance: '1.5 km', price: 32, image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face' },
        { id: 6, name: 'James Wilson', specialty: 'Cuidador Noturno', rating: 4.6, reviews: 67, experience: '2 anos', distance: '4.2 km', price: 45, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' }
      ];

      this.displayCaregivers(caregivers);
      window.allCaregivers = caregivers;
    },

    displayCaregivers(caregivers) {
      const caregiversGrid = document.getElementById('caregiversGrid');
      if (!caregiversGrid) return;
      caregiversGrid.innerHTML = caregivers.map(caregiver => `
        <div class="caregiver-card" data-id="${caregiver.id}">
          <div class="caregiver-header">
            <div class="caregiver-avatar">
              <img src="${caregiver.image}" alt="${caregiver.name}" loading="lazy">
            </div>
            <div class="caregiver-info">
              <h3>${caregiver.name}</h3>
              <p class="caregiver-specialty">${caregiver.specialty}</p>
              <div class="caregiver-rating">
                ${this.generateStars(caregiver.rating)}
                <span class="rating-text">${caregiver.rating} (${caregiver.reviews} reviews)</span>
              </div>
            </div>
          </div>
          <div class="caregiver-details">
            <div class="detail-row"><span class="detail-label">Experiência</span><span class="detail-value">${caregiver.experience}</span></div>
            <div class="detail-row"><span class="detail-label">Distância</span><span class="detail-value">${caregiver.distance}</span></div>
            <div class="detail-row"><span class="detail-label">Preço/hora</span><span class="detail-value">R$ ${caregiver.price}</span></div>
          </div>
          <div class="caregiver-actions">
            <button type="button" class="btn primary" onclick="HomeCliente.viewCaregiverProfile(${caregiver.id})">Abrir perfil do cuidador</button>
          </div>
        </div>
      `).join('');
    },

    generateStars(rating) {
      const fullStars = Math.floor(rating);
      const hasHalfStar = rating % 1 !== 0;
      let stars = '';
      for (let i = 0; i < fullStars; i++) stars += '<i class="ph ph-star star" aria-hidden="true"></i>';
      if (hasHalfStar) stars += '<i class="ph ph-star-half star" aria-hidden="true"></i>';
      const emptyStars = 5 - Math.ceil(rating);
      for (let i = 0; i < emptyStars; i++) stars += '<i class="ph ph-star" style="color: var(--cinza-claro);" aria-hidden="true"></i>';
      return stars;
    },

    viewCaregiverProfile(caregiverId) {
      localStorage.setItem('selectedCaregiverId', caregiverId);
      window.location.href = '../HTML/open-perfil-cuidador.html';
    },

    initFilters() {
      const filterBtn = document.getElementById('filterBtn');
      const filterModal = document.getElementById('filterModal');
      const closeFilterModal = document.getElementById('closeFilterModal');
      const applyFilters = document.getElementById('applyFilters');
      const clearFilters = document.getElementById('clearFilters');
      if (!filterBtn || !filterModal) return;

      filterBtn.addEventListener('click', () => { filterModal.style.display = 'flex'; });
      if (closeFilterModal) closeFilterModal.addEventListener('click', () => { filterModal.style.display = 'none'; });
      filterModal.addEventListener('click', (e) => { if (e.target === filterModal) filterModal.style.display = 'none'; });

      const ratingRange = document.getElementById('ratingRange');
      const ratingValue = document.getElementById('ratingValue');
      const distanceRange = document.getElementById('distanceRange');
      const distanceValue = document.getElementById('distanceValue');
      if (ratingRange && ratingValue) {
        ratingRange.addEventListener('input', () => {
          ratingValue.textContent = parseFloat(ratingRange.value).toFixed(1);
          this.updateStarsDisplay(parseFloat(ratingRange.value));
        });
      }
      if (distanceRange && distanceValue) {
        distanceRange.addEventListener('input', () => { distanceValue.textContent = distanceRange.value; });
      }
      if (applyFilters) applyFilters.addEventListener('click', () => { this.applyFilterSettings(); filterModal.style.display = 'none'; });
      if (clearFilters) clearFilters.addEventListener('click', () => { this.resetFilters(); });
    },

    updateStarsDisplay(rating) {
      const starsContainer = document.querySelector('.rating-display .stars');
      if (starsContainer) starsContainer.innerHTML = this.generateStars(rating);
    },

    applyFilterSettings() {
      console.log('Filtros aplicados');
      // Implementar lógica real de filtros se necessário
    },

    resetFilters() {
      const ratingRange = document.getElementById('ratingRange');
      const ratingValue = document.getElementById('ratingValue');
      const distanceRange = document.getElementById('distanceRange');
      const distanceValue = document.getElementById('distanceValue');
      const minPrice = document.getElementById('minPrice');
      const maxPrice = document.getElementById('maxPrice');

      if (ratingRange) ratingRange.value = 4;
      if (ratingValue) ratingValue.textContent = '4.0';
      if (distanceRange) distanceRange.value = 15;
      if (distanceValue) distanceValue.textContent = '15';
      if (minPrice) minPrice.value = 20;
      if (maxPrice) maxPrice.value = 80;

      const checkboxes = document.querySelectorAll('.filter-option input[type="checkbox"]');
      checkboxes.forEach(checkbox => { checkbox.checked = checkbox.value === 'elderly'; });
      this.updateStarsDisplay(4);
    },

    initCategorySelection() {
      const categoryCards = document.querySelectorAll('.category-card');
      categoryCards.forEach(card => {
        card.addEventListener('click', () => {
          const category = card.dataset.category;
          this.filterByCategory(category);
        });
      });
    },

    filterByCategory(category) {
      console.log(`Filtrando por categoria: ${category}`);
    },

    initLoadMore() {
      const btn = document.getElementById('loadMoreBtn');
      if (!btn) return;
      btn.addEventListener('click', () => {
        console.log('Carregando mais cuidadores...');
      });
    },

    initLogout() {
      const logoutBtn = document.getElementById('logoutBtn');
      if (!logoutBtn) return;
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Tem certeza que deseja sair da sua conta?')) {
          localStorage.removeItem('userData');
          localStorage.removeItem('userType');
          window.location.href = '../HTML/index.html';
        }
      });
    }
  };

  // Expor no escopo global para o onclick do botão
  window.HomeCliente = HomeCliente;

  // Inicializar ao carregar DOM, somente nesta página
  document.addEventListener('DOMContentLoaded', function() {
    // Executar somente se existir um marcador desta página
    if (document.body && document.body.classList.contains('client-home')) {
      HomeCliente.init();
    }
  });
})();
