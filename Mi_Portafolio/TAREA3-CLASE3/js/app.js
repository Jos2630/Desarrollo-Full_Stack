const SITE_AUTOR= 'Josue Chambilla';
const API_BASE= 'https://jsonplaceholder.typicode.com';
const POKE_API= 'https://pokeapi.co/api/v2';
const WATHER_API='https://restcountries.com/v3.1';

let  currentFilter = 'all';
let pokemonPage = 1;
let projectsData = [];  

const greep = (name)=>`'Hola desde el portafolio de ${name}'`;
console.log(greep(SITE_AUTOR));

const formatPrice = (amount) => `$${Number(amount).toLocaleString('es-BO')}`;

const devProfile={
    name: 'Josue Chambilla',
    role: 'Estudiante',
    skills: ['JavaScript', 'HTML', 'CSS', 'React', 'NodeJs'],
    location: 'La Paz, Bolivia',
};





const {name, role, skills} = devProfile;
const [mainSkill, ...otherSkills]=skills;

console.log(`${name} - ${role}`);
console.log(`Habilidades principales: ${mainSkill}`);
console.log(`Otras habilidades: ${otherSkills}`);

const frontEnd=['React', 'Vue', 'Angular'];
const backEnd=['NodeJs', 'Django', 'Ruby on Rails'];
const allTechnologies=[...frontEnd, ...backEnd];
console.log('Todas las tecnologias: ', allTechnologies);

const UpdateProfile={...devProfile, available: true};
console.log('Perfil Actualizado: ', UpdateProfile);

class Project{
    #id;
    constructor({id, title, description, techs, emoji, category}){
        this.#id=id;
        this.title=title;
        this.description=description;
        this.techs=techs;
        this.emoji=emoji;
        this.category=category;
    }
    get id(){
        return this.#id;
    }
    toHtml(){
        const badger = this.techs
        .map(tech=>`<span class="tech-badge">${tech}</span>`)
        .join(' ');
        return `<article class="project-card" data-id="${this.#id}" data-category="${this.category}">
        <div class="project-img" aria-hidden="true">${this.emoji}</div>
        <div class="project-info">
            <h3>${this.title}</h3>
            <p>${this.description}</p>
            <footer class="project-tags">${badger}</footer>
        </div>
        </article>`;    
    }
}
const localProjects = [
  new Project({
    id: 1, category: 'frontend', emoji: '📱',
    title: 'App de Tareas',
    description: 'Aplicación web con drag & drop, almacenamiento local y modo oscuro.',
    techs: ['React', 'CSS Modules', 'Flexbox'],
  }),
  new Project({
    id: 2, category: 'frontend', emoji: '🌿',
    title: 'EcoShop',
    description: 'E-commerce sostenible con sistema de filtros y carrito de compras.',
    techs: ['HTML5', 'CSS Grid', 'JavaScript'],
  }),
  new Project({
    id: 3, category: 'fullstack', emoji: '📊',
    title: 'Dashboard Analytics',
    description: 'Panel con gráficas en tiempo real, filtros dinámicos y exportación.',
    techs: ['Node.js', 'PostgreSQL', 'Chart.js'],
  }),
  new Project({
    id: 4, category: 'backend', emoji: '🔧',
    title: 'REST API – Inventario',
    description: 'API REST completa con autenticación JWT y documentación Swagger.',
    techs: ['Express', 'MySQL', 'JWT'],
  }),
  new Project({
    id: 5, category: 'fullstack', emoji: '🌍',
    title: 'GeoWeather App',
    description: 'Consulta clima en tiempo real usando la API de OpenWeather y países.',
    techs: ['React', 'Fetch API', 'OpenWeather'],
  }),
];
console.log(localProjects);


/** filtro proyectos por categoria */
const filterProjects = (category) => 
    category === 'all' 
    ? localProjects 
    : localProjects.filter(p => p.category === category);



/** extrae solo los titulos */
const getTitles = () => localProjects.map(p => p.title);


/** cuenta proyectos por categoria */
const countByProjects= localProjects.reduce((acc, p)=>{
    acc[p.category]=(acc[p.category]||0)+1;
    return acc;
}, {});


/** busca proyecto por id */
const findProjectById=(id)=>localProjects.find(p=>p.id===id);

console.log('tiulos', getTitles());
console.log('Por categoria', countByProjects);

/** seleccion DOM + manipulacion */
const projectsGrid = document.getElementById('projects-grid');
const filterButtons = document.querySelectorAll('.filter-btn');
const pokeSection = document.getElementById('poke-section');
const pokeGrid = document.getElementById('poke-grid');
const pokeBtnNext = document.getElementById('poke-next');
const countryInput = document.getElementById('country-search');
const countryResult = document.getElementById('country-result');

/** renderiza proyectos en el DOM */
function renderProjects(category='all'){
    if(!projectsGrid) return;
    const filtered = filterProjects(category);
    projectsGrid.innerHTML = filtered
    .map(p=>p.toHtml())
    .join('');
    
    filterButtons.forEach(btn=>{
        btn.classList.toggle('active', btn.dataset.filter===category);
    });

    const counter = document.getElementById('project-count');
    if(counter) counter.textContent = `${filtered.length} proyectos`;
}

/** eventos*/
/** delegacion de eventos en los filtros */
filterButtons.forEach(btn=>{
    btn.addEventListener('click', (e)=>{
        currentFilter = e.target.dataset.filter;
        renderProjects(currentFilter);
    });
});

