// js/motor.js
$(document).ready(function() {
  // Función para efecto máquina de escribir
  function escribirTexto(elemento, texto, velocidad = 30) {
    let i = 0;
    elemento.text(""); // Vaciamos el texto al empezar
    function mecanografiar() {
      if (i < texto.length) {
        elemento.text(elemento.text() + texto.charAt(i));
        i++;
        setTimeout(mecanografiar, velocidad);
      }
    }
    mecanografiar();
  }

  // Lanzamos el efecto de escritura en el texto de aduanas nada más abrir la web
  const textoAduanas = "Ha habido un problema con aduanas y tu regalo físico está tardando más de lo previsto en llegar...";
  escribirTexto($('#texto-aduanas'), textoAduanas, 40);
  // Transición de la broma de aduanas a la pantalla de cine
  $('#btn-siguiente').click(function() {
    $('#pantalla-aduanas').fadeOut(800, function() {
      $('#pantalla-carga').fadeIn(800);
    });
  });
  const magazine = $('#magazine');
  const totalPaginas = 54;

  // 1. Cargar las páginas (usando Template Literals)
  for (let i = 1; i <= totalPaginas; i++) {
    magazine.append(`<div class="page" style="background-image:url('img/paginas/${i}.jpg');"></div>`);
  }

  // 2. Función matemática de escala (Responsive)
  function adaptarPantalla() {
    const anchoVentana = $(window).width() * 0.9;
    const altoVentana = $(window).height() * 0.8;
    const anchoRevista = 800;
    const altoRevista = 565;

    let escala = Math.min(anchoVentana / anchoRevista, altoVentana / altoRevista);
    if (escala > 1) escala = 1;

    magazine.css({
      'transform': `scale(${escala})`,
      'transform-origin': 'center center'
    });
  }

  // Escuchamos los cambios de pantalla
  $(window).resize(adaptarPantalla);

  // 3. Botón de entrada (LA CLAVE DEL ARREGLO)
  $('#btn-entrar').click(function() {
    // Empieza la música
    document.getElementById('audio-fondo').play();

    // Activar pantalla completa de forma nativa (Modo Cine)
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch(err => {});
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    }

    // Ocultamos la pantalla de carga
    $('#pantalla-carga').fadeOut(800, function() {

      // TRUCO: Ponemos el contenedor visible en bloque, pero transparente (opacity 0)
      $('#contenedor-revista').css({ display: 'flex', opacity: 0 });

      // AHORA inicializamos la revista
      magazine.turn({
        display: 'double',
        acceleration: true,
        gradients: true,
        elevation: 50
      });

      // Añadimos el sonido de papel
      magazine.bind('turning', function(event, page, view) {
        const audioPapel = document.getElementById('audio-pagina');
        audioPapel.currentTime = 0;
        let promesa = audioPapel.play();
        if (promesa !== undefined) {
          promesa.catch(error => { /* Ignoramos si el navegador bloquea el audio rápido */ });
        }
        // SI LLEGA A LA ÚLTIMA PÁGINA (54), reproducimos tu mensaje de voz secreto
        if (page === 54) {
          const audioVoz = document.getElementById('audio-voz');
          setTimeout(() => {
            audioVoz.play().catch(e => {});
          }, 1000); // Espera 1 segundo a que termine de abrirse la página
        }
      });

      // Adaptamos el tamaño y mostramos la revista con un fundido suave
      adaptarPantalla();
      $('#contenedor-revista').animate({ opacity: 1 }, 1000);
    });
  });

  // 4. Controles del teclado
  $(document).keydown(function(e){
    if (e.keyCode == 37) {
      magazine.turn('previous');
    } else if (e.keyCode == 39) {
      magazine.turn('next');
    }
  });
});
// Soporte de gestos táctiles (Swipe izquierdo / derecho)
let touchstartX = 0;
let touchendX = 0;

document.addEventListener('touchstart', e => {
  touchstartX = e.changedTouches[0].screenX;
}, false);

document.addEventListener('touchend', e => {
  touchendX = e.changedTouches[0].screenX;
  handleGesture();
}, false);

function handleGesture() {
  if (touchendX < touchstartX - 50) {
    magazine.turn('next'); // Deslizar a la izquierda pasa página adelante
  }
  if (touchendX > touchstartX + 50) {
    magazine.turn('previous'); // Deslizar a la derecha retrocede
  }
}
// --- EFECTO 3D PARALLAX CON EL RATÓN ---
const contenedor = $('#magazine');

$(document).mousemove(function(e) {
  // Obtenemos el ancho y alto de la ventana
  const w = $(window).width();
  const h = $(window).height();

  // Calculamos la posición del ratón respecto al centro de la pantalla (valores entre -1 y 1)
  const mouseX = (e.clientX - w / 2) / (w / 2);
  const mouseY = (e.clientY - h / 2) / (h / 2);

  // Definimos los grados máximos de inclinación (sutil para que sea elegante)
  const maxRotation = 8;

  const rotX = -mouseY * maxRotation;
  const rotY = mouseX * maxRotation;

  // Aplicamos la rotación 3D combinada con nuestra función de escala responsive
  // Cogemos la escala actual que esté usando la revista para no romper el responsive
  const anchoVentana = $(window).width() * 0.9;
  const altoVentana = $(window).height() * 0.8;
  let escala = Math.min(anchoVentana / 800, altoVentana / 565);
  if (escala > 1) escala = 1;

  contenedor.css({
    'transform': `scale(${escala}) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
    'transform-origin': 'center center'
  });
});

// Cuando el ratón sale de la ventana, la revista vuelve a su posición plana original
$(document).mouseleave(function() {
  const anchoVentana = $(window).width() * 0.9;
  const altoVentana = $(window).height() * 0.8;
  let escala = Math.min(anchoVentana / 800, altoVentana / 565);
  if (escala > 1) escala = 1;

  contenedor.css({
    'transform': `scale(${escala}) rotateX(0deg) rotateY(0deg)`,
    'transform-origin': 'center center'
  });
});
