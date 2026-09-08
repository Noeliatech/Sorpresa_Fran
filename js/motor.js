$(document).ready(function() {

  // 1. MÁQUINA DE ESCRIBIR
  function escribirTexto(elemento, texto, velocidad = 30) {
    let i = 0; elemento.text("");
    function mecanografiar() {
      if (i < texto.length) { elemento.text(elemento.text() + texto.charAt(i)); i++; setTimeout(mecanografiar, velocidad); }
    }
    mecanografiar();
  }

  escribirTexto($('#texto-aduanas'), "Ha habido un problema con aduanas y tu regalo físico está tardando más de lo previsto en llegar...", 40);

  $('#btn-siguiente').click(function() {
    $('#pantalla-aduanas').fadeOut(800, function() { $('#pantalla-carga').fadeIn(800); });
  });

  // 2. CREACIÓN DE LAS PÁGINAS
  const magazine = $('#magazine');
  const totalPaginas = 54;
  for (let i = 1; i <= totalPaginas; i++) {
    magazine.append(`<div class="page" style="background-image:url('img/paginas/${i}.jpg');"></div>`);
  }

  // 3. LA CLAVE: CALCULAR EL TAMAÑO PERFECTO Y REDONDEADO (Sin decimales)
  function calcularTamañoHD() {
    const esMovil = $(window).width() < 768;
    const ww = $(window).width();
    const wh = $(window).height();

    const maxW = ww * (esMovil ? 0.95 : 0.90);
    const maxH = wh * 0.75;

    const ratio = esMovil ? (400 / 565) : (800 / 565);

    // EL SECRETO: Usamos Math.round() para que nunca haya píxeles con decimales
    let w = Math.round(maxW);
    let h = Math.round(w / ratio);

    if (h > maxH) {
      h = Math.round(maxH);
      w = Math.round(h * ratio);
    }

    return { ancho: w, alto: h, display: esMovil ? 'single' : 'double' };
  }

  // 4. INICIO Y MOTOR GRÁFICO
  $('#btn-entrar').click(function() {
    document.getElementById('audio-fondo').play();
    const elem = document.documentElement;
    if (elem.requestFullscreen) elem.requestFullscreen().catch(err => {});
    else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();

    setTimeout(function() {
      $('#pantalla-carga').fadeOut(800, function() {
        $('#contenedor-revista').css({ display: 'flex', opacity: 0 });

        const medidas = calcularTamañoHD();

        magazine.turn({
          width: medidas.ancho,
          height: medidas.alto,
          display: medidas.display,
          acceleration: true, // Motor gráfico encendido para fluidez
          gradients: true,
          elevation: 50
        });

        magazine.css({ 'transform': 'none', 'margin': 'auto' });

        magazine.bind('turning', function(event, page, view) {
          const audioPapel = document.getElementById('audio-pagina');
          audioPapel.currentTime = 0;
          let promesa = audioPapel.play();
          if (promesa !== undefined) promesa.catch(() => {});

          if (page === totalPaginas) {
            const audioVoz = document.getElementById('audio-voz');
            setTimeout(() => { audioVoz.play().catch(e => {}); }, 1000);
          }
        });

        $('#contenedor-revista').animate({ opacity: 1 }, 1000);
      });
    }, 500);
  });

  // 5. CONTROLES TÁCTILES Y DE TECLADO
  $(document).keydown(function(e){
    if (e.keyCode == 37) magazine.turn('previous');
    else if (e.keyCode == 39) magazine.turn('next');
  });

  $('#contenedor-revista').on('click', function(e) {
    const anchoVentana = $(window).width();
    if (e.pageX > anchoVentana * 0.70) magazine.turn('next');
    else if (e.pageX < anchoVentana * 0.30) magazine.turn('previous');
  });

});
