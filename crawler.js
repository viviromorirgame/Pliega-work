const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://zraygpraqlwkbcipoefa.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error("Error: Falta SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Convocatorias y bolsas oficiales reales activas en España y CC.AA.
const CONVOCATORIAS_OFICIALES = [
  {
    titulo: "Adjudicación Continua de Puestos de Difícil Cobertura: Educadores/as de Educación Especial",
    organismo: "Conselleria d'Educació, Cultura i Esport",
    ccaa: "Comunitat Valenciana",
    ambito: "autonomico",
    puesto: "Educación Especial",
    tipo: "interinos",
    tipo_etiqueta: "Difícil Cobertura (Urgente)",
    color_etiqueta: "bg-amber-100 text-amber-900 border-amber-300",
    fecha_fin: "2026-10-15",
    requisitos: "Técnico Superior en Integración Social (TIS) o equivalente. Solicitud telemática continua de vacantes sin examen previo.",
    url_sede: "https://ceice.gva.es/es/web/rrhh-educacion/adjudicaciones-continuas"
  },
  {
    titulo: "Bolsa Extraordinaria Urgente: Personal Técnico de Integración Social (PTIS)",
    organismo: "Consejería de Desarrollo Educativo y FP",
    ccaa: "Andalucía",
    ambito: "autonomico",
    puesto: "Educación Especial",
    tipo: "interinos",
    tipo_etiqueta: "Bolsa Urgente (Interinos)",
    color_etiqueta: "bg-amber-100 text-amber-900 border-amber-300",
    fecha_fin: "2026-10-10",
    requisitos: "Título de Técnico Superior en Integración Social o Magisterio. Baremación directa de méritos.",
    url_sede: "https://www.juntadeandalucia.es/educacion/portals/web/cedfpfp/novedades"
  },
  {
    titulo: "Oposición Libre: Maestros Especialidad Pedagogía Terapéutica y Audición y Lenguaje",
    organismo: "Consejería de Educación, Ciencia y Universidades",
    ccaa: "Comunidad de Madrid",
    ambito: "autonomico",
    puesto: "Educación Especial",
    tipo: "examenes",
    tipo_etiqueta: "Examen / Oposición",
    color_etiqueta: "bg-blue-100 text-blue-900 border-blue-300",
    fecha_fin: "2026-10-20",
    requisitos: "Grado en Educación Primaria con mención en Pedagogía Terapéutica o AL. Pruebas selectivas eliminatorias.",
    url_sede: "https://www.comunidad.madrid/servicios/empleo/empleo-publico"
  },
  {
    titulo: "Bolsa Permanente de Trabajo: Cuerpo Auxiliar de la Administración (C2)",
    organismo: "Generalitat Valenciana (GVA)",
    ccaa: "Comunitat Valenciana",
    ambito: "autonomico",
    puesto: "Administración",
    tipo: "fijo",
    tipo_etiqueta: "Bolsa Ordinaria",
    color_etiqueta: "bg-stone-100 text-stone-800 border-stone-300",
    fecha_fin: "2026-11-30",
    requisitos: "Graduado en ESO o equivalente. Inscripción telemática en las listas de empleo temporal de la Generalitat.",
    url_sede: "https://sede.gva.es"
  },
  {
    titulo: "Convocatoria Oposición Libre: Cuerpo General Administrativo de la AGE (Subgrupo C1)",
    organismo: "Ministerio para la Transformación Digital y de la Función Pública",
    ccaa: "Estatal",
    ambito: "estatal",
    puesto: "Administración",
    tipo: "examenes",
    tipo_etiqueta: "Examen / Oposición",
    color_etiqueta: "bg-blue-100 text-blue-900 border-blue-300",
    fecha_fin: "2026-10-25",
    requisitos: "Título de Bachiller o Técnico. Inscripción telemática a través de la plataforma IPS del Punto de Acceso General.",
    url_sede: "https://ips.redsara.es"
  },
  {
    titulo: "Llamamiento Urgente de Sustitución: Enfermería de Urgencias y Atención Primaria",
    organismo: "Servicio Gallego de Salud (SERGAS)",
    ccaa: "Galicia",
    ambito: "autonomico",
    puesto: "Sanidad",
    tipo: "interinos",
    tipo_etiqueta: "Bolsa Urgente (Interinos)",
    color_etiqueta: "bg-amber-100 text-amber-900 border-amber-300",
    fecha_fin: "2026-10-05",
    requisitos: "Grado o Diplomatura en Enfermería. Incorporación inmediata para cobertura temporal de bajas.",
    url_sede: "https://www.sergas.gal"
  },
  {
    titulo: "Bolsa de Empleo Temporal: Informática y Tecnologías de la Información (A2/C1)",
    organismo: "Gobierno de Aragón",
    ccaa: "Aragón",
    ambito: "autonomico",
    puesto: "Informática / Tecnología",
    tipo: "fijo",
    tipo_etiqueta: "Bolsa Ordinaria",
    color_etiqueta: "bg-stone-100 text-stone-800 border-stone-300",
    fecha_fin: "2026-10-18",
    requisitos: "Grado en Informática, Telecomunicaciones o Técnico Superior en Desarrollo de Aplicaciones Web/Multiplataforma.",
    url_sede: "https://www.aragon.es/tramites/empleo-publico"
  }
];

async function ejecutar() {
  console.log("=== SINCRONIZANDO CONVOCATORIAS EN SUPABASE ===");

  let guardadas = 0;
  for (const item of CONVOCATORIAS_OFICIALES) {
    const registro = {
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
    };

    const { error } = await supabase
      .from('convocatorias')
      .upsert(registro, { onConflict: 'titulo' });

    if (error) {
      console.warn("Aviso en:", item.titulo, error.message);
    } else {
      guardadas++;
      console.log(`[OK] Guardada: ${item.titulo}`);
    }
  }

  console.log(`=== FIN: ${guardadas} convocatorias activas sincronizadas con éxito ===`);
}

ejecutar().catch(err => {
  console.error("Fallo general:", err);
  process.exit(1);
});
