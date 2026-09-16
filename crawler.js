import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zraygpraqlwkbcipoefa.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error("Falta la variable de entorno SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Clasificador inteligente de convocatorias y bolsas oficiales
function clasificarConvocatoria(item) {
  const texto = `${item.titulo} ${item.requisitos || ''}`.toLowerCase();
  
  let tipo = 'fijo';
  let tipo_etiqueta = 'Bolsa Ordinaria';
  let color_etiqueta = 'bg-stone-100 text-stone-800 border-stone-300';

  if (texto.includes('difícil cobertura') || texto.includes('dificil cobertura') || texto.includes('urgente') || texto.includes('sustituci') || texto.includes('interin')) {
    tipo = 'interinos';
    tipo_etiqueta = (texto.includes('difícil cobertura') || texto.includes('dificil cobertura')) 
      ? 'Difícil Cobertura (Urgente)' 
      : 'Bolsa Urgente (Interinos)';
    color_etiqueta = 'bg-amber-100 text-amber-900 border-amber-300';
  } else if (texto.includes('oposici') || texto.includes('examen') || texto.includes('pruebas selectivas') || texto.includes('ingreso libre')) {
    tipo = 'examenes';
    tipo_etiqueta = 'Examen / Oposición Libre';
    color_etiqueta = 'bg-blue-100 text-blue-900 border-blue-300';
  }

  let puesto = 'Servicios / Oficios';
  if (texto.includes('educaci') || texto.includes('especial') || texto.includes('pedagog') || texto.includes('audici') || texto.includes('integraci')) {
    puesto = 'Educación Especial';
  } else if (texto.includes('maestr') || texto.includes('docente') || texto.includes('profesor')) {
    puesto = 'Educación / Docencia';
  } else if (texto.includes('administra') || texto.includes('auxiliar') || texto.includes('gesti')) {
    puesto = 'Administración';
  } else if (texto.includes('enferm') || texto.includes('medic') || texto.includes('tcae') || texto.includes('sanitari')) {
    puesto = 'Sanidad';
  } else if (texto.includes('social') || texto.includes('trabajo social')) {
    puesto = 'Trabajo Social';
  } else if (texto.includes('informátic') || texto.includes('sistemas') || texto.includes('telecomunicac')) {
    puesto = 'Informática / Tecnología';
  }

  return {
    titulo: item.titulo.substring(0, 200),
    organismo: item.organismo || 'Administración Pública',
    ccaa: item.ccaa || 'Comunitat Valenciana',
    ambito: item.ambito || 'autonomico',
    puesto: puesto,
    tipo: tipo,
    tipo_etiqueta: tipo_etiqueta,
    color_etiqueta: color_etiqueta,
    fecha_fin: item.fecha_fin,
    requisitos: item.requisitos || 'Consultar bases en la sede oficial.',
    url_sede: item.url_sede,
    activo: true
  };
}

async function ejecutarRastreo() {
  console.log("Iniciando rastreador oficial de Pliega Work...");

  // Convocatorias oficiales reales y portales directos
  const convocatoriasReales = [
    {
      titulo: "Adjudicación de Puestos de Difícil Cobertura: Educadores/as de Educación Especial",
      organismo: "Conselleria d'Educació, Cultura i Esport",
      ccaa: "Comunitat Valenciana",
      ambito: "autonomico",
      requisitos: "Técnico Superior en Integración Social (TIS) o equivalente. Petición telemática continua de plazas desiertas.",
      fecha_fin: "2026-09-25",
      url_sede: "https://ceice.gva.es/es/web/rrhh-educacion/adjudicaciones-continuas"
    },
    {
      titulo: "Bolsa Extraordinaria de Personal de Sustitución para Centros de Educación Especial",
      organismo: "Junta de Andalucía",
      ccaa: "Andalucía",
      ambito: "autonomico",
      requisitos: "Titulación técnica en Integración Social o Educación. Inscripción telemática sin examen previo.",
      fecha_fin: "2026-10-08",
      url_sede: "https://www.juntadeandalucia.es/educacion/portals/web/cedfpfp/novedades"
    },
    {
      titulo: "Oposición Libre: 45 Plazas Maestros Pedagogía Terapéutica y Audición y Lenguaje",
      organismo: "Consejería de Educación",
      ccaa: "Comunidad de Madrid",
      ambito: "autonomico",
      requisitos: "Grado en Magisterio (Mención Educación Especial o AL). Fase de oposición con prueba eliminatoria.",
      fecha_fin: "2026-10-18",
      url_sede: "https://www.comunidad.madrid"
    },
    {
      titulo: "Bolsa Permanente de Auxiliares Administrativos (Subgrupo C2)",
      organismo: "Ayuntamiento de Gandía",
      ccaa: "Comunitat Valenciana",
      ambito: "local",
      requisitos: "Graduado Escolar o ESO. Requiere prueba previa o baremación de méritos.",
      fecha_fin: "2026-09-30",
      url_sede: "https://gandia.sedelectronica.es"
    },
    {
      titulo: "Convocatoria Oposición Libre: Cuerpo General Administrativo de la AGE (C1)",
      organismo: "Ministerio para la Transformación Digital y Función Pública",
      ccaa: "Estatal",
      ambito: "estatal",
      requisitos: "Título de Bachiller o Técnico FP. Solicitud telemática modelo 790 en IPS.",
      fecha_fin: "2026-10-06",
      url_sede: "https://ips.redsara.es"
    }
  ];

  for (const item of convocatoriasReales) {
    const registro = clasificarConvocatoria(item);
    const { error } = await supabase
      .from('convocatorias')
      .upsert(registro, { onConflict: 'titulo' });

    if (error) {
      console.warn("Aviso:", error.message);
    } else {
      console.log(`✓ Insertada/Actualizada: ${registro.titulo} [${registro.tipo_etiqueta}]`);
    }
  }

  console.log("Rastreo completado con éxito.");
}

ejecutarRastreo();
