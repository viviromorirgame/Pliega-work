const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://zraygpraqlwkbcipoefa.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error("Error crítico: Falta configurar SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

function mapearPuestoDetallado(texto) {
  const t = texto.toLowerCase();

  // 1. Docentes (A2 / A1)
  if (t.includes('pedagogía terapéutica') || t.includes('pedagogia terapeutica') || t.includes(' pt ') || t.includes('(pt)')) {
    return 'Maestros: Pedagogía Terapéutica (PT)';
  }
  if (t.includes('audición y lenguaje') || t.includes('audicion y lenguaje') || t.includes(' al ') || t.includes('(al)')) {
    return 'Maestros: Audición y Lenguaje (AL)';
  }
  if (t.includes('infantil')) return 'Educación Infantil';
  if (t.includes('primaria') && !t.includes('atención primaria')) return 'Educación Primaria';
  if (t.includes('secundaria') || t.includes('profesor') || t.includes('docente') || t.includes('formación profesional')) return 'Educación Secundaria y FP';

  // 2. Personal Laboral / Apoyo Educativo / Social (C1 / B)
  if (t.includes('educador') && (t.includes('especial') || t.includes('educación especial') || t.includes('apoyo'))) {
    return 'Educador/a de Educación Especial (C1)';
  }
  if (t.includes('integración social') || t.includes('integracion social') || t.includes('tis') || t.includes('ptis')) {
    return 'Técnico Superior Integración Social (TIS/PTIS)';
  }
  if (t.includes('trabajo social') || t.includes('trabajador social') || t.includes('asistente social')) {
    return 'Trabajo Social';
  }

  // 3. Seguridad y Emergencias
  if (t.includes('policía local') || t.includes('policia local') || t.includes('policía municipal') || t.includes('guardia urbana')) {
    return 'Policía Local';
  }
  if (t.includes('bomber')) return 'Bomberos';

  // 4. Sanidad
  if (t.includes('enferm')) return 'Enfermería';
  if (t.includes('médic') || t.includes('facultativ')) return 'Medicina / Facultativos';
  if (t.includes('tcae') || t.includes('auxiliar de enfermería') || t.includes('auxiliar enfermeria')) return 'Auxiliar de Enfermería (TCAE)';
  if (t.includes('celador')) return 'Celadores';

  // 5. Administración General
  if (t.includes('auxiliar administrativo') || t.includes('auxiliar de administración')) return 'Auxiliar Administrativo (C2)';
  if (t.includes('administrativo') || t.includes('administrativa')) return 'Administrativo (C1)';
  if (t.includes('gestión') || t.includes('gestion') || t.includes('técnico de administración')) return 'Gestión y Técnicos (A2/A1)';

  // 6. Servicios y Oficios
  if (t.includes('limpieza') || t.includes('limpiador')) return 'Personal de Limpieza';
  if (t.includes('peón') || t.includes('peon') || t.includes('mantenimiento') || t.includes('oficios varios')) return 'Mantenimiento y Peones';

  return 'Administrativo (C1)';
}

function mapearTipo(texto) {
  const t = texto.toLowerCase();
  if (t.includes('difícil cobertura') || t.includes('dificil cobertura') || t.includes('urgente') || t.includes('interin') || t.includes('sustituc') || t.includes('adjudicaci') || t.includes('bolsa de trabajo') || t.includes('bolsa de empleo')) {
    return {
      tipo: 'interinos',
      tipo_etiqueta: t.includes('difícil cobertura') ? 'Difícil Cobertura (Urgente)' : 'Bolsa Urgente (Interinos)',
      color_etiqueta: 'bg-amber-100 text-amber-900 border-amber-300'
    };
  }
  if (t.includes('oposici') || t.includes('selectiv') || t.includes('pruebas') || t.includes('concurso-oposición') || t.includes('convocatoria')) {
    return {
      tipo: 'examenes',
      tipo_etiqueta: 'Examen / Oposición',
      color_etiqueta: 'bg-blue-100 text-blue-900 border-blue-300'
    };
  }
  return {
    tipo: 'fijo',
    tipo_etiqueta: 'Bolsa Ordinaria',
    color_etiqueta: 'bg-stone-100 text-stone-800 border-stone-300'
  };
}

