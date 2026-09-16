const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://zraygpraqlwkbcipoefa.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error("CRítico: Falta configurar el secreto SUPABASE_SERVICE_ROLE_KEY en GitHub Actions");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

function mapearPuestoDetallado(texto) {
  const t = texto.toLowerCase();

  if (t.includes('pedagogía terapéutica') || t.includes('pedagogia terapeutica') || t.includes(' pt ') || t.includes('(pt)')) {
    return 'Maestros: Pedagogía Terapéutica (PT)';
  }
  if (t.includes('audición y lenguaje') || t.includes('audicion y lenguaje') || t.includes(' al ') || t.includes('(al)')) {
    return 'Maestros: Audición y Lenguaje (AL)';
  }
  if (t.includes('infantil')) return 'Educación Infantil';
  if (t.includes('primaria') && !t.includes('atención primaria')) return 'Educación Primaria';
  if (t.includes('secundaria') || t.includes('profesor') || t.includes('docente') || t.includes('formación profesional')) return 'Educación Secundaria y FP';

  if (t.includes('educador') && (t.includes('especial') || t.includes('educación especial') || t.includes('apoyo'))) {
    return 'Educador/a de Educación Especial (C1)';
  }
  if (t.includes('integración social') || t.includes('integracion social') || t.includes('tis') || t.includes('ptis')) {
    return 'Técnico Superior Integración Social (TIS/PTIS)';
  }
  if (t.includes('trabajo social') || t.includes('trabajador social') || t.includes('asistente social')) {
    return 'Trabajo Social';
  }

  if (t.includes('policía local') || t.includes('policia local') || t.includes('policía municipal') || t.includes('guardia urbana')) {
    return 'Policía Local';
  }
  if (t.includes('bomber')) return 'Bomberos';

  if (t.includes('enferm')) return 'Enfermería';
  if (t.includes('médic') || t.includes('facultativ')) return 'Medicina / Facultativos';
  if (t.includes('tcae') || t.includes('auxiliar de enfermería') || t.includes('auxiliar enfermeria')) return 'Auxiliar de Enfermería (TCAE)';
  if (t.includes('celador')) return 'Celadores';

  if (t.includes('auxiliar administrativo') || t.includes('auxiliar de administración')) return 'Auxiliar Administrativo (C2)';
  if (t.includes('administrativo') || t.includes('administrativa')) return 'Administrativo (C1)';
  if (t.includes('gestión') || t.includes('gestion') || t.includes('técnico de administración')) return 'Gestión y Técnicos (A2/A1)';

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
  if (t.includes('andaluc') || t.includes('sevilla') || t.includes('málaga') || t.includes('cádiz') || t.includes('granada')) {
    return { ccaa: 'Andalucía', ambito: 'autonomico' };
  }
  if (t.includes('castilla y león') || t.includes('castilla y leon') || t.includes('valladolid') || t.includes('burgos')) {
    return { ccaa: 'Castilla y León', ambito: 'autonomico' };
  }
  if (t.includes('galicia') || t.includes('xunta')) return { ccaa: 'Galicia', ambito: 'autonomico' };
  if (t.includes('aragón') || t.includes('aragon') || t.includes('zaragoza')) return { ccaa: 'Aragón', ambito: 'autonomico' };
  if (t.includes('murcia')) return { ccaa: 'Murcia', ambito: 'autonomico' };
  if (t.includes('extremadura')) return { ccaa: 'Extremadura', ambito: 'autonomico' };
  if (t.includes('canarias')) return { ccaa: 'Islas Canarias', ambito: 'autonomico' };
  if (t.includes('balear')) return { ccaa: 'Islas Baleares', ambito: 'autonomico' };
  if (t.includes('asturias')) return { ccaa: 'Asturias', ambito: 'autonomico' };
  if (t.includes('cantabria')) return { ccaa: 'Cantabria', ambito: 'autonomico' };
  if (t.includes('navarra')) return { ccaa: 'Navarra', ambito: 'autonomico' };
  if (t.includes('rioja')) return { ccaa: 'La Rioja', ambito: 'autonomico' };
  if (t.includes('vasco') || t.includes('euskadi')) return { ccaa: 'País Vasco', ambito: 'autonomico' };
  if (t.includes('catalu')) return { ccaa: 'Cataluña', ambito: 'autonomico' };

  return { ccaa: 'Estatal', ambito: 'estatal' };
}

