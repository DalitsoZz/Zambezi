document.addEventListener('DOMContentLoaded', async () => {
    // Function to fetch news articles from the backend API
    async function fetchNews() {
        try {
            const response = await fetch("http://localhost:3000/api/news");
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            displayNews(data);
        } catch (error) {
            console.error('Error fetching news:', error);
        }
    }

    // Function to display news articles in the HTML
    function displayNews(newsArticles) {
        const newsCarouselContainer = document.querySelector('#most-recent-news .news-carousel');

        if (newsCarouselContainer) {
            newsCarouselContainer.innerHTML = '';

            newsArticles.forEach(news => {
                const newsItem = document.createElement('div');
                newsItem.classList.add('carousel-item');
                newsItem.innerHTML = `
                    <h3><a href="news-detail.html?id=${news.id}">${news.title}</a></h3>
                    <p>${news.content.substring(0, 100)}...</p>
                    <p class="date">Posted on: ${new Date(news.published_date).toDateString()}</p>
                    <a href="news-detail.html?id=${news.id}" class="read-more">Read More</a>
                `;
                newsCarouselContainer.appendChild(newsItem);
            });
        } else {
            console.error('News carousel container not found');
        }
    }

    // Fetch news articles when the DOM is fully loaded
    await fetchNews();
});
