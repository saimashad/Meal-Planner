const SPOONACULAR_API_KEY = "8f32666a8d914df498c0e4af445532b1"; // Replace with a valid API key

document.getElementById("mealForm").addEventListener("submit", function (event) {
    event.preventDefault();
    generateMealPlan();
});

function generateMealPlan() {
    const numMeals = document.getElementById("numMeals").value;
    const dietPreference = document.getElementById("dietPreference").value;
    const healthSpec = document.getElementById("healthSpec").value;
    const calories = document.getElementById("calories").value;

    if (!calories || calories <= 0) {
        alert("Please enter a valid daily calorie intake.");
        return;
    }

    const apiUrl = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${SPOONACULAR_API_KEY}&diet=${dietPreference}&intolerances=${healthSpec}&maxCalories=${calories}&number=${numMeals * 7}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`API Error: ${response.status} - ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            if (!data || !data.results || data.results.length === 0) {
                alert("No meals found. Please adjust your preferences.");
                return;
            }
            displayMealPlan(data.results, numMeals);
        })
        .catch(error => console.error('API Fetch Error:', error));
}

function displayMealPlan(meals, numMeals) {
    const mealPlanDisplay = document.getElementById('mealPlanDisplay');
    mealPlanDisplay.innerHTML = '';  

    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const headerRow = document.createElement('tr');
    days.forEach(day => {
        const th = document.createElement('th');
        th.textContent = day;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    for (let i = 0; i < numMeals; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < 7; j++) {
            const mealIndex = i * 7 + j;
            const meal = meals[mealIndex];
            const cell = document.createElement('td');

            if (meal) {
                cell.innerHTML = `
                    <h3>${meal.title}</h3>
                    <img src="${meal.image}" alt="${meal.title}">
                    <a href="https://spoonacular.com/recipes/${meal.title.replace(/ /g, "-")}-${meal.id}" target="_blank">View Recipe</a>
                `;
            } else {
                cell.textContent = "No Meal";
            }

            row.appendChild(cell);
        }
        tbody.appendChild(row);
    }
    table.appendChild(tbody);
    mealPlanDisplay.appendChild(table);
}
