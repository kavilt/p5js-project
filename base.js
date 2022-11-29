
// Declare Variables
let page = 5.2; // 0 = menu, 1 = game select, 2 = view scores, >2 = games
let keys = [];
let typeTap = [];
let typed = [];
let clicked = false;
let scrolled = 0;
let scalarW = (w / 1280);
let scalarH = (h / 720);
let canvas2;
let myScrollList;
let musicVolume = 0.1;

// beat timing management
let timeSinceNewSong = 0;
let msPerBeat = 0;
let timeOfNextBeat = 0;

// Declare sound variables
let buttonClickSound;
let buttonHoverSound;
let missSound;
let loseSound;
let shootSound;
let songs = [];

// Declare image files
let title;
let heart;
let playButton;
let thumbnails = []; // game3 song covers
let previews = [];

// declare text files
let songFiles = [];

// Preload sound and image files

function preload() {
    buttonClickSound = new Howl({ src: "assets/menuclick.ogg" });
    buttonHoverSound = new Howl({ src: "assets/button hover.ogg" });
    missSound = new Howl({ src: "assets/miss.wav" });
    loseSound = new Howl({ src: "assets/lose.mp3" });
    shootSound = new Howl({ src: "assets/shotgun.wav"});

    songs[0] = new Howl({ src: "assets/songs/brain power.mp3", html5: true, volume: 0.1 });
    songs[1] = new Howl({ src: "assets/songs/meAndU.mp3", html5: true, volume: 0.1 });
    songFiles[0] = loadStrings('assets/songs/brain power.txt');
    songFiles[1] = loadStrings('assets/songs/meAndU.txt');

    title = loadImage('assets/placeholder.png');
    heart = loadImage('assets/heart.png');
    playButton = loadImage('assets/playbutton.png');

}

function setup() {
    createCanvas(constrain(w, 0, 1920), constrain(h, 0, 1080));
    colorMode(HSB, 360, 100, 100, 100);
    textAlign(CENTER, CENTER);
    angleMode(DEGREES);
    canvas2 = createGraphics(400, 400);
    myScrollList = new scrollList(175 * scalarW, 90 * scalarH, 600 * scalarW, 575 * scalarH, 130);
    canvas2.textAlign(CENTER, CENTER);
    addSongs();
    playButton.resize(45 * scalarW, 0);


}

function addSongs() {
    thumbnails[0] = loadImage('assets/thumbnails/BRAIN POWER.png', resizeThumbnails);
    thumbnails[1] = loadImage('assets/thumbnails/succducc.jpg', resizeThumbnails)
    previews[0] = loadImage('assets/thumbnails/BRAIN POWER.png', resizePreviews);
    previews[1] = loadImage('assets/thumbnails/succducc.jpg', resizePreviews)
    for (let i = 0; i < 100; i++) {
        if (3 < i < 4) {
            myScrollList.addItem("me & u", "succducc", 160, 192, songs[1], 94, thumbnails[1], previews[1], 1); // BRAIN  POWERRRRR
        }
        myScrollList.addItem("Brain Power", "NOMA", 173, 110, songs[0], 70, thumbnails[0], previews[0], 0); // BRAIN  POWERRRRR
    }



}

function resizeThumbnails() {
    for (let i = 0; i < thumbnails.length; i++) {
        thumbnails[i].resize(80 * scalarW, 0);
    }
}

function resizePreviews() {
    for (let i = 0; i < previews.length; i++) {
        previews[i].resize(505 * scalarW, 0); // fill the remaining space on the right side of screen
    }
}

function mouseClicked() {
    clicked = true; // true only for one frame when the user releases the mouse
}

function mouseWheel(event) {
    scrolled = event.delta;
}

function touchEnded() { // for mobile
    clicked = true;
}

function keyPressed() {
    keys[keyCode] = true;
    typeTap[keyCode] = true;
}

function keyReleased() {
    keys[keyCode] = false;
}