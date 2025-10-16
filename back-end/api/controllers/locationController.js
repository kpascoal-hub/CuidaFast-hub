const Usuario = require('../models/UsuarioModel');
const Cliente = require('../models/ClienteModel');
const Cuidador = require('../models/CuidadorModel');
const Vinculo = require('../models/VinculoModel');
const { geocodeAddress } = require('../services/geocodeService');
const { firestore, FieldValue } = require('../services/firebaseAdmin');

function nowTimestamp() {
  return new Date();
}

async function getCliente(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const usuario = await Usuario.getById(id);
    if (!usuario) return res.status(404).json({ error: 'Usuario não encontrado' });

    const cliente = await Cliente.getById(id);
    if (!cliente) return res.status(404).json({ error: 'Cliente não encontrado' });

    const enderecoTexto = typeof cliente.endereco === 'string' ? cliente.endereco : JSON.stringify(cliente.endereco || {});

    let coords = null;
    try {
      coords = await geocodeAddress(enderecoTexto);
    } catch {}

    if (usuario.firebase_uid && coords) {
      const docRef = firestore.collection('localizacoes').collection('clientes').doc(usuario.firebase_uid);
      await docRef.set({ lat: coords.lat, lng: coords.lng, atualizadoEm: nowTimestamp() }, { merge: true });
    }

    res.json({
      usuario_id: id,
      nome: usuario.nome,
      email: usuario.email,
      endereco: enderecoTexto,
      firebase_uid: usuario.firebase_uid || null,
      coordinates: coords,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao obter cliente' });
  }
}

async function postClienteEndereco(req, res) {
  try {
    const uid = req.firebaseUid;
    if (!uid) return res.status(401).json({ error: 'Não autenticado' });
    const { endereco } = req.body || {};
    if (!endereco) return res.status(400).json({ error: 'endereco é obrigatório' });

    // Resolve usuario pelo firebase_uid
    const usuario = await Usuario.findByFirebaseUid(uid);
    if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });

    // Atualiza endereço do cliente no MySQL (mantém formato original)
    const enderecoSalvar = typeof endereco === 'string' ? endereco : JSON.stringify(endereco);
    await Cliente.update(usuario.id, { historico_contratacoes: null, endereco: enderecoSalvar, preferencias: null });

    // Geocode e grava no Firestore
    let coords = null;
    try {
      const texto = typeof endereco === 'string' ? endereco : enderecoSalvar;
      coords = await geocodeAddress(texto);
      if (coords) {
        await firestore.collection('localizacoes').collection('clientes').doc(uid).set({
          lat: Number(coords.lat),
          lng: Number(coords.lng),
          atualizadoEm: FieldValue.serverTimestamp(),
        }, { merge: true });
      }
    } catch (e) {
      // Não bloqueia salvamento no MySQL
      console.warn('Geocoding falhou:', e?.message || e);
    }

    return res.json({ ok: true, coordinates: coords });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao salvar endereço do cliente' });
  }
}

async function getClienteMe(req, res) {
  try {
    const uid = req.firebaseUid;
    if (!uid) return res.status(401).json({ error: 'Não autenticado' });
    const usuario = await Usuario.findByFirebaseUid(uid);
    if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });
    const cliente = await Cliente.getById(usuario.id);
    const enderecoTexto = cliente && cliente.endereco ? (typeof cliente.endereco === 'string' ? cliente.endereco : JSON.stringify(cliente.endereco)) : null;
    return res.json({ usuario_id: usuario.id, firebaseUid: uid, endereco: enderecoTexto });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao obter dados do cliente' });
  }
}

