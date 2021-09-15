//Modal Info
const modalInfo = new bootstrap.Modal(document.getElementById('modalInfo'));
const modalInfoLabel = document.querySelector('#modalInfoLabel');
const modalInfoBody = document.querySelector('#modalInfo .modal-body');
const btnInfoClose = document.querySelector('#btn-info-close');

//Modal New
const modalNew = new bootstrap.Modal(document.getElementById('modalNew'));
const modalNewLabel = document.querySelector('#modalNewLabel');
const modalNewBody = document.querySelector('#modalNew .modal-body .characterList');
const btn_start = document.querySelector('#btn-start');

//Modal Settings
const switchSound = document.querySelector('#switchSound');
const chkSound = document.querySelector('#chkSound');

//Navbar Menu Buttons
const btn_howto = document.querySelector('#btn-howto');
const btn_about = document.querySelector('#btn-about');
const btn_new = document.querySelector('#btn-new');
const btn_settings = document.querySelector('#btn-settings');

//field
const field = document.querySelector('#field');
const progress = document.querySelector('#progress');

let players = []; //will hold the current players in the field
let ranks = []; //will hold the ranking of the current play

//audio
let soundOn = false; //var to hold the sound if on or off
const bg_audio = new Audio("./assets/sfx/gta.mp3");
const play_audio = new Audio("./assets/sfx/bg.mp3");
const alright_audio = new Audio("./assets/sfx/alright.mp3");
const counterStrick_audio = new Audio("./assets/sfx/counterstrike.mp3");
const feelGood_audio = new Audio("./assets/sfx/feelgood.mp3");
const yeah_audio = new Audio("./assets/sfx/yaaa.mp3");
const hello_audio = new Audio("./assets/sfx/hello.mp3");
const congrats_audio = new Audio("./assets/sfx/congrats.mp3");
const congrats2_audio = new Audio("./assets/sfx/congrats2.mp3");

Audio.prototype.start = function() {
    this.pause();
    this.currentTime = 0;
    this.loop = true;
    this.play();
};

Audio.prototype.start_once = function() {
    this.pause();
    this.currentTime = 0;
    this.play();
};

Audio.prototype.stop = function() {
    this.pause();
    this.currentTime = 0;
};

switchSound.addEventListener('click', () => {
    if (chkSound.checked) {
        soundOn = true;
        bg_audio.start();
    } else {
        soundOn = false;
        bg_audio.stop();
    }
});

btn_howto.addEventListener('click', () => {
    modalInfoLabel.textContent = `How To Play`;
    modalInfoBody.innerHTML =
        `
        <ol>
            <li>Click "New Game"</li>
            <li>Set/Choose Players and Characters</li>           
            <li>Click "Start the Game"</li>
        </ol>
        <p>Whoever gets into the finish line first will be the winner!</p>
        `;
});

btn_about.addEventListener('click', () => {
    modalInfoLabel.textContent = `About the Game`;
    modalInfoBody.innerHTML =
        `
        <p>
            This is a simple Game created using Plain Javascript and Bootstrap 5.1.
        </p>
        <p>
            Every player will get a random number of steps to be performed in every iteration until they get into the finish line.
        </p>
        `;
});

function getCharacterList() {
    let cards = '';

    for (let i = 0; i < 4; i++) { //I have only 4 static player

        let characterNumber = i + 1;

        //generate card
        cards +=
            `
                <div class="col">
                    <div class="card h-100">
                        
                        <div class="card-body">
                            <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" id="switchOnPlayer${characterNumber}">
                                <label class="form-check-label" for="switchOnPlayer${characterNumber}">Use this Character</label>
                            </div>
                            <input type="text" id="txtPlayerName${characterNumber}" class="form-control mb-2" placeholder="Enter Name" value="Player ${characterNumber}" disabled />
                            
                            <h5 class="card-title mx-auto">Character ${characterNumber}</h5>                            
                            
                        </div>

                        <img id="imgNewImage${characterNumber}"  src="./assets/img/player${characterNumber}_stand.png" class="card-img-top mx-auto mb-2" alt="Player ${characterNumber}">

                        <div class="card-footer">
                            &nbsp;
                        </div>

                    </div>
                </div>
            `;
    }

    return cards;
}

