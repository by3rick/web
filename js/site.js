// site.js — versión mejorada por Erick (modular, accesible, optimizada)
// Requiere elementos: pais_input, btn_search, results, pais_name, pais_flag, pais_region, dato_catolico, santo_pais, santo_img

class Country {
  constructor({ flags, name, region }) {
    this.flag = flags?.png || flags?.svg || '';
    this.name = name?.common || 'Not found';
    this.region = region || 'Unknown';
  }

  static factsMap() {
    return {
      italy: "Italy is home to the Vatican, the heart of Catholicism.",
      spain: "Spain has a deep Catholic heritage and many missionaries.",
      mexico: "Mexico has the second-largest Catholic population. Our Lady of Guadalupe appeared to St. Juan Diego in 1531, becoming the patroness of the Americas. 💀🕯️",
      brazil: "Brazil celebrates Our Lady of Aparecida as its patroness.",
      argentina: "Argentina is the birthplace of Pope Francis.",
      poland: "Poland gave the world Pope John Paul II.",
      france: "Lourdes is one of the most visited pilgrimage sites due to the Marian apparitions."
    };
  }

  static saintsMap() {
    return {
      italy: "St. Francis of Assisi",
      spain: "St. Teresa of Avila",
      mexico: "St. Juan Diego",
      brazil: "St. Dulce of the Poor",
      argentina: "St. Héctor Valdivielso Sáez",
      poland: "St. John Paul II",
      portugal: "St. Anthony of Padua",
      france: "St. Joan of Arc",
      germany: "St. Boniface",
      ireland: "St. Patrick",
      philippines: "St. Lorenzo Ruiz",
      "united states": "St. Elizabeth Ann Seton",
      canada: "St. Josephine Bakhita",
      colombia: "St. Peter Claver",
      chile: "St. Alberto Hurtado",
      peru: "St. Rose of Lima",
      cuba: "St. Anthony Mary Claret",
      venezuela: "St. José de Anchieta",
      "el salvador": "St. Oscar Romero",
      japan: "St. Maximilian Kolbe",
      lebanon: "St. Charbel Makhlouf",
      algeria: "St. Augustine of Hippo"
    };
  }

  getCatholicFact() {
    return Country.factsMap()[this.name.toLowerCase()] || "This country has a rich Catholic history. 💫";
  }

  getSaint() {
    return Country.saintsMap()[this.name.toLowerCase()] || "No specific saint registered.";
  }

  getSaintImage() {
    const images = {
      "St. Francis of Assisi": "https://www.aciprensa.com/santos/images/Asis_04Octubre.jpg",
      "St. Teresa of Avila": "https://www.aciprensa.com/santos/images/TeresaAvila_14Octubre.jpg",
      "St. Juan Diego": "https://www.aciprensa.com/imagespp/sanjuandiego9diciembre.jpg?w=672&h=448",
      "St. Dulce of the Poor": "https://www.acidigital.com/images/ago13.jpg?w=680&h=378",
      "St. Héctor Valdivielso Sáez": "https://www.aciprensa.com/imagespp/Santo/395/st-hector.jpg",
      "St. John Paul II": "https://www.aciprensa.com/imagespp/sanjuanpabloiielgrande.jpg?w=672&h=448",
      "St. Rose of Lima": "https://www.aciprensa.com/imagespp/RosaDeLima_Agosto.jpg?w=672&h=448",
      "St. Oscar Romero": "https://www.aciprensa.com/imagespp/beatoromerooscar.jpg?w=672&h=448",
      "St. Maximilian Kolbe": "https://www.aciprensa.com/imagespp/sanmaximilianokolbe.jpg?w=672&h=448",
      "St. Patrick": "https://www.aciprensa.com/imagespp/sanpatricio17demarzo.jpg?w=672&h=448",
      "St. Charbel Makhlouf": "https://www.aciprensa.com/imagespp/sancharbelmakhlouf.jpg?w=672&h=448",
      "St. Joan of Arc": "https://www.aciprensa.com/santos/images/JuanaArco_30Mayo.jpg",
      "St. Augustine of Hippo": "https://www.aciprensa.com/imagespp/sanagustin-1724808071.jpg?w=672&h=448",
      "St. Elizabeth Ann Seton": "https://www.aciprensa.com/santos/images/IsabelAnaBayleySeton_04Enero.jpg"
    };
    return images[this.getSaint()] || "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Christian_cross.svg/1024px-Christian_cross.svg.png";
  }
}

