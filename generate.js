document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("quiz-form").addEventListener("submit", function (event) {
        event.preventDefault();
        calculateScore();
    });
});

function calculateScore() {
    const moodCategories = {
        happy: 0,
        stressed: 0,
        anxious: 0,
        tired: 0
    };

    // Get all selected answers
    const answers = document.querySelectorAll("input[type='radio']:checked");

    if (answers.length < 10) {
        alert("Please answer all questions before submitting!");
        return;
    }

    answers.forEach((answer) => {
        const value = answer.value;

        // Categorizing answers into different moods
        if (["A"].includes(value)) moodCategories.happy++;
        if (["B"].includes(value)) moodCategories.stressed++;
        if (["C"].includes(value)) moodCategories.anxious++;
        if (["D"].includes(value)) moodCategories.tired++;
    });

    // Determine dominant mood
    let dominantMood = "happy"; 
    let maxScore = 0;
    for (let mood in moodCategories) {
        if (moodCategories[mood] > maxScore) {
            maxScore = moodCategories[mood];
            dominantMood = mood;
        }
    }

    fetchMovies(dominantMood);
}

// Fetch movies from TMDb API based on the user's mood
function fetchMovies(mood) {
    // The TMDB key is read from config.js (kept on your computer, not uploaded to GitHub).
    const apiKey = (window.MINDSTREAM_CONFIG || {}).TMDB_API_KEY;
    const resultsDiv = document.getElementById("quiz-results");
    if (!apiKey) {
        resultsDiv.innerHTML = `<h3>Your Mood: ${mood.toUpperCase()}</h3><p>Add your TMDB API key to config.js to see movie recommendations (see README).</p>`;
        return;
    }
    let genreId;

    switch (mood) {
        case "happy":
            genreId = 35; // Comedy
            break;
        case "stressed":
            genreId = 12; // Adventure
            break;
        case "anxious":
            genreId = 10749; // Romance
            break;
        case "tired":
            genreId = 16; // Animation
            break;
        default:
            genreId = 18; // Drama
    }

    // exclude horror (27) and thriller (53): this is a wellness app
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}&without_genres=27,53&include_adult=false&sort_by=popularity.desc`;

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error(`TMDB returned HTTP ${response.status}`);
            return response.json();
        })
        .then(data => displayMovies(data.results || [], mood))
        .catch(error => {
            console.error("Error fetching movies:", error);
            resultsDiv.innerHTML = `<h3>Your Mood: ${mood.toUpperCase()}</h3><p>Could not load movie recommendations right now.</p>`;
        });
}

// Display movie recommendations with thumbnails
function displayMovies(movies, mood) {
    const resultsDiv = document.getElementById("quiz-results");
    resultsDiv.innerHTML = `<h3>Your Mood: ${mood.toUpperCase()}</h3><p>Here are some movie recommendations for you:</p>`;

    const movieContainer = document.createElement("div");
    movieContainer.classList.add("movie-container");

    movies.slice(0, 5).forEach(movie => {
        const movieCard = document.createElement("div");
        movieCard.classList.add("movie-card");

        if (movie.poster_path) {
            const moviePoster = document.createElement("img");
            moviePoster.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
            moviePoster.alt = movie.title;
            movieCard.appendChild(moviePoster);
        }

        const movieTitle = document.createElement("p");
        movieTitle.innerHTML = `<strong>${movie.title}</strong> (${movie.release_date ? movie.release_date.split("-")[0] : "N/A"})`;

        movieCard.appendChild(movieTitle);
        movieContainer.appendChild(movieCard);
    });

    resultsDiv.appendChild(movieContainer);
}
