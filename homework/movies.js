// First, sign up for an account at https://themoviedb.org
// Once verified and signed-in, go to Settings and create a new
// API key; in the form, indicate that you'll be using this API
// key for educational or personal use, and you should receive
// your new key right away.

// For this exercise, we'll be using the "now playing" API endpoint
// https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US

// Note: image data returned by the API will only give you the filename;
// prepend with `https://image.tmdb.org/t/p/w500/` to get the 
// complete image URL
let db = firebase.firestore()

window.addEventListener('DOMContentLoaded', async function(event) {
  // Step 1: Construct a URL to get movies playing now from TMDB, fetch
  // data and put the Array of movie Objects in a variable called
  // movies. Write the contents of this array to the JavaScript
  // console to ensure you've got good data
  // ⬇️ ⬇️ ⬇️
  
  let response = await fetch('https://api.themoviedb.org/3/movie/now_playing?api_key=c70da2c8d7f253603a80b816bea81ac7&language=en-US')
  let json = await response.json()
  let movies = json.results
  console.log(movies)
  
  for (let i = 0; i < movies.length; i++) {
    let movieId = movies[i].id  
    let pictures = movies[i].poster_path
    let movieWatchedData = await db.collection('watched').doc(`${movieId}`).get()
    let watchedMovies = movieWatchedData.data()
    console.log(watchedMovies)

    if (watchedMovies) {
      document.querySelector(`.movies`).insertAdjacentHTML("beforeend", `
      <div class="w-1/5 p-4 movie-${movieId} opacity-20"> 
        <img src="https://image.tmdb.org/t/p/w500/${pictures}" class="w-full">
        <a href="#" class="watched-button block text-center text-white bg-green-500 mt-4 px-4 py-2 rounded">I've watched this!</a>
        </div>
      `)
    } else {document.querySelector(`.movies`).insertAdjacentHTML(`beforeend`, `
      <div class="w-1/5 p-4 movie-${movieId}">
      <img src="https://image.tmdb.org/t/p/w500/${pictures}" class="w-full">
      <a href="#" class="watched-button block text-center text-white bg-green-500 mt-4 px-4 py-2 rounded">I've watched this!</a>
      </div>
    `)}

    document.querySelector(`.movie-${movieId} .watched-button`).addEventListener('click', async function(event) {
      event.preventDefault()
      document.querySelector(`.movie-${movieId}`).classList.add('opacity-20')
      await db.collection('watched').doc(`${movieId}`).set({})
  })
}
  
})