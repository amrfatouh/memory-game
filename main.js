//defining main variables
let cardContainer = document.querySelector('.card-container');
let cards = document.querySelectorAll('.card.playable');
let imageIdArr = makeImageIdArr();
let radios = document.querySelectorAll('.options input');
let rangeInputs = document.querySelectorAll('.level-editor input');

let TRANSITION_DURATION = 500
let TIMEOUT_DURATION = TRANSITION_DURATION * 2;
let GAME_DIFFICULTY;

let Game = {
    difficulty: {
        easy: {
            width: 235,
            height: 104,
            margin: 10,
            cardsCount: 20
        },
        intermediate: {
            width: 196,
            height: 84,
            margin: 8,
            cardsCount: 30
        },
        hard: {
            width: 149,
            height: 73,
            margin: 5,
            cardsCount: 48
        }

    }
};

// starting the game flow
addEventListenerToOverlayButton();
//once overlay is gone, navigation in game is done using radio buttons
addListenersToRadios();
addEventListenersToLevelEditorItems();

function addEventListenerToOverlayButton() {
    document.querySelector('.overlay button').onclick = () => {
        document.querySelector('.info .name span').textContent = prompt('Enter your name: ') || 'unnamed';
        removeOverlay();
    }
}
function removeOverlay() {
    setUpGame(document.querySelector('.overlay select').value);
    document.querySelector('.overlay').remove();
}

// removeOverlay();

//choosing difficulty
function addListenersToRadios() {
    radios.forEach(radio => {
        radio.onclick = function () {
            document.querySelector('.level-editor').style.display = 'none';
            if (confirm('Your progress will be erased. Are you sure?')) {
                if (radio.dataset.difficulty !== 'custom') {
                    setUpGame(radio.dataset.difficulty);
                } else {
                    document.querySelector('.level-editor').style.display = 'block';
                    updateRangeInputsFromCards();
                    createCards(10, true);
                }
            } else {
                //returning the checking to the radio button representing current level
                document.querySelector(`.options input[data-difficulty=${GAME_DIFFICULTY}]`).checked = true;
            }
        }
    })
}
function updateRangeInputsFromCards() {
    Array.from(rangeInputs).filter(i => i.dataset.property).forEach(input => {
        input.value = parseInt(getComputedStyle(document.documentElement).getPropertyValue(input.dataset.property));
    })
}

function handleRangeUpdate() {
    let cardsNumber = Number(document.querySelector('.level-editor input:last-of-type').value);
    document.documentElement.style.setProperty(this.dataset.property, this.value);
    //recreate the cards with the new dimensions
    createCards(cardsNumber, true);
}
function handleCardNumberInputUpdate() {
    createCards(Number(this.value), true);
}

function addEventListenersToLevelEditorItems() {
    rangeInputs.forEach(input => {
        if (input.dataset.property != undefined) {
            input.addEventListener('change', handleRangeUpdate);
            //add mousemove event listener only if the input is clicked
            input.addEventListener('mousedown', () => input.addEventListener('mousemove', handleRangeUpdate));
            //remove the mouse move event listener as the user releases the mouse button
            input.addEventListener('mouseup', () => input.removeEventListener('mousemove', handleRangeUpdate));
        } else {
            input.addEventListener('change', handleCardNumberInputUpdate);
            input.addEventListener('mousedown', () => input.addEventListener('mousemove', handleCardNumberInputUpdate));
            input.addEventListener('mouseup', () => input.removeEventListener('mousemove', handleCardNumberInputUpdate));

        }
    })
    document.querySelector('.level-editor button').onclick = function () {
        document.querySelector('.level-editor').style.display = 'none';
        setUpGame('custom');
        cardContainer.classList.remove('no-clicking');
        setTimeout(flipAllCards, 1000);
    }
}


// document.body.onblur = function () {
//     alert('gone away ... reloading');
//     window.location.reload();
// }


//making an array of valid IDs in the website picsum.photos
function makeImageIdArr() {
    let imageIdArr = Array.from(Array(80).keys()).map(x => x + 1000);
    let forbiddenArr = [1007, 1017, 1030, 1034, 1046];
    imageIdArr.forEach((x, i) => {
        if (forbiddenArr.includes(x)) {
            imageIdArr.splice(i, 1);
        }
    })
    return imageIdArr;
}
function chooseIdFromArr(arr) {
    let random = Math.floor(Math.random() * arr.length)
    return arr.splice(random, 1)[0];
}
//filling cards with data-imgid 
//(filling each two consecutive cards with the same image id)
function fillCardsWithId() {
    cards.forEach((card, i) => {
        if (card.getAttribute('data-imgid') == null) {
            let imgId = chooseIdFromArr(imageIdArr);
            card.setAttribute('data-imgid', imgId);
            cards[i + 1].setAttribute('data-imgid', imgId);
        }
    })
}

