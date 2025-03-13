document.addEventListener('DOMContentLoaded', () => {
    const formInscricao = document.getElementById('form-inscricao');

    formInscricao.addEventListener('submit', (event) => {
        event.preventDefault();

        const nome = document.getElementById('validationTooltip01').value;
        const email = document.getElementById('validationTooltipUsername').value;
        const senha = document.getElementById('validationTooltip02').value;
        const qtdpetSelect = document.getElementById('validationTooltip04');
        const qtdpetValue = qtdpetSelect.value;
        const qtdpet = qtdpetValue === '4+' ? '4' : qtdpetValue;

        const NovoUsuario = {
            name: nome,
            email: email,
            senha: senha,
            qtdpet: qtdpet
        };

        console.log("NovoUsuario (antes do fetch):", NovoUsuario);

        fetch('/.netlify/functions/api', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(NovoUsuario)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro ao inscrever: ${response.status}`)
                }
                window.location.href = 'entrar.html';
            })
            .catch(error => {
                console.error('Erro ao inscrever:', error);
                alert('Erro ao realizar inscrição. Verifique o console para mais detalhes.');
            });
    });

});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker registrado com sucesso:', registration);
        })
        .catch(err => {
          console.error('Falha ao registrar o Service Worker:', err);
        });
    });
  }