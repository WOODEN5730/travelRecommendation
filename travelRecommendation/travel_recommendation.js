async function travelData() {
  const url = "travel_recommendation_api.json";

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();

    // Flatten everything into one array
    const allItems = [
      ...data.countries.flatMap(country => country.cities),
      ...data.temples,
      ...data.beaches
    ];

    // Get search text
    const query = document.querySelector("input[name='search']").value.toLowerCase();
   
    if (query === "") {
     console.log("Search is empty");
     return; // stop the function
    }
    
    // Filter results
    const filtered = allItems.filter(item =>
      item.name.toLowerCase().includes(query) 
    );

    displayResults(filtered);

  } catch (err) {
    console.error("Fetch failed:", err);
  }
}

function displayResults(items) {
  const container = document.getElementById("results");
  container.innerHTML = "";

  if (items.length === 0) {
    container.innerHTML = `<p>No results found.</p>`;
    return;
  }

  items.forEach(item => {
    const card = document.createElement("div");
    card.className = "result-card";

    card.innerHTML = `
      <img src="${item.imageUrl}" alt="${item.name}">
      <h3>${item.name}</h3>
      <p>${item.description}</p>
    `;

    container.appendChild(card);
  });
}

function displayResults(data) {
  const container = document.getElementById("results");
  container.innerHTML = "";

  data.forEach(item => {
    const card = document.createElement("div");
    card.className = "result-card";

    card.innerHTML = `
    <img class="result-img" src="${item.imageUrl}" alt="${item.name}">
     <h3>${item.name}</h3>
    <p>${item.description}</p>
    `;

    container.appendChild(card);
  });
}

document.getElementById("myBtn").addEventListener("click", travelData);
