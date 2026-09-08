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

  // LA SOLUCIÓN DEFINITIVA PARA QUE SEA GIGANTE
  function adaptarPantalla() {
    const esMovil = $(window).width() < 768;

    if (esMovil) {
      // Tomamos el 95% del ancho de la pantalla de tu móvil
      const anchoGigante = $(window).width() * 0.95;
      // Calculamos el alto para que mantenga las proporciones de tu foto
      const altoGigante = anchoGigante * (565 / 400);

      // Le inyectamos las medidas exactas a la fuerza
      if (magazine.turn('is')) {
        magazine.turn('size', anchoGigante, altoGigante);
      }

      // Apagamos la escala CSS para que el móvil no la encoja dos veces
      magazine.css({ 'transform': 'none' });
    } else {
      // En ordenador seguimos con la escala normal
      const anchoVentana = $(window).width() * 0.9;
      const altoVentana = $(window).height() * 0.8;
      let escala = Math.min(anchoVentana / 800, altoVentana / 565);
      if (escala > 1) escala = 1;

      magazine.css({
        'transform': `scale(${escala})`,
        'transform-origin': 'center center'
      });
    }
  }

  $(window).resize(adaptarPantalla);

  // 3. INICIO DE LA REVISTA
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

        // Medidas iniciales gigantes para el móvil
        const anchoGigante = $(window).width() * 0.95;
        const altoGigante = anchoGigante * (565 / 400);

        magazine.turn({
          width: esMovil ? anchoGigante : 800,
          height: esMovil ? altoGigante : 565,
          display: esMovil ? 'single' : 'double',
          acceleration: esMovil ? false : true,
          gradients: true,
          elevation: 50
        });

        magazine.bind('turning', function(event, page, view) {
          const audioPapel = document.getElementById('audio-pagina');
          audioPapel.currentTime = 0;
          let promesa = audioPapel.play();
          if (promesa !== undefined) { promesa.catch(error => { }); }
          if (page === 54) {
            const audioVoz = document.getElementById('audio-voz');
            setTimeout(() => { audioVoz.play().catch(e => {}); }, 1000);
          }
        });

        adaptarPantalla();
        $('#contenedor-revista').animate({ opacity: 1 }, 1000);
      });
    }, 500);
  });

  // 4. CONTROLES DE PASO DE PÁGINA
  $(document).keydown(function(e){
    if (e.keyCode == 37) magazine.turn('previous');
    else if (e.keyCode == 39) magazine.turn('next');
  });

  $('#contenedor-revista').on('click', function(e) {
    const anchoVentana = $(window).width();
    const posicionToque = e.pageX;
    if (posicionToque > anchoVentana * 0.75) magazine.turn('next');
    else if (posicionToque < anchoVentana * 0.25) magazine.turn('previous');
  });

});
