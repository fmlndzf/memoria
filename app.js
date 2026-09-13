const tablero = document.getElementById("tablero");
const informacion = document.querySelector(".informacion");
const nuevoJuego = document.getElementById("nuevoJuego");
const jugarDeNuevo = document.getElementById("jugarDeNuevo");
const niveles = document.getElementById("niveles");
const menuNiveles = document.getElementById("menuNiveles");
const cerrarNiveles = document.getElementById("cerrarNiveles");
const botonesNivel = document.querySelectorAll(".nivel");
const cartaDatos = new Map();


/* --------------------------------
   ICONOS DISPONIBLES
-------------------------------- */

const iconosDisponibles = [

    "fa-solid fa-cat",
    "fa-solid fa-dog",
    "fa-solid fa-fish",
    "fa-solid fa-crow",

    "fa-solid fa-car",
    "fa-solid fa-plane",
    "fa-solid fa-rocket",
    "fa-solid fa-bicycle",

    "fa-solid fa-heart",
    "fa-solid fa-star",
    "fa-solid fa-bell",
    "fa-solid fa-camera",

    "fa-solid fa-gamepad",
    "fa-solid fa-music",
    "fa-solid fa-ghost",
    "fa-solid fa-pizza-slice",

    "fa-solid fa-apple-whole",
    "fa-solid fa-leaf",
    "fa-solid fa-sun",
    "fa-solid fa-moon",

    "fa-solid fa-anchor",
    "fa-solid fa-bone",
    "fa-solid fa-gun",
    "fa-solid fa-frog",
    
    "fa-solid fa-calculator",
    "fa-solid fa-guitar",
    "fa-solid fa-glasses",
    "fa-solid fa-cannabis",

    "fa-solid fa-atom",
    "fa-solid fa-faucet",
    "fa-solid fa-futbol",
    "fa-solid fa-bacterium",

    "fa-solid fa-flag",
    "fa-solid fa-carrot",
    "fa-solid fa-eye",
    "fa-solid fa-bug",

    "fa-solid fa-horse",
    "fa-solid fa-key",
    "fa-solid fa-lemon",
    "fa-solid fa-marker",

    "fa-solid fa-paperclip",
    "fa-solid fa-house",
    "fa-solid fa-phone",
    "fa-solid fa-robot",

    "fa-solid fa-scissors",
    "fa-solid fa-skull",
    "fa-solid fa-ice-cream",
    "fa-solid fa-lightbulb",

    "fa-solid fa-tree",
    "fa-solid fa-volcano",
    "fa-solid fa-wrench",
    "fa-solid fa-snowman",

    "fa-solid fa-fire",
    "fa-solid fa-snowflake",
    "fa-solid fa-cloud",
    "fa-solid fa-bolt"
];


/* --------------------------------
   ESTADO DEL JUEGO
-------------------------------- */

let primeraCarta = null;
let segundaCarta = null;

let bloqueo = false;

let paresEncontrados = 0;
let movimientos = 0;

let juegoIniciado = false;

let nivelActual = 4;
let tamañoTablero = 4;

let temporizadorIntervalo = null;
let segundosTranscurridos = 0;

/* --------------------------------
   TEMPORIZADOR
-------------------------------- */
function iniciarTemporizador() {

    if (temporizadorIntervalo !== null) {
        return;
    }

    temporizadorIntervalo = setInterval(() => {

        segundosTranscurridos++;

        actualizarTemporizador();

    }, 1000);
}


function detenerTemporizador() {

    if (temporizadorIntervalo !== null) {
        clearInterval(temporizadorIntervalo);
        temporizadorIntervalo = null;
    }
}


function reiniciarTemporizador() {

    detenerTemporizador();

    segundosTranscurridos = 0;

    actualizarTemporizador();
}


function actualizarTemporizador() {

    const minutos = Math.floor(segundosTranscurridos / 60);
    const segundos = segundosTranscurridos % 60;

    const tiempo = 
        String(minutos).padStart(2, "0") +
        ":" +
        String(segundos).padStart(2, "0");

    document.getElementById("temporizador").textContent = tiempo;
}


/* --------------------------------
   INICIAR JUEGO
-------------------------------- */

