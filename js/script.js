// select all required tags or elements

const wrapper = document.querySelector(".wrapper"),
musicImg = wrapper.querySelector(".img-area img"),
musicName = wrapper.querySelector(".song-details .name"),
musicArtist = wrapper.querySelector(".song-details .artist"),
mainAudio = wrapper.querySelector("#main-audio"),
PlayPauseBtn = wrapper.querySelector(".play-pause"),
prevBtn = wrapper.querySelector("#prev"),
nextBtn = wrapper.querySelector("#next"),
progressBar = wrapper.querySelector(".progress-bar"),
progressArea = wrapper.querySelector(".progress-area"),
musicList = wrapper.querySelector(".music-list"),
showMoreBtn = wrapper.querySelector("#more-music"),
hideMusicBtn = musicList.querySelector("#close");


// let musicIndex = 1;
let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);
window.addEventListener("load", ()=>{
    loadMusic(musicIndex); //calling load music function once window is loaded
    PlayingNow();
})

//load music function
function loadMusic(indexNumb) {
    musicName.innerText = allMusic[indexNumb - 1].name;
    musicArtist.innerText = allMusic[indexNumb - 1].artist;
    musicImg.src = `images/${allMusic[indexNumb - 1].img}.jpg`
    mainAudio.src = `songs/${allMusic[indexNumb - 1].src}.mp3`
}

//play music function
function playMusic() {
    wrapper.classList.add("paused");
    PlayPauseBtn.querySelector("i").className = "fa-solid fa-pause";
    mainAudio.play();
}

//pause music function
function pauseMusic() {
    wrapper.classList.remove("paused");
    PlayPauseBtn.querySelector("i").className = "fa-solid fa-play";
    mainAudio.pause();
}

//next music function
function nextMusic() {
    //we'll just increment of index by 1
    musicIndex++;
    /* if musicIndex is greater than array length then musicIndex will be 1
        so the first song will play
    */
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    PlayingNow();
}

//prev music function
function prevMusic() {
    //we'll just decrement of index by 1
    musicIndex--;
    /* if musicIndex is less than 1 then musicIndex will be array length 
        so the last song will play
    */
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    PlayingNow();
}

//play or pause music button event
PlayPauseBtn.addEventListener('click', ()=>{
    const isMusicPause = wrapper.classList.contains("paused");
    isMusicPause ? pauseMusic() : playMusic();
});

//next music button event
nextBtn.addEventListener('click', ()=>{
    nextMusic();//calling nextMusic function
});

//prev music button event
prevBtn.addEventListener('click', ()=>{
    prevMusic();//calling nextMusic function
});