function mapearCCAA(texto) {
  const t = texto.toLowerCase();
  if (t.includes('castilla-la mancha') || t.includes('castilla la mancha') || t.includes('toledo') || t.includes('albacete') || t.includes('ciudad real') || t.includes('cuenca') || t.includes('guadalajara') || t.includes('jccm')) {
    return { ccaa: 'Castilla-La Mancha', ambito: 'autonomico' };
  }
  if (t.includes('valenc') || t.includes('gva') || t.includes('alicante') || t.includes('castellón') || t.includes('valència')) {
    return { ccaa: 'Comunitat Valenciana', ambito: 'autonomico' };
  }
  if (t.includes('madrid')) return { ccaa: 'Comunidad de Madrid', ambito: 'autonomico' };
  if (t.includes('andaluc') || t.includes('sevilla') || t.includes('málaga') || t.includes('cádiz') || t.includes('granada') || t.includes('córdoba') || t.includes('almería') || t.includes('huelva') || t.includes('jaén')) {
    return { ccaa: 'Andalucía', ambito: 'autonomico' };
  }
  if (t.includes('castilla y león') || t.includes('castilla y leon') || t.includes('valladolid') || t.includes('burgos') || t.includes('león') || t.includes('salamanca')) {
    return { ccaa: 'Castilla y León', ambito: 'autonomico' };
  }
  if (t.includes('galicia') || t.includes('xunta') || t.includes('coruña') || t.includes('vigo') || t.includes('ourense') || t.includes('pontevedra') || t.includes('lugo')) {
    return { ccaa: 'Galicia', ambito: 'autonomico' };
  }
  if (t.includes('aragón') || t.includes('aragon') || t.includes('zaragoza') || t.includes('huesca') || t.includes('teruel')) return { ccaa: 'Aragón', ambito: 'autonomico' };
  if (t.includes('murcia')) return { ccaa: 'Murcia', ambito: 'autonomico' };
  if (t.includes('extremadura') || t.includes('badajoz') || t.includes('cáceres')) return { ccaa: 'Extremadura', ambito: 'autonomico' };
  if (t.includes('canarias') || t.includes('palmas') || t.includes('tenerife')) return { ccaa: 'Islas Canarias', ambito: 'autonomico' };
  if (t.includes('balear') || t.includes('palma') || t.includes('ibiza') || t.includes('menorca')) return { ccaa: 'Islas Baleares', ambito: 'autonomico' };
  if (t.includes('asturias') || t.includes('oviedo') || t.includes('gijón')) return { ccaa: 'Asturias', ambito: 'autonomico' };
  if (t.includes('cantabria') || t.includes('santander')) return { ccaa: 'Cantabria', ambito: 'autonomico' };
  if (t.includes('navarra') || t.includes('pamplona')) return { ccaa: 'Navarra', ambito: 'autonomico' };
  if (t.includes('rioja') || t.includes('logroño')) return { ccaa: 'La Rioja', ambito: 'autonomico' };
  if (t.includes('vasco') || t.includes('euskadi') || t.includes('bilbao') || t.includes('vitoria') || t.includes('san sebastián')) return { ccaa: 'País Vasco', ambito: 'autonomico' };
  if (t.includes('catalu') || t.includes('gencat') || t.includes('barcelona') || t.includes('girona') || t.includes('lleida') || t.includes('tarragona')) {
    return { ccaa: 'Cataluña', ambito: 'autonomico' };
  }

  return { ccaa: 'Estatal', ambito: 'estatal' };
}

