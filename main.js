(() => {
  'use strict'

  const forms = document.querySelectorAll('.needs-validation')

  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

document.querySelectorAll('.offcanvas a.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    const offcanvasEl = document.getElementById('offcanvasNavbar');
    const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
    if (offcanvas) {
      offcanvas.hide();
    }
  });
});
document.addEventListener('DOMContentLoaded', () => {
  const linkPerfilNome = document.getElementById('link-perfil-nome');
  const username = localStorage.getItem('username');

  if (linkPerfilNome && username) {
      linkPerfilNome.textContent = username;
  }
});