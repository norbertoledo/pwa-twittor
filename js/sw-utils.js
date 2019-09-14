// Archivo auxiliar del SW para trasladar cierta logica al sw

// Guardar en el cache dinamico
const actualizarCacheDinamico = (dynamicCache, req, res) => {

    if (res.ok) {

        return caches.open(dynamicCache)
            .then(cache => {

                cache.put(req, res.clone());

                return res.clone();

            });

    } else {
        return res;
    }


};