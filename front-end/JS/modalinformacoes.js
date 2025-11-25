const users = {
    maria: {
        nome: "Maria Cardoso",
        email: "maria@gmail.com",
        tipo: "Cuidador",
        rg: "docs/maria_rg.png",
        cv: "docs/maria_cv.pdf"
    },
    ricardo: {
        nome: "Ricardo Lopes",
        email: "ricardolopes@hotmail.com",
        tipo: "Cliente",
        rg: "docs/ricardo_rg.png",
        cv: "docs/ricardo_cv.pdf"
    }
};

let modal = document.getElementById("modal");
let close = document.getElementById("closeModal");

document.querySelectorAll(".ver-mais").forEach(btn => {
    btn.addEventListener("click", function() {
        let userID = this.getAttribute("data-user");
        let user = users[userID];

        document.getElementById("modal-nome").innerText = user.nome;
        document.getElementById("modal-email").innerText = user.email;
        document.getElementById("modal-tipo").innerText = user.tipo;
        document.getElementById("modal-rg").src = user.rg;
        document.getElementById("modal-cv").href = user.cv;

        modal.style.display = "block";
    });
});

close.onclick = () => modal.style.display = "none";
window.onclick = e => e.target == modal ? modal.style.display = "none" : null;
