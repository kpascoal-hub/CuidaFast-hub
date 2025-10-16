// cuidaloc.js - Página do Cuidador
// Requer: Firebase compat (app+firestore), FirebaseConfig.js fornecendo firebase.initializeApp e const db

(function () {
  const map = L.map('map').setView([-23.5505, -46.6333], 15);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  const statusEl = document.getElementById('status');

  // Helpers
  const km = (m) => (m / 1000).toFixed(2);
  function haversine(lat1, lng1, lat2, lng2) {
    const R = 6371e3;
    const toRad = (v) => v * Math.PI / 180;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLng/2)**2;
    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  // Identify caregiver and linked client
  const usuarioId = Number(localStorage.getItem('usuario_id')) || Number(new URLSearchParams(location.search).get('id')) || null;
  let cuidadorUid = null;
  let clienteUid = null;

  // Markers
  let cuidadorMarker = null;
  let clienteMarker = null;

  function setStatus(msg) {
    if (statusEl) statusEl.textContent = msg;
  }

  async function fetchVinculoDoCuidador() {
    if (!usuarioId) return null;
    const res = await fetch(`/api/vinculo/cuidador/${usuarioId}`);
    if (!res.ok) return null;
    return res.json();
  }

  function upsertCuidadorMarker(lat, lng) {
    const icon = L.divIcon({
      className: '',
      html: '<i class="ph-user ph-bold ph-icon" style="font-size:28px;color:#0d6efd"></i>',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });
    if (cuidadorMarker) {
      cuidadorMarker.setLatLng([lat, lng]);
    } else {
      cuidadorMarker = L.marker([lat, lng], { icon }).addTo(map).bindPopup('Minha posição');
    }
  }

  function upsertClienteMarker(lat, lng) {
    const icon = L.divIcon({
      className: '',
      html: '<i class="ph-house ph-bold ph-icon" style="font-size:30px;color:#333"></i>',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });
    if (clienteMarker) {
      clienteMarker.setLatLng([lat, lng]);
    } else {
      clienteMarker = L.marker([lat, lng], { icon }).addTo(map).bindPopup('Casa do cliente');
    }
  }

  async function postarLocalizacao(lat, lng) {
    try {
      await fetch('/api/localizacao/cuidador', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario_id: usuarioId, lat, lng })
      });
    } catch (e) {
      console.error('Falha ao enviar localização do cuidador', e);
    }
  }

  function subscribeClienteHouse(uid) {
    if (!uid || !window.firebase || !window.firebase.firestore) return;
    db.collection('localizacoes').doc('clientes'); // ensure path comp
    const ref = db.collection('localizacoes').doc('clientes');
    // compat path style: localizacoes/clientes/{uid}
    db.collection('localizacoes').doc('clientes');
    db.collection('localizacoes').collection('clientes').doc(uid).onSnapshot((doc) => {
      const d = doc.data();
      if (!d) return;
      upsertClienteMarker(d.lat, d.lng);
    });
  }

  async function init() {
    setStatus('Inicializando...');
    try {
      const vinculo = await fetchVinculoDoCuidador();
      if (vinculo && vinculo.cliente_firebase_uid) {
        clienteUid = vinculo.cliente_firebase_uid;
        subscribeClienteHouse(clienteUid);
      } else if (vinculo && vinculo.coordinates) {
        upsertClienteMarker(vinculo.coordinates.lat, vinculo.coordinates.lng);
      }
      setStatus('Ativando geolocalização...');
    } catch (e) {
      console.warn('Sem vínculo do cuidador encontrado ainda.');
    }

    if (!navigator.geolocation) {
      setStatus('Geolocalização não suportada.');
      return;
    }

    let lastSent = 0;
    navigator.geolocation.watchPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      upsertCuidadorMarker(latitude, longitude);
      map.setView([latitude, longitude], 15);

      const now = Date.now();
      if (now - lastSent > 10000) { // 10s
        lastSent = now;
        postarLocalizacao(latitude, longitude);
      }

      if (clienteMarker) {
        const d = haversine(latitude, longitude, clienteMarker.getLatLng().lat, clienteMarker.getLatLng().lng);
        setStatus(`Distância até o cliente: ${km(d)} km`);
      } else {
        setStatus('Localizando cliente...');
      }
    }, (err) => {
      console.error(err);
      setStatus('Não foi possível obter a sua posição. Permita o acesso ao GPS.');
    }, { enableHighAccuracy: true });
  }

  init();
})();
