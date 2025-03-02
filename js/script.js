document.addEventListener('DOMContentLoaded', () => {
    // Modal de la página principal
    const galleryImages = document.querySelectorAll('.gallery-container img');
    const galleryModal = document.getElementById('imageModal');
    const galleryModalImage = document.getElementById('modalImage');
    const closeGalleryModal = document.getElementById('closeModal');

    if (galleryImages.length > 0 && galleryModal) {
        galleryImages.forEach(image => {
            image.addEventListener('click', () => {
                galleryModal.style.display = 'flex';
                galleryModalImage.src = image.src;
            });
        });

        closeGalleryModal.addEventListener('click', () => {
            galleryModal.style.display = 'none';
        });

        galleryModal.addEventListener('click', (e) => {
            if (e.target === galleryModal) {
                galleryModal.style.display = 'none';
            }
        });
    }

    // Modal del menú
    const menuImages = document.querySelectorAll('.menu-images-container img');
    const menuModal = document.getElementById('menuImageModal');
    const menuModalImage = document.getElementById('menuModalImage');
    const closeMenuModal = document.getElementById('closeMenuModal');

    if (menuImages.length > 0 && menuModal) {
        menuImages.forEach(image => {
            image.addEventListener('click', () => {
                menuModal.style.display = 'flex'; 
                menuModalImage.src = image.src; 
            });
        });

        closeMenuModal.addEventListener('click', () => {
            menuModal.style.display = 'none';
        });

        menuModal.addEventListener('click', (e) => {
            if (e.target === menuModal) {
                menuModal.style.display = 'none';
            }
        });
    }
});

//Filtrado de platos
document.addEventListener("DOMContentLoaded", function () {
    const filters = document.querySelectorAll("#menu-filters input[type='checkbox']");
    const menuCategories = document.querySelectorAll(".menu-category");

    filters.forEach(filter => {
        filter.addEventListener("change", function () {
            // Desmarcar todos los filtros antes de marcar el nuevo
            filters.forEach(f => {
                if (f !== this) f.checked = false;
            });

            applyFilters();
        });
    });

    function applyFilters() {
        let activeFilter = Array.from(filters).find(filter => filter.checked)?.value;

        menuCategories.forEach(category => {
            const items = category.querySelectorAll(".menu-item");
            let visibleItems = 0;

            items.forEach(item => {
                const itemCategories = item.dataset.category.split(" ");

                if (!activeFilter || itemCategories.includes(activeFilter)) {
                    item.style.display = "block"; // Mostrar plato
                    visibleItems++;
                } else {
                    item.style.display = "none"; // Ocultar plato
                }
            });

            // Ocultar el h2 si no hay platos visibles en la categoría
            const categoryTitle = category.querySelector("h2");
            categoryTitle.style.display = visibleItems > 0 ? "block" : "none";
        });
    }
});