btn_new.addEventListener('click', () => {
    //clear global player array
    players = [];
    ranks = [];

    modalNewLabel.textContent = `New Game`;
    modalNewBody.innerHTML = getCharacterList();
});

//add event listener to switch button
function setSwitchClickEvent(characterNumber) {
    document.addEventListener('click', e => {
        if (e.target.closest('#switchOnPlayer' + characterNumber)) {

            //const switchOnPlayer = document.querySelector('#switchOnPlayer' + characterNumber);
            const txtPlayerName = document.querySelector('#txtPlayerName' + characterNumber);
            const imgNewImage = document.querySelector('#imgNewImage' + characterNumber);

            if (txtPlayerName.disabled) { //if textbox is disabled meaning the switch is off
                txtPlayerName.disabled = false;
                imgNewImage.src = `./assets/img/player${characterNumber}.gif`; //animated image

                if (soundOn) { //if sound is ON, add sound effects when selecting a player
                    switch (characterNumber) {
                        case 1:
                            alright_audio.start_once();
                            break;
                        case 2:
                            hello_audio.start_once();
                            break;
                        case 3:
                            yeah_audio.start_once();
                            break;
                        default:
                            counterStrick_audio.start_once();
                    }
                }

            } else {
                txtPlayerName.disabled = true;
                imgNewImage.src = `./assets/img/player${characterNumber}_stand.png`; //static image
            }
        }
    });
}

setSwitchClickEvent(1);
setSwitchClickEvent(2);
setSwitchClickEvent(3);
setSwitchClickEvent(4);

//start button
document.addEventListener('click', e => {
    if (e.target.closest('#btn-start')) {

        players = []; //reset global players array
        let error = false;

        //loop through out the cards       
        let i = 1;
        while (i <= 4) { //4 since i have only 4 static characters/cards
            let player = [];

            let playerName = document.querySelector(`#txtPlayerName${i}`);
            if (!playerName.disabled) { //if textbox is NOT disabled then add to players array

                if (playerName.value) {
                    player.push(playerName.value, i, 0); //i - character number; 0 - is the current steps
                    players.push(player); //push to the global players array only if they enable the player name
                } else {
                    alert(`Error: Please Provide a Name for Player ${i}.`);
                    error = true;
                    players = []; //if found error reset or empty the global variable     
                    break; //stop the loop
                }
            }
            i++; //increment iterator
        }

        if (players.length > 1) { //check if it has at least 2 players

            if (!error) { //if no error then deploy
                deployPlayers(); //plot the players to the field
                modalNew.hide(); //hide the new modal window
                btn_new.disabled = true; //disable the new button
            }

        } else {
            if (!error) { //if there is no any preceeded error then display this error below
                alert(`Error: It must have atleast 2 players!`);
            }
        }
    }
});

function playersProgress() {
    let characters = ''; //variable to hold  the characters

    //copy players array into clonePlayers
    const clonePlayers = [...players];

    //sort multi dimension array
    clonePlayers.sort((a, b) => {
        return a[2] - b[2]
    });

    clonePlayers.reverse(); //reverse the sort

    //display the ranking
    ranks.forEach((rank, index) => {
        let rank_label = '';
        switch (index) {
            case 0:
                rank_label = 'First';
                break;
            case 1:
                rank_label = 'Second';
                break;
            case 2:
                rank_label = 'Third';
                break;
            default:
                rank_label = "Last";
        }

        characters +=
            `
                <div class="position-relative mx-3">
                    <img class="rounded-circle shadow border border-light" src="./assets/img/player${rank[0]}_avatar.png" />
                    <span class="position-absolute top-0 start-0 translate-middle badge border border-light rounded-pill bg-success">
                        ${rank_label}
                    </span>
                </div>
            `;
    });

    //display the progress
    clonePlayers.forEach(player => {

        if (parseFloat(player[2]) < 100) {
            characters +=
                `
               <div class="position-relative mx-3">
                    <img class="rounded-circle shadow border border-light" src="./assets/img/player${player[1]}_avatar.png" />
                    <span class="position-absolute top-0 start-0 translate-middle badge border border-light rounded-pill bg-success">
                        ${player[2]}m
                    </span>
                </div>
            `;
        }
    });

    progress.innerHTML = characters; //deploy to the field

    if (ranks.length == players.length) { //check if all players are done.
        btn_new.disabled = false; //enable the new button
        play_audio.stop(); //stop the play sound
        displayResult();
    }
}

