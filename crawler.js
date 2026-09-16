async function obtenerConvocatoriasReales() {
  const convocatorias = [];

  // 1. RASTREO DINÁMICO GVA: Adjudicaciones Continuas y Difícil Cobertura
  try {
    console.log("-> Inspeccionando adjudicaciones continuas de la GVA en tiempo real...");
    const urlGVA = "https://ceice.gva.es/es/web/rrhh-educacion/adjudicaciones-continuas";
    const res = await fetch(urlGVA, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });

    if (res.ok) {
      const html = await res.text();

      // Buscamos patrones del tipo: Convocatoria ADC-EDU-XXX/XX o similares con su plazo
      const regexConvocatoria = /(?:Convocatoria\s+)?(ADC-[A-Z]+-\d+\/\d+)[^<]*?\((?:Hasta|fins a)\s+([^)]+)\)/i;
      const match = html.match(regexConvocatoria);

      if (match) {
        const codigo = match[1].trim();
        const plazoTexto = match[2].trim();

        console.log(`[V] Detectada convocatoria en plazo GVA: ${codigo} - Hasta: ${plazoTexto}`);

        convocatorias.push({
          titulo: `Convocatoria ${codigo}: Adjudicaciones Continuas y Difícil Cobertura Docente`,
          organismo: "Conselleria d'Educació (GVA)",
          url_sede: "https://ovidoc.edu.gva.es/", // Enlace directo a la tramitación OVIDOC / GVA
          requisitos: `Plazo oficial: Hasta ${plazoTexto}. Provisión de puestos de difícil cobertura y sustituciones docentes urgentes. Petición telemática mediante OVIDOC.`,
          ccaa: "Comunitat Valenciana",
          ambito: "autonomico",
          puesto: "Educación Especial",
          tipo: "interinos",
          tipo_etiqueta: "Difícil Cobertura (Urgente)",
          color_etiqueta: "bg-amber-100 text-amber-900 border-amber-300",
          fecha_fin: null // Al ser ventana horaria exprés, se indica detallado en requisitos/plazo
        });
      } else {
        // Si justo entre convocatorias no hay un código activo en cabecera
        convocatorias.push({
          titulo: "Adjudicaciones Continuas y Difícil Cobertura Docente (GVA)",
          organismo: "Conselleria d'Educació (GVA)",
          url_sede: "https://ovidoc.edu.gva.es/",
          requisitos: "Sistema semanal continuo de sustituciones y puestos urgentes docentes. Solicitud telemática activa mediante OVIDOC.",
          ccaa: "Comunitat Valenciana",
          ambito: "autonomico",
          puesto: "Educación Especial",
          tipo: "interinos",
          tipo_etiqueta: "Difícil Cobertura (Urgente)",
          color_etiqueta: "bg-amber-100 text-amber-900 border-amber-300",
          fecha_fin: null
        });
      }
    }
  } catch (err) {
    console.warn("Aviso escaneando GVA:", err.message);
  }

  // 2. RASTREO DINÁMICO DEL ESTADO Y OTRAS CC.AA. (Feed Oficial del Punto de Acceso General)
  try {
    console.log("-> Conectando al feed oficial de convocatorias del Estado...");
    const res = await fetch("https://administracion.gob.es/pag_Home/empleoPublico/rss/ofertas-empleo-publico.rss", {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });

    if (res.ok) {
      const xml = await res.text();
      const items = xml.split('<item>');

      for (let i = 1; i < items.length; i++) {
        const item = items[i];
        const titleMatch = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || item.match(/<title>(.*?)<\/title>/);
        const linkMatch = item.match(/<link><!\[CDATA\[(.*?)\]\]><\/link>/) || item.match(/<link>(.*?)<\/link>/);
        const descMatch = item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/) || item.match(/<description>(.*?)<\/description>/);

        if (titleMatch && linkMatch) {
          const titulo = titleMatch[1].replace(/&amp;/g, '&').replace(/<[^>]+>/g, '').trim();
          const url_sede = linkMatch[1].trim();
          const descripcion = descMatch ? descMatch[1].replace(/<[^>]+>/g, '').trim() : '';
          const fullText = `${titulo} ${descripcion}`;

          const { tipo, tipo_etiqueta, color_etiqueta } = mapearTipo(fullText);
          const puesto = mapearSector(fullText);
          const { ccaa, ambito } = mapearCCAA(fullText);

          convocatorias.push({
            titulo: titulo.substring(0, 240),
            organismo: "Administración Convocante",
            url_sede: url_sede,
            requisitos: descripcion ? descripcion.substring(0, 280) : 'Consulta las bases completas y tramita la solicitud en la sede oficial.',
            ccaa,
            ambito,
            puesto,
            tipo,
            tipo_etiqueta,
            color_etiqueta,
            fecha_fin: null
          });
        }
      }
    }
  } catch (err) {
    console.warn("Aviso conectando al feed del Estado:", err.message);
  }

  return convocatorias;
}
