document.addEventListener("DOMContentLoaded", () => {
    const profileBtn = document.getElementById("userProfileBtn");
    const dropdownMenu = document.getElementById("profileDropdownMenu");
    const userProfileDropdown = document.getElementById("userProfileDropdown");

    // Mostra/esconde dropdown
    if (profileBtn && dropdownMenu && userProfileDropdown) {
      profileBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        userProfileDropdown.classList.toggle("open");
      });

      document.addEventListener("click", (event) => {
        if (!userProfileDropdown.contains(event.target)) {
          userProfileDropdown.classList.remove("open");
        }
      });
    }

    // Botões de mensagem e notificação usam o link do HTML
    const messageBtn = document.getElementById("messageBtn");
    const notificationBtn = document.getElementById("notificationBtn");

    [messageBtn, notificationBtn].forEach(btn => {
      if (btn) {
        btn.addEventListener("click", (e) => {
          // Deixa o HTML cuidar do redirecionamento naturalmente
          // Nenhum window.location.href é usado
        });
      }
    });

    console.log("Header carregada e interações ativas!");
  });
