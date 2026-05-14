const BASE_URL = 'https://pokeapi.co/api/v2/pokemon';

const inputPokemon  = document.getElementById('inputPokemon');
const btnBuscar     = document.getElementById('btnBuscar');
const btnAleatorio  = document.getElementById('btnAleatorio');
const secResultado  = document.getElementById('resultado');
const secError      = document.getElementById('error');
const pokemonImg    = document.getElementById('pokemonImg');
const pokemonNombre = document.getElementById('pokemonNombre');
const pokemonId     = document.getElementById('pokemonId');
const pokemonTipos  = document.getElementById('pokemonTipos');
const pokemonStats  = document.getElementById('pokemonStats');
const listaDiv      = document.getElementById('lista');

function mostrarSpinner(contenedor) {
  contenedor.innerHTML = '<div class="spinner"></div>';
}

function ocultarResultado() {
  secResultado.classList.add('oculto');
  secError.classList.add('oculto');
}

function mostrarError() {
  ocultarResultado();
  secError.classList.remove('oculto');
}

function mostrarPokemon(data) {
  pokemonImg.src =
    data.sprites.other['official-artwork'].front_default ||
    data.sprites.front_default;
  pokemonImg.alt = data.name;

  pokemonNombre.textContent = data.name;
  pokemonId.textContent     = `#${String(data.id).padStart(3, '0')}`;

  pokemonTipos.innerHTML = data.types
    .map(t => `<span class="tipo tipo-${t.type.name}">${t.type.name}</span>`)
    .join('');

  pokemonStats.innerHTML = data.stats
    .map(s => {
      const pct = Math.min((s.base_stat / 255) * 100, 100).toFixed(1);
      return `
        <li>
          <span class="nombre-stat">${s.stat.name.replace('-', ' ')}</span>
          <div class="barra-contenedor">
            <div class="barra" style="width:${pct}%"></div>
          </div>
          <span class="valor-stat">${s.base_stat}</span>
        </li>`;
    })
    .join('');

  secError.classList.add('oculto');
  secResultado.classList.remove('oculto');
}

async function buscarPokemon(query) {
  ocultarResultado();
  const termino = String(query).toLowerCase().trim();
  if (!termino) return;

  try {
    const res = await fetch(`${BASE_URL}/${termino}`);
    if (!res.ok) { mostrarError(); return; }
    const data = await res.json();
    mostrarPokemon(data);
  } catch {
    mostrarError();
  }
}

async function pokemonAleatorio() {
  const id = Math.floor(Math.random() * 1025) + 1;
  await buscarPokemon(id);
}

async function cargarLista() {
  mostrarSpinner(listaDiv);
  try {
    const res  = await fetch(`${BASE_URL}?limit=20&offset=0`);
    const data = await res.json();

    const detalles = await Promise.all(
      data.results.map(p => fetch(p.url).then(r => r.json()))
    );

    listaDiv.innerHTML = detalles
      .map(p => {
        const img =
          p.sprites.other['official-artwork'].front_default ||
          p.sprites.front_default;
        return `
          <div class="pokemon-mini" data-nombre="${p.name}">
            <img src="${img}" alt="${p.name}" loading="lazy" />
            <p>${p.name}</p>
          </div>`;
      })
      .join('');

    listaDiv.querySelectorAll('.pokemon-mini').forEach(card => {
      card.addEventListener('click', () => {
        buscarPokemon(card.dataset.nombre);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  } catch {
    listaDiv.innerHTML = '<p>No se pudo cargar la lista.</p>';
  }
}

btnBuscar.addEventListener('click', () => buscarPokemon(inputPokemon.value));
btnAleatorio.addEventListener('click', pokemonAleatorio);
inputPokemon.addEventListener('keydown', e => {
  if (e.key === 'Enter') buscarPokemon(inputPokemon.value);
});

cargarLista();
