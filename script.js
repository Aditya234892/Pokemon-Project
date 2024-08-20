const selectOption = document.getElementById("pokemon-types");
const pokenmonTypeURL = "https://pokeapi.co/api/v2/type/";
const list = document.getElementById("container");
const search = document.getElementById("search");
const reset = document.getElementById("reset");

const typeObject = [];
const pokemonCard = [];

const typeColor = {
  bug: "#26de81",
  dragon: "#ffeaa7",
  dark: "#8A8A8A",
  electric: "#fed330",
  fairy: "#FF0069",
  fighting: "#30336b",
  fire: "#f0932b",
  flying: "#81ecec",
  grass: "#00b894",
  ground: "#EFB549",
  ghost: "#a55eea",
  ice: "#74b9ff",
  normal: "#95afc0",
  poison: "#6c5ce7",
  psychic: "#a29bfe",
  rock: "#2d3436",
  water: "#0190FF",
  steel: "#71797E"
};

async function fetchPokenmonType() {
  const res = await fetch(pokenmonTypeURL);
  const parseRes = await res.json();
  const dataArr = parseRes.results;
  dataArr.forEach((ele) => {
    const name = ele.name;
    typeObject[ele.name] = ele.url;
    const option = document.createElement("option");
    option.innerHTML = name;
    option.setAttribute("value", name);
    selectOption.append(option);
  });
}

async function fetchPokemonOnType() {
  list.innerHTML = "";
  pokemonCard.length = 0;
  const pokemonTypeValue = selectOption.value;
  const url = typeObject[pokemonTypeValue];
  const res = await fetch(url);
  const parseRes = await res.json();
  const pokemonData = parseRes.pokemon;
  const pokemonsListLength = pokemonData.length > 30 ? 30 : pokemonData.length;

  for (let i = 0; i < pokemonsListLength; i++) {
    const pokename = pokemonData[i].pokemon.name;
    const pokeurl = pokemonData[i].pokemon.url;
    const response = await fetch(pokeurl);
    const parsedResponse = await response.json();
    const sprites = parsedResponse.sprites;
    const img = sprites.other.dream_world.front_default;
    const back = sprites.other.showdown.back_default;
    // console.log(back);
    
    const hp = parsedResponse.stats[0].base_stat;
    // const hpVal = hp.base_stat;
    // console.log(hp);
    const obj = {
      name: pokename,
      image: img,
      backImg: back,
      hp: hp,
      types: parsedResponse.types.map((ele) => {
        // const {name} = ele.type;
        const name = ele.type.name;
        return name;
      }),
      abilites: parsedResponse.abilities.map((ele) => {
        const ability = ele.ability.name;
        return ability;
      }),
      attack: parsedResponse.stats[1].base_stat,
      defense: parsedResponse.stats[2].base_stat,
      speed: parsedResponse.stats[5].base_stat,
    };
    pokemonCard.push(obj);
  }
  displaySearchResults(pokemonCard);
}
function searchPokemon() {
  const searchInput = search.value;
  const results = pokemonCard.filter((pokemon) => {
    return pokemon.name.toLowerCase().includes(searchInput.toLowerCase());
  });
  displaySearchResults(results);
}
function displaySearchResults(results) {
  list.innerHTML = "";
  results.forEach((ele) => {
    // console.log("Creating card for", ele.name);
    const main = document.createElement("div");
    main.classList.add("main");
    const themeColor = typeColor[ele.types[0]];
    // console.log(themeColor)
    main.innerHTML = `
    <div class="card">
  <div class="front">
    <p class="hp">
            <span>HP</span>
              ${ele.hp}
          </p>
          <img src=${ele.image} />
          <h2 class="poke-name">${ele.name}</h2>
          <div class="types">
          </div>
  </div>
  <div class="back">
    <img src="${ele.backImg}">
    <div class="stats">
            <div>
              <h3>${ele.attack}</h3>
              <p>Attack</p>
            </div>
            <div>
              <h3>${ele.defense}</h3>
              <p>Defense</p>
            </div>
            <div>
              <h3>${ele.speed}</h3>
              <p>Speed</p>
            </div>
          </div>
  </div>
</div>`;
    ele.types.forEach((item) => {
      let span = document.createElement("SPAN");
      span.textContent = item;
      span.style.backgroundColor = typeColor[item]; // Set the background color of the span
      main.querySelector(".types").appendChild(span);
    });
    const colorElements = main.querySelectorAll(".types span");
    colorElements.forEach((colorElement) => {
      main.style.background = `radial-gradient(circle at 50% 0%, ${themeColor} 36%, #ffffff 36%)`;
      // colorElement.style.backgroundColor = themeColor;
    });
    // console.log("Appending card to list");
    list.append(main);
  });
}

async function onloadFunction() {
  for (let i = 1; i < 200; i++) {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}/`);
    const parseRes = await res.json();
    const nameOfPokemon = parseRes.name;
    const sprites = parseRes.sprites;
    const img = sprites.other.dream_world.front_default;
    console.log(parseRes);
    
    const back = sprites.other.showdown.back_default;
    const pokeObj = {
      name: nameOfPokemon,
      image: img,
      backImg: back,
      hp: parseRes.stats[0].base_stat,
      types: parseRes.types.map((ele) => {
        const { name } = ele.type;
        return name;
      }),
      abilites: parseRes.abilities.map((ele) => {
        const ability = ele.ability.name;
        return ability;
      }),
      attack: parseRes.stats[1].base_stat,
      defense: parseRes.stats[2].base_stat,
      speed: parseRes.stats[5].base_stat,
    };
    pokemonCard.push(pokeObj);
  }
  displaySearchResults(pokemonCard);
}
function resetPokemon() {
  pokemonCard.length = 0;
  onloadFunction();
}
// console.log(pokemonCard);

window.addEventListener("load", onloadFunction);
search.addEventListener("keyup", searchPokemon);
reset.addEventListener("click", resetPokemon);

//Button Ripple Effect
const btn = document.querySelector('a');
// console.log(btn);

btn.addEventListener("mouseover", (e) => {
  const rect = btn.getBoundingClientRect();
  const x = e.pageX - rect.left;
  const y = e.pageY - rect.top;

  btn.style.setProperty("--xPos", x + "px");
  btn.style.setProperty("--yPos", y + "px");
});