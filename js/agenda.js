(function () {
    const form = document.getElementById("agendaForm");
    const msg = document.getElementById("agendaMsg");
    if (!form) return;

    function soloNumeros(str) {
        return /^[0-9]+$/.test(str);
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const especialidad = form.especialidad.value.trim();
        const tipoPaciente = form.tipoPaciente.value.trim();
        const centro = form.centro.value.trim();
        const fecha = form.fecha.value;
        const hora = form.hora.value;
        const nombre = form.nombre.value.trim();
        const cedula = form.cedula.value.trim();
        const comentarios = form.comentarios.value.trim();

        if (!especialidad || !tipoPaciente || !centro || !fecha || !hora || !nombre || !cedula) {
            msg.textContent = "Por favor completá todos los campos obligatorios.";
            return;
        }

        if (!soloNumeros(cedula)) {
            msg.textContent = "La cédula debe tener solo números (sin puntos ni guiones).";
            return;
        }

        msg.textContent = "Listo ✅ Ahora te redirijo a WhatsApp para enviar la solicitud.";

        // Armá tu número real de WhatsApp acá (formato internacional sin +)
        const telefonoWhatsApp = "59800000000";

        const texto =
            `Hola, quiero agendar una consulta.\n\n` +
            `Especialidad: ${especialidad}\n` +
            `Paciente: ${tipoPaciente}\n` +
            `Centro: ${centro}\n` +
            `Fecha: ${fecha}\n` +
            `Hora: ${hora}\n` +
            `Nombre: ${nombre}\n` +
            `CI: ${cedula}\n` +
            (comentarios ? `Comentarios: ${comentarios}\n` : "");

        const url = `https://wa.me/${telefonoWhatsApp}?text=${encodeURIComponent(texto)}`;
        window.open(url, "_blank", "noopener");
    });
})();
