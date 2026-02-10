document.addEventListener('DOMContentLoaded', () => {
    const nombreSaludo = document.getElementById('nombreSaludo');
    const btnSaludoApi = document.getElementById('btnSaludoApi');
    const apiInfo = document.getElementById('apiInfo');
    const welcomeEl = document.getElementById('welcomeMessage');

    if (btnSaludoApi && nombreSaludo && apiInfo) {
        btnSaludoApi.addEventListener('click', async () => {
            const nombre = nombreSaludo.value.trim();
            apiInfo.textContent = 'Solicitando saludo a AWS...';
            apiInfo.style.color = '#666';

            // URL definitiva apuntando a tu instancia EC2 en el puerto 8080
            const urlAws = `http://54.226.148.233:8080/api/saludos${nombre ? '?nombre=' + encodeURIComponent(nombre) : ''}`;

            try {
                // Realizamos la petición Fetch
                const resp = await fetch(urlAws);
                
                if (!resp.ok) throw new Error(`Error HTTP: ${resp.status}`);
                
                // Procesamos la respuesta como JSON
                const data = await resp.json();
                
                if (data && data.mensaje) {
                    // Actualizamos el mensaje dinámico sin refrescar la página
                    if (welcomeEl) welcomeEl.textContent = data.mensaje;
                    
                    apiInfo.textContent = `Éxito: Saludo "${data.estado}" recibido desde EC2.`;
                    apiInfo.style.color = '#2b7a2b';
                }
            } catch (err) {
                apiInfo.textContent = `Error: ${err.message}. Revisa la consola y el puerto 8080.`;
                apiInfo.style.color = 'red';
                console.error("Error en Fetch:", err);
            }
        });
    }
});