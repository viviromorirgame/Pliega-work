const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://zraygpraqlwkbcipoefa.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error("Error: Falta SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

function mapearSector(texto) {
  const t = texto.toLowerCase();
  if (t.includes('educaci') || t.includes('especial') || t.includes('pedagog') || t.includes('audici') || t.includes('integraci') || t.includes('tis') || t.includes('apoyo educat')) {
    return 'Educación Especial';
  }
  if (t.includes('maestr') || t.includes('docente') || t.includes('profesor') || t.includes('secundaria') || t.includes('primaria') || t.includes('infantil')) {
    return 'Educación / Docencia';
  }
  if (t.includes('administra') || t.includes('auxiliar') || t.includes('gesti') || t.includes('subaltern') || t.includes('tramitac')) {
    return 'Administración';
  }
  if (t.includes('enferm') || t.includes('medic') || t.includes('tcae') || t.includes('sanit') || t.includes('salud') || t.includes('farmac')) {
    return 'Sanidad';
  }
  if (t.includes('social') || t.includes('psicol')) {
    return 'Trabajo Social';
  }
  if (t.includes('informát') || t.includes('telecom') || t.includes('sistemas') || t.includes('programad')) {
    return 'Informática / Tecnología';
  }
  return 'Servicios / Oficios';
}

function mapearTipo(texto) {
  const t = texto.toLowerCase();
  if (t.includes('difícil cobertura') || t.includes('dificil cobertura') || t.includes('urgente') || t.includes('sustituc') || t.includes('interin') || t.includes('adjudicaci')) {
    return {
      tipo: 'interinos',
      tipo_etiqueta: t.includes('difícil cobertura') ? 'Difícil Cobertura (Urgente)' : 'Bolsa Urgente (Interinos)',
      color_etiqueta: 'bg-amber-100 text-amber-900 border-amber-300'
    };
  }
  if (t.includes('oposici') || t.includes('examen') || t.includes('selectiv') || t.includes('pruebas selectivas') || t.includes('concurso-oposición')) {
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
  if (t.includes('valenc') || t.includes('gva') || t.includes('alicante') || t.includes('castellón')) return { ccaa: 'Comunitat Valenciana', ambito: 'autonomico' };
  if (t.includes('andaluc') || t.includes('sevilla') || t.includes('málaga') || t.includes('granada')) return { ccaa: 'Andalucía', ambito: 'autonomico' };
  if (t.includes('madrid')) return { ccaa: 'Comunidad de Madrid', ambito: 'autonomico' };
  if (t.includes('catalu') || t.includes('gencat') || t.includes('barcelona')) return { ccaa: 'Cataluña', ambito: 'autonomico' };
  if (t.includes('galicia') || t.includes('xunta')) return { ccaa: 'Galicia', ambito: 'autonomico' };
  if (t.includes('castilla y león') || t.includes('burgos') || t.includes('valladolid')) return { ccaa: 'Castilla y León', ambito: 'autonomico' };
  if (t.includes('castilla-la mancha')) return { ccaa: 'Castilla-La Mancha', ambito: 'autonomico' };
  if (t.includes('aragón') || t.includes('zaragoza')) return { ccaa: 'Aragón', ambito: 'autonomico' };
  if (t.includes('murcia')) return { ccaa: 'Murcia', ambito: 'autonomico' };
  if (t.includes('canarias')) return { ccaa: 'Islas Canarias', ambito: 'autonomico' };
  if (t.includes('balear')) return { ccaa: 'Islas Baleares', ambito: 'autonomico' };
  if (t.includes('asturias')) return { ccaa: 'Asturias', ambito: 'autonomico' };
  if (t.includes('extremadura')) return { ccaa: 'Extremadura', ambito: 'autonomico' };
  if (t.includes('navarra')) return { ccaa: 'Navarra', ambito: 'autonomico' };
  if (t.includes('cantabria')) return { ccaa: 'Cantabria', ambito: 'autonomico' };
  if (t.includes('rioja')) return { ccaa: 'La Rioja', ambito: 'autonomico' };
  if (t.includes('vasco') || t.includes('euskadi')) return { ccaa: 'País Vasco', ambito: 'autonomico' };
  return { ccaa: 'Estatal', ambito: 'estatal' };
}

async function obtenerConvocatoriasReales() {
  const convocatorias = [];

  // 1. Canal Directo GVA (Educación y Difícil Cobertura en la sede oficial activa)
  convocatorias.push({
    titulo: "Adjudicaciones continuas y provisión de puestos de difícil cobertura docentes",
    organismo: "Conselleria d'Educació, Cultura, Universitats i Ocupació (GVA)",
    url_sede: "https://ceice.gva.es/es/web/rrhh-educacion/adjudicaciones-continuas",
    requisitos: "Convocatoria periódica de sustituciones urgentes y plazas docentes sin cubrir para maestros y profesorado.",
    ccaa: "Comunitat Valenciana",
    ambito: "autonomico",
    puesto: "Educación Especial",
    tipo: "interinos",
    tipo_etiqueta: "Difícil Cobertura (Urgente)",
    color_etiqueta: "bg-amber-100 text-amber-900 border-amber-300",
    fecha_fin: "2026-12-31"
  });

  // 2. Feed oficial del Punto de Acceso General del Gobierno de España
  try {
    console.log("-> Conectando al feed oficial del Estado y CC.AA...");
    const res = await fetch("https://administracion.gob.es/pag_Home/empleoPublico/rss/ofertas-empleo-publico.rss", {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });

    if (res.ok) {
      const xml = await res.text();
      const items = xml.split('<item>');
      console.log(`-> Procesando ${items.length - 1} ofertas del feed oficial...`);

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

          // Fecha límite por defecto (30 días vista)
          const f = new Date();
          f.setDate(f.getDate() + 30);
          const fecha_fin = f.toISOString().split('T')[0];

          convocatorias.push({
            titulo: titulo.substring(0, 240),
            organismo: "Administración Convocante",
            url_sede: url_sede,
            requisitos: descripcion ? descripcion.substring(0, 280) : 'Ver detalles y tramitación telemática en el portal oficial.',
            ccaa,
            ambito,
            puesto,
            tipo,
            tipo_etiqueta,
            color_etiqueta,
            fecha_fin
          });
        }
      }
    }
  } catch (err) {
    console.warn("Aviso conectando al feed del PAG:", err.message);
  }

  return convocatorias;
}

async function ejecutar() {
  console.log("=== INICIANDO RASTREO REAL ===");
  const lista = await obtenerConvocatoriasReales();
  console.log(`Total de convocatorias extraídas: ${lista.length}`);

  let insertadas = 0;
  for (const item of lista) {
    const { error } = await supabase
      .from('convocatorias')
      .upsert({
        titulo: item.titulo,
        organismo: item.organismo,
        ccaa: item.ccaa,
        ambito: item.ambito,
        puesto: item.puesto,
        tipo: item.tipo,
        tipo_etiqueta: item.tipo_etiqueta,
        color_etiqueta: item.color_etiqueta,
        fecha_fin: item.fecha_fin,
        requisitos: item.requisitos,
        url_sede: item.url_sede,
        activo: true
      }, { onConflict: 'titulo' });

    if (!error) insertadas++;
  }

  console.log(`=== FIN: ${insertadas} convocatorias reales guardadas en Supabase ===`);
}

ejecutar().catch(err => {
  console.error(err);
  process.exit(1);
});
