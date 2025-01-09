console.log("Wecome To Spotify Designed By Bhavya");

let songs = [
    {name: "ANTIDOTE", filePath: "songs/ANTIDOTE.mp3", coverPath: "cover/antidote.jpg"},
    {name: "Jo Tum Mere Ho", filePath: "songs/23.mp3", coverPath: "cover/jo tum mere ho.jpg"},
    {name: "TU HAI KAHAN", filePath: "songs/3.mp3", coverPath: "cover/tu hai kahan.jpg"},
    {name: "Hasti Rahe Tu", filePath: "songs/4.mp3", coverPath: "cover/hasti rhe tu.jpg"},
];

let songIndex = 0;
let audioElement = new Audio(songs[0].filePath);
let masterPlay = document.getElementById('masterPlay');
let myProgressBar = document.getElementById('myProgressBar');
let masterSongName = document.getElementById('masterSongName');
let gif = document.getElementById('gif');
let previous = document.getElementById('previous');
let next = document.getElementById('next');
let masterSongTime = document.getElementById('masterSongTime');
let songItems = document.getElementsByClassName('songItem');

// Add this after creating the audioElement
audioElement.onerror = function() {
    console.error('Error loading audio:', audioElement.error);
};

// Play/Pause button functionality
masterPlay.addEventListener('click', ()=>{
    if(audioElement.paused || audioElement.currentTime<=0){
        let playPromise = audioElement.play();
        if (playPromise !== undefined) {
            playPromise.then(_ => {
                console.log('Audio started playing');
                masterPlay.classList.remove('fa-circle-play');
                masterPlay.classList.add('fa-circle-pause');
                gif.style.opacity = 1;
            })
            .catch(error => {
                console.error('Error playing audio:', error);
            });
        }
    }
    else {
        audioElement.pause();
        masterPlay.classList.add('fa-circle-play');
        masterPlay.classList.remove('fa-circle-pause');
        gif.style.opacity = 0;
    }
});

// Update progress bar as song plays
audioElement.addEventListener('timeupdate', ()=>{
    // Update Progress Bar
    let progress = parseInt((audioElement.currentTime/audioElement.duration) * 100);
    myProgressBar.value = progress;
    
    // Update current song timestamp in the list
    let currentTimestamp = document.querySelector('.songItem:nth-child(' + (songIndex + 1) + ') .timestamp');
    if (currentTimestamp) {
        currentTimestamp.textContent = `${formatTime(audioElement.currentTime)} / ${formatTime(audioElement.duration)}`;
    }
    
    // Update bottom timestamp
    masterSongTime.textContent = `${formatTime(audioElement.currentTime)} / ${formatTime(audioElement.duration)}`;
});

// Allow user to change the song position
myProgressBar.addEventListener('input', ()=>{
    audioElement.currentTime = (myProgressBar.value * audioElement.duration)/100;
});

// Make sure the progress bar is properly initialized when a new song loads
audioElement.addEventListener('loadedmetadata', ()=>{
    myProgressBar.value = 0;
    myProgressBar.max = 100;
});

// Add this function to format time in MM:SS
function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

// Add this function to update all song timestamps
function updateTimestamps() {
    let timestamps = document.getElementsByClassName('timestamp');
    Array.from(timestamps).forEach((timestamp, index) => {
        // Create a temporary audio element to get duration
        let audio = new Audio(songs[index].filePath);
        audio.addEventListener('loadedmetadata', () => {
            timestamp.textContent = formatTime(audio.duration);
        });
        audio.addEventListener('error', () => {
            timestamp.textContent = '--:--';
        });
    });
}

// Function to play a new song
function playNewSong() {
    audioElement.src = songs[songIndex].filePath;
    masterSongName.innerText = songs[songIndex].name;
    audioElement.currentTime = 0;
    let playPromise = audioElement.play();
    if (playPromise !== undefined) {
        playPromise.then(_ => {
            console.log('Playing:', songs[songIndex].name);
            masterPlay.classList.remove('fa-circle-play');
            masterPlay.classList.add('fa-circle-pause');
            gif.style.opacity = 1;
        })
        .catch(error => {
            console.error('Error playing audio:', error);
        });
    }
    
    // Reset all timestamps to their original duration
    let timestamps = document.getElementsByClassName('timestamp');
    Array.from(timestamps).forEach((timestamp, index) => {
        if (index !== songIndex) {
            let audio = new Audio(songs[index].filePath);
            audio.addEventListener('loadedmetadata', () => {
                timestamp.textContent = formatTime(audio.duration);
            });
        }
    });
    
    // Reset bottom timestamp
    masterSongTime.textContent = '0:00 / 0:00';
}

// Modify previous button
previous.addEventListener('click', () => {
    if(songIndex <= 0){
        songIndex = songs.length - 1;
    }
    else{
        songIndex -= 1;
    }
    playNewSong();
});

// Modify next button
next.addEventListener('click', () => {
    if(songIndex >= songs.length - 1){
        songIndex = 0;
    }
    else{
        songIndex += 1;
    }
    playNewSong();
});

// Call updateTimestamps when the page loads
document.addEventListener('DOMContentLoaded', updateTimestamps);

function makeAllPlays() {
    Array.from(document.getElementsByClassName('songlistplay')).forEach((element) => {
        element.getElementsByTagName('i')[0].classList.remove('fa-circle-pause');
        element.getElementsByTagName('i')[0].classList.add('fa-circle-play');
    });
}

Array.from(songItems).forEach((element, i) => {
    element.addEventListener('click', (e) => {
        makeAllPlays();
        songIndex = i;
        e.currentTarget.getElementsByTagName('i')[0].classList.remove('fa-circle-play');
        e.currentTarget.getElementsByTagName('i')[0].classList.add('fa-circle-pause');
        playNewSong();
    });
});
