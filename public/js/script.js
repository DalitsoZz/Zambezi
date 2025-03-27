// script.js

$(document).ready(function() {
    // Set up the paths and number of images
    const imageFolder = 'img/slides/';
    const totalImages = 3;
    const imagePaths = [];

    // Preload image paths dynamically
    for (let i = 1; i <= totalImages; i++) {
        imagePaths.push(`${imageFolder}${i}.jpg`);
    }

    // Initialize variables
    let currentIndex = 0;
    const transitionSpeed = 1000; // Transition speed in milliseconds
    const displayTime = 3000; // Time to display each image in milliseconds

    function showSlide(index) {
        const $slides = $('#custom-carousel .carousel-slides');
        $slides.fadeOut(transitionSpeed, function() {
            $slides.html(`<img src="${imagePaths[index]}" alt="Slide ${index + 1}" />`);
            $slides.fadeIn(transitionSpeed);
        });
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalImages;
        showSlide(currentIndex);
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalImages) % totalImages;
        showSlide(currentIndex);
    }

    // Initial slide display
    showSlide(currentIndex);

    // Set up automatic slide transition
    setInterval(nextSlide, displayTime);

    // Bind next and previous buttons
    window.nextSlide = nextSlide;
    window.prevSlide = prevSlide;

    // Light/Dark Mode Toggle
    const toggleSwitch = document.getElementById('theme-toggle');

    function switchTheme() {
        if (document.body.classList.contains('dark-mode')) {
            document.body.classList.remove('dark-mode');
            document.body.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
        } else {
            document.body.classList.remove('light-mode');
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        }
    }

    // Load the theme from local storage
    function loadTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.body.classList.add(savedTheme);
            if (savedTheme === 'light') {
                toggleSwitch.checked = true;
            }
        } else {
            document.body.classList.add('dark-mode');
        }
    }

    // Event listener for the theme switch
    toggleSwitch.addEventListener('change', switchTheme);

    // Apply the theme to all pages
    loadTheme(); // Ensure the theme is applied on page load
});