//update progress bar width according to music current time
mainAudio.addEventListener('timeupdate', (e)=>{
    const currentTime = e.target.currentTime; //getting current time of song
    const duration = e.target.duration; //getting total duration of song
    let progressBarWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressBarWidth}%`;

    let musicCurrentTime = wrapper.querySelector(".current"),
    musicDuration = wrapper.querySelector(".duration");

    mainAudio.addEventListener("loadeddata", ()=>{

        //update song total duration
        let audioDuration = mainAudio.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if(totalSec < 10) {
            totalSec = `0${totalSec}`;
        }
        musicDuration.innerText = `${totalMin}:${totalSec}`;
    });

    //update playing song current time
    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if(currentSec < 10) {
        currentSec = `0${currentSec}`;
    }
    musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

//update playing song current time according to the progress bar width
progressArea.addEventListener('click', (e) =>{
    let progressWidthVal = progressArea.clientWidth; //getting width of progress bar
    let clickedOffSetX = e.offsetX; //getting offset x value
    let songDuration = mainAudio.duration; //getting song total duration

    mainAudio.currentTime = (clickedOffSetX / progressWidthVal) * songDuration;
    playMusic();
    PlayingNow();
});


//working on repeat, shuffle song according to the icon
const repeatBtn = wrapper.querySelector("#repeat-list");
repeatBtn.addEventListener('click', () =>{
    //first we get the innerText of icon the we'll change according
    let getText = repeatBtn.innerText;// getting innerText of icon
    //let's do different changes on different icon click using switch
    switch(getText){
        case 'repeat'://if this icon is repeat then change the icon to repeat_one
            repeatBtn.innerText = "repeat_one";
            repeatBtn.setAttribute("title", "Song looped");
            break;
        case 'repeat_one': //if this icon is repeat_one then change the icon to shuffle
            repeatBtn.innerText = "shuffle";
            repeatBtn.setAttribute("title", "Playback shuffle")
            break;
        case 'shuffle': //if this icon is shuffle then change the icon to repeat
            repeatBtn.innerText = "repeat";
            repeatBtn.setAttribute("title", "Playlist looped")
            break;
    }
})


//above we just changed the icon, now let's work on what to do after the song ended
mainAudio.addEventListener('ended', ()=>{
    //we'll do according to the icon means if user has set icon to loop song then we'll repeat
    //the current song and will do further accordingly
    let getText = repeatBtn.innerText;//getting innerText of icon
    //let's do different changes on different icon click using switch
    switch(getText){
        case 'repeat'://if this icon is repeat then simply we call the nextMusic function so the next song will play
            nextMusic();
            break;
        case 'repeat_one': //if this icon is repeat_one then we'll change the current playing song current time to 0 so song will play from begining
            mainAudio.currentTime = 0;
            loadMusic(musicIndex);
            playMusic();// calling playMusic function
            PlayingNow();
            break;
        case 'shuffle': //if this icon is shuffle then change the icon to repeat
            //generating random index between the max range of array length
            let randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            do {
                randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            }while(musicIndex == randIndex);// this loop run until the next random number won't be the same of current music index
            musicIndex = randIndex;//passing randomIndex to musicIndex so random song will play
            loadMusic(musicIndex); //calling loadMusic function
            playMusic();// calling playMusic function
            PlayingNow();
            break;
    }
});

//show and close the button Playlist
showMoreBtn.addEventListener("click", ()=>{
    musicList.classList.toggle("show");
});

hideMusicBtn.addEventListener("click", ()=>{
    showMoreBtn.click();
});

const ulTag = wrapper.querySelector("ul");

//Create li according to the array length
for(let i = 0; i < allMusic.length; i++) {
    //pass the song name, artist from the array to li
    let liTag = `<li li-index="${i + 1}">
                    <div class="row">
                        <span>${allMusic[i].name}</span>
                        <p>${allMusic[i].artist}</p>
                    </div>
                    <audio class="${allMusic[i].src}" src="songs/${allMusic[i].src}.mp3"></audio>
                    <span id="${allMusic[i].src}" class="audio-duration">3:40</span>
                </li>`;
    ulTag.insertAdjacentHTML("beforeend", liTag);

    let liAudioDuration = ulTag.querySelector(`#${allMusic[i].src}`);
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

    liAudioTag.addEventListener("loadeddata",()=>{
        let audioDuration = liAudioTag.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if(totalSec < 10) {
            totalSec = `0${totalSec}`;
        }
        liAudioDuration.innerText = `${totalMin}:${totalSec}`;
        //add t-duration attribute
        liAudioDuration.setAttribute("t-duration", `${totalMin}:${totalSec}`);
    });
}

//work's on play particular song on click
const allLiTag = ulTag.querySelectorAll('li');

function PlayingNow() {
    for(let j = 0; j < allLiTag.length; j++) {
        let audioTag = allLiTag[j].querySelector(".audio-duration");
        //remove playing class from all other li expect the last one which is clicked
        if(allLiTag[j].classList.contains("playing")){
            allLiTag[j].classList.remove("playing");
            //Get that audio duration value and pass to .audio-duration innerText
            let adDuration = audioTag.getAttribute("t-duration");
            audioTag.innerText = adDuration; //passing t-duration value to audio duration innerText
        }
        //if there is an li tag which li-index is equal to musicIndex
        //then this music is playing now and we'll style it
        if(allLiTag[j].getAttribute("li-index")== musicIndex) {
            allLiTag[j].classList.add("playing");
            audioTag.innerText = "Playing...";
        }
        //adding onclick attribute in all li tags
        allLiTag[j].setAttribute('onclick', 'clicked(this)');
    }
}

//Play songs on li click
function clicked(element) {
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex;//passing liindex to musicindex
    loadMusic(musicIndex);
    playMusic();
    PlayingNow();
}