async function sincronizar() {
  console.log("=== INICIANDO RASTREO GLOBAL PLIEGA WORK ===");
  const registros = [];

  // 1. Catálogo oficial del Punto de Acceso General del Estado (España)
  try {
    const res = await fetch("https://administracion.gob.es/pag_Home/empleoPublico/rss/ofertas-empleo-publico.rss", {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    if (res.ok) {
      const xml = await res.text();
      const items = xml.split('<item>');
      console.log(`-> Ítems brutos detectados en el feed oficial: ${items.length - 1}`);

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
            organismo: ambito === 'estatal' ? 'Administración General del Estado / BOE' : `Organismo Oficial / CCAA (${ccaa})`,
            url_sede: link,
            requisitos: desc ? desc.substring(0, 300) : 'Consulta las bases completas y tramita la solicitud en la sede oficial.',
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
    console.warn("Aviso obteniendo feed oficial:", e.message);
  }

  // 2. Convocatorias clave garantizadas de alta demanda (GVA, JCCM, Policías y Ayuntamientos)
  const baseGarantizada = [
    {
      titulo: "Convocatoria ADC-EDU-130/26: Adjudicaciones Continuas y Difícil Cobertura",
      organismo: "Conselleria d'Educació (GVA)",
      url_sede: "https://ovidoc.edu.gva.es/",
      requisitos: "Plazo oficial: Hasta las 23:59h del 17 de septiembre de 2026. Sustituciones docentes y puestos urgentes de difícil cobertura. Petición en OVIDOC.",
      ccaa: "Comunitat Valenciana",
      ambito: "autonomico",
      puesto: "Maestros: Pedagogía Terapéutica (PT)",
      tipo: "interinos",
      tipo_etiqueta: "Difícil Cobertura (Urgente)",
      color_etiqueta: "bg-amber-100 text-amber-900 border-amber-300",
      fecha_fin: null
    },
    {
      titulo: "Bolsa Extraordinaria de Sustituciones: Educadores/as de Educación Especial (C1)",
      organismo: "Generalitat Valenciana (GVA Borses)",
      url_sede: "https://sede.gva.es",
      requisitos: "Título de Técnico Superior en Integración Social. Cobertura de personal no docente en centros educativos.",
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
      organismo: "Consejería de Educación (JCCM)",
      url_sede: "https://www.educa.jccm.es",
      requisitos: "Técnico Superior en Integración Social. Apoyo al alumnado con NEAE en centros públicos de Castilla-La Mancha.",
      ccaa: "Castilla-La Mancha",
      ambito: "autonomico",
      puesto: "Técnico Superior Integración Social (TIS/PTIS)",
      tipo: "interinos",
      tipo_etiqueta: "Bolsa Urgente (Interinos)",
      color_etiqueta: "bg-amber-100 text-amber-900 border-amber-300",
      fecha_fin: null
    },
    {
      titulo: "Convocatoria Oposición Libre: Agentes de la Policía Local",
      organismo: "Ayuntamientos / Administración Local",
      url_sede: "https://www.boe.es",
      requisitos: "Título de Bachiller o equivalente. Pruebas físicas, psicotécnicas y temario publicado en boletín oficial.",
      ccaa: "Castilla-La Mancha",
      ambito: "autonomico",
      puesto: "Policía Local",
      tipo: "examenes",
      tipo_etiqueta: "Examen / Oposición",
      color_etiqueta: "bg-blue-100 text-blue-900 border-blue-300",
      fecha_fin: null
    }
  ];

  for (const item of baseGarantizada) {
    if (!registros.some(r => r.titulo === item.titulo)) {
      registros.push(item);
    }
  }

  console.log(`Total de convocatorias listas para registrar masivamente en Supabase: ${registros.length}`);

  let ok = 0;
  for (const item of registros) {
    const { error } = await supabase.from('convocatorias').upsert(item, { onConflict: 'titulo' });
    if (error) {
      console.error("Error al insertar:", error.message);
    } else {
      ok++;
    }
  }

  console.log(`=== SINCRONIZACIÓN EXITOSA: ${ok} registros guardados en Supabase ===`);
}

sincronizar().catch(err => {
  console.error("Fallo crítico:", err);
  process.exit(1);
});
