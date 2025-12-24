// Slider universal para todas las especialidades
(function () {
    const slider = document.querySelector(".galeria-slider");
    if (!slider) return;

    const folder = slider.dataset.folder;
    if (!folder) return;

    const basePath = `../img/especialidades/${folder}/`;

    const imagenes = [
        basePath + "1.JPG",
        basePath + "2.JPG",
        basePath + "3.JPG",
        basePath + "4.JPG",
        basePath + "5.JPG"
    ];


    let indice = 0;

    const img = document.getElementById("galeriaImg");
    const btnNext = slider.querySelector(".galeria-btn.next");
    const btnPrev = slider.querySelector(".galeria-btn.prev");

    if (!img || !btnNext || !btnPrev) return;

    function mostrarImagen(nuevoIndice) {
        indice = nuevoIndice;

        if (indice >= imagenes.length) indice = 0;
        if (indice < 0) indice = imagenes.length - 1;

        // Fade out
        img.classList.add("is-fading");

        // Espera a que se vea el fade, cambia la imagen y hace fade in
        setTimeout(() => {
            img.src = imagenes[indice];

            // Cuando cargue la nueva, vuelve a aparecer
            img.onload = () => {
                img.classList.remove("is-fading");
            };
        }, 180);
    }


    btnNext.addEventListener("click", () => {
        mostrarImagen(indice + 1);
    });

    btnPrev.addEventListener("click", () => {
        mostrarImagen(indice - 1);
    });
})();
