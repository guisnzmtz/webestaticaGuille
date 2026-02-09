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

    async function setMessage(index, opts = {}) {
        let text = messages[index] ?? messages[0];

        // Intenta obtener saludo desde la API REST; si falla, usar texto local
        try {
            const nombre = (opts.nombre || '');
            const url = `http://localhost:8080/api/saludos?nombre=${encodeURIComponent(nombre)}`;
            const resp = await fetch(url, { method: 'GET' });
            if (resp.ok) {
                const data = await resp.json();
                if (data && data.estado === 'success' && data.mensaje) {
                    text = data.mensaje;
                }
            }
        } catch (e) {
            // Silencioso: se conservará el texto local como fallback
            console.warn('No se pudo obtener saludo desde API:', e);
        }

        welcomeEl.style.opacity = '0';
        welcomeEl.style.transform = 'translateY(6px)';

        setTimeout(() => {
            welcomeEl.textContent = text;
            welcomeEl.style.opacity = '';
            welcomeEl.style.transform = '';
        }, 180);
    }

    if (changeBtn) {
        changeBtn.addEventListener('click', () => {
            current = (current + 1) % messages.length;
            setMessage(current);
            changeBtn.setAttribute('aria-pressed', 'true');
        });

        
        changeBtn.addEventListener('keydown', (e) => { 
            if (e.key === 'Enter' || e.key === ' ') { 
                e.preventDefault(); 
                changeBtn.click(); 
            } 
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            current = 0; 
            setMessage(current);
            changeBtn.setAttribute('aria-pressed', 'false');
        });
        
        resetBtn.addEventListener('keydown', (e) => { 
            if (e.key === 'Enter' || e.key === ' ') { 
                e.preventDefault(); 
                resetBtn.click(); 
            } 
        });
    }

    setTimeout(() => {
        const card = document.getElementById('welcomeCard');
        if (card) card.classList.remove('fade-in');
    }, 600);

    // Mostrar saludo inicial (se intentará obtener desde la API)
    setMessage(current).catch(() => {});
})();



document.addEventListener('DOMContentLoaded', () => {

    
    const inputPractica = document.getElementById('inputPractica');
    const btnPractica = document.getElementById('btnPractica');
    const resultadoPractica = document.getElementById('resultadoPractica');

    
    if (btnPractica && inputPractica && resultadoPractica) {
        
        btnPractica.addEventListener('click', () => {
            
            const textoUsuario = inputPractica.value;
            let respuesta;
            
            if (textoUsuario.trim() === "") {
                respuesta = "El campo está vacío. Por favor, escribe algo.";
                resultadoPractica.style.color = "red";
            } else {
                const textoMayus = textoUsuario.toUpperCase();
                const longitud = textoUsuario.length;
                
                respuesta = `Texto procesado: "${textoMayus}" (Longitud: ${longitud} caracteres)`;
                resultadoPractica.style.color = "#333"; 
            }
            resultadoPractica.textContent = respuesta;
        });
    }
});