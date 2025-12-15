(function () {
    const messages = [
        'Bienvenido — gracias por visitar mi página. Espero que encuentres lo que buscas.',
        '¡Hola! Encantado de saludarte. Si buscas algo concreto aquí, dímelo.',
        'Gracias por pasarte — que tengas un excelente día.',
        'Explora y disfruta: esta es una página de bienvenida simple y elegante.'
    ];

    const welcomeEl = document.getElementById('welcomeMessage');
    const changeBtn = document.getElementById('changeBtn');
    const resetBtn = document.getElementById('resetBtn');
    let current = 0;

    function setMessage(index, opts = {}) {
        const text = messages[index] ?? messages[0];
        // small animated swap
        welcomeEl.style.opacity = '0';
        welcomeEl.style.transform = 'translateY(6px)';
        setTimeout(() => {
            welcomeEl.textContent = text;
            welcomeEl.style.opacity = '';
            welcomeEl.style.transform = '';
        }, 180);
    }

    changeBtn.addEventListener('click', () => {
        current = (current + 1) % messages.length;
        setMessage(current);
        changeBtn.setAttribute('aria-pressed', 'true');
    });

    resetBtn.addEventListener('click', () => {
        current = 0; setMessage(current);
        changeBtn.setAttribute('aria-pressed', 'false');
    });

    // keyboard accessibility: space/enter trigger when focused
    changeBtn.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); changeBtn.click(); } });
    resetBtn.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); resetBtn.click(); } });

    // initial appearance
    setTimeout(() => document.getElementById('welcomeCard').classList.remove('fade-in'), 600);
})();