// ---------------------------
// UTIL
// ---------------------------
const $ = (id) => document.getElementById(id);
const safeText = (s) => typeof s === 'string' ? s : '';
const isCarloPage = () => /carlo|index-carlo/.test(location.pathname.toLowerCase());

// ARIA live region
const liveRegion = document.getElementById('aria_live_region') || (() => {
  const r = document.createElement('div');
  r.id = 'aria_live_region';
  r.setAttribute('aria-live', 'polite');
  r.setAttribute('aria-atomic', 'true');
  r.style.position = 'absolute';
  r.style.left = '-9999px';
  r.style.width = '1px';
  r.style.height = '1px';
  document.body.appendChild(r);
  return r;
})();

// Spinner
const showSpinner = (container) => {
  removeSpinner();
  const spinner = document.createElement('div');
  spinner.id = 'cf-spinner';
  spinner.setAttribute('role', 'status');
  spinner.setAttribute('aria-live', 'polite');
  spinner.innerHTML = `<span class="visually-hidden">Loading...</span>`;
  spinner.style.cssText = "margin:1rem auto;width:48px;height:48px;border:4px solid rgba(255,255,255,0.08);border-top:4px solid #00bfff;border-radius:50%;";
  container.appendChild(spinner);
};
const removeSpinner = () => $('#cf-spinner')?.remove();

// CACHE
const resultsCache = new Map();

// FETCH COUNTRY
const fetchCountryData = async (name) => {
  const key = name.toLowerCase();
  if (resultsCache.has(key)) return resultsCache.get(key);
  const urls = [
    `https://restcountries.com/v3.1/name/${encodeURIComponent(name)}?fullText=true`,
    `https://restcountries.com/v3.1/name/${encodeURIComponent(name)}`
  ];
  for (const url of urls) {
    try {
      const res = await fetch(url, { cache: 'force-cache' });
      if (!res.ok) throw new Error(`Not found (${res.status})`);
      const json = await res.json();
      if (Array.isArray(json) && json.length > 0) { resultsCache.set(key, json[0]); return json[0]; }
    } catch (_) {}
  }
  throw new Error('Country fetch failed');
};

// ---------------------------
// DOM Helpers
// ---------------------------
const removeExistingAltar = () => {
  $('.altar-dia-muertos')?.remove();
  $('#btn-open-carlo-altar')?.remove();
};

const decorateAltar = (country) => {
  const isMexico = country?.name?.toLowerCase() === 'mexico';
  if (isCarloPage()) {
    removeExistingAltar();
    const container = document.createElement('section');
    container.className = 'altar-dia-muertos glass-card mt-4 p-4 animate-glow';
    container.setAttribute('aria-labelledby', 'altar-title');
    container.innerHTML = `
      <h3 id="altar-title">💀 Altar de Muertos — En honor a Carlo Acutis 🕯️</h3>
      <p>Este altar del grupo honra a Carlo Acutis, joven que unió fe y tecnología.</p>
      <div class="altar-visual d-flex justify-content-center align-items-center flex-wrap gap-4 mt-3">
        <div class="vela" role="img" aria-label="Vela encendida"></div>
        <figure style="margin:0;">
          <img src="https://www.aciprensa.com/imagespp/beatocarloacutis.jpg?w=672&h=448"
               alt="Fotografía del Beato Carlo Acutis" style="max-height:220px; border-radius:12px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
        </figure>
        <div class="vela" role="img" aria-label="Vela encendida"></div>
      </div>
    `;
    const results = $('results') || document.body;
    results.appendChild(container);
    container.setAttribute('tabindex', '-1');
    container.focus({ preventScroll: false });
    liveRegion.textContent = 'Altar de muertos cargado en la página de Carlo.';
  } else if (isMexico) {
    removeExistingAltar();
    const results = $('results');
    if (!results) return;
    const btn = document.createElement('a');
    btn.id = 'btn-open-carlo-altar';
    btn.href = 'index-carlo.html';
    btn.className = 'btn btn-hero mt-3';
    btn.textContent = 'Ver altar de Carlo Acutis (Día de Muertos)';
    results.appendChild(btn);
    liveRegion.textContent = 'Hay un altar disponible en la página de Carlo.';
  } else removeExistingAltar();
};

