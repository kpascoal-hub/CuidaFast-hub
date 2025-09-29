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

// ===== FILTRAGEM DE CARDS VIA HEADER SEARCH =====
(function(){
  function normalize(text){
    return (text||'').toString().toLowerCase().trim();
  }

  const headerSearch = document.getElementById('headerSearch');
  const searchBtn = document.querySelector('.search-btn');
  const mobileSearch = document.querySelector('.mobile-search-input');
  const container = document.querySelector('.containerzin') || document.getElementById('main-content') || document.body;

  // Dataset falso de cuidadores (substitui os cards estáticos)
  const FAKE_CAREGIVERS = [
    { name: 'Maria Silva', specialty: 'Idosos', bio: 'Cuidadora especializada em idosos com 5 anos de experiência.', rating: 4.9, reviews: 127 },
    { name: 'João Santos', specialty: 'Infantil', bio: 'Cuidador infantil certificado, especialista em primeiros socorros.', rating: 4.7, reviews: 89 },
    { name: 'Ana Costa', specialty: 'Pets', bio: 'Pet sitter experimente, ama animais e oferece cuidados especiais.', rating: 5.0, reviews: 203 },
    { name: 'Pedro Almeida', specialty: 'Reabilitação', bio: 'Cuidador com experiência em fisioterapia e reabilitação.', rating: 4.8, reviews: 92 },
    { name: 'Carlos Oliveira', specialty: 'Idosos', bio: 'Enfermeiro especializado em cuidados domiciliares para idosos.', rating: 4.8, reviews: 156 },
    { name: 'Lucia Ferreira', specialty: 'Infantil', bio: 'Babá certificada com experiência em desenvolvimento infantil.', rating: 4.9, reviews: 98 },
    { name: 'Roberto Lima', specialty: 'Pets', bio: 'Veterinário e pet sitter, especialista em cuidados com animais.', rating: 4.6, reviews: 234 },
    { name: 'Sandra Mendes', specialty: 'Idosos', bio: 'Psicóloga especializada em cuidados com idosos e demência.', rating: 5.0, reviews: 78 },
    { name: 'Patricia Alves', specialty: 'Reabilitação', bio: 'Fisioterapeuta especializada em reabilitação geriátrica.', rating: 5.0, reviews: 87 },
    { name: 'Fernando Santos', specialty: 'Infantil', bio: 'Educador infantil com especialização em necessidades especiais.', rating: 4.7, reviews: 145 },
    { name: 'Camila Rocha', specialty: 'Pets', bio: 'Adestradora e cuidadora de pets, especialista em comportamento animal.', rating: 4.9, reviews: 176 },
    { name: 'Ricardo Souza', specialty: 'Home Care', bio: 'Técnico em enfermagem com especialização em home care.', rating: 4.7, reviews: 134 }
  ];

  // Estado de paginação e filtro
  let caregiversState = {
    items: FAKE_CAREGIVERS.slice(), // cópia
    page: 0,
    perPage: 4,
    filtered: null
  };

  function renderCard(c) {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <div class="icon"><i class="ph ph-user" style="font-size:40px;color:#1B475D"></i></div>
      <h3>${escapeHtml(c.name)}</h3>
      <p>${escapeHtml(c.bio)}</p>
      <div style="display:flex;align-items:center;gap:8px;margin:12px 0;">
        <div style="display:flex;color:#FAD564">
          ${renderStars(c.rating)}
        </div>
        <span style="font-size:14px;color:#666;">${c.rating} (${c.reviews} avaliações)</span>
      </div>
      <a href="#" class="btn primary" style="margin-top:16px;">Ver Perfil</a>
    `;
    return div;
  }

  function renderStars(r){
    const full = Math.round(r);
    let out = '';
    for(let i=0;i<full;i++) out += '<i class="ph-fill ph-star"></i>';
    for(let i=full;i<5;i++) out += '<i class="ph ph-star"></i>';
    return out;
  }

  function escapeHtml(s){
    return (s||'').toString().replace(/[&<>"']/g, function(ch){
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[ch];
    });
  }

  function getActiveList(){
    return caregiversState.filtered || caregiversState.items;
  }

  function renderNextPage(reset){
    const containerEl = document.getElementById('caregiversContainer');
    if(!containerEl) return;
    if(reset){ containerEl.innerHTML = ''; caregiversState.page = 0; }
    const list = getActiveList();
    const start = caregiversState.page * caregiversState.perPage;
    const slice = list.slice(start, start + caregiversState.perPage);
    slice.forEach(item => containerEl.appendChild(renderCard(item)));
    caregiversState.page++;

    // controlar botão "Carregar mais" - mostrar botão cinza semelhante ao 'Ordenar' quando não houver mais itens
    const loadBtn = document.getElementById('loadMoreBtn');
    if (loadBtn) {
      if (caregiversState.page * caregiversState.perPage >= list.length) {
        // Não há mais itens: manter o botão visível, torná-lo outline + disabled (cinza)
        loadBtn.style.display = '';
        loadBtn.disabled = true;
        loadBtn.className = 'btn outline disabled';
        loadBtn.innerHTML = 'Todos os cuidadores carregados';
        loadBtn.style.opacity = '';
        loadBtn.style.cursor = 'not-allowed';
      } else {
        // Ainda há itens: garantir que o botão esteja habilitado e com estilo primário
        loadBtn.style.display = '';
        loadBtn.disabled = false;
        loadBtn.className = 'btn primary';
        loadBtn.innerHTML = 'Carregar mais cuidadores <i class="ph ph-arrow-down" aria-hidden="true"></i>';
        loadBtn.style.opacity = '';
        loadBtn.style.cursor = '';
      }
    }
  }

  // hook initial render
  document.addEventListener('DOMContentLoaded', function(){
    // exibir primeira página
    renderNextPage(true);
    const loadBtn = document.getElementById('loadMoreBtn');
    if(loadBtn){
      loadBtn.addEventListener('click', function(){ renderNextPage(false); });
    }
  });

  function filterCards(query){
    const q = normalize(query);
    // filtrar no dataset
    const list = FAKE_CAREGIVERS.slice();
    const filtered = list.filter(c => ((c.name + ' ' + c.bio + ' ' + c.specialty).toLowerCase().indexOf(q) !== -1));
    caregiversState.filtered = q === '' ? null : filtered;
    // re-render a partir da página 0
    renderNextPage(true);
    const sections = Array.from(document.querySelectorAll('.servicos'));
    let anyVisible = false;

    // Hide the welcome and top service categories while searching
    const welcomeSection = document.querySelector('.welcome-section');
    const topServices = document.getElementById('serviceCategories');
    if(q !== ''){
      if(welcomeSection) welcomeSection.style.display = 'none';
      if(topServices) topServices.style.display = 'none';
      // ocultar botão carregar mais durante busca
      const loadBtnDuringSearch = document.getElementById('loadMoreBtn');
      if (loadBtnDuringSearch) {
        loadBtnDuringSearch.style.display = 'none';
      }
    } else {
      if(welcomeSection) welcomeSection.style.display = '';
      if(topServices) topServices.style.display = '';
      // restaurar botão carregar mais ao limpar busca (o renderNextPage cuidará do estado)
      const loadBtnAfterSearch = document.getElementById('loadMoreBtn');
      if (loadBtnAfterSearch) {
        loadBtnAfterSearch.style.display = '';
      }
    }

    // compute anyVisible based on rendered cards
    const rendered = Array.from(document.querySelectorAll('#caregiversContainer .card'));
    anyVisible = rendered.length > 0;
    // hide the static service sections when searching
    

    const noId = 'homeSearchNoResults';
    let no = document.getElementById(noId);

    // Mostrar/ocultar header de cuidadores
    const caregiversHeader = document.getElementById('caregiversHeader');
    if(caregiversHeader){
      caregiversHeader.style.display = anyVisible ? '' : 'none';
    }

    if(!anyVisible && q !== ''){
      if(!no){
        no = document.createElement('div');
        no.id = noId;
        no.className = 'no-results-box';
        no.innerHTML = `
          <div class="no-results-icon">
            <i class="ph ph-magnifying-glass" aria-hidden="true"></i>
          </div>
          <div class="no-results-text">
            <h3>Nenhum cuidador encontrado</h3>
            <p>Tente outra palavra-chave ou remova filtros para ver mais resultados.</p>
          </div>
        `;
        container.prepend(no);
      }
      // adicionar classe para encurtar a página e mostrar o rodapé
      document.body.classList.add('short-page');
      // Forçar inline styles caso exista regra conflitante de min-height
      try {
        document.body.style.minHeight = 'auto';
        const mainEl = document.getElementById('main-content') || document.querySelector('main');
        if (mainEl) mainEl.style.minHeight = '60vh';
        if (container) container.style.minHeight = '60vh';
      } catch (e) {
        // ignore
      }
    } else if(no){
      no.remove();
      // remover a classe quando houver resultados
      document.body.classList.remove('short-page');
      // limpar estilos inline aplicados anteriormente
      try {
        document.body.style.minHeight = '';
        const mainEl = document.getElementById('main-content') || document.querySelector('main');
        if (mainEl) mainEl.style.minHeight = '';
        if (container) container.style.minHeight = '';
      } catch (e) {}
    }
  }

  function debounce(fn,delay){let t;return function(...a){clearTimeout(t);t=setTimeout(()=>fn.apply(this,a),delay);};}

  const deb = debounce(function(){
    const v = (headerSearch && headerSearch.value) || (mobileSearch && mobileSearch.value) || '';
    filterCards(v);
  },200);

  if(headerSearch){ headerSearch.addEventListener('input', deb); headerSearch.addEventListener('keypress', function(e){ if(e.key==='Enter'){ e.preventDefault(); filterCards(headerSearch.value); } }); }
  if(mobileSearch){ mobileSearch.addEventListener('input', deb); mobileSearch.addEventListener('keypress', function(e){ if(e.key==='Enter'){ e.preventDefault(); filterCards(mobileSearch.value); } }); }
  if(searchBtn){ searchBtn.addEventListener('click', function(){ const v = (headerSearch && headerSearch.value) || (mobileSearch && mobileSearch.value) || ''; filterCards(v); }); }

  // Expor para console (opcional)
  window.CuidaFast = window.CuidaFast || {};
  window.CuidaFast.filterCards = filterCards;
})();


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
    initFilterModal();
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
      this.initModernHeader();
      this.initSidebar();
      this.loadUserData();
      this.initLoadMore();
      this.initLogout();
      console.log('HomeCliente inicializada');
    },

    // Inicializar funcionalidades do header moderno
    initModernHeader() {
      this.initProfileDropdown();
      this.initHeaderSearch();
      this.initMobileMenu();
      this.initHeaderActions();
    },

    // Dropdown do perfil do usuário
    initProfileDropdown() {
      const profileBtn = document.getElementById('userProfileBtn');
      const profileDropdown = document.getElementById('userProfileDropdown');
      const dropdownMenu = document.getElementById('profileDropdownMenu');
      
      if (!profileBtn || !profileDropdown) return;

      profileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        profileDropdown.classList.toggle('open');
      });

      // Fechar dropdown ao clicar fora
      document.addEventListener('click', (e) => {
        if (!profileDropdown.contains(e.target)) {
          profileDropdown.classList.remove('open');
        }
      });

      // Logout do header
      const headerLogoutBtn = document.getElementById('headerLogoutBtn');
      if (headerLogoutBtn) {
        headerLogoutBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.handleLogout();
        });
      }
    },

    // Busca no header
    initHeaderSearch() {
      const headerSearch = document.getElementById('headerSearch');
      const searchBtn = document.querySelector('.search-btn');
      const mobileSearchInput = document.querySelector('.mobile-search-input');
      const mobileSearchBtn = document.querySelector('.mobile-search-btn');

      if (headerSearch) {
        headerSearch.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            this.performHeaderSearch(headerSearch.value);
          }
        });
      }

      if (searchBtn) {
        searchBtn.addEventListener('click', () => {
          this.performHeaderSearch(headerSearch.value);
        });
      }

      if (mobileSearchInput) {
        mobileSearchInput.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            this.performHeaderSearch(mobileSearchInput.value);
          }
        });
      }

      if (mobileSearchBtn) {
        mobileSearchBtn.addEventListener('click', () => {
          this.performHeaderSearch(mobileSearchInput.value);
        });
      }
    },

    // Menu mobile
    initMobileMenu() {
      const mobileMenuToggle = document.getElementById('mobileMenuToggle');
      const sidebar = document.getElementById('clientSidebar');
      const overlay = document.getElementById('sidebarOverlay');

      if (mobileMenuToggle && sidebar && overlay) {
        mobileMenuToggle.addEventListener('click', () => {
          sidebar.classList.add('open');
          overlay.classList.add('active');
        });
      }
    },

    // Ações do header (notificações, mensagens)
    initHeaderActions() {
      const notificationBtn = document.getElementById('notificationBtn');
      const messageBtn = document.getElementById('messageBtn');

      if (notificationBtn) {
        notificationBtn.addEventListener('click', () => {
          window.location.href = '../HTML/notificacao.html';
        });
      }

      if (messageBtn) {
        messageBtn.addEventListener('click', () => {
          window.location.href = '../HTML/mensagens.html';
        });
      }
    },

    // Busca do header
    performHeaderSearch(query) {
      if (!query || !query.trim()) {
        // resetizar filtros visuais quando a query estiver vazia
        if (window.CuidaFast && typeof window.CuidaFast.filterCards === 'function') {
          window.CuidaFast.filterCards('');
        }
        return;
      }

      console.log('Buscando por:', query);

      // Filtrar os cards já visíveis através da função comum
      if (window.CuidaFast && typeof window.CuidaFast.filterCards === 'function') {
        window.CuidaFast.filterCards(query);
      }

      // Implementar busca real aqui (opcional)
      if (window.allCaregivers) {
        const filtered = window.allCaregivers.filter(caregiver => 
          caregiver.name.toLowerCase().includes(query.toLowerCase()) ||
          caregiver.specialty.toLowerCase().includes(query.toLowerCase())
        );
        this.displayCaregivers(filtered);
      }
      
      // Feedback visual
      const searchContainer = document.querySelector('.search-container');
      if (searchContainer) {
        searchContainer.style.borderColor = 'var(--verde-escuro)';
        setTimeout(() => {
          searchContainer.style.borderColor = 'transparent';
        }, 2000);
      }
    },

    // Função de logout atualizada
    handleLogout() {
      if (confirm('Tem certeza que deseja sair da sua conta?')) {
        localStorage.removeItem('userData');
        localStorage.removeItem('userType');
        window.location.href = '../HTML/index.html';
      }
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

    // Função para carregar mais cuidadores
    initLoadMore() {
      const btn = document.getElementById('loadMoreBtn');
      if (!btn) return;
      
      let currentLoad = 0;
      
      btn.addEventListener('click', () => {
        console.log('Carregando mais cuidadores...');
        
        if (currentLoad === 0) {
          // Mostrar segunda seção de cuidadores
          const moreCaregivers = document.getElementById('moreCaregivers');
          if (moreCaregivers) {
            moreCaregivers.style.display = 'grid';
            moreCaregivers.classList.add('show');
          }
          currentLoad = 1;
          btn.innerHTML = 'Carregar mais cuidadores <i class="ph ph-arrow-down" aria-hidden="true"></i>';
        } else if (currentLoad === 1) {
          // Mostrar terceira seção de cuidadores
          const evenMoreCaregivers = document.getElementById('evenMoreCaregivers');
          if (evenMoreCaregivers) {
            evenMoreCaregivers.style.display = 'grid';
            evenMoreCaregivers.classList.add('show');
          }
          btn.innerHTML = 'Todos os cuidadores carregados <i class="ph ph-check" aria-hidden="true"></i>';
          btn.disabled = true;
          btn.style.opacity = '0.6';
          btn.style.cursor = 'not-allowed';
          currentLoad = 2;
        }
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

  // Inicialização do modal de filtro
  function initFilterModal() {
    const filterModal = new bootstrap.Modal(document.getElementById('filterModal'));
    const openFilterBtn = document.getElementById('openFilterBtn');
    const applyFiltersBtn = document.getElementById('applyFilters');
    const clearFiltersBtn = document.getElementById('clearFilters');
    const ratingRange = document.getElementById('ratingRange');
    const ratingValue = document.getElementById('ratingValue');
    const distanceRange = document.getElementById('distanceRange');
    const distanceValue = document.getElementById('distanceValue');
    const minPrice = document.getElementById('minPrice');
    const maxPrice = document.getElementById('maxPrice');
    
    // Abrir modal de filtro
    if (openFilterBtn) {
      openFilterBtn.addEventListener('click', function() {
        filterModal.show();
      });
    }
    
    // Atualizar valor da avaliação quando o range for alterado
    if (ratingRange && ratingValue) {
      ratingRange.addEventListener('input', function() {
        ratingValue.textContent = this.value;
        updateStars(this.value);
      });
    }
    
    // Atualizar valor da distância quando o range for alterado
    if (distanceRange && distanceValue) {
      distanceRange.addEventListener('input', function() {
        distanceValue.textContent = this.value;
      });
    }
    
    // Aplicar filtros
    if (applyFiltersBtn) {
      applyFiltersBtn.addEventListener('click', function() {
        // Aqui você pode adicionar a lógica para aplicar os filtros
        console.log('Filtros aplicados:', {
          rating: ratingRange ? ratingRange.value : null,
          distance: distanceRange ? distanceRange.value : null,
          minPrice: minPrice ? minPrice.value : null,
          maxPrice: maxPrice ? maxPrice.value : null
        });
        
        // Fechar o modal
        filterModal.hide();
      });
    }
    
    // Limpar filtros
    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener('click', function() {
        // Resetar todos os filtros
        if (ratingRange) ratingRange.value = 4;
        if (ratingValue) ratingValue.textContent = '4.0';
        if (distanceRange) distanceRange.value = 15;
        if (distanceValue) distanceValue.textContent = '15';
        if (minPrice) minPrice.value = '20';
        if (maxPrice) maxPrice.value = '80';
        
        // Atualizar estrelas
        updateStars(4);
        
        console.log('Filtros limpos');
      });
    }
    
    // Função para atualizar as estrelas de avaliação
    function updateStars(rating) {
      const stars = document.querySelectorAll('.stars i');
      const fullStars = Math.floor(rating);
      const hasHalfStar = rating % 1 >= 0.5;
      
      stars.forEach((star, index) => {
        if (index < fullStars) {
          star.className = 'ph-fill ph-star';
        } else if (index === fullStars && hasHalfStar) {
          star.className = 'ph ph-star-half';
        } else {
          star.className = 'ph ph-star';
        }
      });
    }
    
    // Inicializar estrelas
    updateStars(ratingRange ? ratingRange.value : 4);
  }

  // Expor no escopo global para o onclick do botão
  window.HomeCliente = HomeCliente;

  // Inicializar ao carregar DOM, somente nesta página
  document.addEventListener('DOMContentLoaded', function() {
    // Executar somente se existir um marcador desta página
    if (document.body && document.body.classList.contains('client-home')) {
      HomeCliente.init();
      initFilterModal();
    }
  });
})();
