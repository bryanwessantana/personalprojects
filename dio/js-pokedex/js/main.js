const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const POKEDEX_CONFIG = {
    maxRecords: 151,
    limit: 10,
    offset: 0
};

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}"
                     loading="lazy">
            </div>
        </li>
    `
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(POKEDEX_CONFIG.offset, POKEDEX_CONFIG.limit)

loadMoreButton.addEventListener('click', () => {
    POKEDEX_CONFIG.offset += POKEDEX_CONFIG.limit
    const qtdRecordsWithNexPage = POKEDEX_CONFIG.offset + POKEDEX_CONFIG.limit

    if (qtdRecordsWithNexPage >= POKEDEX_CONFIG.maxRecords) {
        const newLimit = POKEDEX_CONFIG.maxRecords - POKEDEX_CONFIG.offset
        loadPokemonItens(POKEDEX_CONFIG.offset, newLimit)

        loadMoreButton.remove() 
    } else {
        loadPokemonItens(POKEDEX_CONFIG.offset, POKEDEX_CONFIG.limit)
    }
})