//settign cards background
function setCardsBackgroundFromData() {
    let backImgWidth = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--card-width'));
    let backImgHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--card-height'));
    document.querySelectorAll('.card.playable .back').forEach(cardBack => {
        let id = cardBack.parentElement.dataset.imgid;
        cardBack.style.backgroundImage = `url('https://picsum.photos/id/${id}/${backImgWidth}/${backImgHeight}')`;
    })
}
function addEventListenersForCards() {
    cards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.add('flipped');
            checkIf2();
        })
    })
}
function shuffle() {
    let orderArr = [];
    while (orderArr.length !== cards.length) {
        let random = Math.floor(Math.random() * cards.length);
        if (!(orderArr.includes(random))) {
            orderArr.push(random);
        }
    }
    cards.forEach((card, i) => {
        card.style.order = orderArr[i]
    })
}

function checkIf2() {
    let flippedCards = document.querySelectorAll('.card.flipped');
    if (flippedCards.length === 2) {
        cardContainer.classList.add('no-clicking');
        if (flippedCards[0].dataset.imgid === flippedCards[1].dataset.imgid) {
            handleMatch(flippedCards[0], flippedCards[1]);
        } else {
            document.querySelector('.info span.tries-num').textContent = parseInt(document.querySelector('.info span.tries-num').textContent) + 1;
            setTimeout(() => {
                flippedCards.forEach(card => {
                    card.classList.remove('flipped');
                });
                cardContainer.classList.remove('no-clicking');
            }, TIMEOUT_DURATION)
        }
    }
}

function handleMatch(card1, card2) {
    [card1, card2].forEach(card => {
        card.classList.remove('flipped');
        card.classList.add('match');
        card.classList.add('no-clicking');
    });
    cardContainer.classList.remove('no-clicking');
    if (Array.from(cards).filter(card => card.classList.contains('no-clicking')).length === cards.length) {
        win();
    }
}

function win() {
    let winDiv = document.querySelector('.win');
    winDiv.style.display = 'block';
    winDiv.style.opacity = '1';
    cardContainer.style.filter = 'blur(5px)'
    //making body's overflow hidden
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
        winDiv.style.opacity = '0';
        setTimeout(() => winDiv.style.display = 'none', 700);
        cardContainer.style.filter = 'blur(0px)'
        document.body.style.overflow = 'auto';
    }, 7000)
}

function setDimensions(difficulty) {
    document.documentElement.style.setProperty('--card-width', Game.difficulty[difficulty].width);
    document.documentElement.style.setProperty('--card-height', Game.difficulty[difficulty].height);
    document.documentElement.style.setProperty('--card-margin', Game.difficulty[difficulty].margin);
}

//creating all cards
function createCards(num, custom = false) {
    if (custom) {
        //create cards without fading out and in (for custom levels)
        cards.forEach((card, i) => card.remove());
        let cardModel = document.querySelector('.card');
        for (let i = 0; i < num; i++) {
            let newCard = cardModel.cloneNode(true);
            newCard.style.display = 'block';
            newCard.classList.add('playable');
            cardContainer.appendChild(newCard);
        }
    } else {
        //create cards with fading out and in animations (for standard levels)
        cards.forEach((card, i) => {
            card.style.opacity = '0';
            //remove cards after the transition animation ends
            setTimeout(() => card.remove(), TRANSITION_DURATION);
        });
        let cardModel = document.querySelector('.card');
        for (let i = 0; i < num; i++) {
            let newCard = cardModel.cloneNode(true);
            //adding the opacity = 0 before adding class 'playable' as it has a transition for opacity and we don't need it
            newCard.style.opacity = '0';
            newCard.classList.add('playable');
            cardContainer.appendChild(newCard);
            setTimeout(() => {
                //make new cards take their place in card board after transition duration
                newCard.style.display = 'block';
                //make a small break between changing display and opacity properties as changeing display cuts the transition
                setTimeout(() => newCard.style.opacity = '1', 10);
            }, TRANSITION_DURATION);
        }
    }
    cards = document.querySelectorAll('.card.playable');
}

function flipAllCards() {
    cards.forEach(card => {
        card.classList.add('flipped');
        setTimeout(() => cards.forEach(card => card.classList.remove('flipped')), TIMEOUT_DURATION);
    })
}

function setUpGame(difficulty) {
    GAME_DIFFICULTY = difficulty;
    //checking the right radio button (specially for the first time the game starts)
    Array.from(radios).find(radio => radio.dataset.difficulty === GAME_DIFFICULTY).checked = true;
    //setting dimensions after the opacity transition animation ends (the canvas changes its dimensions if the difficulty is changed , so the old card formation doesn't fit in the new dimensions)
    if (difficulty !== 'custom') setTimeout(() => setDimensions(difficulty), TRANSITION_DURATION);
    createCards(Game.difficulty[difficulty].cardsCount);
    setTimeout(flipAllCards, 1000);
    addEventListenersForCards();
    //making timeout for these functions as they depend on the dimensions (which have a timout function)
    setTimeout(() => {
        imageIdArr = makeImageIdArr();
        fillCardsWithId();
        setCardsBackgroundFromData();
        shuffle();
    }, TRANSITION_DURATION);
    document.querySelector('.info span.tries-num').textContent = 0;
}