//Implementacion del carrito en el formulario de reeservas 
document.addEventListener('DOMContentLoaded', () => {
    const cartButton = document.getElementById('cart-button');  // Botón de carrito
    const cartModal = document.getElementById('cart-modal');  // Modal del carrito
    const cartItemsList = document.getElementById('cart-items');
    const cartBookingItems = document.getElementById('cart-booking-items');
    const cartTotalElement = document.getElementById('cart-total');
    const cartCountElement = document.getElementById('cart-count');
    const cartDataInput = document.getElementById('cart-data');
    const closeCartButton = document.getElementById('close-cart-modal');  // Botón para cerrar el modal del carrito
    const confirmationMessage = document.getElementById('confirmation-message');  // Mensaje de confirmación
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const reservationForm = document.getElementById('reservation-form');  // Formulario de reserva

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Mostrar carrito
    function updateCartUI() {
        cartItemsList.innerHTML = '';
        let total = 0;

        cart.forEach((item, index) => {
            const li = document.createElement('li');
            li.textContent = `${item.name} - ${item.price}€`;

            const removeButton = document.createElement('button');
            removeButton.textContent = '❌';
            removeButton.addEventListener('click', () => removeFromCart(index));

            li.appendChild(removeButton);
            cartItemsList.appendChild(li);
            total += parseFloat(item.price);
        });

        cartTotalElement.textContent = total.toFixed(2);
        cartCountElement.textContent = cart.length;
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function updateCartBookingUI() {
        if(cartBookingItems) {
             cartBookingItems.innerHTML = '';
      
        // Contar cantidad de cada producto
        const productCount = {};
        cart.forEach(item => {
            productCount[item.name] = (productCount[item.name] || 0) + 1;
        });

        let cartText = "";

        Object.entries(productCount).forEach(([name, quantity]) => {
            const li = document.createElement('li');
            li.textContent = `${name} (x${quantity})`;

            const removeButton = document.createElement('button');
            removeButton.textContent = '❌';
            removeButton.onclick = () => {
                const itemIndex = cart.findIndex(product => product.name === name);
                removeFromCart(itemIndex);
            };

            li.appendChild(removeButton);
            cartBookingItems.appendChild(li);

            cartText += `${name} (x${quantity})\n`;
        });

        cartDataInput.value = cartText.trim(); // Gua
        }
       
    }
    

    // Agregar producto al carrito
    function addToCart(event) {
        const button = event.target;
        const name = button.getAttribute('data-name');
        const price = button.getAttribute('data-price');

        cart.push({ name, price });
        updateCartUI();
        updateCartBookingUI();
    }

    // Eliminar producto del carrito
    function removeFromCart(index) {
        cart.splice(index, 1);
        updateCartUI();
         updateCartBookingUI();
    }

    // Abrir modal del carrito al hacer clic en el botón del carrito
    cartButton.addEventListener('click', () => {
        if (cart.length > 0) {
            cartModal.style.display = 'flex'; // Muestra el modal si hay productos en el carrito
        } else {
            alert('Tu carrito está vacío.');
        }
    });

    // Cerrar el modal del carrito al hacer clic en el botón de cerrar
    closeCartButton.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });

    // Cerrar el modal si haces clic fuera del modal
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });

    // Confirmar carrito y proceder con la reserva
    // confirmCartButton.addEventListener('click', () => {
    //     if (cart.length === 0) {
    //         // Si el carrito está vacío, continuar con la reserva sin productos
    //         confirmationMessage.style.display = 'block';
    //         confirmationMessage.innerHTML = `
    //             <h3>¡Su reserva ha sido realizada con éxito!</h3>
    //             <p>Gracias por su reserva. No hay productos en su carrito, pero su reserva ha sido registrada correctamente.</p>
    //         `;
    //     } else {
    //         // Si hay productos, confirmar carrito
    //         cartModal.style.display = 'none'; // Cerrar el modal
    //         confirmationMessage.style.display = 'block';
    //         confirmationMessage.innerHTML = `
    //             <h3>¡Su reserva ha sido realizada con éxito!</h3>
    //             <p>Gracias por su compra. ¡Nos vemos pronto!</p>
    //             <p>Productos reservados: ${cart.map(item => item.name).join(', ')}</p>
    //         `;
    //     }

    //     // Limpiar carrito después de la reserva
    //     localStorage.removeItem('cart');
    //     cart = [];
    //     updateCartUI(); // Refrescar la interfaz del carrito
    //      updateCartBookingUI();

    //     // Enviar el formulario de reserva
    //     reservationForm.submit();
    // });

    // 🚀 Agregar funcionalidad a todos los botones "Añadir al Carrito"
    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });

    updateCartUI();
     updateCartBookingUI();

    // sendBookingButton.addEventListener('click', () => {
    //     if (cart.length === 0) {
    //         // Si el carrito está vacío, continuar con la reserva sin productos
    //         confirmationMessage.style.display = 'block';
    //         confirmationMessage.innerHTML = `
    //             <h3>¡Su reserva ha sido realizada con éxito!</h3>
    //             <p>Gracias por su reserva. No hay productos en su carrito, pero su reserva ha sido registrada correctamente.</p>
    //         `;
    //     } else {
    //         // Si hay productos, confirmar carrito
    //         cartModal.style.display = 'none'; // Cerrar el modal
    //         confirmationMessage.style.display = 'block';
    //         confirmationMessage.innerHTML = `
    //             <h3>¡Su reserva ha sido realizada con éxito!</h3>
    //             <p>Gracias por su compra. ¡Nos vemos pronto!</p>
    //             <p>Productos reservados: ${cart.map(item => item.name).join(', ')}</p>
    //         `;
    //     }

    //     // Limpiar carrito después de la reserva
    //     localStorage.removeItem('cart');
    //     cart = [];
    //     updateCartUI(); // Refrescar la interfaz del carrito
    //      updateCartBookingUI();

    //     // Enviar el formulario de reserva
    //     reservationForm.submit();
    // });


    // Evitar el envío del formulario si está presente en la página
    // reservationForm.addEventListener('submit', (e) => {
    //     e.preventDefault();  // Evitar el envío a Formspree
    // });
});



