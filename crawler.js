const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://zraygpraqlwkbcipoefa.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error("Error: Falta SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// 1. DICCIONARIO DE FUENTES DIRECTAS AUTONÓMICAS (Bolsas Urgentes / Difícil Cobertura / Adjudicaciones)
const FUENTES_AUTONOMICAS = [
  {
    ccaa: "Comunitat Valenciana",
    organismo: "Conselleria d'Educació (GVA)",
    url: "https://ceice.gva.es/es/web/rrhh-educacion/adjudicaciones-continuas",
    palabrasClave: ["difícil cobertura", "dificil cobertura", "urgente", "educación especial", "adjudicación", "provisión"]
  },
  {
    ccaa: "Andalucía",
    organismo: "Junta de Andalucía - SIPRI / Empleo",
    url: "https://www.juntadeandalucia.es/educacion/portals/web/cedfpfp/novedades",
    palabrasClave: ["urgente", "convocatoria", "bolsa", "sustituc", "difícil cobertura"]
  },
  {
    ccaa: "Comunidad de Madrid",
    organismo: "Comunidad de Madrid - Empleo Público",
    url: "https://www.comunidad.madrid/servicios/empleo/empleo-publico",
    palabrasClave: ["bolsa", "urgente", "convocatoria", "oposición", "personal funcionario", "laboral"]
  },
  {
    ccaa: "Cataluña",
    organismo: "Generalitat de Catalunya (Gencat)",
    url: "https://treball.gencat.cat/ca/ambits/ocupacio/ofertes-treball/",
    palabrasClave: ["convocatòria", "borsa", "urgent", "oposicions", "adjudicació"]
  },
  {
    ccaa: "Galicia",
    organismo: "Xunta de Galicia - Función Pública",
    url: "https://www.xunta.gal/funcion-publica",
    palabrasClave: ["bolsa", "convocatoria", "urxente", "oposicion", "adxudicacion"]
  },
  {
    ccaa: "Castilla y León",
    organismo: "Junta de Castilla y León",
    url: "https://empleopublico.jcyl.es",
    palabrasClave: ["bolsa", "urgente", "convocatoria", "sustituciones"]
  },
  {
    ccaa: "Castilla-La Mancha",
    organismo: "Junta de Comunidades de Castilla-La Mancha",
    url: "https://empleopublico.castillalamancha.es",
    palabrasClave: ["bolsa", "extraordinaria", "urgente", "convocatoria"]
  },
  {
    ccaa: "Euskadi",
    organismo: "Eusko Jaurlaritza - Gobierno Vasco",
    url: "https://www.euskadi.eus/empleo-publico/",
    palabrasClave: ["bolsa", "deialdia", "urgente", "oposizioa", "hautespen"]
  },
  {
    ccaa: "Canarias",
    organismo: "Gobierno de Canarias",
    url: "https://www.gobiernodecanarias.org/administracion/empleo/",
    palabrasClave: ["bolsa", "extraordinaria", "urgente", "convocatoria"]
  },
  {
    ccaa: "Región de Murcia",
    organismo: "Comunidad Autónoma de la Región de Murcia",
    url: "https://empleopublico.carm.es",
    palabrasClave: ["bolsa", "urgente", "convocatoria", "oposición"]
  },
  {
    ccaa: "Aragón",
    organismo: "Gobierno de Aragón",
    url: "https://www.aragon.es/tramites/empleo-publico",
    palabrasClave: ["bolsa", "urgente", "convocatoria", "oposición"]
  },
  {
    ccaa: "Islas Baleares",
    organismo: "Govern de les Illes Balears",
    url: "https://www.caib.es/govern/organismes/ebap/",
    palabrasClave: ["borsa", "urgent", "convocatòria", "difícil cobertura"]
  },
  {
    ccaa: "Extremadura",
    organismo: "Junta de Extremadura",
    url: "https://ciudadano.juntaex.es/empleo-publico",
    palabrasClave: ["bolsa", "urgente", "convocatoria", "lista de espera"]
  },
  {
    ccaa: "Asturias",
    organismo: "Gobierno del Principado de Asturias",
    url: "https://www.asturias.es/empleo-publico",
    palabrasClave: ["bolsa", "urgente", "convocatoria", "oposición"]
  },
  {
    ccaa: "Navarra",
    organismo: "Gobierno de Navarra",
    url: "https://www.navarra.es/es/empleo-publico",
    palabrasClave: ["contratación temporal", "bolsa", "urgente", "oposición"]
  },
  {
    ccaa: "Cantabria",
    organismo: "Gobierno de Cantabria",
    url: "https://www.cantabria.es/empleo-publico",
    palabrasClave: ["bolsa", "urgente", "convocatoria"]
  },
  {
    ccaa: "La Rioja",
    organismo: "Gobierno de La Rioja",
    url: "https://www.larioja.org/empleo-publico",
    palabrasClave: ["bolsa", "urgente", "convocatoria"]
  }
];