async function getLocalizacaoCuidadorByUid(req, res) {
  try {
    // Auth já validado, opcionalmente checar vínculo aqui
    const { firebaseUid } = req.params;
    if (!firebaseUid) return res.status(400).json({ error: 'firebaseUid é obrigatório' });
    const snap = await firestore.collection('localizacoes').collection('cuidadores').doc(firebaseUid).get();
    if (!snap.exists) return res.status(404).json({ error: 'Localização não encontrada' });
    const data = snap.data();
    return res.json({ lat: data.lat, lng: data.lng, atualizadoEm: data.atualizadoEm || null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao obter localização do cuidador' });
  }
}

async function sanityFirestoreTest(req, res) {
  try {
    await firestore.collection('localizacoes').collection('cuidadores').doc('teste').set({
      lat: -23.561,
      lng: -46.655,
      atualizadoEm: FieldValue.serverTimestamp(),
    }, { merge: true });
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao escrever no Firestore' });
  }
}

async function getCuidador(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const usuario = await Usuario.getById(id);
    if (!usuario) return res.status(404).json({ error: 'Usuario não encontrado' });

    const cuidador = await Cuidador.getById(id);
    if (!cuidador) return res.status(404).json({ error: 'Cuidador não encontrado' });

    res.json({
      usuario_id: id,
      nome: usuario.nome,
      email: usuario.email,
      local_trabalho: cuidador.local_trabalho || null,
      firebase_uid: usuario.firebase_uid || null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao obter cuidador' });
  }
}

async function postLocalizacaoCuidador(req, res) {
  try {
    const { lat, lng } = req.body || {};
    if ((lat == null) || (lng == null)) return res.status(400).json({ error: 'lat e lng são obrigatórios' });

    // uid vem SEMPRE do token verificado pelo middleware
    const uid = req.firebaseUid;
    if (!uid) return res.status(401).json({ error: 'Não autenticado' });

    const docRef = firestore.collection('localizacoes').collection('cuidadores').doc(uid);
    await docRef.set({ lat: Number(lat), lng: Number(lng), atualizadoEm: FieldValue.serverTimestamp() }, { merge: true });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao salvar localização do cuidador' });
  }
}

async function getLocalizacaoCliente(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const usuario = await Usuario.getById(id);
    const cliente = await Cliente.getById(id);
    if (!usuario || !cliente) return res.status(404).json({ error: 'Cliente não encontrado' });

    const enderecoTexto = typeof cliente.endereco === 'string' ? cliente.endereco : JSON.stringify(cliente.endereco || {});
    const coords = await geocodeAddress(enderecoTexto);

    res.json({ usuario_id: id, firebase_uid: usuario.firebase_uid || null, coordinates: coords });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao obter localização do cliente' });
  }
}

async function getVinculoByCliente(req, res) {
  try {
    const clienteId = parseInt(req.params.id, 10);
    const cuidadorId = await Vinculo.getCuidadorIdByClienteId(clienteId);
    if (!cuidadorId) return res.status(404).json({ error: 'Vínculo não encontrado' });

    const cuidadorUser = await Usuario.getById(cuidadorId);
    res.json({ cliente_id: clienteId, cuidador_id: cuidadorId, cuidador_firebase_uid: cuidadorUser ? cuidadorUser.firebase_uid : null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao obter vínculo' });
  }
}

async function getVinculoByCuidador(req, res) {
  try {
    const cuidadorId = parseInt(req.params.id, 10);
    const clienteId = await Vinculo.getClienteIdByCuidadorId(cuidadorId);
    if (!clienteId) return res.status(404).json({ error: 'Vínculo não encontrado' });

    const clienteUser = await Usuario.getById(clienteId);
    const cliente = await Cliente.getById(clienteId);

    let coords = null;
    if (cliente && cliente.endereco) {
      const enderecoTexto = typeof cliente.endereco === 'string' ? cliente.endereco : JSON.stringify(cliente.endereco || {});
      coords = await geocodeAddress(enderecoTexto);
    }

    res.json({ cuidador_id: cuidadorId, cliente_id: clienteId, cliente_firebase_uid: clienteUser ? clienteUser.firebase_uid : null, coordinates: coords });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao obter vínculo' });
  }
}

module.exports = {
  getCliente,
  getCuidador,
  postLocalizacaoCuidador,
  getLocalizacaoCliente,
  getVinculoByCliente,
  getVinculoByCuidador,
  postClienteEndereco,
  getClienteMe,
  getLocalizacaoCuidadorByUid,
  sanityFirestoreTest,
};