function setPlayersProgress(meters, characterIndex) {
    players[characterIndex][2] = meters;
    playersProgress();
}

function deployPlayers() {
    let characters = ''; //variable to hold  the characters

    players.forEach((player, index) => {

        characters +=
            `
                <a class="road d-inline-block position-relative"
                data-player="${player[1]}"
                data-playername="${player[0]}"
                data-characterindex="${index}"
                data-characterposition="0">
                    <img id="img_character${player[1]}" src="./assets/img/player${player[1]}.gif" />
                    <span class="position-absolute top-100 start-50 translate-middle badge rounded-pill bg-success border border-light">
                        ${player[0].toUpperCase()}
                    </span>
                </a>
                <hr />
            `;
    });

    field.innerHTML = characters; //deploy to the field

    setTimeout(() => {

        if (soundOn) {
            bg_audio.stop();
            play_audio.start();
        }

        play();
    }, 100);

}

function play() {

    const movePlayers = document.querySelectorAll('#field .road');;

    movePlayers.forEach(player => {

        let currentStep = 0,
            maximumStep = 100;

        const iv = setInterval(function() { //run this code every 100 milliseconds

            currentStep = Math.floor(Math.random() * 2);

            let currentPlayer = player.dataset.player;
            let playerName = player.dataset.playername;
            let characterIndex = player.dataset.characterindex;
            let characterPosition = player.dataset.characterposition;
            let newPosition = parseFloat(characterPosition) + currentStep;
            player.dataset.characterposition = newPosition;

            player.style.left = newPosition + 'vw'; //move the player
            player.style.transition = 'all 1s'; //add transition effects

            currentStep = newPosition + 6;

            if (currentStep > maximumStep) {
                clearInterval(iv); //stop the loop

                let rankInfo = [currentPlayer, playerName];
                ranks.push(rankInfo); //once run is done add the player to ranks array

                //change the image once reach the destination
                imageCharacter = document.querySelector(`#img_character${currentPlayer}`);
                imageCharacter.src = `./assets/img/player${currentPlayer}_stand.png`;
            }

            setPlayersProgress(currentStep, characterIndex);

        }, 100);
    });
}

function displayResult() {
    let gameResult = '';

    ranks.forEach((rank, index) => {
        let rank_label = '';
        switch (index) {
            case 0:
                rank_label = `<b class='text-success'>Winner</b>`;
                break;
            case 1:
                rank_label = `Second`;
                break;
            case 2:
                rank_label = `Third`;
                break;
            default:
                rank_label = `Last`;
        }

        gameResult +=
            `
                <div class="row ">
                    <div class="col-sm-5 ps-2  my-auto">
                        ${rank_label}
                    </div>
                    <div class="col-sm-7  my-2">
                        <div class="position-relative mx-3">
                            <img class="rounded-circle shadow border border-light" src="./assets/img/player${rank[0]}_avatar.png" />
                            <span class="position-absolute top-100 start-50 translate-middle badge border border-light rounded-pill bg-success">
                                ${rank[1]}
                            </span>
                        </div>
                    </div>
                </div>               
            `;
    });

    modalInfoLabel.textContent = `Congratulations!!!`;
    modalInfoBody.innerHTML = gameResult;
    modalInfo.show();

    if (soundOn) { //check if sound is on
        play_audio.stop();
        congrats_audio.start_once();
        congrats2_audio.start();
    }
}

btnInfoClose.addEventListener('click', () => {
    if (soundOn) {
        congrats2_audio.stop();
        bg_audio.start();
    }

});

document.addEventListener('DOMContentLoaded', () => {
    btn_about.click();
});