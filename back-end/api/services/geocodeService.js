const https = require('https');

function httpsGetJson(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, json });
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function geocodeAddress(address) {
  if (!address || typeof address !== 'string') {
    throw new Error('Endereço inválido para geocodificação');
  }
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;
  const { status, json } = await httpsGetJson(url, { 'User-Agent': 'CuidaFast/1.0 (contato@cuidafast.com)' });
  if (status < 200 || status >= 300) {
    throw new Error(`Falha na geocodificação: ${status}`);
  }
  if (!Array.isArray(json) || json.length === 0) return null;
  return { lat: parseFloat(json[0].lat), lng: parseFloat(json[0].lon) };
}

module.exports = { geocodeAddress };
