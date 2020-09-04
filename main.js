//starting the game
// document.querySelector('.overlay button').onclick = () => {
//     document.querySelector('.info .name span').textContent = prompt('Enter your name: ') || 'unnamed';
//     GAME_DIFFICULTY = document.querySelector('.overlay select').value;
//     setUpGame(GAME_DIFFICULTY);
//     document.querySelector('.overlay').remove();
// }



let cardContainer = document.querySelector('.card-container');
let cards = document.querySelectorAll('.card.playable');
let imageIdArr = makeImageIdArr();
let radios = document.querySelectorAll('.options input');

let TRANSITION_DURATION = 500
let TIMEOUT_DURATION = TRANSITION_DURATION * 2;
// let GAME_DIFFICULTY = document.querySelector('.overlay select').value;

GAME_DIFFICULTY = 'easy' //temporarily set to easy
setUpGame(GAME_DIFFICULTY);

//choosing difficulty
radios.forEach(radio => {
    radio.onclick = function () {
        if (confirm('Your progress will be erased. Are you sure?')) {
            setUpGame(radio.dataset.difficulty);
        } else {
            document.querySelector(`.options input[data-difficulty=${GAME_DIFFICULTY}]`).checked = true;
        }
    }
})


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
    document.querySelectorAll('.card .back').forEach(cardBack => {
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

function setDimensions(difficulty) {
    switch (difficulty) {
        case 'easy':
            document.documentElement.style.setProperty('--card-width', '235px');
            document.documentElement.style.setProperty('--card-height', '104px');
            document.documentElement.style.setProperty('--card-margin', '10px');
            break;
        case 'intermediate':
            document.documentElement.style.setProperty('--card-width', '196px');
            document.documentElement.style.setProperty('--card-height', '84px');
            document.documentElement.style.setProperty('--card-margin', '8px');
            break;
        case 'hard':
            document.documentElement.style.setProperty('--card-width', '150px');
            document.documentElement.style.setProperty('--card-height', '73px');
            document.documentElement.style.setProperty('--card-margin', '5px');
            break;
    }
}

//creating all cards
function createCards(num) {
    cards.forEach((card, i) => card.remove())
    let cardModel = document.querySelector('.card');
    for (let i = 0; i < num; i++) {
        let newCard = cardModel.cloneNode(true);
        newCard.classList.add('playable');
        newCard.style.display = 'block';
        cardContainer.appendChild(newCard);
    }
    // cardModel.remove();
}

function setUpGame(difficulty) {
    GAME_DIFFICULTY = difficulty;
    Array.from(radios).find(radio => radio.dataset.difficulty === GAME_DIFFICULTY).checked = true;
    setDimensions(difficulty);
    switch (difficulty) {
        case 'easy':
            createCards(20);
            break;
        case 'intermediate':
            createCards(30);
            break;
        case 'hard':
            createCards(48);
            break;
    }
    cards = document.querySelectorAll('.card.playable');
    addEventListenersForCards();
    fillCardsWithId();
    setCardsBackgroundFromData();
    shuffle();
    document.querySelector('.info span.tries-num').textContent = 0;
}