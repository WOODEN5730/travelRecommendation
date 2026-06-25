async function travelData() {
  const url = "travel_recommendation_api.json";

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();

    // Flatten cities
    const cities = data.countries.flatMap(country =>
      country.cities.map((city, index) => ({
        id: index + 1,
        type: "city",
        country: country.name,
        name: city.name.trim(),
        imageUrl: city.imageUrl,
        description: city.description.trim()
      }))
    );

    // Flatten temples
    const temples = data.temples.map(t => ({
      id: t.id,
      type: "temples",
      name: t.name.trim(),
      imageUrl: t.imageUrl,
      description: t.description.trim()
    }));

    // Flatten beaches
    const beaches = data.beaches.map(b => ({
      id: b.id,
      type: "beaches",
      name: b.name.trim(),
      imageUrl: b.imageUrl,
      description: b.description.trim()
    }));

    // Combine all
    const allItems = [...cities, ...temples, ...beaches];

    // Get search text
    const query = document.querySelector("input[name='search']").value.trim().toLowerCase();

    if (!query) {
      console.log("Search is empty");
      return;
    }

    // Safe filter (never crashes)
    const filtered = allItems.filter(item =>
      (item.name?.toLowerCase() || "").includes(query) ||
      (item.type?.toLowerCase() || "").includes(query) ||
      (item.description?.toLowerCase() || "").includes(query)
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
      <img class="result-img" src="${item.imageUrl}" alt="${item.name}">
      <h3>${item.name}</h3>
      <p>${item.description}</p>
    `;

    container.appendChild(card);
  });
}

document.getElementById("myBtn").addEventListener("click", travelData);