// 2. CLASIFICADOR INTELIGENTE
function clasificar(tituloRaw, organismoRaw, descRaw, url, ccaaRaw) {
  const texto = `${tituloRaw} ${descRaw || ''} ${organismoRaw || ''}`.toLowerCase();

  // Tipo de proceso
  let tipo = 'fijo';
  let tipo_etiqueta = 'Bolsa Ordinaria';
  let color_etiqueta = 'bg-stone-100 text-stone-800 border-stone-300';

  if (texto.includes('difícil cobertura') || texto.includes('dificil cobertura') || texto.includes('urgente') || texto.includes('sustituci') || texto.includes('interin') || texto.includes('adjudicaci') || texto.includes('borsa urgent')) {
    tipo = 'interinos';
    tipo_etiqueta = (texto.includes('difícil cobertura') || texto.includes('dificil cobertura')) 
      ? 'Difícil Cobertura (Urgente)' 
      : 'Bolsa Urgente (Interinos)';
    color_etiqueta = 'bg-amber-100 text-amber-900 border-amber-300';
  } else if (texto.includes('oposici') || texto.includes('examen') || texto.includes('selectiv') || texto.includes('libre') || texto.includes('oposizio') || texto.includes('concurso-oposición')) {
    tipo = 'examenes';
    tipo_etiqueta = 'Examen / Oposición';
    color_etiqueta = 'bg-blue-100 text-blue-900 border-blue-300';
  }

  // Puesto y sector
  let puesto = 'Servicios / Oficios';
  if (texto.includes('educaci') || texto.includes('especial') || texto.includes('pedagog') || texto.includes('audici') || texto.includes('integraci') || texto.includes('tis') || texto.includes('educador')) {
    puesto = 'Educación Especial';
  } else if (texto.includes('maestr') || texto.includes('docente') || texto.includes('profesor') || texto.includes('secundaria') || texto.includes('primaria') || texto.includes('mestre')) {
    puesto = 'Educación / Docencia';
  } else if (texto.includes('administra') || texto.includes('auxiliar') || texto.includes('gesti') || texto.includes('c1') || texto.includes('c2')) {
    puesto = 'Administración';
  } else if (texto.includes('enferm') || texto.includes('medic') || texto.includes('tcae') || texto.includes('sanitari') || texto.includes('salud') || texto.includes('celador') || texto.includes('metge')) {
    puesto = 'Sanidad';
  } else if (texto.includes('social') || texto.includes('psicolog')) {
    puesto = 'Trabajo Social';
  } else if (texto.includes('informátic') || texto.includes('sistemas') || texto.includes('telecomunicac') || texto.includes('programador')) {
    puesto = 'Informática / Tecnología';
  }

  // CCAA y ámbito
  let ccaa = ccaaRaw || 'Estatal';
  let ambito = 'autonomico';

  if (texto.includes('valencian') || texto.includes('gva') || texto.includes('valència') || texto.includes('castellón') || texto.includes('alicante')) {
    ccaa = 'Comunitat Valenciana';
  } else if (texto.includes('andaluc') || texto.includes('junta de andalucía') || texto.includes('sevilla')) {
    ccaa = 'Andalucía';
  } else if (texto.includes('madrid') || texto.includes('bocm')) {
    ccaa = 'Comunidad de Madrid';
  } else if (texto.includes('catalun') || texto.includes('gencat') || texto.includes('barcelona')) {
    ccaa = 'Cataluña';
  } else if (texto.includes('galicia') || texto.includes('xunta')) {
    ccaa = 'Galicia';
  } else if (texto.includes('castilla y león') || texto.includes('jcyl')) {
    ccaa = 'Castilla y León';
  } else if (texto.includes('castilla-la mancha') || texto.includes('clm')) {
    ccaa = 'Castilla-La Mancha';
  } else if (texto.includes('euskadi') || texto.includes('país vasco')) {
    ccaa = 'País Vasco';
  } else if (texto.includes('canarias') || texto.includes('tenerife') || texto.includes('palmas')) {
    ccaa = 'Islas Canarias';
  } else if (texto.includes('baleares') || texto.includes('balears') || texto.includes('mallorca')) {
    ccaa = 'Islas Baleares';
  } else if (texto.includes('aragón') || texto.includes('zaragoza')) {
    ccaa = 'Aragón';
  } else if (texto.includes('murcia')) {
    ccaa = 'Murcia';
  } else if (texto.includes('asturias')) {
    ccaa = 'Asturias';
  } else if (texto.includes('extremadura')) {
    ccaa = 'Extremadura';
  } else if (texto.includes('navarra')) {
    ccaa = 'Navarra';
  } else if (texto.includes('cantabria')) {
    ccaa = 'Cantabria';
  } else if (texto.includes('rioja')) {
    ccaa = 'La Rioja';
  } else if (texto.includes('estado') || texto.includes('ministerio') || texto.includes('boe') || texto.includes('age')) {
    ccaa = 'Estatal';
    ambito = 'estatal';
  }

  // Fecha fin calculada por defecto (15 días)
  const f = new Date();
  f.setDate(f.getDate() + 15);
  const fechaFin = f.toISOString().split('T')[0];

  return {
    titulo: tituloRaw.trim().substring(0, 200),
    organismo: (organismoRaw || 'Administración Pública').substring(0, 150),
    ccaa: ccaa,
    ambito: ambito,
    puesto: puesto,
    tipo: tipo,
    tipo_etiqueta: tipo_etiqueta,
    color_etiqueta: color_etiqueta,
    fecha_fin: fechaFin,
    requisitos: descRaw ? descRaw.substring(0, 300) : 'Consultar bases oficiales e instancias en la sede electrónica del organismo convocante.',
    url_sede: url,
    activo: true
  };
}

