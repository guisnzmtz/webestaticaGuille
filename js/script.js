if (btnSaludoApi && nombreSaludo && apiInfo) {
        btnSaludoApi.addEventListener('click', async () => {
            const nombre = nombreSaludo.value.trim();
            apiInfo.textContent = 'Solicitando saludo a AWS...';
            apiInfo.style.color = '#666';

            // URL definitiva para tu despliegue apuntando a tu IP y puerto 8080
            const urlAws = `http://appguilleapi-env.eba-pxippjat.us-east-1.elasticbeanstalk.com/api/saludos${nombre ? '?nombre=' + encodeURIComponent(nombre) : ''}`;

            try {
                const resp = await fetch(urlAws);
                
                if (!resp.ok) throw new Error(`Error HTTP: ${resp.status}`);
                
                const data = await resp.json();
                
                if (data && data.mensaje) {
                    const welcomeEl = document.getElementById('welcomeMessage');
                    if (welcomeEl) welcomeEl.textContent = data.mensaje;
                    
                    apiInfo.textContent = `Éxito: Saludo obtenido desde la instancia EC2.`;
                    apiInfo.style.color = '#2b7a2b';
                }
            } catch (err) {
                apiInfo.textContent = `Error: ${err.message}. ¿Está el puerto 8080 abierto?`;
                apiInfo.style.color = 'red';
                console.error("Error en Fetch:", err);
            }
        });
    }