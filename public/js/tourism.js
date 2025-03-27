document.addEventListener('DOMContentLoaded', function() {
    // URL for the API endpoint to fetch tourism data
    const apiUrl = '/api/tourism';

    // Function to fetch tourism data from the API
    async function fetchTourismData() {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            displayTourismData(data);
        } catch (error) {
            console.error('Error fetching tourism data:', error);
        }
    }

    // Function to display tourism data on the page
    function displayTourismData(data) {
        const featuredDestinationsContainer = document.getElementById('featured-destinations-carousel');
        const trendingTravelGuidesContainer = document.getElementById('trending-travel-guides');

        // Clear existing content
        featuredDestinationsContainer.innerHTML = '';
        trendingTravelGuidesContainer.innerHTML = '';

        data.forEach(item => {
            // Create carousel items for featured destinations
            const carouselItem = document.createElement('div');
            carouselItem.className = 'carousel-item';
            carouselItem.innerHTML = `
                <img src="destination-image${item.id}.jpg" alt="${item.location_name}">
                <h3>${item.location_name}</h3>
                <p>${item.description} <a href="#" class="read-more">Read more</a></p>
            `;
            featuredDestinationsContainer.appendChild(carouselItem);

            // Create travel guide items for popular travel guides
            const guideItem = document.createElement('div');
            guideItem.className = 'travel-guide-item';
            guideItem.innerHTML = `
                <img src="guide-thumb${item.id}.jpg" alt="Travel Guide Thumbnail ${item.id}">
                <div>
                    <h4>${item.location_name}</h4>
                    <p>${item.description}</p>
                    <a href="#" class="read-more">Read more</a>
                </div>
            `;
            trendingTravelGuidesContainer.appendChild(guideItem);
        });
    }

    // Fetch tourism data when the page is loaded
    fetchTourismData();
});