// Formulario
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("reservation-form");

  form?.addEventListener("submit", (e) => {
    const name = document.getElementById("name").value.trim();
    const surname = document.getElementById("surname").value.trim();
    const numPeople = document.getElementById("num-people").value.trim();
    const date = document.getElementById("date").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();

    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/; 
    const surnameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const phoneRegex = /^\d+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !nameRegex.test(name)) {
      alert("Por favor, introduce un nombre válido (solo letras).");
      e.preventDefault();
      return;
    }

    if (!surname || !surnameRegex.test(surname)) {
      alert("Por favor, introduce apellidos válidos (solo letras).");
      e.preventDefault();
      return;
    }

    if (!numPeople || isNaN(numPeople) || numPeople <= 0) {
      alert("Por favor, introduce un número de personas válido.");
      e.preventDefault();
      return;
    }

    if (!date || !dateRegex.test(date)) {
      alert("Por favor, introduce una fecha válida en formato YYYY-MM-DD.");
      e.preventDefault();
      return;
    }

    if (!phone || !phoneRegex.test(phone)) {
      alert("Por favor, introduce un número de teléfono válido (solo números).");
      e.preventDefault();
      return;
    }

    if (!email || !emailRegex.test(email)) {
      alert("Por favor, introduce un correo electrónico válido.");
      e.preventDefault();
      return;
    }
  });
});

//Menu grupos
document.addEventListener("DOMContentLoaded", function () {
    const detailsElements = document.querySelectorAll("details");

    detailsElements.forEach((details) => {
        details.addEventListener("toggle", function () {
            if (this.open) {
                detailsElements.forEach((otherDetails) => {
                    if (otherDetails !== this) {
                        otherDetails.removeAttribute("open");
                    }
                });
            }
        });
    });
});

//Cookie banner
document.addEventListener("DOMContentLoaded", function () {
    const cookieBanner = document.getElementById("cookie-banner");
    const acceptNecessaryButton = document.getElementById("accept-necessary-cookies");
    const acceptAllButton = document.getElementById("accept-all-cookies");

    if (!cookieBanner || !acceptNecessaryButton || !acceptAllButton) {
        console.error("El banner de cookies o los botones no se encontraron en el DOM.");
        return;
    }

    // Verificar si ya hay una elección guardada
    const cookiePreferences = JSON.parse(localStorage.getItem("cookiePreferences"));

    if (cookiePreferences && cookiePreferences.expiration > Date.now()) {
        cookieBanner.style.display = "none";
    }

    // Función para guardar la elección y establecer la fecha de expiración (1 mes)
    function setCookiePreference(type) {
        const expirationTime = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 días en milisegundos
        localStorage.setItem("cookiePreferences", JSON.stringify({ type, expiration: expirationTime }));
        cookieBanner.style.display = "none";

        if (type === "all") {
            console.log("Todas las cookies activadas.");
            // Aquí puedes activar otras cookies opcionales, como analíticas o de terceros
        } else {
            console.log("Solo cookies necesarias activadas.");
            // Aquí puedes bloquear cookies no esenciales si es necesario
        }
    }

    // Evento para aceptar solo las necesarias
    acceptNecessaryButton.addEventListener("click", function () {
        setCookiePreference("necessary");
    });

    // Evento para aceptar todas
    acceptAllButton.addEventListener("click", function () {
        setCookiePreference("all");
    });
});

