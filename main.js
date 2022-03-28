const pokeApi = {
    url : "https://pokeapi.co/api/v2/pokemon/",
    search : async function (pokemon) {
        console.log(`Buscando ${pokemon} en ${this.url }`);
        console.log(this.url + pokemon);
        return await fetch(this.url + pokemon)
            .then( response => response.json())
            .catch(() => false)
            .then( data => {
                if(data === false){
                    return false;
                }
                let pokeRes = {};
                pokeRes.name = pokemon;
                pokeRes.img  = data.sprites.front_default;
                pokeRes.types = new Array();
                for(let i=0 ; i < data.types.length ; i++){
                    pokeRes.types.push(data.types[i].type.name);
                }
                pokeRes.stats = {};
                pokeRes.stats.hp      =data.stats[0].base_stat;
                pokeRes.stats.attack  =data.stats[1].base_stat;
                pokeRes.stats.defense =data.stats[2].base_stat;
                pokeRes.stats.sattack =data.stats[3].base_stat;
                pokeRes.stats.sdefense=data.stats[4].base_stat;
                pokeRes.stats.speed   =data.stats[5].base_stat;
                return pokeRes;
            });
    }
}

const maxStat = 252;

const keyDown = (e) => {
    const val = document.getElementById('pokemon').value;
   if(e === "Enter") buscarPokemon();
}

const buscarPokemon = () => {
    const poke = document.getElementById('pokemon').value;
    pokeApi.search(poke)
        .then(res => res===false ?
                alert('No se encontró el pokemón') :
                publicar(res)
        );
}

const showStats = stats => {
    let avg = 0;
    let i = 0;
    for(let stat in stats){
        let p100Val =  Math.round((parseInt(stats[stat]) / maxStat) * 100);
        avg += parseInt(stats[stat]);
        document.getElementById(`stat-${stat}`).style.height = p100Val.toString() + 'px';
        console.log(`#stat-${stat} .stat-value`);
        console.log(document.querySelector(`#stat-${stat} .stat-value`));
        document.querySelector(`#stat-${stat} .stat-value`).innerHTML = stats[stat];
        i++;
    }
    avg = Math.round(avg / i);
    document.getElementById('average-value').innerHTML = avg;
    document.getElementById('stat-average').style.bottom = Math.round((avg / maxStat) * 100 - 10).toString() + 'px';
}

const showTypes = types => {
    if (typeof types != 'object') return false;
    document.getElementById('types').innerHTML = '';
    for (let i = 0; i < types.length ; i++){
        let img = document.createElement('img');
        img.src = `./img/type-${types[i]}.png`;
        img.title = types[i].toUpperCase();
        img.style.height = '40px';
        img.alt = types[i];
        document.getElementById('types').append(img);
    }
}

const limpiar = () => {
    document.getElementById('pokemon').value = '';
    document.getElementById('picture-container').innerHTML = '';
    document.getElementById('stat-average').style.bottom = '-10px';
    document.getElementById('average-value').innerHTML = '';
    document.querySelectorAll('div.stats > div[id^="stat-"]').forEach(elm => elm.style.height = '1px');
    document.querySelectorAll(".stat-value").forEach( elm => elm.innerHTML = '');
    document.getElementById('types').innerHTML = '';
}

const publicar = pokemon => {
    console.log(pokemon);
    if(pokemon){
        console.log(pokemon);
        let img = document.createElement('img');
        img.src = pokemon.img;
        img.className = "img"
        document.getElementById('picture-container').innerHTML = '';
        document.getElementById('picture-container').append(img);
        showStats(pokemon.stats);
        showTypes(pokemon.types);
    }
}