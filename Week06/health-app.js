const apiUrl = 'https://disease.sh/v3/covid-19/countries';

async function fetchData() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        populateDropdown(data);
        const defaultCountry = 'UK';
        document.getElementById('countrySelect').value = defaultCountry;
        updateChart(data, defaultCountry);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function populateDropdown(data) {
    const dropdown = document.getElementById('countrySelect');
    data.forEach(country => {
        const option = document.createElement('option');
        option.value = country.country;
        option.textContent = country.country;
        dropdown.appendChild(option);
    });

    dropdown.addEventListener('change', () => {
        updateChart(data, dropdown.value);
    });
}

function updateChart(data, selectedCountry) {
    const countryData = data.find(country => country.country === selectedCountry);
    if (!countryData) return;
    
    const chartData = {
        labels: ['Cases', 'Deaths', 'Recovered'],
        datasets: [{
            label: `COVID-19 Stats for ${selectedCountry}`,
            data: [countryData.cases, countryData.deaths, countryData.recovered],
            backgroundColor: ['blue', 'red', 'green']
        }]
    };

    if (window.myChart) {
        window.myChart.destroy();
    }

    const ctx = document.getElementById('covidChart').getContext('2d');
    window.myChart = new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: {
            responsive: false,
            maintainAspectRatio: true,
            width: 800,
            height: 400,
            scales: {
                y: {
                    beginAtZero: true,
                    suggestedMax: 100000000,
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString();
                        }
                    }
                }
            },
            plugins: {
                datalabels: {
                    anchor: 'end',
                    align: 'top',
                    formatter: (value) => value.toLocaleString(),
                    font: {
                        weight: 'bold'
                    }
                }
            }
        },
        plugins: [ChartDataLabels]
    });
}

document.addEventListener('DOMContentLoaded', fetchData);
