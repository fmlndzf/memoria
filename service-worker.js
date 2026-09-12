const CACHE_NAME = "juego-memoria-v2";

const ARCHIVOS = [
    "./",
    "./index.html",
    "./styles.css",
    "./app.js",
    "./manifest.json",

    "./css/fontawesome.css",
    "./css/solid.css",

    "./webfonts/fa-solid-900.woff2",

    "./icon-192.png",
    "./icon-512.png"
];


// Instalar y guardar los archivos en caché
self.addEventListener("install", evento => {

    evento.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ARCHIVOS))
    );

    self.skipWaiting();
});


// Activar y eliminar cachés antiguas
self.addEventListener("activate", evento => {

    evento.waitUntil(
        caches.keys().then(claves => {

            return Promise.all(
                claves
                    .filter(clave => clave !== CACHE_NAME)
                    .map(clave => caches.delete(clave))
            );

        })
    );

    self.clients.claim();
});


// Servir desde caché
self.addEventListener("fetch", evento => {

    evento.respondWith(

        caches.match(evento.request)
            .then(respuesta => {

                if (respuesta) {
                    return respuesta;
                }

                return fetch(evento.request);

            })
    );
});