/** scroll suave con evento global     */
document.querySelectorAll('a[href^="#"]').forEach(anchor=>{
    anchor.addEventListener('click', (e)=> {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if(target){
            target.scrollIntoView({behavior: 'smooth'});
        };
    });
});

/** local storage    */
function saveFormData(data){
    localStorage.setItem('form-draft', JSON.stringify(data));
}     

function validateEmail(email){
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            const Valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            if(Valid)resolve({ok: true, email});
            else{
                reject(new Error(`Email no valido: ${email}`));
            }   
        }, 500);
});
}

validateEmail('josue@ejemplo.com')
    .then(({email})=>console.log(`Email valido: ${email}`))
    .catch((error)=>console.error(error.message));

async function fetchJSON(url){
    const res = await fetch(url);
    if(!res.ok) throw new Error(`Error al obtener datos: ${res.status}`);
    return await res.json();
}
async function fetchProjects() {
    const loader = document.getElementById('project-loader');
    if(loader) loader.classList.remove('hidden');
    try {
        const posts = await fetchJSON(`${API_BASE}/posts?_limit=5`);
        console.log(posts);
        const extra = posts.map(({id, title, body}) => new Project({
            id: id+100,
            category: 'api',
            emoji: '😊',
            title: title.slice(0,40) + '...',
            description: body.slice(0,80) + '...',
            techs: ['API', 'Fetch', 'Async/Await']
        }));
        projectsData = [...localProjects, ...extra];
        showToast('Proyectos cargados desde API');
    } catch (error) {
        console.error('Error al cargar proyectos:', error);
        showToast('Error al cargar proyectos', 'error');
    } finally {
        if(loader) loader.classList.add('hidden');
    }
}


async function fetchPokemons(offset = 0) {
    if (!pokeGrid) return;

    pokeGrid.innerHTML = '<p class="loading-text">Cargando Pokémon...</p>';

    try {
        // Fetch GET con parámetros en la URL
        const data = await fetchJSON(`${POKE_API}/pokemon?limit=6&offset=${offset}`);

        // Promise.all: carga los detalles de los 6 pokémon EN PARALELO
        const details = await Promise.all(
            data.results.map(p => fetchJSON(p.url)) // map() + Promise.all
        );

        // Manipulación DOM: construir tarjetas con innerHTML
        pokeGrid.innerHTML = details.map(({ name, id, sprites, types }) => {
            const type = types[0].type.name;
            const img = sprites.other['official-artwork'].front_default || sprites.front_default;
            return `
                <div class="poke-card poke--${type}">
                    <img src="${img}" alt="${name}" loading="lazy" />
                    <p class="poke-name">${name}</p>
                    <span class="poke-type">${type}</span>
                </div>
            `;
        }).join('');
    } catch (err) {
        pokeGrid.innerHTML = `<p class="error-text">Error: ${err.message}</p>`;
    }
}

async function fetchCountry(query) {
    if (!countryResult || !query.trim()) return;
    
    // Mostrar mensaje de carga
    countryResult.innerHTML = '<p class="loading-text">Buscando país...</p>';
    
    try {
        // Llamada a la API de REST Countries
        const [country] = await fetchJSON(
            `${WATHER_API}/name/${encodeURIComponent(query.trim())}?fields=name,capital,population,flags,region`
        );
        
        // Destructuring del objeto
        const {
            name: { common },
            capital: [capital] = ['N/A'],
            population,
            flags: { svg: flag },
            region,
        } = country;
        
        // Mostrar la tarjeta del país
        countryResult.innerHTML = `
            <div class="country-card">
                <img src="${flag}" alt="Bandera de ${common}" class="country-flag" />
                <div class="country-info">
                    <h4>${common}</h4>
                    <p>Capital: <strong>${capital}</strong></p>
                    <p>Región: <strong>${region}</strong></p>
                    <p>Población: <strong>${population.toLocaleString()}</strong></p>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error al buscar país:', error);
        countryResult.innerHTML = `<p class="error-text">País no encontrado. Revisa el nombre o intenta con otro.</p>`;
        if (typeof showToast === 'function') showToast('Error al buscar país', 'error');
    }
}


let searchTimer;
if (countryInput) {
    countryInput.addEventListener('input', (e) => {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(() => fetchCountry(e.target.value), 600);
    });
}

async function loadDashboardData() {
    try {
        const [posts, users, todos] = await Promise.all([
            fetchJSON(`${API_BASE}/posts?limit=5`),
            fetchJSON(`${API_BASE}/users?limit=5`),
            fetchJSON(`${API_BASE}/todos?limit=5`)
        ]);
        console.log('Posts:', posts);
        console.log('Users:', users);
        console.log('Todos:', todos);

        showToast('Datos del dashboard cargados');
    } catch (error) {
        console.error('Error al cargar datos del dashboard:', error);
        showToast('Error al cargar datos del dashboard', 'error');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (pokeSection) fetchPokemons(0);
});


let currentOffset = 0; // lleva la cuenta del desplazamiento actual

if (pokeBtnNext) {
    pokeBtnNext.addEventListener('click', () => {
        currentOffset += 6;          // avanzamos 6 Pokémon
        fetchPokemons(currentOffset); // cargamos desde el nuevo offset
    });
}
function showToast(message, type = 'info') {
    console.log(`[${type}] ${message}`);
    // Opcional: puedes implementar un toast visual más adelante
}