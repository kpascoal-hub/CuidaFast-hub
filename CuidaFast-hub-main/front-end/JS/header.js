document.addEventListener("DOMContentLoaded", () => {
    const profileBtn = document.getElementById("userProfileBtn");
    const dropdownMenu = document.getElementById("profileDropdownMenu");

    // Mostra/esconde dropdown
    if (profileBtn && dropdownMenu) {
      profileBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        dropdownMenu.classList.toggle("show");
        console.log('[Header] Dropdown toggled');
      });

      document.addEventListener("click", (event) => {
        if (!profileBtn.contains(event.target) && !dropdownMenu.contains(event.target)) {
          dropdownMenu.classList.remove("show");
        }
      });
    }

    // Configurar navegação - Notificações
    const notificationBtn = document.getElementById("notificationBtn");
    if (notificationBtn) {
      notificationBtn.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = 'solicitacoesServicos.html';
      });
    }

    // Configurar navegação - Mensagens
    const messageBtn = document.getElementById("messageBtn");
    if (messageBtn) {
      messageBtn.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = 'mensagens.html';
      });
    }

    console.log("Header carregada e interações ativas!");
  });
