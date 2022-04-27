const cardBoard = document.getElementsByClassName("card-board")[0];
var front = document.querySelectorAll(".front");
const counter = document.getElementById("counter");
const modal = document.getElementById("myModal");
const modalContent = document.getElementsByClassName("modal-content")[0];

let lockBoard = false;
let hasFlippedFirstCard = false;
let hasFlippedSecondCard = false;
let firstCard, secondCard, thirdCard;

const numOfCards = 24;
let minutes = 2;
let mem_card;
let points;
let cardsFlipped;
let kind;
let x = null;
const self = this;

setUpGame();

function setUpGame() {
    mem_card = [];
	console.log(minutes)
    counter.innerHTML = minutes + ":00";
    clearInterval(x);
    removeChildrenElements(cardBoard);
    randomCards();
    setCards();
}

function start() {
    points = 0;
    cardsFlipped = 0;
    mem_card = [];
    clearInterval(x);
    countdown();
    removeChildrenElements(cardBoard);
    randomCards();
    setCards();
    flipCard();
}

/* =============== */
/* EVENT LISTENERS */
/* =============== */
document.getElementById("start-button").addEventListener("click", () => start());

document.getElementById("twoOfKind").addEventListener("click", (e) => {
    kind = e.currentTarget.id;
    setUpGame();
});

document.getElementById("threeOfKind").addEventListener("click", (e) => {
	console.log(e.currentTarget.id)
    kind = e.currentTarget.id;
    setUpGame();
});

document.getElementById("score-button").addEventListener("click", () => {
    setUpGame();
    displayScore();
});

function setCards() {
    for (let i = 0; i < numOfCards; i++) {
        const flipContainer = document.createElement("div");
        const flipper = document.createElement("div");
        const front = document.createElement("div");
        const frontImage = document.createElement("img");
        const back = document.createElement("div");
        const backImage = document.createElement("img");

        cardBoard.appendChild(flipContainer);
        flipContainer.appendChild(flipper);
        flipper.appendChild(front);
        front.appendChild(frontImage);
        flipper.appendChild(back);
        back.appendChild(backImage);

        frontImage.src = "files/images/mem_card_2.png";
        backImage.src = "files/images/mem_" + mem_card[i] + ".png";

        flipper.setAttribute("data-image", mem_card[i]);

        flipContainer.classList.add("flip-container");
        flipper.classList.add("flipper");
        front.classList.add("front");
        back.classList.add("back");
    }
}

/* ============================= */
/* CHECKS IF THE CARDS ARE EQUAL */
/* ============================= */
function flipCard() {
    const flipContainer = document.querySelectorAll(".flip-container");
    for (let i = 0; i < numOfCards; i++) {
        flipContainer[i].firstChild.addEventListener("click", (e) => {
            if (lockBoard) return;
            if (e.currentTarget === firstCard || e.currentTarget === secondCard) return;

            e.currentTarget.classList.add("flip");

            if (!hasFlippedFirstCard) {
                hasFlippedFirstCard = true;
                firstCard = e.currentTarget;
                return;
            } else if (!hasFlippedSecondCard) {
                hasFlippedSecondCard = true;
                secondCard = e.currentTarget;
                if (kind !== "threeOfKind") {
                    checkForMatch();
                }
                return;
            } else {
                thirdCard = e.currentTarget;
                checkForMatch();
            }
        });
    }
}

function checkForMatch() {
    const firstAttr = firstCard.getAttribute("data-image");
    const secondAttr = secondCard.getAttribute("data-image");
    let thirdAttr = secondCard.getAttribute("data-image");

    if (kind === "threeOfKind") {
        thirdAttr = thirdCard.getAttribute("data-image");
    }

    let isMatch = false;
    if (firstAttr === secondAttr && secondAttr === thirdAttr) {
        isMatch = true;
    }

    lockBoard = true;
    setTimeout(() => (isMatch ? disableCards() : unflipCards()), 750);
}

function disableCards() {
    firstCard.parentNode.classList.add("disabled");
    secondCard.parentNode.classList.add("disabled");
    if (kind === "threeOfKind") {
        points += 5;
        cardsFlipped += 3;
        thirdCard.parentNode.classList.add("disabled");
    } else {
        points++;
        cardsFlipped += 2;
    }
    if (cardsFlipped === numOfCards) {
        displayWinningModal();
    }
    resetBoard();
}

function unflipCards() {
    firstCard.classList.remove("flip");
    secondCard.classList.remove("flip");
    if (kind === "threeOfKind") {
        thirdCard.classList.remove("flip");
    }
    resetBoard();
}

function resetBoard() {
	[hasFlippedFirstCard, hasFlippedSecondCard, lockBoard] = [false, false, false];
	[firstCard, secondCard, thirdCard] = [null, null, null];
}

function randomCards() {
    if (kind !== "threeOfKind") {
        for (let i = 1; i <= numOfCards / 2; i++) {
            mem_card.push(i);
            mem_card.push(i);
        }
    } else {
        for (let i = 1; i <= numOfCards / 3; i++) {
            mem_card.push(i);
            mem_card.push(i);
            mem_card.push(i);
        }
    }
    shuffleCards();
}