function iniciarJuego() {

    reiniciarTemporizador();

    tablero.innerHTML = "";

    primeraCarta = null;
    segundaCarta = null;

    bloqueo = false;

    paresEncontrados = 0;
    movimientos = 0;

    juegoIniciado = false;

    informacion.innerHTML = `
        <span>
            Movimientos:
            <strong id="movimientos">0</strong>
        </span>
    `;

    crearCartas();
}

/* --------------------------------
   INICIAR MISMO JUEGO
-------------------------------- */
function jugarMismoJuego() {

    if (!juegoIniciado) {
        return;
    }

    reiniciarTemporizador();
    
    primeraCarta = null;
    segundaCarta = null;

    bloqueo = false;

    paresEncontrados = 0;
    movimientos = 0;

    informacion.innerHTML = `
        <span>
            Movimientos:
            <strong id="movimientos">0</strong>
        </span>
    `;

    const cartas = tablero.querySelectorAll(".carta");

    cartas.forEach(carta => {

        carta.classList.remove("volteada");
        carta.classList.remove("encontrada");

    });
}


/* --------------------------------
   CREAR CARTAS
-------------------------------- */

function crearCartas() {

    tablero.style.gridTemplateColumns =
        `repeat(${tamañoTablero}, 1fr)`;

    cartaDatos.clear();

    const totalCartas = tamañoTablero * tamañoTablero;
    const cantidadPares = Math.floor(totalCartas / 2);
    const esNivelImpar = totalCartas % 2 !== 0;

    const iconos = [...iconosDisponibles];

    mezclarFisherYates(iconos);

    const iconosSeleccionados = iconos.slice(0, cantidadPares);

    let cartas = [
        ...iconosSeleccionados,
        ...iconosSeleccionados
    ];

    if (esNivelImpar) {

        const posicionCentral = Math.floor(totalCartas / 2);

        cartas.splice(posicionCentral, 0, "__especial__");
    }

    cartas = mezclarCartas(cartas);

    cartas.forEach(icono => {

        const carta = document.createElement("button");

        carta.className = "carta";


        // Carta especial
        if (icono === "__especial__") {

            carta.classList.add("carta--especial");
            carta.dataset.especial = "true";

            carta.innerHTML = `
                <div class="carta__interior">
                    <div class="carta__frente carta__especial">
                    <i class="fa-solid fa-m"></i>
                    </div>
                </div>
            `;

        }


        // Carta normal
        else {

            // Guardamos el icono solamente en JavaScript
            cartaDatos.set(carta, icono);

            carta.innerHTML = `
                <div class="carta__interior">

                    <div class="carta__dorso">
                    </div>

                    <div class="carta__frente"></div>

                </div>
            `;

            carta.addEventListener("click", () => {
                seleccionarCarta(carta);
            });
        }

        tablero.appendChild(carta);
    });
}

