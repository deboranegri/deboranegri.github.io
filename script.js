
class Vaga {
   
    #elementoDOM;
    #titulo;
    #descricaoCurta;
    #area; 
    #idVaga;

    constructor(elementoDOM) {
        this.#elementoDOM = elementoDOM;
        this.#titulo = elementoDOM.querySelector('.vaga_titulo')?.textContent.toLowerCase() || '';
        this.#descricaoCurta = elementoDOM.querySelector('.vaga_descricao')?.textContent.toLowerCase() || '';
        this.#area = elementoDOM.getAttribute('data-area') || '';
    }

    exibir_card() {
        this.#elementoDOM.style.display = 'block';
    }

    ocultar_card() {
        this.#elementoDOM.style.display = 'none';
    }

    visualizar_detalhes() {
        console.log(`Visualizando detalhes da vaga: ${this.#titulo}`);
    }

    clicar_inscrever() {
        console.log(`Clicando em inscrever para a vaga: ${this.#titulo}`);
    }

    matchesArea(filterValue) {
        return filterValue === 'all' || this.#area === filterValue;
    }

    matchesSearch(searchTerm) {
        return this.#titulo.includes(searchTerm) || this.#descricaoCurta.includes(searchTerm);
    }
}

class Categoria {
    #nome;
    #idCategoria;
    #vagasAssociadas = []; 

    constructor(nome) {
        this.#nome = nome;
    }

    Selecionar_filtro(filterValue) {
        document.querySelectorAll('.filter_button').forEach(btn => {
            btn.classList.remove('active');
        });

        const clickedButton = document.querySelector(`.filter_button[data-filter="${filterValue}"]`);
        if (clickedButton) {
            clickedButton.classList.add('active');
        }
        
        return filterValue;
    }

    resetar_filtros() {
        return 'all';
    }
}

class SistemaDeBusca {
    #termoPesquisa = '';
    #filtroAtivo = 'all';
    #vagasOriginais = []; 

    constructor(vagasDOM) {
        this.#vagasOriginais = Array.from(vagasDOM).map(el => new Vaga(el));
    }

    pesquisarPorTermo(searchTerm) {
        this.#termoPesquisa = searchTerm.toLowerCase();
    }

    exibir_resultado() {
        this.#vagasOriginais.forEach(vaga => {
            const matchesArea = vaga.matchesArea(this.#filtroAtivo);
            const matchesSearch = vaga.matchesSearch(this.#termoPesquisa);

            if (matchesArea && matchesSearch) {
                vaga.exibir_card();
            } else {
                vaga.ocultar_card();
            }
        });
    }

    setFiltroAtivo(filterValue) {
        this.#filtroAtivo = filterValue;
    }
}

class Candidato {
    
    #termoPesquisa;
    #vagasOriginais;

    constructor() {
        
    }

    informar_dados() {
        console.log("Candidato: Informando dados (lógica em candidatura.html)");
    }

    finalizar_candidatura() {
        console.log("Candidato: Finalizando candidatura (lógica em candidatura.html)");
        return true;
    }
}

class Candidatura {

    #idCandidatura;
    #dataEnvio;
    #status;

    constructor() {
        
    }

    iniciar_candidatura() {
        console.log("Candidatura: Iniciando processo (lógica em candidatura.html)");
    }

    finalizar_candidatura() {
        console.log("Candidatura: Finalizando processo (lógica em candidatura.html)");
        return true;
    }
}

const mainScreenItems = document.querySelectorAll('.main-screen-item');
const vagasContainer = document.getElementById('vagas_container');
const formContainer = document.getElementById('form_container'); 

let sistemaDeBusca;
const categoriaManager = new Categoria('Filtros de Vaga'); 

function openMenu() {
    document.getElementById("menu_aba").style.display = "block";
}

function closeMenu() {
    document.getElementById("menu_aba").style.display = "none";
}

function openVagas() {
    mainScreenItems.forEach(item => item.style.display = "none");
    
    const componentes = document.getElementById("componentes");
    if (componentes) componentes.style.display = "none";

    if (formContainer) formContainer.style.display = 'none'; 

    if (vagasContainer) vagasContainer.style.display = "block";

    if (sistemaDeBusca) {
        sistemaDeBusca.exibir_resultado();
    }
}

function closeVagas() {
    if (vagasContainer) vagasContainer.style.display = "none";
    if (formContainer) formContainer.style.display = "none"; 
    
    mainScreenItems.forEach(item => {
        item.style.display = "block";
    });
    
    const componentes = document.getElementById("componentes");
    if (componentes) componentes.style.display = "block";
}

const root = document.documentElement;

function temaInatel() {
    root.classList.remove('tema-limao', 'tema-dark');
    localStorage.setItem('theme', '');
}

function temaLim() {
    root.classList.remove('tema-dark');
    root.classList.add('tema-limao');
    localStorage.setItem('theme', 'tema-limao');
}

function temaDark() {
    root.classList.remove('tema-limao');
    root.classList.add('tema-dark');
    localStorage.setItem('theme', 'tema-dark');
}

document.addEventListener('click', function(event) {
    const menuAba = document.getElementById('menu_aba');
    const menuButton = document.getElementById('menu');
    const perfilButton = document.getElementById('perfil');

    if (menuAba && menuAba.style.display === 'block' && 
        !menuAba.contains(event.target) && 
        !menuButton.contains(event.target) &&
        !perfilButton.contains(event.target)) {
        closeMenu();
    }
});

function applyFiltersRefactored() {
    if (!sistemaDeBusca) return;

    const searchInput = document.getElementById('vagas_search');
    const searchTerm = searchInput ? searchInput.value : '';

    sistemaDeBusca.pesquisarPorTermo(searchTerm);
    
    sistemaDeBusca.exibir_resultado();
}

function handleFilterClickRefactored(event) {
    const clickedButton = event.target.closest('.filter_button');
    if (!clickedButton) return;

    const filterValue = clickedButton.getAttribute('data-filter');
    if (!filterValue) return;

    const novoFiltro = categoriaManager.Selecionar_filtro(filterValue);
    
    if (sistemaDeBusca) {
        sistemaDeBusca.setFiltroAtivo(novoFiltro);
    }

    applyFiltersRefactored();
}

document.addEventListener('DOMContentLoaded', () => {
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.className = savedTheme;
    }
    
    const vagasWrapper = document.getElementById('vagas_carrossel_wrapper');
    if (vagasWrapper) {
        const vagaItems = vagasWrapper.querySelectorAll('.vaga_item');
        sistemaDeBusca = new SistemaDeBusca(vagaItems);
    }

    const searchInput = document.getElementById('vagas_search');
    const filterButtonsContainer = document.getElementById('filter_buttons_container');
    
    if (searchInput) {
        searchInput.addEventListener('input', applyFiltersRefactored);
    }
    
    if (filterButtonsContainer) {
        filterButtonsContainer.addEventListener('click', handleFilterClickRefactored);
    }
    
});