document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector('tbody');
    const searchBar = document.getElementById('searchBar');
    const searchButton = document.getElementById('searchButton');
    const topButton = document.getElementById('topButton');
    const tableContainer = document.querySelector('.table-container');
    const csvFilePath = 'pokestats.csv';

    const centerDiv = () => {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        if (screenWidth > screenHeight) {
            tableContainer.style.width = '70%';
        } 
        else {
            tableContainer.style.width = '100%';
        }
    };

    window.addEventListener('resize', centerDiv);
    window.addEventListener('orientationchange', centerDiv);

    centerDiv();

    fetch(csvFilePath)
        .then(response => response.text())
        .then(data => {
            const rows = data.split('\n');
            if (rows.length > 0) {
                // Populate headers
                const headers = rows[0].split(',');
                const headerRow = document.createElement('tr');
                headers.forEach(header => {
                    const th = document.createElement('th');
                    th.textContent = header.trim();
                    headerRow.appendChild(th);
                });
                tableBody.parentElement.querySelector('thead').appendChild(headerRow);

                // Populate rows
                rows.slice(1).forEach(row => {
                    if (row.trim() !== '') {
                        const columns = row.split(',');
                        const tr = document.createElement('tr');
                        tr.setAttribute('data-name', columns[1]?.trim().toLowerCase());
                        columns.forEach(column => {
                            const td = document.createElement('td');
                            td.textContent = column.trim();
                            tr.appendChild(td);
                        });
                        tableBody.appendChild(tr);
                    }
                });
            }
        })
        .catch(error => console.error('Error loading CSV:', error));

    let highlightedRow = null;

    topButton.addEventListener('click', () => {
        if (highlightedRow) {
            highlightedRow.classList.remove('highlight');
            highlightedRow = null;
        }

        const firstRow = tableBody.querySelector('tr');
        if (firstRow) {
            firstRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });

    const performSearch = () => {
        const query = searchBar.value.trim().toLowerCase();
        const rows = document.querySelectorAll('tbody tr');
        let foundExact = false;
        let foundPrefix = false;
        let foundSubstring = false;

        if (highlightedRow) {
            highlightedRow.classList.remove('highlight');
        }

        rows.forEach(row => {
            const name = row.getAttribute('data-name');

            // Exact match
            if (name === query) {
                row.scrollIntoView({ behavior: 'smooth', block: 'center' });
                row.classList.add('highlight');
                highlightedRow = row;
                foundExact = true;
            }
        });

        if (!foundExact) {
            rows.forEach(row => {
                const name = row.getAttribute('data-name');

                // Prefix match
                if (!foundPrefix && name && name.startsWith(query)) {
                    row.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    row.classList.add('highlight');
                    highlightedRow = row;
                    foundPrefix = true;
                }
            });
        }

        if (!foundExact && !foundPrefix) {
            rows.forEach(row => {
                const name = row.getAttribute('data-name');

                // Substring match
                if (!foundSubstring && name && name.includes(query)) {
                    row.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    row.classList.add('highlight');
                    highlightedRow = row;
                    foundSubstring = true;
                }
            });
        }

        if (!foundExact && !foundPrefix && !foundSubstring) {
            alert('No Pokémon found with that name or substring.');
        }
    };

    searchButton.addEventListener('click', performSearch);

    searchBar.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            performSearch();
        }
    })
});