async function sincronizar() {
  console.log("=== INICIANDO RASTREO: BOE OFICIAL Y BOLSAS AUTONÓMICAS DE DIFÍCIL COBERTURA ===");
  const registros = [];

  // =========================================================================
  // 1. RASTREO AUTONÓMICO VIVO: COMUNITAT VALENCIANA (Adjudicaciones Continuas)
  // =========================================================================
  try {
    console.log("-> [GVA] Rastreando adjudicaciones continuas y difícil cobertura docente...");
    const resGva = await fetch("https://ceice.gva.es/es/web/rrhh-educacion/adjudicaciones-continuas", {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });

    if (resGva.ok) {
      const html = await resGva.text();
      const match = html.match(/(ADC-[A-Z0-9\/]+)[^<]*?\((?:Hasta|fins a)\s+([^)]+)\)/i);

      if (match) {
        const codigo = match[1].trim();
        const plazo = match[2].trim();
        console.log(`   [V] Detectada en GVA: ${codigo} - Límite: ${plazo}`);

        registros.push({
          titulo: `Convocatoria ${codigo}: Adjudicaciones Continuas y Difícil Cobertura`,
          organismo: "Conselleria d'Educació (GVA)",
          url_sede: "https://ovidoc.edu.gva.es/",
          requisitos: `Plazo oficial: Hasta ${plazo}. Sustituciones docentes y vacantes sobrevenidas urgentes. Solicitud telemática en OVIDOC.`,
          ccaa: "Comunitat Valenciana",
          ambito: "autonomico",
          puesto: "Maestros: Pedagogía Terapéutica (PT)",
          tipo: "interinos",
          tipo_etiqueta: "Difícil Cobertura (Urgente)",
          color_etiqueta: "bg-amber-100 text-amber-900 border-amber-300",
          fecha_fin: null
        });
      }
    }
  } catch (e) {
    console.warn("Aviso GVA:", e.message);
  }

  // =========================================================================
  // 2. RASTREO AUTONÓMICO VIVO: CASTILLA-LA MANCHA (Educación y Difícil Cobertura)
  // =========================================================================
  try {
    console.log("-> [JCCM] Rastreando bolsas extraordinarias y difícil cobertura de Castilla-La Mancha...");
    const resJccm = await fetch("https://www.educa.jccm.es/es/empleo-docente", {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });

    if (resJccm.ok) {
      const htmlJccm = await resJccm.text();
      // Si el portal publica convocatorias de interinidad extraordinarias o difícil cobertura
      if (htmlJccm.toLowerCase().includes('extraordinaria') || htmlJccm.toLowerCase().includes('bolsa')) {
        registros.push({
          titulo: "Convocatoria Extraordinaria de Sustituciones y Difícil Cobertura (JCCM)",
          organismo: "Consejería de Educación, Cultura y Deportes (JCCM)",
          url_sede: "https://www.educa.jccm.es/es/empleo-docente",
          requisitos: "Provisión urgente de puestos vacantes de difícil cobertura y sustituciones docentes en centros de Castilla-La Mancha. Trámite en el portal educativo.",
          ccaa: "Castilla-La Mancha",
          ambito: "autonomico",
          puesto: "Maestros: Pedagogía Terapéutica (PT)",
          tipo: "interinos",
          tipo_etiqueta: "Difícil Cobertura (Urgente)",
          color_etiqueta: "bg-amber-100 text-amber-900 border-amber-300",
          fecha_fin: null
        });
      }
    }
  } catch (e) {
    console.warn("Aviso JCCM:", e.message);
  }

  // Bolsas de apoyo educativo C1 (Educador de Educación Especial y TIS)
  registros.push(
    {
      titulo: "Bolsa de Sustituciones Extraordinarias: Educador/a de Educación Especial (C1)",
      organismo: "Generalitat Valenciana (Función Pública / GVA Borses)",
      url_sede: "https://sede.gva.es",
      requisitos: "Plazo exprés de llamamiento urgente. Título de Técnico Superior en Integración Social o equivalente para cobertura de plazas en centros educativos.",
      ccaa: "Comunitat Valenciana",
      ambito: "autonomico",
      puesto: "Educador/a de Educación Especial (C1)",
      tipo: "interinos",
      tipo_etiqueta: "Difícil Cobertura (Urgente)",
      color_etiqueta: "bg-amber-100 text-amber-900 border-amber-300",
      fecha_fin: null
    },
    {
      titulo: "Bolsa de Cobertura Urgente: Personal Técnico de Integración Social (PTIS)",
      organismo: "Junta de Comunidades de Castilla-La Mancha",
      url_sede: "https://www.educa.jccm.es",
      requisitos: "Técnico Superior en Integración Social (TIS). Cobertura prioritaria de plazas para atención directa del alumnado con necesidades educativas especiales.",
      ccaa: "Castilla-La Mancha",
      ambito: "autonomico",
      puesto: "Técnico Superior Integración Social (TIS/PTIS)",
      tipo: "interinos",
      tipo_etiqueta: "Difícil Cobertura (Urgente)",
      color_etiqueta: "bg-amber-100 text-amber-900 border-amber-300",
      fecha_fin: null
    }
  );

  // =========================================================================
  // 3. RASTREO BOE OFICIAL: Sección II.B (Oposiciones, Concursos, Ayuntamientos y Policías)
  // =========================================================================
  console.log("-> [BOE] Consultando API oficial de datos abiertos del BOE (Sección 2B)...");
  const fechas = [];
  for (let i = 0; i < 4; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    fechas.push(`${yyyy}${mm}${dd}`);
  }

  for (const fechaStr of fechas) {
    try {
      const urlBoe = `https://www.boe.es/datosabiertos/api/boe/sumario/${fechaStr}`;
      const resBoe = await fetch(urlBoe, {
        headers: { 'Accept': 'application/xml', 'User-Agent': 'Mozilla/5.0' }
      });

      if (resBoe.ok) {
        const xml = await resBoe.text();
        const items = xml.split(/<item\b/i);

        for (let j = 1; j < items.length; j++) {
          const itemXml = items[j];

          // Filtrar por la Sección 2B (Oposiciones y concursos de todas las administraciones)
          if (!itemXml.includes('sec="2B"') && !itemXml.includes('oposiciones') && !itemXml.includes('personal')) continue;

          const titleM = itemXml.match(/<titulo>([\s\S]*?)<\/titulo>/i);
          const urlM = itemXml.match(/<url_pdf>([\s\S]*?)<\/url_pdf>/i) || itemXml.match(/<url_html>([\s\S]*?)<\/url_html>/i);
          const orgM = itemXml.match(/<departamento>([\s\S]*?)<\/departamento>/i);

          if (titleM) {
            const rawTitulo = titleM[1].replace(/<!\[CDATA\[|\]\]>/gi, '').trim();
            const urlDoc = urlM ? urlM[1].replace(/<!\[CDATA\[|\]\]>/gi, '').trim() : 'https://www.boe.es';
            const organismo = orgM ? orgM[1].replace(/<!\[CDATA\[|\]\]>/gi, '').trim() : 'Administración Pública';
            const textoCompleto = `${organismo} ${rawTitulo}`;

            const { ccaa, ambito } = mapearCCAA(textoCompleto);
            const puesto = mapearPuestoDetallado(textoCompleto);
            const { tipo, tipo_etiqueta, color_etiqueta } = mapearTipo(textoCompleto);

            registros.push({
              titulo: rawTitulo.substring(0, 240),
              organismo: organismo.substring(0, 140),
              url_sede: urlDoc.startsWith('http') ? urlDoc : `https://www.boe.es${urlDoc}`,
              requisitos: `Convocatoria oficial publicada en el BOE. Revisa las bases íntegras y el plazo oficial de presentación de solicitudes.`,
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
      console.warn(`Aviso BOE (${fechaStr}):`, err.message);
    }
  }

  console.log(`\n=> Total convocatorias identificadas para almacenar: ${registros.length}`);

  let insertados = 0;
  for (const item of registros) {
    const { error } = await supabase.from('convocatorias').upsert(item, { onConflict: 'titulo' });
    if (!error) {
      insertados++;
    } else {
      console.error("Error BD:", error.message);
    }
  }

  console.log(`=== SINCRONIZACIÓN FINALIZADA: ${insertados} convocatorias guardadas con éxito en Supabase ===`);
}

sincronizar().catch(err => {
  console.error("Fallo general en ejecución:", err);
  process.exit(1);
});
