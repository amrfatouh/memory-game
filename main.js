//filling cards with data-imgid
document.querySelectorAll('.card').forEach(card => {
    let imgId = card.querySelector('img').src.split('/')[4];
    card.setAttribute('data-imgid', imgId);
})

document.querySelector('.overlay button').onclick = () => {
    document.querySelector('.info .name span').textContent = prompt('Enter your name: ');
    document.querySelector('.overlay').remove();
}

let cardContainer = document.querySelector('.card-container');
let cards = document.querySelectorAll('.card');

let TRANSITION_DURATION = 500
let TIMEOUT_DURATION = TRANSITION_DURATION * 2;

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
    while (orderArr.length !== 20) {
        let random = Math.floor(Math.random() * 20);
        if (!(orderArr.includes(random))) {
            orderArr.push(random);
        }
    }
    cards.forEach((card, i) => {
        card.style.order = orderArr[i]
    })
}