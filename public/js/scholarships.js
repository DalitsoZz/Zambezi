document.addEventListener('DOMContentLoaded', function() {
    // URL for the API endpoint to fetch scholarship data
    const apiUrl = '/api/scholarships';

    // Function to fetch scholarship data from the API
    async function fetchScholarshipData() {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            displayScholarshipData(data);
        } catch (error) {
            console.error('Error fetching scholarship data:', error);
        }
    }

    // Function to display scholarship data on the page
    function displayScholarshipData(data) {
        const recentScholarshipsContainer = document.getElementById('recent-scholarships-carousel').querySelector('.carousel-inner');
        const trendingScholarshipsContainer = document.getElementById('trending-scholarships');

        // Clear existing content
        recentScholarshipsContainer.innerHTML = '';
        trendingScholarshipsContainer.innerHTML = '';

        data.forEach(item => {
            // Create carousel items for recent scholarships
            const carouselItem = document.createElement('div');
            carouselItem.className = 'carousel-item';
            carouselItem.innerHTML = `
                <img src="scholarship-image${item.id}.jpg" alt="${item.scholarship_name}">
                <h3><a href="scholarship-detail.html?id=${item.id}">${item.scholarship_name}</a></h3>
                <p>${item.details.substring(0, 100)}... <a href="scholarship-detail.html?id=${item.id}" class="read-more">Read more</a></p>
            `;
            recentScholarshipsContainer.appendChild(carouselItem);

            // Create trending scholarship items
            const trendingItem = document.createElement('div');
            trendingItem.className = 'trending-scholarship-item';
            trendingItem.innerHTML = `
                <img src="scholarship-thumb${item.id}.jpg" alt="Scholarship Thumbnail ${item.id}">
                <div>
                    <h4><a href="scholarship-detail.html?id=${item.id}">${item.scholarship_name}</a></h4>
                    <p>${item.details.substring(0, 50)}...</p>
                    <a href="scholarship-detail.html?id=${item.id}" class="read-more">Read more</a>
                </div>
            `;
            trendingScholarshipsContainer.appendChild(trendingItem);
        });
    }

    // Fetch scholarship data when the page is loaded
    fetchScholarshipData();
});
