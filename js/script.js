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

                // Intentar consulta al endpoint relativo primero (misma origin),
                // y si falla, intentar el backend en localhost:8080 como fallback.
                const paths = [
                    `/api/saludos?nombre=${encodeURIComponent(nombre)}`,
                    `http://localhost:8080/api/saludos?nombre=${encodeURIComponent(nombre)}`
                ];

                for (const u of paths) {
                    try {
                        const resp = await fetch(u, { method: 'GET' });
                        if (!resp.ok) continue;
                        const data = await resp.json();
                        if (data && data.estado === 'success' && data.mensaje) {
                            text = data.mensaje;
                            break;
                        }
                    } catch (err) {
                        // Intento siguiente; registro para depuración
                        console.warn('fetch fallo para', u, err);
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

    // Integración con la API de saludos: usar el input 'nombreSaludo' y el botón 'btnSaludoApi'
    const nombreSaludo = document.getElementById('nombreSaludo');
    const btnSaludoApi = document.getElementById('btnSaludoApi');
    const apiInfo = document.getElementById('apiInfo');

    if (btnSaludoApi && nombreSaludo && apiInfo) {
        btnSaludoApi.addEventListener('click', async () => {
            const nombre = nombreSaludo.value.trim();
            apiInfo.textContent = 'Solicitando saludo...';
            apiInfo.style.color = '#666';
            try {
                // Reutilizamos la función setMessage a través del endpoint (se intenta en el IIFE)
                // Hacemos una llamada directa aquí para mostrar respuesta rápidamente
                const url = `/api/saludos?nombre=${encodeURIComponent(nombre)}`;
                const resp = await fetch(url);
                if (!resp.ok) throw new Error(resp.statusText || 'Error en la petición');
                const data = await resp.json();
                if (data && data.estado === 'success' && data.mensaje) {
                    // Actualiza el mensaje principal de bienvenida
                    const welcomeEl = document.getElementById('welcomeMessage');
                    if (welcomeEl) welcomeEl.textContent = data.mensaje;
                    apiInfo.textContent = 'Saludo recibido.';
                    apiInfo.style.color = '#2b7a2b';
                } else {
                    apiInfo.textContent = 'Respuesta inesperada de la API.';
                    apiInfo.style.color = 'orange';
                }
            } catch (err) {
                apiInfo.textContent = 'No se pudo conectar con la API.';
                apiInfo.style.color = 'red';
                console.warn('Error solicitando saludo:', err);
            }
        });
    }
});