function mezclarFisherYates(array) {

    for (let i = array.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}


function mezclarCartas(cartas) {

    const esNivelImpar = cartas.length % 2 !== 0;

    if (!esNivelImpar) {
        let mezcladas;

        do {
            mezcladas = [...cartas];
            mezcladas = mezclarFisherYates(mezcladas);
        } while (hayParejasConsecutivas(mezcladas));

        return mezcladas;
    }


    // Guardar la carta especial
    const posicionCentral = Math.floor(cartas.length / 2);

    const cartasNormales = cartas.filter(
        carta => carta !== "__especial__"
    );


    let mezcladas;

    do {
        mezcladas = [...cartasNormales];
        mezcladas = mezclarFisherYates(mezcladas);

        // Volver a colocar la especial en el centro
        mezcladas.splice(posicionCentral, 0, "__especial__");

    } while (hayParejasConsecutivas(mezcladas));


    return mezcladas;
}

function hayParejasConsecutivas(cartas) {

    const columnas = tamañoTablero;
    const filas = tamañoTablero;

    for (let i = 0; i < cartas.length; i++) {

        // La carta especial no tiene icono
        if (cartas[i] === "__especial__") {
            continue;
        }

        const fila = Math.floor(i / columnas);
        const columna = i % columnas;


        // Carta de la derecha
        if (columna < columnas - 1) {

            const derecha = cartas[i + 1];

            if (
                derecha !== "__especial__" &&
                cartas[i] === derecha
            ) {
                return true;
            }
        }


        // Carta de abajo
        if (fila < filas - 1) {

            const abajo = cartas[i + columnas];

            if (
                abajo !== "__especial__" &&
                cartas[i] === abajo
            ) {
                return true;
            }
        }
    }

    return false;
}

function mostrarIcono(carta) {

    const icono = cartaDatos.get(carta);

    if (!icono) {
        return;
    }

    const frente = carta.querySelector(".carta__frente");

    frente.innerHTML = `
        <i class="${icono}"></i>
    `;
}


/* --------------------------------
   SELECCIONAR CARTA
-------------------------------- */

function seleccionarCarta(carta) {

    if (bloqueo) {
        return;
    }

    if (carta === primeraCarta) {
        return;
    }

    if (carta.classList.contains("encontrada")) {
        return;
    }


    // Comenzar juego
    juegoIniciado = true;

    iniciarTemporizador();


    // Mostrar el icono
    mostrarIcono(carta);

    carta.classList.add("volteada");


    // Primera carta
    if (primeraCarta === null) {

        primeraCarta = carta;

        return;
    }


    // Segunda carta
    segundaCarta = carta;

    movimientos++;

    document.getElementById("movimientos").textContent =
        movimientos;

    comprobarPareja();
}


/* --------------------------------
   COMPROBAR PAREJA
-------------------------------- */

function comprobarPareja() {

    const iconoPrimera = cartaDatos.get(primeraCarta);
    const iconoSegunda = cartaDatos.get(segundaCarta);


    // Son iguales
    if (iconoPrimera === iconoSegunda) {

        primeraCarta.classList.add("encontrada");
        segundaCarta.classList.add("encontrada");

        paresEncontrados++;

        primeraCarta = null;
        segundaCarta = null;


        const cantidadPares =
            Math.floor(
                (tamañoTablero * tamañoTablero) / 2
            );


        // Juego terminado
        if (paresEncontrados === cantidadPares) {

            detenerTemporizador();

            informacion.innerHTML = `
                <strong>
                    ¡Completado en
                    ${movimientos} movimientos!
                </strong>
            `;
        }

    }


    // No son iguales
    else {

        bloqueo = true;

        setTimeout(() => {

            primeraCarta.classList.remove("volteada");
            segundaCarta.classList.remove("volteada");


            // Eliminar los iconos del HTML
            primeraCarta.querySelector(
                ".carta__frente"
            ).innerHTML = "";

            segundaCarta.querySelector(
                ".carta__frente"
            ).innerHTML = "";


            primeraCarta = null;
            segundaCarta = null;

            bloqueo = false;

        }, 600);
    }
}


/* --------------------------------
   LIMPIAR SELECCIÓN
-------------------------------- */

function limpiarSeleccion() {

    primeraCarta = null;
    segundaCarta = null;

    bloqueo = false;

}


/* --------------------------------
   NUEVO JUEGO
-------------------------------- */

nuevoJuego.addEventListener("click", iniciarJuego);

jugarDeNuevo.addEventListener("click", jugarMismoJuego);


/* --------------------------------
   NIVELES
-------------------------------- */
niveles.addEventListener("click", () => {

    menuNiveles.classList.add("visible");

});

cerrarNiveles.addEventListener("click", () => {

    menuNiveles.classList.remove("visible");

});

menuNiveles.addEventListener("click", (evento) => {

    if (evento.target === menuNiveles) {
        menuNiveles.classList.remove("visible");
    }

});

botonesNivel.forEach(boton => {

    boton.addEventListener("click", () => {

        const tamaño = Number(boton.dataset.filas);

        nivelActual = tamaño;
        tamañoTablero = tamaño;

        botonesNivel.forEach(b => {
            b.classList.remove("nivel--activo");
        });

        boton.classList.add("nivel--activo");

        menuNiveles.classList.remove("visible");

        iniciarJuego();

    });

});

/* --------------------------------
   ARRANCAR
-------------------------------- */

iniciarJuego();