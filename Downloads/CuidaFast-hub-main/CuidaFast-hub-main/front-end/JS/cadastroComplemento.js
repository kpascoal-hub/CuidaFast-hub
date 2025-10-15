form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const existingData = JSON.parse(localStorage.getItem('cuidafast_user') || '{}');

  const endereco = {
    cep: document.getElementById('cep').value,
    rua: document.getElementById('rua').value,
    numero: document.getElementById('numero').value,
    complemento: document.getElementById('complemento').value,
    bairro: document.getElementById('bairro').value,
    cidade: document.getElementById('cidade').value,
    estado: document.getElementById('estado').value,
  };

  const updatedData = {
    ...existingData,
    dataNascimento: document.getElementById('dataNascimento').value,
    cpf: document.getElementById('cpf').value,
    endereco: endereco,
    cadastroCompleto: true,
    updatedAt: new Date().toISOString(),
  };

  // ✅ SALVAR NO BACKEND
  try {
    const response = await fetch('http://localhost:3000/api/cliente/dados-complementares', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: existingData.id, // ID do usuário no banco
        endereco: endereco,
        dataNascimento: updatedData.dataNascimento,
        cpf: updatedData.cpf
      })
    });

    if (!response.ok) {
      throw new Error('Erro ao salvar dados no servidor');
    }

    console.log('✅ Dados salvos no backend');
  } catch (error) {
    console.error('❌ Erro ao salvar no backend:', error);
    alert('Erro ao salvar dados. Tente novamente.');
    return;
  }

  // Salvar também no localStorage (cache local)
  localStorage.setItem('cuidafast_user', JSON.stringify(updatedData));
  atualizarUsuarioNaLista(updatedData);

  alert('✅ Cadastro completado com sucesso!');
  window.location.href = 'homeCliente.html';
});