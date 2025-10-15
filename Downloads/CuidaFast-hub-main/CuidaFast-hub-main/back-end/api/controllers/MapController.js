// ======================================================
// Mapa e integração com Firestore + Geocoding
// ======================================================

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Inicializa o mapa Leaflet
const map = L.map("map").setView([-23.5505, -46.6333], 13); // São Paulo padrão

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

// ======================================================
// Função: Adicionar marcador do cuidador
// ======================================================
function atualizarCuidador(uid, lat, lng, ultimoUpdate) {
  const icon = L.divIcon({
    className: "",
    html: '<i class="ph ph-user ph-bold ph-icon" style="color: var(--azul-escuro); font-size: 28px;"></i>',
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });

  L.marker([lat, lng], { icon }).addTo(map)
    .bindPopup(`<b>Cuidador:</b> ${uid}<br><b>Última atualização:</b> ${new Date(ultimoUpdate.toDate ? ultimoUpdate.toDate() : ultimoUpdate).toLocaleString()}`);
}

// ======================================================
// Função: Converter endereço em coordenadas (geocoding)
// ======================================================
async function obterCoordenadas(enderecoTexto) {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(enderecoTexto)}&limit=1`;
    const resposta = await fetch(url, { headers: { "User-Agent": "CuidaFastApp" } });
    const dados = await resposta.json();

    if (dados && dados.length > 0) {
      const lat = parseFloat(dados[0].lat);
      const lng = parseFloat(dados[0].lon);
      return { lat, lng };
    } else {
      console.warn("Endereço não encontrado:", enderecoTexto);
      return null;
    }
  } catch (erro) {
    console.error("Erro ao converter endereço:", erro);
    return null;
  }
}

// ======================================================
// Função: Mostrar casa do cliente atual no mapa
// ======================================================
async function mostrarCasaUsuarioAtual() {
  try {
    const user = firebase.auth().currentUser;
    if (!user) {
      console.warn("Usuário não autenticado.");
      return;
    }

    const uid = user.uid;
    const clienteRef = db.collection("clientes").doc(uid);
    const clienteDoc = await clienteRef.get();

    if (!clienteDoc.exists) {
      console.warn("Cliente não encontrado no Firestore:", uid);
      return;
    }

    const dados = clienteDoc.data();
    let geopoint = dados.geopoint;
    let enderecoTexto = "";

    // Caso ainda não tenha geopoint, converter o endereço
    if (!geopoint) {
      if (dados.endereco) {
        try {
          const enderecoObj = typeof dados.endereco === "string" ? JSON.parse(dados.endereco) : dados.endereco;
          enderecoTexto = `${enderecoObj.logradouro || ""}, ${enderecoObj.numero || ""}, ${enderecoObj.cidade || ""}, ${enderecoObj.estado || ""}`;
        } catch {
          enderecoTexto = dados.endereco;
        }

        const coords = await obterCoordenadas(enderecoTexto);
        if (coords) {
          geopoint = new firebase.firestore.GeoPoint(coords.lat, coords.lng);
          await clienteRef.update({ geopoint });
          console.log("Geopoint salvo para o cliente:", uid);
        }
      }
    }

    if (geopoint) {
      const lat = geopoint.latitude;
      const lng = geopoint.longitude;

      const houseIcon = L.divIcon({
        className: "",
        html: '<i class="ph ph-house ph-bold ph-icon" style="color: var(--azul-escuro); font-size: 32px;"></i>',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      L.marker([lat, lng], { icon: houseIcon })
        .addTo(map)
        .bindPopup(`<b>Minha Casa</b><br>${enderecoTexto || "Endereço confirmado"}`);

      map.setView([lat, lng], 15);
    }

  } catch (erro) {
    console.error("Erro ao mostrar casa do usuário:", erro);
  }
}

// ======================================================
// Escutar cuidadores (como já fazia antes)
// ======================================================
db.collection("cuidadores").onSnapshot(snapshot => {
  snapshot.docs.forEach(doc => {
    const data = doc.data();
    const uid = doc.id;
    if (!data || !data.geopoint) return;
    const ultimo = data.ultimoUpdate || firebase.firestore.Timestamp.now();
    atualizarCuidador(uid, data.geopoint.latitude, data.geopoint.longitude, ultimo);
  });
});

// ======================================================
// Inicializar quando o usuário estiver autenticado
// ======================================================
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    mostrarCasaUsuarioAtual();
  } else {
    console.warn("Usuário não logado — aguardando autenticação.");
  }
});
