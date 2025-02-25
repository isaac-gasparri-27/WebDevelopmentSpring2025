const API_KEY = '5fc1fff26879aea0c63f086f4feb184d';
const API_URL = `https://cors-anywhere.herokuapp.com/https://superheroapi.com/api/${API_KEY}/search/`;

const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const errorMessage = document.getElementById('error-message');
const superheroDetails = document.getElementById('superhero-details');
const heroImage = document.getElementById('hero-image');
const heroName = document.getElementById('hero-name');
const heroBiography = document.getElementById('hero-biography');
const heroStrength = document.getElementById('hero-strength');
const heroSpeed = document.getElementById('hero-speed');
const heroIntelligence = document.getElementById('hero-intelligence');
const heroDurability = document.getElementById('hero-durability')
const heroPower = document.getElementById('hero-power')
const heroCombat = document.getElementById('hero-combat')

searchButton.addEventListener('click', () => {
  const query = searchInput.value.trim();
  if (!validateInput(query)) return;
  fetchSuperhero(query);
});

function validateInput(input) {
  if (input === '') {
    displayError('Please enter a superhero name!');
    return false;
  }
  if (!/^[a-zA-Z0-9 ]+$/.test(input)) {
    displayError('Please enter a valid superhero name!');
    return false;
  }
  clearError();
  return true;
}

async function fetchSuperhero(name) {
  try {
    console.log(`${API_URL}${name}`);

    const response = await fetch(`${API_URL}${name}`);
    const data = await response.json();

    console.log(data);

    if (data.response === 'error' || !data.results || data.results.length === 0) {
        displayError(`No results found for '${name}'. Please try again.`);
      return;
    }

    displaySuperhero(data.results[0]);
  } catch (error) {
    displayError('There was an issue fetching data. Please try again.');
  }
}

function displaySuperhero(hero) {
  if (!hero || !hero.name || !hero.image || !hero.powerstats || !hero.biography) {
    displayError('Incomplete superhero data. Please try again.');
    return;
  }

  heroImage.src = hero.image.url;
  heroName.textContent = hero.name;
  heroBiography.textContent = hero.biography['full-name'] || 'No biography available.';
  heroStrength.textContent = hero.powerstats.strength || 'N/A';
  heroSpeed.textContent = hero.powerstats.speed || 'N/A';
  heroIntelligence.textContent = hero.powerstats.intelligence || 'N/A';
  heroDurability.textContent = hero.powerstats.durability || 'N/A';
  heroPower.textContent = hero.powerstats.power || 'N/A';
  heroCombat.textContent = hero.powerstats.combat || 'N/A';

  superheroDetails.classList.remove('hidden');
}

function displayError(message) {
  errorMessage.textContent = message;
  superheroDetails.classList.add('hidden');
}

function clearError() {
  errorMessage.textContent = '';
}
