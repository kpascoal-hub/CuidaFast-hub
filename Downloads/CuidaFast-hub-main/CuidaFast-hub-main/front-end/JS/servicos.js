
  // ===== SIDEBAR =====
  const sidebar = document.getElementById('clientSidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  const sidebarToggle = document.getElementById('sidebarToggle');

  sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    sidebarOverlay.classList.toggle('active');
  });

  sidebarOverlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('active');
  });

  // ===== DROPDOWN PERFIL =====
  const userProfileDropdown = document.getElementById('userProfileDropdown');
  const userProfileBtn = document.getElementById('userProfileBtn');

  userProfileBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    userProfileDropdown.classList.toggle('open');
  });

  document.addEventListener('click', () => {
    userProfileDropdown.classList.remove('open');
  });

  // ===== LEAFLET MAPA =====
  const map = L.map('map').setView([-23.5505, -46.6333], 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  const marcadores = {};
  const rastros = {};
  let mapaCentralizado = false;

  function atualizarCuidador(uid, lat, lng, ultimoUpdate) {
    if (!uid || lat == null || lng == null) return;

    if (marcadores[uid]) {
      marcadores[uid].setLatLng([lat, lng]);
      marcadores[uid].setPopupContent(`Cuidador: ${uid}<br>Última atualização: ${ultimoUpdate.toDate().toLocaleTimeString()}`);
    } else {
      const divIcon = L.divIcon({
        className: "",
        html: '<i class="ph-user ph-bold ph-icon"></i>',
        iconSize: [32, 32],
        popupAnchor: [0, -16]
      });
      const marker = L.marker([lat, lng], { icon: divIcon }).addTo(map)
        .bindPopup(`Cuidador: ${uid}<br>Última atualização: ${ultimoUpdate.toDate().toLocaleTimeString()}`);
      marcadores[uid] = marker;
      rastros[uid] = [];
    }

    rastros[uid].push([lat, lng]);
    if (rastros[uid].length > 1) {
      L.polyline(rastros[uid], { color: 'red' }).addTo(map);
    }

    if (!mapaCentralizado) {
      map.setView([lat, lng], 15);
      mapaCentralizado = true;
    }
  }

  db.collection("cuidador").onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
      const data = change.doc.data();
      atualizarCuidador(change.doc.id, data.latitude, data.longitude, data.ultimoUpdate);
    });
  });
