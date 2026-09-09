$(document).ready(function() {

  // 1. FUNCIÓN MÁQUINA DE ESCRIBIR (Aduanas)
  function escribirTexto(elemento, texto, velocidad = 30) {
    let i = 0;
    elemento.text("");
    function mecanografiar() {
      if (i < texto.length) {
        elemento.text(elemento.text() + texto.charAt(i));
        i++;
        setTimeout(mecanografiar, velocidad);
      }
    }
    mecanografiar();
  }

  const textoAduanas = "Ha habido un problema con aduanas y tu regalo físico está tardando más de lo previsto en llegar...";
  escribirTexto($('#texto-aduanas'), textoAduanas, 40);

  // Transición de aduanas a cine
  $('#btn-siguiente').click(function() {
    $('#pantalla-aduanas').fadeOut(800, function() {
      $('#pantalla-carga').fadeIn(800);
    });
  });

  // 2. CONFIGURACIÓN DE LA REVISTA
  const magazine = $('#magazine');
  const totalPaginas = 54;

  for (let i = 1; i <= totalPaginas; i++) {
    magazine.append(`<div class="page" style="background-image:url('img/paginas/${i}.jpg');"></div>`);
  }

// 2. Función matemática de escala (Responsive Corregido)
  function adaptarPantalla() {
    const esMovil = $(window).width() < 768;

    // En móvil usamos el 95% de la pantalla para que sea GIGANTE, en PC el 90%
    const porcentajeAncho = esMovil ? 0.95 : 0.9;
    const porcentajeAlto = esMovil ? 0.90 : 0.8;

    const anchoVentana = $(window).width() * porcentajeAncho;
    const altoVentana = $(window).height() * porcentajeAlto;

    // LA CLAVE: Si es móvil, la base es 400. Si es PC, es 800.
    const anchoRevista = esMovil ? 400 : 800;
    const altoRevista = 565;

    let escala = Math.min(anchoVentana / anchoRevista, altoVentana / altoRevista);
    if (escala > 1) escala = 1;

    magazine.css({
      'transform': `scale(${escala})`,
      'transform-origin': 'center center'
    });
  }

  $(window).resize(adaptarPantalla);

  // 3. BOTÓN DE ENTRADA Y PANTALLA COMPLETA
  $('#btn-entrar').click(function() {
    document.getElementById('audio-fondo').play();

    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch(err => {});
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    }

    setTimeout(function() {
      $('#pantalla-carga').fadeOut(800, function() {

        $('#contenedor-revista').css({ display: 'flex', opacity: 0 });

        const esMovil = $(window).width() < 768;

        magazine.turn({
          width: esMovil ? 400 : 800,
          height: 565,
          display: esMovil ? 'single' : 'double',

          /* MAGIA: Si es móvil apaga el 3D, si es PC lo deja encendido */
          acceleration: esMovil ? false : true,

          gradients: true,
          elevation: 50
        });

        magazine.bind('turning', function(event, page, view) {
          const audioPapel = document.getElementById('audio-pagina');
          audioPapel.currentTime = 0;
          let promesa = audioPapel.play();
          if (promesa !== undefined) {
            promesa.catch(error => { });
          }
          // SI LLEGA A LA ÚLTIMA PÁGINA (54), reproducimos tu mensaje de voz
          if (page === 54) {
            const audioVoz = document.getElementById('audio-voz');
            const audioMusica = document.getElementById('audio-fondo');

            // 1. Bajamos el volumen de Hans Zimmer al 20% para que no tape tu voz
            audioMusica.volume = 0.2;

            // 2. Esperamos 1 segundo y reproducimos tu nota de voz
            setTimeout(() => {
              audioVoz.play().catch(e => {});
            }, 1000);

          } else {
            // Si Fran retrocede a cualquier otra página, la música vuelve a estar a tope (100%)
            document.getElementById('audio-fondo').volume = 1.0;
          }
        });

        adaptarPantalla();
        $('#contenedor-revista').animate({ opacity: 1 }, 1000);
      });
    }, 500);
  });

  // 4. CONTROLES DEFINITIVOS (Teclado, Ratón y Táctil Simple)

  // Teclado (Flechas)
  $(document).keydown(function(e){
    if (e.keyCode == 37) {
      magazine.turn('previous');
    } else if (e.keyCode == 39) {
      magazine.turn('next');
    }
  });

  // Táctil infalible para móviles: Tocar los bordes de la pantalla
  $('#contenedor-revista').on('click', function(e) {
    const anchoVentana = $(window).width();
    const posicionToque = e.pageX;

    // Si toca en el 25% derecho de la pantalla, avanza.
    if (posicionToque > anchoVentana * 0.75) {
      magazine.turn('next');
    }
    // Si toca en el 25% izquierdo de la pantalla, retrocede.
    else if (posicionToque < anchoVentana * 0.25) {
      magazine.turn('previous');
    }
    // (El centro queda libre para que el ratón en PC pueda agarrar la página de forma natural)
  });

});
