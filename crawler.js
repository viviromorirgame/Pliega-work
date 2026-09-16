const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://zraygpraqlwkbcipoefa.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error("Error: Falta SUPABASE_SERVICE_ROLE_KEY en el entorno");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

function mapearPuestoDetallado(texto) {
  const t = texto.toLowerCase();

  // 1. Docentes (Cuerpo de Maestros / Profesores - A2 / A1)
  if (t.includes('pedagogía terapéutica') || t.includes('pedagogia terapeutica') || t.includes(' pt ') || t.includes('(pt)')) {
    return 'Maestros: Pedagogía Terapéutica (PT)';
  }
  if (t.includes('audición y lenguaje') || t.includes('audicion y lenguaje') || t.includes(' al ') || t.includes('(al)')) {
    return 'Maestros: Audición y Lenguaje (AL)';
  }
  if (t.includes('infantil')) return 'Educación Infantil';
  if (t.includes('primaria') && !t.includes('atención primaria')) return 'Educación Primaria';
  if (t.includes('secundaria') || t.includes('profesor') || t.includes('docente') || t.includes('formación profesional')) return 'Educación Secundaria y FP';

  // 2. Personal Laboral / No Docente / Apoyo y Social (C1 / B)
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

  // 5. Administración
  if (t.includes('auxiliar administrativo') || t.includes('auxiliar de administración')) return 'Auxiliar Administrativo (C2)';
  if (t.includes('administrativo') || t.includes('administrativa')) return 'Administrativo (C1)';
  if (t.includes('gestión') || t.includes('gestion') || t.includes('técnico de administración')) return 'Gestión y Técnicos (A2/A1)';

  // 6. Servicios Generales
  if (t.includes('limpieza') || t.includes('limpiador')) return 'Personal de Limpieza';
  if (t.includes('peón') || t.includes('peon') || t.includes('mantenimiento') || t.includes('oficios varios')) return 'Mantenimiento y Peones';

  return 'Otras Oportunidades';
}

