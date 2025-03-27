// Ensure the script runs only after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Function to get the news ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const newsId = urlParams.get('id');

    // Fetch the news article based on the ID
    if (newsId) {
        fetchNewsDetail(newsId);
    } else {
        document.querySelector('#news-content').innerHTML = '<p>Error: No news ID provided.</p>';
    }
});

// Function to fetch and display the news article
function fetchNewsDetail(id) {
    // Fetch request to the API endpoint with the news ID
    fetch(`/api/index/${id}`)
        .then(response => {
            // Check if the response is okay (status 200)
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // Parse the JSON response
            return response.json();
        })
        .then(data => {
            // Call function to display the fetched news article
            displayNewsDetail(data);
        })
        .catch(error => {
            // Log errors to the console
            console.error('Error fetching news detail:', error);
            document.querySelector('#news-content').innerHTML = '<p>Error loading news details.</p>';
        });
}

// Function to display the news article in the HTML
function displayNewsDetail(news) {
    // Select the container where the news article will be displayed
    const newsContentContainer = document.querySelector('#news-content');

    // Check if the container exists
    if (newsContentContainer) {
        // Populate the inner HTML of the container with news article details
        newsContentContainer.innerHTML = `
            <h1>${news.title}</h1>
            <p>${news.content}</p>
            <p class="date">Posted on: ${new Date(news.published_date).toDateString()}</p>
        `;
    } else {
        // Log an error if the news content container is not found
        console.error('News content container not found');
    }
}
