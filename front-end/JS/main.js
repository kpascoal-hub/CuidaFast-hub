function initFAQ() {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach(item => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    if (!question || !answer) return;

    question.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      // fecha todos os outros
      faqItems.forEach(otherItem => {
        const otherAnswer = otherItem.querySelector(".faq-answer");
        const otherQuestion = otherItem.querySelector(".faq-question");

        otherItem.classList.remove("active");
        if (otherAnswer) otherAnswer.style.maxHeight = null;
        if (otherQuestion) otherQuestion.setAttribute("aria-expanded", "false");
      });

      // abre o atual (se estava fechado)
      if (!isActive) {
        item.classList.add("active");
        question.setAttribute("aria-expanded", "true");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });
}
// ===== NEWSLETTER =====

function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletterForm');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            
            if (!name || !email) {
                showAlert('Por favor, preencha todos os campos.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showAlert('Por favor, digite um e-mail válido.', 'error');
                return;
            }
            
            // Simular envio
            showAlert('Cadastro realizado com sucesso! Obrigado por se inscrever.', 'success');
            
            // Limpar formulário
            this.reset();
        });
    }
}


function showAlert(message, type = 'info') {
    // Criar elemento de alerta
    const alert = document.createElement('div');
    alert.className = `alert alert-${type === 'error' ? 'danger' : type === 'success' ? 'success' : 'info'}`;
    alert.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 9999;
        max-width: 300px;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease;
    `;
    alert.textContent = message;
    
    document.body.appendChild(alert);
    
    // Remover após 3 segundos
    setTimeout(() => {
        alert.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (alert.parentNode) {
                alert.parentNode.removeChild(alert);
            }
        }, 300);
    }, 3000);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

