document.getElementById('searchForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const query = document.querySelector('input[name="query"]').value;
    const response = await fetch('/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ 'query': query })
    });
    const results = await response.json();
    displayResults(results);
});

function displayResults(results) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
    const docTitles = [];
    const scores = [];

    results.forEach((result, i) => {
        const div = document.createElement('div');
        const doc = document.createElement('p');
        doc.textContent = `Document ${i + 1}: ${result[0]} - Cosine Similarity: ${result[1].toFixed(4)}`;
        div.appendChild(doc);
        resultsDiv.appendChild(div);
        docTitles.push(`Doc ${i + 1}`);
        scores.push(result[1]);
    });

    const ctx = document.getElementById('chart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: docTitles,
            datasets: [{
                label: 'Cosine Similarity',
                data: scores,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