// ---------------------------
// RENDER COUNTRY
// ---------------------------
const renderCountry = (data) => {
  if (!data) return;
  const country = new Country(data);
  const els = {
    results: $('results'), name: $('pais_name'), region: $('pais_region'),
    flag: $('pais_flag'), fact: $('dato_catolico'), saint: $('santo_pais'), saintImg: $('santo_img')
  };
  if (!els.results || !els.name) return;

  removeExistingAltar();

  els.name.textContent = safeText(country.name);
  els.name.setAttribute('tabindex', '-1');
  els.region.textContent = `Region: ${safeText(country.region)}`;
  if (els.flag) { els.flag.src = country.flag; els.flag.alt = `Flag of ${country.name}`; els.flag.classList.add('flag'); }
  if (els.fact) els.fact.textContent = country.getCatholicFact();
  if (els.saint) els.saint.textContent = `Saint: ${country.getSaint()}`;
  if (els.saintImg) { els.saintImg.src = country.getSaintImage(); els.saintImg.alt = `Image of ${country.getSaint()}`; els.saintImg.classList.add('img-santo'); }

  els.results.classList.remove('invisible');
  removeSpinner();
  triggerAnimations();
  els.name.focus();
  liveRegion.textContent = `${country.name} cargado. ${country.getCatholicFact()}`;

  decorateAltar(country);
};

// ---------------------------
// ANIMACIONES
// ---------------------------
const triggerAnimations = () => {
  ['pais_name','pais_flag','pais_region','dato_catolico','santo_pais','santo_img'].forEach(id => {
    const el = $(id); if (!el) return;
    el.classList.remove('fade-in','slide-in'); void el.offsetWidth;
    el.classList.add((id==='dato_catolico'||id==='santo_pais')?'slide-in':'fade-in');
  });
};

// ---------------------------
// ERROR
// ---------------------------
const showError = (msg) => {
  removeSpinner();
  const elResults = $('results');
  if (!elResults) { alert(msg); return; }
  let alert = $('#cf-alert');
  if (!alert) { alert = document.createElement('div'); alert.id='cf-alert'; alert.setAttribute('role','alert'); alert.className='glass-card p-3 mt-3'; elResults.appendChild(alert); }
  alert.textContent = msg;
  elResults.classList.remove('invisible');
  alert.focus();
  liveRegion.textContent = msg;
};

// ---------------------------
// GET COUNTRY
// ---------------------------
const getCountry = async (name) => {
  if (!name?.trim()) { showError('Please enter a country name in English.'); return; }
  $('#cf-alert')?.remove();
  const elResults = $('results') || document.createElement('div');
  showSpinner(elResults);
  try { renderCountry(await fetchCountryData(name)); }
  catch { showError('Could not fetch country. Make sure the name is in English and is a real country.'); }
  finally { removeSpinner(); }
};

// ---------------------------
// EVENTS
// ---------------------------
document.addEventListener('DOMContentLoaded', () => {
  const btn = $('btn_search'), input = $('pais_input');

  btn?.addEventListener('click', e => { e.preventDefault(); getCountry(input?.value?.trim()); });
  input?.addEventListener('keydown', e => { if(e.key==='Enter'){ e.preventDefault(); getCountry(input.value.trim()); }});
  if(input && !document.querySelector('label[for="pais_input"]')) input.setAttribute('aria-label','Enter country name in English');

  document.addEventListener('keydown', e => { if(e.key==='/' && !['INPUT','TEXTAREA'].includes(document.activeElement.tagName)){ e.preventDefault(); $('pais_input')?.focus(); } });

  if(isCarloPage()){
    const results = $('results') || (() => { const r=document.createElement('div'); r.id='results'; r.className='glass-card p-4 mt-4'; document.body.appendChild(r); return r; })();
    if(!results.children.length) renderCountry({ flags:{png:'https://flagcdn.com/w320/it.png'}, name:{common:'Italy'}, region:'Europe' });
  }
});
