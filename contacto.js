document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const form = document.querySelector('#contact-form');
    const submitBtn = document.querySelector('.submit-btn');

    // Toggle sidebar
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });

    // Form validation and loading effect
    form.addEventListener('submit', (e) => {
        const name = document.querySelector('#name');
        const email = document.querySelector('#email');
        const message = document.querySelector('#message');

        // Basic validation
        if (!name.value || !email.value || !message.value) {
            e.preventDefault();
            [name, email, message].forEach(input => {
                if (!input.value) {
                    input.classList.add('error');
                    setTimeout(() => input.classList.remove('error'), 300);
                }
            });
            return;
        }

        // Add loading effect
        submitBtn.classList.add('loading');
        submitBtn.innerHTML = '<span>Enviando...</span>';
        setTimeout(() => {
            submitBtn.classList.remove('loading');
            submitBtn.innerHTML = 'Enviar comentario';
        }, 2000); // Simula envío (ajusta según necesidades)
    });
});
