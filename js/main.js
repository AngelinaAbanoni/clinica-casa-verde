// ===== Config básica (cambiamos luego)
const WHATSAPP_NUMBER = "59891501957"; // sin + ni espacios
const WHATSAPP_MSG = "Hola, quiero agendar una consulta en Clínica Casa Verde.";

function buildWhatsappLink() {
    const text = encodeURIComponent(WHATSAPP_MSG);
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

// ===== Menú mobile (existe en todas)
const navToggle = document.getElementById("navToggle");
const siteNav = document.getElementById("siteNav");

if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => {
        const isOpen = siteNav.classList.toggle("is-open");
        navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    siteNav.querySelectorAll("a").forEach((a) => {
        a.addEventListener("click", () => {
            siteNav.classList.remove("is-open");
            navToggle.setAttribute("aria-expanded", "false");
        });
    });
}

// ===== WhatsApp links (puede existir o no)
["btnWhatsappTop", "btnWhatsappBottom", "fabWhatsapp"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.href = buildWhatsappLink();
});

// ===== Año footer (puede existir o no)
const year = document.getElementById("year");
if (year) year.textContent = String(new Date().getFullYear());

// ======================================================================
// ===== FORM CONTACTO (Formspree) - NO bloquea el envío
// ======================================================================
const contactForm = document.getElementById("contactForm");
const formMsg = document.getElementById("formMsg");

if (contactForm) {
    const btnSubmit = contactForm.querySelector("button[type='submit']");

    contactForm.addEventListener("submit", async (e) => {
        // IMPORTANTE: frenamos el submit normal para mandar por fetch,
        // pero NO reseteamos ni mostramos "gracias" antes de enviar.
        e.preventDefault();

        // agarramos campos por name (como los tenés en el HTML)
        const nombreEl = contactForm.querySelector('[name="nombre"]');
        const emailEl = contactForm.querySelector('[name="email"]');
        const mensajeEl = contactForm.querySelector('[name="mensaje"]');

        const nombre = nombreEl ? nombreEl.value.trim() : "";
        const email = emailEl ? emailEl.value.trim() : "";
        const mensaje = mensajeEl ? mensajeEl.value.trim() : "";

        // Validación simple (esto arregla el “me dice que está vacío”)
        if (!nombre || !email || !mensaje) {
            if (formMsg) formMsg.textContent = "❌ Completá nombre, email y mensaje antes de enviar.";
            return;
        }

        // Si existe _replyto, lo llenamos (Formspree lo usa para responder)
        const replyto = contactForm.querySelector('[name="_replyto"]');
        if (replyto) replyto.value = email;

        // UI
        if (formMsg) formMsg.textContent = "";
        const originalBtnText = btnSubmit ? btnSubmit.textContent : "";
        if (btnSubmit) {
            btnSubmit.disabled = true;
            btnSubmit.textContent = "Enviando...";
        }

        try {
            const response = await fetch(contactForm.action, {
                method: contactForm.method || "POST",
                body: new FormData(contactForm),
                headers: { "Accept": "application/json" }
            });

            if (response.ok) {
                contactForm.reset();
                if (formMsg) formMsg.textContent = "✅ ¡Mensaje enviado! Te respondemos a la brevedad.";
            } else {
                if (formMsg) formMsg.textContent = "❌ No se pudo enviar. Intentá de nuevo en un ratito.";
            }
        } catch (err) {
            if (formMsg) formMsg.textContent = "❌ Error de conexión. Probá más tarde.";
        } finally {
            if (btnSubmit) {
                btnSubmit.disabled = false;
                btnSubmit.textContent = originalBtnText || "Enviar";
            }
        }
    });
}

// ======================================================================
// ===== Galería modal (solo en galeria.html)
// ======================================================================
const gallery = document.getElementById("gallery");
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modalImg");
const modalClose = document.getElementById("modalClose");
const modalBackdrop = document.getElementById("modalBackdrop");

function openModal(src) {
    if (!modal || !modalImg) return;
    modalImg.src = src;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    if (modalImg) modalImg.src = "";
}

if (gallery) {
    gallery.addEventListener("click", (e) => {
        const btn = e.target.closest(".gallery-item");
        if (!btn) return;
        const src = btn.getAttribute("data-img");
        if (src) openModal(src);
    });
}

if (modalClose) modalClose.addEventListener("click", closeModal);
if (modalBackdrop) modalBackdrop.addEventListener("click", closeModal);
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
});

// ======================================================================
// ===== HERO SLIDESHOW (crossfade limpio)
// ======================================================================
const hero = document.querySelector(".hero");

if (hero) {
    const images = [ //SI QUIERO AGREGAR MAS IMAGENES PONGO ACA LA RUTA
        "img/Neuro3.jpg",
        "img/clinicaFrente.jpg",
        "img/Fono.jpg",
        "img/recepcion.jpg",
        "img/Sala4.jpg",
        "img/Salita.jpg"
    ];

    let index = 0;
    let showingA = true;

    // set inicial
    hero.style.setProperty("--hero-bg-a", `url("${images[0]}")`);
    hero.style.setProperty("--hero-bg-b", `url("${images[1]}")`);
    hero.classList.add("show-a");

    setInterval(() => {
        // avanzamos índice
        index = (index + 1) % images.length;

        if (showingA) {
            // cargamos la próxima en B (oculta)
            hero.style.setProperty("--hero-bg-b", `url("${images[index]}")`);

            // ahora hacemos el fade
            hero.classList.remove("show-a");
            hero.classList.add("show-b");
        } else {
            // cargamos la próxima en A (oculta)
            hero.style.setProperty("--hero-bg-a", `url("${images[index]}")`);

            hero.classList.remove("show-b");
            hero.classList.add("show-a");
        }

        showingA = !showingA;
    }, 5000);
}
// ===== FIN HERO SLIDESHOW =====


// ======================================================================
// ===== Servicios: seleccionar visualmente (solo en servicios.html)
// ======================================================================
const serviceCards = document.querySelectorAll(".service-card");

if (serviceCards.length) {
    serviceCards.forEach((card) => {
        card.addEventListener("click", (e) => {
            const href = card.getAttribute("href");

            // Si el link es real, dejamos que el navegador navegue
            if (href && href !== "#") {
                return;
            }

            // Si es "#", bloqueamos y usamos la lógica visual
            e.preventDefault();

            // ---- lógica visual que ya tenías ----
            serviceCards.forEach(c => c.classList.remove("active"));
            card.classList.add("active");
        });
    });
}

// ======================================================================
// ===== Animación frase del hero (cuando entra en pantalla)
// ======================================================================
const quote = document.querySelector(".page-hero-quote");

if (quote) {
    const obs = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    quote.classList.add("is-visible");
                    obs.disconnect(); // se anima 1 sola vez
                }
            });
        },
        { threshold: 0.25 }
    );

    obs.observe(quote);
}
// ===== Fin animación frase =====
