// IMPORTS
//import { actualizarCacheDinamico } from 'js/sw-utils.js';
importScripts('js/sw-utils.js');

const VERSION = '-v2';
const STATIC_CACHE = 'static' + VERSION;
const DYNAMIC_CACHE = 'dynamic' + VERSION;
const INMUTABLE_CACHE = 'inmutable' + VERSION;


const APP_SHELL = [
    //'/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js',
    'js/sw-utils.js'
];

const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
];


// Instalacion del Service Worker
self.addEventListener('install', e => {

    const cacheStatic = caches.open(STATIC_CACHE)
        .then(cache => cache.addAll(APP_SHELL));

    const cacheInmutable = caches.open(INMUTABLE_CACHE)
        .then(cache => cache.addAll(APP_SHELL_INMUTABLE));

    e.waitUntil(Promise.all([cacheStatic, cacheInmutable]));

});


// Proceso para activar y borrar caches anteriores cuando se actualiza el SW
self.addEventListener('activate', e => {

    const respuesta = caches.keys()
        .then(keys => {
            keys.forEach(key => {
                if (key !== STATIC_CACHE && key.includes('static')) {
                    return caches.delete(key);
                }
            });
        });

    e.waitUntil(respuesta);
});


// Implementar la estrategial del Cache - CACHE WITH NETWORK FALLBACK
self.addEventListener('fetch', e => {

    const respuesta = caches.match(e.request)
        .then(res => {

            if (res) {

                return res;

            } else {

                return fetch(e.request)
                    .then(newRes => {

                        return actualizarCacheDinamico(DYNAMIC_CACHE, e.request, newRes);

                    });

            }
        });


    e.respondWith(respuesta);
});