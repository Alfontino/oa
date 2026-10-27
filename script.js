// Detective digital: el mensaje sospechoso — Sprint 3
// Lógica de los retos, feedback con el DOM y puntaje.

// ---------- Configuración de puntos ----------
const PUNTOS_ACIERTO = 1;   // se suman al acertar (una sola vez por reto)
const PUNTOS_ERROR = 0.5;   // se restan en cada error (poné 0 para "sin castigo")

// ---------- Estado ----------
let puntaje = 0;
const resueltos = { 1: false, 2: false, 3: false };

// ---------- Elementos del DOM ----------
const puntajeEl = document.getElementById("puntaje");
const cierreEl = document.getElementById("cierre");

// ---------- Retroalimentación ----------
const mensajes = {
  1: {
    b: "Muy bien. Reconociste dos señales juntas: el premio y el apuro. Avisar a una persona adulta es la mejor decisión.",
    a: "Cuidado. El apuro es una señal de engaño. Un mensaje verdadero no te da dos horas para entregar tu contraseña.",
    c: "Todavía no. Si respondés, la otra persona confirma que tu dirección existe y te va a escribir de nuevo. Es mejor no contestar.",
  },
  2: {
    ok: "Exacto. Esa palabra nombra el engaño: alguien pesca datos con un mensaje falso.",
    mal: "Todavía no. Volvé al título «Expediente: qué es el phishing». La palabra que buscás está en la primera frase.",
  },
  3: {
    ok: "Muy bien. El engaño también llega por mensaje de texto, por redes sociales y por aplicaciones de mensajes.",
    mal: "No. El correo es solo un camino. Un mensaje de texto puede traer el mismo engaño.",
  },
};

// ---------- Funciones auxiliares ----------
function mostrarPuntaje() {
  // Muestra la coma decimal (0,5) como se escribe en Uruguay
  puntajeEl.textContent = String(puntaje).replace(".", ",");
}

function mostrarFeedback(reto, texto, acierto) {
  const caja = document.getElementById("feedback" + reto);
  caja.textContent = (acierto ? "✅ " : "❌ ") + texto;
  caja.className = "feedback " + (acierto ? "correcto" : "incorrecto");
}

function bloquearReto(reto) {
  // Cuando el reto está resuelto, se desactivan sus controles
  const form = document.getElementById("form-reto" + reto);
  const controles = form.querySelectorAll("input, button");
  controles.forEach(function (control) {
    control.disabled = true;
  });
}

function registrarResultado(reto, acierto) {
  if (resueltos[reto]) return;

  if (acierto) {
    resueltos[reto] = true;
    puntaje += PUNTOS_ACIERTO;
    bloquearReto(reto);
  } else {
    puntaje = Math.max(0, puntaje - PUNTOS_ERROR);
  }

  mostrarPuntaje();
  revisarCierre();
}

function revisarCierre() {
  if (resueltos[1] && resueltos[2] && resueltos[3]) {
    cierreEl.hidden = false;
    cierreEl.scrollIntoView({ behavior: "smooth" });
  }
}

// ---------- Reto 1: opción múltiple ----------
function comprobarReto1(evento) {
  evento.preventDefault();
  const elegida = document.querySelector('input[name="reto1"]:checked');

  if (elegida === null) {
    mostrarFeedback(1, "Elegí una opción antes de comprobar.", false);
    return; // sin respuesta no se resta
  }

  const acierto = elegida.value === "b";
  mostrarFeedback(1, mensajes[1][elegida.value], acierto);
  registrarResultado(1, acierto);
}

// ---------- Reto 2: completar ----------
function comprobarReto2(evento) {
  evento.preventDefault();
  const texto = document.getElementById("respuesta2").value.trim().toLowerCase();

  if (texto === "") {
    mostrarFeedback(2, "Escribí la palabra antes de comprobar.", false);
    return;
  }

  const acierto = texto === "phishing";
  mostrarFeedback(2, acierto ? mensajes[2].ok : mensajes[2].mal, acierto);
  registrarResultado(2, acierto);
}

// ---------- Reto 3: verdadero o falso ----------
function comprobarReto3(evento) {
  evento.preventDefault();
  const elegida = document.querySelector('input[name="reto3"]:checked');

  if (elegida === null) {
    mostrarFeedback(3, "Marcá verdadero o falso antes de comprobar.", false);
    return;
  }

  const acierto = elegida.value === "falso";
  mostrarFeedback(3, acierto ? mensajes[3].ok : mensajes[3].mal, acierto);
  registrarResultado(3, acierto);
}

// ---------- Conectar los formularios ----------
document.getElementById("form-reto1").addEventListener("submit", comprobarReto1);
document.getElementById("form-reto2").addEventListener("submit", comprobarReto2);
document.getElementById("form-reto3").addEventListener("submit", comprobarReto3);

mostrarPuntaje();