function shuffleCards() {
    let i = mem_card.length;
    while (i > 0) {
        let index = Math.floor(Math.random() * i);
        i--;
        [mem_card[index], mem_card[i]] = [mem_card[i], mem_card[index]];
    }
}

function removeChildrenElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/* ===== */
/* TIMER */
/* ===== */
function countdown() {
    let distance = minutes * 60 * 1000;

    x = setInterval(() => {

        distance -= 1000;

        const minutesCountDown = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const secondsCountDown = Math.floor((distance % (1000 * 60)) / 1000);

        counter.innerHTML = minutesCountDown + ":" + (secondsCountDown < 10 ? "0" : "") + String(secondsCountDown);

        if (distance < 1) {
            clearInterval(x);
            displayGameOverModal();
            counter.innerHTML = "0:00";
        }
    }, 1000);
}

/* ====== */
/* MODALS */
/* ====== */
function displayScore() {
    modal.style.display = "block";

    const close = document.createElement("p");
    close.innerHTML = "x";
    modalContent.appendChild(close);

    const firstH2 = document.createElement("h2");
    firstH2.innerHTML = "Top 5 Scores:";
    modalContent.appendChild(firstH2);

    const ol = document.createElement("ol");
    modalContent.appendChild(ol);
    ol.classList.add("high-scores");    

    getHighScores();
    closeModalListener(close);
}

function displayWinningModal() {
    const timeLeft = counter.innerHTML.split(":");
    const minutes = parseInt(timeLeft[0]);
    const seconds = parseInt(timeLeft[1]);

    clearInterval(x);

    const score = minutes * 60 + seconds + points;

    updateScore(score);

    modal.style.display = "block";
    
    const close = document.createElement("p");
    close.innerHTML = "x";
    modalContent.appendChild(close);

    const firstH2 = document.createElement("h2");
    firstH2.innerHTML = "Congratulations";
    modalContent.appendChild(firstH2);

    const secondH2 = document.createElement("h2");
    secondH2.innerHTML = "Your score is:";
    modalContent.appendChild(secondH2);

    const thirdH2 = document.createElement("h2");
    thirdH2.innerHTML = score;
    modalContent.appendChild(thirdH2);

    const fourthH2 = document.createElement("h2");
    fourthH2.innerHTML = "Play again!";
    modalContent.appendChild(fourthH2);

    playAgainModalListener(fourthH2);
    closeModalListener(close);
}

function displayGameOverModal() {
    modal.style.display = "block";

    const close = document.createElement("p");
    close.innerHTML = "x";
    modalContent.appendChild(close);

    const awww = document.createElement("h2");
    awww.innerHTML = "Awww :((";
    modalContent.appendChild(awww);

    const yourTime = document.createElement("h2");
    yourTime.innerHTML = "Your time";
    modalContent.appendChild(yourTime);

    const isUp = document.createElement("h2");
    isUp.innerHTML = "is up!";
    modalContent.appendChild(isUp);

    const playAgain = document.createElement("h2");
    playAgain.innerHTML = "Play again!";
    modalContent.appendChild(playAgain);

    playAgainModalListener(playAgain)
    closeModalListener(close);
}

function playAgainModalListener(el) {
    el.addEventListener("click", () => {
        start();
        modal.style.display = "none";
        removeChildrenElements(modalContent);
    });
}

function closeModalListener(el) {
    el.addEventListener("click", () => {
        setUpGame();
        modal.style.display = "none";
        removeChildrenElements(modalContent);
    });
}

/* ========= */
/* HIGHSCORE */
/* ========= */
function getHighScores() {
    const highScores = document.querySelector(".high-scores");

    removeChildrenElements(highScores);

    if (typeof(Storage) !== "undefined") {
        const scores = false;
        if (localStorage["high-scores"]) {
            scores = JSON.parse(localStorage["high-scores"]);
            scores = scores.sort((a, b) => parseInt(b) - parseInt(a));

            for (let i = 0; i < 5; i++) {
                const s = scores[i];                        
                const li = document.createElement('li');
                li.innerHTML = (typeof(s) != "undefined" ? s : "" );
                highScores.appendChild(li);
            }
        }
    } 
}

function updateScore(currentPoints) {
    if (typeof(Storage) !== "undefined") {
        let scores = false;
        if (localStorage["high-scores"]) {

            scores = JSON.parse(localStorage["high-scores"]);
            scores = scores.sort((a, b) => parseInt(b) - parseInt(a));
            
            for (let i = 0; i < 5; i++) {
                const s = parseInt(scores[i]);
                
                let val = (!isNaN(s) ? s : 0 );
                if (currentPoints > val) {
                    val = currentPoints;
                    scores.splice(i, 0, parseInt(currentPoints));
                    break;
                }
            }
            scores.length = 10;                                
            localStorage["high-scores"] = JSON.stringify(scores);
        } else {                        
            scores = [];
            scores[0] = currentPoints;
            localStorage["high-scores"] = JSON.stringify(scores);
        }
    } 
}
