(function () {
    'use strict';

    var nav = document.querySelector('.nav');
    var menuButton = document.querySelector('.menu-toggle');
    var menu = document.getElementById('menu');

    var mobileQuery = window.matchMedia ? window.matchMedia('(max-width: 768px)') : null;

    function isMobile() {
        return mobileQuery ? mobileQuery.matches : window.innerWidth <= 768;
    }

    function openMenu() {
        menu.classList.add('is-open');
        document.body.classList.add('menu-open');
        nav.classList.remove('nav--hidden');
        menuButton.setAttribute('aria-expanded', 'true');
        menuButton.setAttribute('aria-label', 'Cerrar menú');
    }

    function closeMenu() {
        menu.classList.remove('is-open');
        document.body.classList.remove('menu-open');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Abrir menú');
    }

    function toggleMenu() {
        if (menu.classList.contains('is-open')) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    if (nav && menuButton && menu) {
        menuButton.addEventListener('click', toggleMenu);

        var links = menu.querySelectorAll('a');
        for (var i = 0; i < links.length; i++) {
            links[i].addEventListener('click', closeMenu);
        }

        document.addEventListener('keydown', function (event) {
            if ((event.key === 'Escape' || event.keyCode === 27) && menu.classList.contains('is-open')) {
                closeMenu();
                menuButton.focus();
            }
        });
    }

    var lastScrollY = window.pageYOffset;
    var ticking = false;
    var DELTA = 8;

    function updateNav() {
        var currentY = window.pageYOffset;

        if (currentY > 20) {
            nav.classList.add('is-scrolled');
        } else {
            nav.classList.remove('is-scrolled');
        }

        if (!isMobile() || menu.classList.contains('is-open') || currentY <= 0) {
            nav.classList.remove('nav--hidden');
            lastScrollY = currentY;
            ticking = false;
            return;
        }

        var diff = currentY - lastScrollY;

        if (Math.abs(diff) > DELTA) {
            if (diff > 0 && currentY > nav.offsetHeight) {
                nav.classList.add('nav--hidden');
            } else if (diff < 0) {
                nav.classList.remove('nav--hidden');
            }
            lastScrollY = currentY;
        }

        ticking = false;
    }

    if (nav && menu) {
        window.addEventListener('scroll', function () {
            if (!ticking) {
                window.requestAnimationFrame(updateNav);
                ticking = true;
            }
        });

        nav.addEventListener('focusin', function () {
            nav.classList.remove('nav--hidden');
        });

        window.addEventListener('resize', function () {
            if (!isMobile()) {
                closeMenu();
                nav.classList.remove('nav--hidden');
            }
        });

        updateNav();
    }

    var year = document.getElementById('year');
    if (year) {
        year.textContent = new Date().getFullYear();
    }

    var modal = document.getElementById('modal-invitado');
    var modalClose = document.getElementById('modal-close');
    var modalImg = document.getElementById('modal-img');
    var modalNombre = document.getElementById('modal-nombre');
    var modalDesc = document.getElementById('modal-desc');
    var tarjetasInvitados = document.querySelectorAll('.tarjeta-invitado');

    if (modal && tarjetasInvitados.length > 0) {
        for (var t = 0; t < tarjetasInvitados.length; t++) {
            tarjetasInvitados[t].addEventListener('click', function () {
                var nombre = this.getAttribute('data-nombre');
                var desc = this.getAttribute('data-desc');
                var img = this.getAttribute('data-img');

                modalNombre.textContent = nombre;
                modalDesc.textContent = desc;
                modalImg.src = img;
                modalImg.alt = 'Fotografía de ' + nombre;

                if (typeof modal.showModal === 'function') {
                    modal.showModal();
                } else {
                    modal.setAttribute('open', '');
                }
            });
        }

        if (modalClose) {
            modalClose.addEventListener('click', function () {
                if (typeof modal.close === 'function') {
                    modal.close();
                } else {
                    modal.removeAttribute('open');
                }
            });
        }

        modal.addEventListener('click', function (evento) {
            if (evento.target === modal) {
                if (typeof modal.close === 'function') {
                    modal.close();
                } else {
                    modal.removeAttribute('open');
                }
            }
        });
    }

    var GASTOS_POR_ENTRADA = 1.5;
    var MAXIMO_POR_TIPO = 10;

    var formulario = document.querySelector('#formulario-compra');
    var entradas = document.querySelectorAll('.entrada');

    var resumenLista = document.querySelector('#resumen-lista');
    var totalEntradasTexto = document.querySelector('#total-entradas');
    var subtotalTexto = document.querySelector('#subtotal');
    var gastosTexto = document.querySelector('#gastos');
    var totalTexto = document.querySelector('#total');

    var botonComprar = document.querySelector('#boton-comprar');
    var mensaje = document.querySelector('#mensaje');
    var campoNombre = document.querySelector('#nombre');
    var campoEmail = document.querySelector('#email');

    function formatearPrecio(numero) {
        return numero.toFixed(2).replace('.', ',') + ' €';
    }

    function leerCantidad(entrada) {
        var cantidad = entrada.querySelector('.contador__cantidad');
        return parseInt(cantidad.textContent, 10);
    }

    function escribirCantidad(entrada, numero) {
        var cantidad = entrada.querySelector('.contador__cantidad');
        cantidad.textContent = numero;
    }

    function mostrarMensaje(texto, tipo) {
        if (!mensaje) return;
        mensaje.textContent = texto;
        mensaje.className = 'mensaje mensaje--' + tipo;
    }

    function borrarMensaje() {
        if (!mensaje) return;
        mensaje.textContent = '';
        mensaje.className = 'mensaje';
    }

    function actualizarTotal() {
        if (!entradas.length) return;

        var totalEntradas = 0;
        var subtotal = 0;
        var lineasResumen = '';

        for (var j = 0; j < entradas.length; j++) {
            var entrada = entradas[j];

            var precio = parseFloat(entrada.getAttribute('data-precio'));
            var nombreEntrada = entrada.getAttribute('data-nombre');
            var cantidad = leerCantidad(entrada);
            var subtotalEntrada = precio * cantidad;

            var subtotalElem = entrada.querySelector('.entrada__subtotal strong');
            if (subtotalElem) {
                subtotalElem.textContent = formatearPrecio(subtotalEntrada);
            }

            var btnMenos = entrada.querySelector('.contador__boton--menos');
            var btnMas = entrada.querySelector('.contador__boton--mas');
            if (btnMenos) btnMenos.disabled = (cantidad === 0);
            if (btnMas) btnMas.disabled = (cantidad === MAXIMO_POR_TIPO);

            if (cantidad > 0) {
                entrada.classList.add('is-seleccionada');
                lineasResumen = lineasResumen +
                    '<li><span>' + cantidad + ' × ' + nombreEntrada + '</span>' +
                    '<strong>' + formatearPrecio(subtotalEntrada) + '</strong></li>';
            } else {
                entrada.classList.remove('is-seleccionada');
            }

            totalEntradas = totalEntradas + cantidad;
            subtotal = subtotal + subtotalEntrada;
        }

        var gastos = totalEntradas * GASTOS_POR_ENTRADA;
        var total = subtotal + gastos;

        if (resumenLista) {
            if (lineasResumen === '') {
                resumenLista.innerHTML = '<li class="resumen__vacio">Todavía no has elegido ninguna entrada.</li>';
            } else {
                resumenLista.innerHTML = lineasResumen;
            }
        }

        if (totalEntradasTexto) totalEntradasTexto.textContent = totalEntradas;
        if (subtotalTexto) subtotalTexto.textContent = formatearPrecio(subtotal);
        if (gastosTexto) gastosTexto.textContent = formatearPrecio(gastos);
        if (totalTexto) totalTexto.textContent = formatearPrecio(total);

        if (botonComprar) botonComprar.disabled = (totalEntradas === 0);
    }

    function conectarContador(entrada) {
        var botonMenos = entrada.querySelector('.contador__boton--menos');
        var botonMas = entrada.querySelector('.contador__boton--mas');

        if (botonMas) {
            botonMas.addEventListener('click', function () {
                var cantidad = leerCantidad(entrada);
                if (cantidad < MAXIMO_POR_TIPO) {
                    escribirCantidad(entrada, cantidad + 1);
                    borrarMensaje();
                    actualizarTotal();
                }
            });
        }

        if (botonMenos) {
            botonMenos.addEventListener('click', function () {
                var cantidad = leerCantidad(entrada);
                if (cantidad > 0) {
                    escribirCantidad(entrada, cantidad - 1);
                    borrarMensaje();
                    actualizarTotal();
                }
            });
        }
    }

    if (entradas.length > 0) {
        for (var k = 0; k < entradas.length; k++) {
            conectarContador(entradas[k]);
        }
    }

    if (campoNombre) {
        campoNombre.addEventListener('input', function () {
            campoNombre.classList.remove('is-error');
        });
    }

    if (campoEmail) {
        campoEmail.addEventListener('input', function () {
            campoEmail.classList.remove('is-error');
        });
    }

    if (formulario) {
        formulario.addEventListener('submit', function (evento) {
            evento.preventDefault();

            var nombreValor = campoNombre ? campoNombre.value.trim() : '';
            var emailValor = campoEmail ? campoEmail.value.trim() : '';
            var hayErrores = false;

            if (nombreValor === '') {
                if (campoNombre) campoNombre.classList.add('is-error');
                hayErrores = true;
            }

            if (emailValor.indexOf('@') === -1 || emailValor.indexOf('.') === -1) {
                if (campoEmail) campoEmail.classList.add('is-error');
                hayErrores = true;
            }

            if (hayErrores) {
                mostrarMensaje('Revisa tu nombre y tu email antes de comprar.', 'error');
                return;
            }

            mostrarMensaje('¡Entradas confirmadas, ' + nombreValor + '! Nos vemos en Splash Fest. Total: ' + totalTexto.textContent, 'ok');

            for (var m = 0; m < entradas.length; m++) {
                escribirCantidad(entradas[m], 0);
            }
            if (campoNombre) campoNombre.value = '';
            if (campoEmail) campoEmail.value = '';
            actualizarTotal();
        });
    }

    actualizarTotal();

})();