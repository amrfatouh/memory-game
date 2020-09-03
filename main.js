//starting thr game
// document.querySelector('.overlay button').onclick = () => {
//     document.querySelector('.info .name span').textContent = prompt('Enter your name: ');
//     document.querySelector('.overlay').remove();
// }

let cardContainer = document.querySelector('.card-container');
let cards = document.querySelectorAll('.card');

let TRANSITION_DURATION = 500
let TIMEOUT_DURATION = TRANSITION_DURATION * 2;

//filling cards with data-imgid 
//(filling each two consecutive cards with the same image id)
cards.forEach((card, i) => {
    if (card.getAttribute('data-imgid') == null) {
        let imgId = Math.ceil(Math.random() * 100) * 10;
        card.setAttribute('data-imgid', imgId);
        cards[i + 1].setAttribute('data-imgid', imgId);
    }
})
//settign cards background
let backImgSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--card-size'));
document.querySelectorAll('.card .back').forEach(cardBack => {
    let id = cardBack.parentElement.dataset.imgid;
    cardBack.style.backgroundImage = `url('https://picsum.photos/id/${id}/${backImgSize}')`;
})

shuffle();

document.querySelectorAll('.card-container .card').forEach(card => {
    card.addEventListener('click', () => {
        card.classList.add('flipped');
        checkIf2();
    })
})

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
            document.documentElement.style.setProperty('--container-width', '600px');
            document.documentElement.style.setProperty('--container-height', '480px');
            document.documentElement.style.setProperty('--card-size', '100px');
            document.documentElement.style.setProperty('--card-margin', '10px');
            break;
        case 'intermediate':
            document.documentElement.style.setProperty('--container-width', '546px');
            document.documentElement.style.setProperty('--container-height', '455px');
            document.documentElement.style.setProperty('--card-size', '75px');
            document.documentElement.style.setProperty('--card-margin', '8px');
            break;
        case 'hard':
            document.documentElement.style.setProperty('--container-width', '480px');
            document.documentElement.style.setProperty('--container-height', '360px');
            document.documentElement.style.setProperty('--card-size', '50px');
            document.documentElement.style.setProperty('--card-margin', '5px');
            break;
    }
}