// 3. RASTREADOR DE LAS 17 WEBS AUTONÓMICAS
async function rastrearPortalesAutonomicos() {
  console.log(`-> Escaneando portales oficiales directos de las ${FUENTES_AUTONOMICAS.length} Comunidades Autónomas...`);
  const hallazgos = [];

  for (const fuente of FUENTES_AUTONOMICAS) {
    try {
      const res = await fetch(fuente.url, { 
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PliegaBot/1.0)' },
        signal: AbortSignal.timeout(7000) 
      });

      if (!res.ok) continue;

      const html = await res.text();
      const regexEnlaces = /<a[^>]+href="([^">]+)"[^>]*>(.*?)<\/a>/gi;
      let match;

      while ((match = regexEnlaces.exec(html)) !== null) {
        const href = match[1];
        const textoLimpio = match[2].replace(/<[^>]+>/g, '').trim();

        if (textoLimpio.length > 15 && textoLimpio.length < 180) {
          const coincide = fuente.palabrasClave.some(kw => textoLimpio.toLowerCase().includes(kw));

          if (coincide) {
            let fullUrl = href;
            if (!href.startsWith('http')) {
              const urlBase = new URL(fuente.url).origin;
              fullUrl = `${urlBase}${href.startsWith('/') ? '' : '/'}${href}`;
            }

            hallazgos.push({
              titulo: textoLimpio,
              organismo: fuente.organismo,
              ccaa: fuente.ccaa,
              desc: `Convocatoria o llamamiento publicado directamente en el portal oficial de ${fuente.ccaa}.`,
              url: fullUrl
            });
          }
        }
      }
    } catch (e) {
      console.warn(`[Skip] ${fuente.ccaa}: ${e.message}`);
    }
  }

  return hallazgos;
}

// 4. RASTREADOR DE CONVOCATORIAS ESTATALES Y AUTONÓMICAS CENTRALIZADAS (PAG)
async function rastrearPuntoAccesoGeneral() {
  console.log("-> Rastreando Punto de Acceso General (BOE y todas las CC.AA.)...");
  const lista = [];

  try {
    const urlFeed = "https://administracion.gob.es/pag_Home/empleoPublico/rss/ofertas-empleo-publico.rss";
    const res = await fetch(urlFeed, { signal: AbortSignal.timeout(10000) });
    
    if (res.ok) {
      const xml = await res.text();
      const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
      let itemMatch;

      while ((itemMatch = itemRegex.exec(xml)) !== null) {
        const itemXml = itemMatch[1];
        const tituloMatch = /<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i.exec(itemXml);
        const linkMatch = /<link>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/i.exec(itemXml);
        const descMatch = /<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/i.exec(itemXml);

        if (tituloMatch && linkMatch) {
          lista.push({
            titulo: tituloMatch[1].replace(/&amp;/g, '&').trim(),
            organismo: "Administración Pública",
            desc: descMatch ? descMatch[1].replace(/<[^>]+>/g, '').trim() : '',
            url: linkMatch[1].trim()
          });
        }
      }
    }
  } catch (err) {
    console.warn("Aviso Punto de Acceso General:", err.message);
  }

  return lista;
}

// 5. MOTOR PRINCIPAL
async function ejecutar() {
  console.log("=== INICIANDO RASTREO MULTICANAL ESPAÑA (17 CC.AA. + ESTADO) ===");

  const autonomicas = await rastrearPortalesAutonomicos();
  const centralizadas = await rastrearPuntoAccesoGeneral();

  const total = [...autonomicas, ...centralizadas];
  console.log(`Detectadas ${total.length} convocatorias candidatas.`);

  let guardadas = 0;
  for (const item of total) {
    if (!item.titulo || item.titulo.length < 6) continue;

    const reg = clasificar(item.titulo, item.organismo, item.desc, item.url, item.ccaa);

    const { error } = await supabase
      .from('convocatorias')
      .upsert(reg, { onConflict: 'titulo' });

    if (!error) {
      guardadas++;
    }
  }

  console.log(`=== FIN DEL RASTREO: ${guardadas} convocatorias sincronizadas en Supabase ===`);
}

ejecutar().catch(err => {
  console.error("Error general:", err);
  process.exit(1);
});