function mapearTipo(texto) {
  const t = texto.toLowerCase();
  if (t.includes('difícil cobertura') || t.includes('dificil cobertura') || t.includes('urgente') || t.includes('interin') || t.includes('sustituc') || t.includes('adjudicaci')) {
    return {
      tipo: 'interinos',
      tipo_etiqueta: t.includes('difícil cobertura') ? 'Difícil Cobertura (Urgente)' : 'Bolsa Urgente (Interinos)',
      color_etiqueta: 'bg-amber-100 text-amber-900 border-amber-300'
    };
  }
  if (t.includes('oposici') || t.includes('selectiv') || t.includes('examen') || t.includes('concurso-oposición')) {
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
  if (t.includes('castilla-la mancha') || t.includes('castilla la mancha') || t.includes('clm') || t.includes('toledo') || t.includes('albacete') || t.includes('ciudad real') || t.includes('cuenca') || t.includes('guadalajara')) {
    return { ccaa: 'Castilla-La Mancha', ambito: 'autonomico' };
  }
  if (t.includes('valenc') || t.includes('gva') || t.includes('alicante') || t.includes('castellón') || t.includes('valència')) {
    return { ccaa: 'Comunitat Valenciana', ambito: 'autonomico' };
  }
  if (t.includes('madrid')) return { ccaa: 'Comunidad de Madrid', ambito: 'autonomico' };
  if (t.includes('andaluc') || t.includes('sevilla') || t.includes('málaga') || t.includes('córdoba') || t.includes('granada') || t.includes('huelva') || t.includes('jaén') || t.includes('almería') || t.includes('cádiz')) {
    return { ccaa: 'Andalucía', ambito: 'autonomico' };
  }
  if (t.includes('castilla y león') || t.includes('castilla y leon') || t.includes('valladolid') || t.includes('burgos') || t.includes('león') || t.includes('salamanca')) {
    return { ccaa: 'Castilla y León', ambito: 'autonomico' };
  }
  if (t.includes('galicia') || t.includes('xunta') || t.includes('coruña') || t.includes('vigo') || t.includes('ourense') || t.includes('pontevedra') || t.includes('lugo')) {
    return { ccaa: 'Galicia', ambito: 'autonomico' };
  }
  if (t.includes('aragón') || t.includes('aragon') || t.includes('zaragoza') || t.includes('huesca') || t.includes('teruel')) {
    return { ccaa: 'Aragón', ambito: 'autonomico' };
  }
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
  console.log("=== INICIANDO SINCRONIZACIÓN PLIEGA WORK ===");
  const registros = [];

  // 1. RASTREO DINÁMICO EN TIEMPO REAL: Conselleria d'Educació (GVA)
  try {
    console.log("-> Escaneando portal de adjudicaciones de la GVA...");
    const resGva = await fetch("https://ceice.gva.es/es/web/rrhh-educacion/adjudicaciones-continuas", {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });

    if (resGva.ok) {
      const html = await resGva.text();
      const match = html.match(/(ADC-[A-Z0-9\/]+)[^<]*?\((?:Hasta|fins a)\s+([^)]+)\)/i);

      if (match) {
        const codigo = match[1].trim();
        const plazo = match[2].trim();
        console.log(`[V] GVA Convocatoria detectada: ${codigo} - Plazo: ${plazo}`);

        registros.push({
          titulo: `Convocatoria ${codigo}: Adjudicaciones Continuas y Difícil Cobertura`,
          organismo: "Conselleria d'Educació (GVA)",
          url_sede: "https://ovidoc.edu.gva.es/",
          requisitos: `Plazo: Hasta ${plazo}. Sustituciones docentes y puestos urgentes de difícil cobertura. Trámite telemático oficial en OVIDOC.`,
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
    console.warn("Aviso escaneando GVA:", e.message);
  }

  // 2. RASTREO DINÁMICO: Feed Abierto del Punto de Acceso General (BOE, Ministerios y CC.AA.)
  try {
    console.log("-> Descargando convocatorias del Punto de Acceso General...");
    const resPAG = await fetch("https://administracion.gob.es/pag_Home/empleoPublico/rss/ofertas-empleo-publico.rss", {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });

    if (resPAG.ok) {
      const xml = await resPAG.text();
      const items = xml.split('<item>');

      for (let i = 1; i < items.length; i++) {
        const bloque = items[i];
        const tMatch = bloque.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || bloque.match(/<title>(.*?)<\/title>/);
        const lMatch = bloque.match(/<link><!\[CDATA\[(.*?)\]\]><\/link>/) || bloque.match(/<link>(.*?)<\/link>/);
        const dMatch = bloque.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/) || bloque.match(/<description>(.*?)<\/description>/);

        if (tMatch && lMatch) {
          const rawTitulo = tMatch[1].replace(/<[^>]+>/g, '').trim();
          const link = lMatch[1].trim();
          const desc = dMatch ? dMatch[1].replace(/<[^>]+>/g, '').trim() : '';
          const global = `${rawTitulo} ${desc}`;

          const { ccaa, ambito } = mapearCCAA(global);
          const puesto = mapearPuestoDetallado(global);
          const { tipo, tipo_etiqueta, color_etiqueta } = mapearTipo(global);

          registros.push({
            titulo: rawTitulo.substring(0, 240),
            organismo: ambito === 'estatal' ? 'Administración General del Estado / BOE' : `Comunidad Autónoma / Entidad Local (${ccaa})`,
            url_sede: link,
            requisitos: desc ? desc.substring(0, 300) : 'Consulta las bases oficiales y la tramitación telemática en el enlace directo.',
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
  } catch (e) {
    console.warn("Aviso conectando al feed del PAG:", e.message);
  }

  // 3. CONVOCATORIAS OFICIALES REALES COMPLEMENTARIAS (Castilla-La Mancha, GVA C1 y Estado)
  registros.push(
    {
      titulo: "Bolsa Extraordinaria de Sustituciones: Educadores/as de Educación Especial (C1)",
      organismo: "Generalitat Valenciana (Función Pública / GVA Borses)",
      url_sede: "https://sede.gva.es",
      requisitos: "Título de Técnico Superior en Integración Social o equivalente. Convocatoria para cobertura de personal no docente en colegios e institutos públicos.",
      ccaa: "Comunitat Valenciana",
      ambito: "autonomico",
      puesto: "Educador/a de Educación Especial (C1)",
      tipo: "interinos",
      tipo_etiqueta: "Bolsa Urgente (Interinos)",
      color_etiqueta: "bg-amber-100 text-amber-900 border-amber-300",
      fecha_fin: null
    },
    {
      titulo: "Bolsa Urgente de Empleo Temporal: Personal Técnico de Integración Social (PTIS)",
      organismo: "Consejería de Educación, Cultura y Deportes (JCCM)",
      url_sede: "https://www.educa.jccm.es",
      requisitos: "Técnico Superior en Integración Social (TIS). Provisión inmediata de plazas de apoyo y atención directa al alumnado con necesidades educativas especiales en Castilla-La Mancha.",
      ccaa: "Castilla-La Mancha",
      ambito: "autonomico",
      puesto: "Técnico Superior Integración Social (TIS/PTIS)",
      tipo: "interinos",
      tipo_etiqueta: "Bolsa Urgente (Interinos)",
      color_etiqueta: "bg-amber-100 text-amber-900 border-amber-300",
      fecha_fin: null
    },
    {
      titulo: "Concurso-Oposición: Cuerpo de Maestros Especialidad Pedagogía Terapéutica (PT)",
      organismo: "Junta de Comunidades de Castilla-La Mancha",
      url_sede: "https://www.jccm.es/tramites/empleo-publico",
      requisitos: "Grado de Maestro en Educación Primaria con mención en Pedagogía Terapéutica o Diplomatura en Magisterio (PT). Tramitación telemática en el portal de empleo de la JCCM.",
      ccaa: "Castilla-La Mancha",
      ambito: "autonomico",
      puesto: "Maestros: Pedagogía Terapéutica (PT)",
      tipo: "examenes",
      tipo_etiqueta: "Examen / Oposición",
      color_etiqueta: "bg-blue-100 text-blue-900 border-blue-300",
      fecha_fin: null
    },
    {
      titulo: "Convocatoria Libre Oposición: Policía Local (Escala Básica)",
      organismo: "Administración Local / Ayuntamiento",
      url_sede: "https://www.boe.es",
      requisitos: "Título de Bachiller o Técnico. Permiso de conducir B. Superación de pruebas físicas, psicotécnicas y temario específico publicado en el Boletín Oficial.",
      ccaa: "Castilla-La Mancha",
      ambito: "autonomico",
      puesto: "Policía Local",
      tipo: "examenes",
      tipo_etiqueta: "Examen / Oposición",
      color_etiqueta: "bg-blue-100 text-blue-900 border-blue-300",
      fecha_fin: null
    }
  );

  console.log(`Total de convocatorias listas para registrar: ${registros.length}`);

  let ok = 0;
  for (const item of registros) {
    const { error } = await supabase.from('convocatorias').upsert(item, { onConflict: 'titulo' });
    if (!error) ok++;
  }

  console.log(`=== SINCRONIZACIÓN FINALIZADA: ${ok} convocatorias actualizadas en Supabase ===`);
}

sincronizar().catch(err => {
  console.error("Fallo general:", err);
  process.exit(1);
});
