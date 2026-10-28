/* Limpia entradas del navegador antes de usarlas.
   El sitio no tiene servidor propio: los formularios arman un mensaje de WhatsApp. */
(function () {
  function cleanText(value, max) {
    return String(value || "")
      .replace(/[\u0000-\u001F\u007F]/g, "")
      .replace(/[<>]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, max);
  }

  document.addEventListener(
    "submit",
    (event) => {
      const form = event.target;
      if (!(form instanceof HTMLFormElement)) return;

      form.querySelectorAll("input, textarea").forEach((field) => {
        const type = (field.getAttribute("type") || "text").toLowerCase();
        if (type === "checkbox" || type === "radio" || type === "hidden" || type === "file") return;

        if (type === "email") {
          field.value = cleanText(field.value, 120).toLowerCase();
          return;
        }

        if (type === "tel") {
          field.value = cleanText(field.value, 20).replace(/[^\d+\s()-]/g, "");
          return;
        }

        if (type === "number") {
          field.value = cleanText(field.value, 3).replace(/\D/g, "");
          return;
        }

        const max = field.name && field.name.indexOf("cedula") !== -1 ? 20 : 80;
        field.value = cleanText(field.value, max);
      });
    },
    true
  );
})();
