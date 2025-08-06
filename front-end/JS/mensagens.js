// Home Cliente JavaScript

// Dados mock dos cuidadores
const caregivers = [
    {
        id: 1,
        name: "Sarah Johnson",
        specialty: "Cuidado de Idosos",
        rating: 4.9,
        reviews: 127,
        photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face"
    },
    {
        id: 2,
        name: "Jennifer Lopez",
        specialty: "Cuidado de Pets",
        rating: 4.8,
        reviews: 89,
        photo: "https://images.unsplash.com/photo-1594824388853-d0c7b3b9e3c8?w=150&h=150&fit=crop&crop=face"
    },
    {
        id: 3,
        name: "Emily Rodriguez",
        specialty: "Cuidado Infantil",
        rating: 5.0,
        reviews: 156,
        photo: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face"
    },
    {
        id: 4,
        name: "David Thompson",
        specialty: "Cuidado de Idosos",
        rating: 4.7,
        reviews: 98,
        photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face"
    },
    {
        id: 5,
        name: "Maria Santos",
        specialty: "Cuidado Infantil",
        rating: 4.9,
        reviews: 134,
        photo: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=150&h=150&fit=crop&crop=face"
    },
    {
        id: 6,
        name: "Carlos Mendes",
        specialty: "Cuidado de Pets",
        rating: 4.6,
        reviews: 76,
        photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&h=150&fit=crop&crop=face"
    }
];

// Elementos DOM
const menuToggle = document.getElementById('menuToggle');
const closeSidebar = document.getElementById('closeSidebar');
const sidebarModal = document.getElementById('sidebarModal');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const caregiversContainer = document.getElementById('caregiversContainer');

// Função para abrir o modal lateral
function openSidebar() {
    sidebarModal.classList.add('active');
    sidebarOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Função para fechar o modal lateral
function closeSidebarModal() {
    sidebarModal.classList.remove('active');
    sidebarOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Função para gerar estrelas de avaliação
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let starsHTML = '';
    
    // Estrelas cheias
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="ph-fill ph-star star"></i>';
    }
    
    // Meia estrela
    if (hasHalfStar) {
        starsHTML += '<i class="ph ph-star-half star"></i>';
    }
    
    // Estrelas vazias
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="ph ph-star star" style="opacity: 0.3;"></i>';
    }
    
    return starsHTML;
}

// Função para renderizar os cards de cuidadores
function renderCaregivers() {
    caregiversContainer.innerHTML = '';
    
    caregivers.forEach(caregiver => {
        const caregiverCard = document.createElement('div');
        caregiverCard.className = 'col-lg-4 col-md-6 col-sm-12';
        
        caregiverCard.innerHTML = `
            <div class="caregiver-card">
                <img src="${caregiver.photo}" alt="${caregiver.name}" class="caregiver-photo">
                <h3 class="caregiver-name">${caregiver.name}</h3>
                <p class="caregiver-specialty">${caregiver.specialty}</p>
                <div class="caregiver-rating">
                    <div class="stars">
                        ${generateStars(caregiver.rating)}
                    </div>
                    <span class="rating-text">${caregiver.rating} (${caregiver.reviews} avaliações)</span>
                </div>
                <button class="contact-btn" onclick="contactCaregiver(${caregiver.id})">
                    Entrar em Contato
                </button>
            </div>
        `;
        
        caregiversContainer.appendChild(caregiverCard);
    });
}

// Função para entrar em contato com cuidador
function contactCaregiver(caregiverId) {
    const caregiver = caregivers.find(c => c.id === caregiverId);
    if (caregiver) {
        alert(`Entrando em contato com ${caregiver.name}...`);
        // Aqui você implementaria a lógica real de contato
    }
}

// Event Listeners
menuToggle.addEventListener('click', openSidebar);
closeSidebar.addEventListener('click', closeSidebarModal);
sidebarOverlay.addEventListener('click', closeSidebarModal);

// Fechar modal com tecla ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebarModal.classList.contains('active')) {
        closeSidebarModal();
    }
});

// Event listeners para os cards de serviço
document.addEventListener('DOMContentLoaded', () => {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('click', () => {
            const serviceType = card.querySelector('.service-title').textContent;
            alert(`Você clicou em: ${serviceType}`);
            // Aqui você implementaria a navegação para a página específica do serviço
        });
    });
    
    // Renderizar cuidadores ao carregar a página
    renderCaregivers();
});

// Função para filtrar cuidadores por especialidade (para uso futuro)
function filterCaregivers(specialty) {
    const filteredCaregivers = specialty === 'all' 
        ? caregivers 
        : caregivers.filter(c => c.specialty === specialty);
    
    caregiversContainer.innerHTML = '';
    
    filteredCaregivers.forEach(caregiver => {
        const caregiverCard = document.createElement('div');
        caregiverCard.className = 'col-lg-4 col-md-6 col-sm-12';
        
        caregiverCard.innerHTML = `
            <div class="caregiver-card">
                <img src="${caregiver.photo}" alt="${caregiver.name}" class="caregiver-photo">
                <h3 class="caregiver-name">${caregiver.name}</h3>
                <p class="caregiver-specialty">${caregiver.specialty}</p>
                <div class="caregiver-rating">
                    <div class="stars">
                        ${generateStars(caregiver.rating)}
                    </div>
                    <span class="rating-text">${caregiver.rating} (${caregiver.reviews} avaliações)</span>
                </div>
                <button class="contact-btn" onclick="contactCaregiver(${caregiver.id})">
                    Entrar em Contato
                </button>
            </div>
        `;
        
        caregiversContainer.appendChild(caregiverCard);
    });
}
