document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = '/api/index';

    async function fetchNewsData() {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            displayNewsData(data);
        } catch (error) {
            console.error('Error fetching news data:', error);
        }
    }

    function displayNewsData(newsArticles) {
        const newsCarouselContainer = document.querySelector('#most-recent-news .news-carousel');
        const newsListContainer = document.querySelector('#trending-news .news-list');
        const paginationInfo = document.getElementById('page-info');
        const prevPageButton = document.getElementById('prev-page');
        const nextPageButton = document.getElementById('next-page');

        // Clear existing content
        if (newsCarouselContainer) newsCarouselContainer.innerHTML = '';
        if (newsListContainer) newsListContainer.innerHTML = '';

        newsArticles.forEach(news => {
            // Create carousel items for most recent news
            const newsItem = document.createElement('div');
            newsItem.classList.add('news-item');
            newsItem.innerHTML = `
                <h3 class="news-title"><a href="news-detail.html?id=${news.id}">${news.title}</a></h3>
                <p class="news-summary">${news.content.substring(0, 100)}...</p>
                <p class="date">Posted on: ${new Date(news.published_date).toDateString()}</p>
                <a href="news-detail.html?id=${news.id}" class="read-more">Read More</a>
            `;
            if (newsCarouselContainer) newsCarouselContainer.appendChild(newsItem);

            // Create list items for trending news
            const trendingItem = document.createElement('div');
            trendingItem.classList.add('news-item');
            trendingItem.innerHTML = `
                <h4 class="news-title"><a href="news-detail.html?id=${news.id}">${news.title}</a></h4>
                <p class="news-summary">${news.content.substring(0, 100)}...</p>
                <a href="news-detail.html?id=${news.id}" class="read-more">Read More</a>
            `;
            if (newsListContainer) newsListContainer.appendChild(trendingItem);
        });

        paginationInfo.textContent = 'Page 1 of 5'; 
        prevPageButton.disabled = true;
    }

    fetchNewsData();
});
