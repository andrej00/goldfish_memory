var cardBoard = document.getElementsByClassName("card-board")[0];
var front = document.querySelectorAll(".front");
var counter = document.getElementById("counter");
var modal = document.getElementById("myModal");
var modalContent = document.getElementsByClassName("modal-content")[0];

// for checking if the cards are equal
var lockBoard = false;
var hasFlippedFirstCard = false;
var hasFlippedSecondCard = false;
var firstCard, secondCard, thirdCard;

var numOfCards = 24;
var minutes = 2;
var mem_card;
var points;
var cardsFlipped;
var kind;
var x = null;

setUpGame();

function setUpGame() {
    mem_card = [];
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

document.getElementById("twoOfKind").addEventListener("click", function() {
    kind = this.id;
    setUpGame();
});

document.getElementById("threeOfKind").addEventListener("click", function() {
    kind = this.id;
    setUpGame();
});

document.getElementById("score-button").addEventListener("click", function() {
    setUpGame();
    displayScore();
});

// creates html elements which are required for flipping the cards
function setCards() {
    for (var i = 0; i < numOfCards; i++) {
        var flipContainer = document.createElement("div");
        var flipper = document.createElement("div");
        var front = document.createElement("div");
        var frontImage = document.createElement("img");
        var back = document.createElement("div");
        var backImage = document.createElement("img");

        cardBoard.appendChild(flipContainer);
        flipContainer.appendChild(flipper);
        flipper.appendChild(front);
        front.appendChild(frontImage);
        flipper.appendChild(back);
        back.appendChild(backImage);

        // adds images to cards
        frontImage.src = "files/images/mem_card_2.png";
        backImage.src = "files/images/mem_" + mem_card[i] + ".png";

        // each card will have the data-image attribute and 
        // its value will be the number from mem_card array
        flipper.setAttribute("data-image", mem_card[i]);

        // adds css classes to created elements
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
    var flipContainer = document.querySelectorAll(".flip-container");
    for (var i = 0; i < numOfCards; i++) {
        flipContainer[i].firstChild.addEventListener("click", function() {
            if (lockBoard) return;
            if (this === firstCard || this === secondCard) return;

            this.classList.add("flip");

            if (!hasFlippedFirstCard) {
                hasFlippedFirstCard = true;
                firstCard = this;
                return;
            } else if (!hasFlippedSecondCard) {
                hasFlippedSecondCard = true;
                secondCard = this;
                if (kind !== "threeOfKind") {
                    checkForMatch();
                }
                return;
            } else {
                thirdCard = this;
                checkForMatch();
            }
        });
    }
}

function checkForMatch() {
    var firstAttr = firstCard.getAttribute("data-image");
    var secondAttr = secondCard.getAttribute("data-image");

    // by default thirdAttr will have the secondCard attribute
    var thirdAttr = secondCard.getAttribute("data-image");

    // if the kind is three of kind thirdAttr will have 
    // the data attribute of the third card that is clicked
    if (kind === "threeOfKind") {
        thirdAttr = thirdCard.getAttribute("data-image");
    }
    // } else {
    //     // else: thirdAttr will have the attribute of the second card that is clicked
    //     // it is set like this because when we compare the secondAttr and thirdAttr
    //     // they will be true, that way it won't make any difference when comparing for isMatch
    //     thirdAttr = secondCard.getAttribute("data-image");
    // }

    var isMatch = false;
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

// after each successful or failed attempt of picking two/three cards
// resetBoard() will be called
function resetBoard() {
  [hasFlippedFirstCard, hasFlippedSecondCard, lockBoard] = [false, false, false];
  [firstCard, secondCard, thirdCard] = [null, null, null];
}
/* ============================= */

function randomCards() {
    // adds cards for two of kind
    if (kind !== "threeOfKind") {
        for (var i = 1; i <= numOfCards / 2; i++) {
            mem_card.push(i);
            mem_card.push(i);
        }
    } else {
        // adds cards for three of kind
        for (var i = 1; i <= numOfCards / 3; i++) {
            mem_card.push(i);
            mem_card.push(i);
            mem_card.push(i);
        }
    }
    shuffleCards();
}

function shuffleCards() {
    var i = mem_card.length;
    while (i > 0) {
        var index = Math.floor(Math.random() * i);
        i--;
        // this does the shuffling
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
    var distance = minutes * 60 * 1000;

    x = setInterval(() => {

        distance -= 1000;

        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        counter.innerHTML = minutes + ":" + (seconds < 10 ? "0" : "") + String(seconds);

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

    var close = document.createElement("p");
    close.innerHTML = "x";
    modalContent.appendChild(close);

    var firstH2 = document.createElement("h2");
    firstH2.innerHTML = "Top 5 Scores:";
    modalContent.appendChild(firstH2);

    var ol = document.createElement("ol");
    modalContent.appendChild(ol);
    ol.classList.add("high-scores");    

    getHighScores();

    closeModalListener(close);
}

function displayWinningModal() {
    // gets the time left from counter from html
    var timeLeft = counter.innerHTML.split(":");
    var minutes = parseInt(timeLeft[0]);
    var seconds = parseInt(timeLeft[1]);

    clearInterval(x);

    var score = minutes*60 + seconds + points;

    updateScore(score);

    modal.style.display = "block";
    
    var close = document.createElement("p");
    close.innerHTML = "x";
    modalContent.appendChild(close);

    var firstH2 = document.createElement("h2");
    firstH2.innerHTML = "Congratulations";
    modalContent.appendChild(firstH2);

    var secondH2 = document.createElement("h2");
    secondH2.innerHTML = "Your score is:";
    modalContent.appendChild(secondH2);

    var thirdH2 = document.createElement("h2");
    thirdH2.innerHTML = score;
    modalContent.appendChild(thirdH2);

    var fourthH2 = document.createElement("h2");
    fourthH2.innerHTML = "Play again!";
    modalContent.appendChild(fourthH2);

    playAgainModalListener(fourthH2);

    closeModalListener(close);
}

function displayGameOverModal() {
    modal.style.display = "block";

    var close = document.createElement("p");
    close.innerHTML = "x";
    modalContent.appendChild(close);

    var firstH2 = document.createElement("h2");
    firstH2.innerHTML = "Awww :((";
    modalContent.appendChild(firstH2);

    var secondH2 = document.createElement("h2");
    secondH2.innerHTML = "Your time";
    modalContent.appendChild(secondH2);

    var thirdH2 = document.createElement("h2");
    thirdH2.innerHTML = "is up!";
    modalContent.appendChild(thirdH2);

    var fourthH2 = document.createElement("h2");
    fourthH2.innerHTML = "Play again!";
    modalContent.appendChild(fourthH2);

    playAgainModalListener(fourthH2)

    closeModalListener(close);
}
// event listener for "Play again"
function playAgainModalListener(el) {
    el.addEventListener("click", function() {
        start();
        modal.style.display = "none";
        removeChildrenElements(modalContent);
    });
}
// event listener for "x"
function closeModalListener(el) {
    el.addEventListener("click", function() {
        setUpGame();
        modal.style.display = "none";
        removeChildrenElements(modalContent);
    });
}

/* ========= */
/* HIGHSCORE */
/* ========= */
function getHighScores() {
    var highScores = document.querySelector(".high-scores");

    removeChildrenElements(highScores);

    if (typeof(Storage) !== "undefined") {
        var scores = false;
        if (localStorage["high-scores"]) {
            scores = JSON.parse(localStorage["high-scores"]);
            scores = scores.sort((a, b) => parseInt(b) - parseInt(a));

            for (var i = 0; i < 5; i++) {
                var s = scores[i];                        
                var li = document.createElement('li');
                li.innerHTML = (typeof(s) != "undefined" ? s : "" );
                highScores.appendChild(li);
            }
        }
    } 
}

function updateScore(currentPoints) {
    if (typeof(Storage) !== "undefined") {
        var scores = false;
        if (localStorage["high-scores"]) {

            scores = JSON.parse(localStorage["high-scores"]);
            scores = scores.sort((a, b) => parseInt(b) - parseInt(a));
            
            for (var i = 0; i < 5; i++) {
                var s = parseInt(scores[i]);
                
                var val = (!isNaN(s) ? s : 0 );
                if (currentPoints > val) {
                    val = currentPoints;
                    scores.splice(i, 0, parseInt(currentPoints));
                    break;
                }
            }
            scores.length = 10;                                
            localStorage["high-scores"] = JSON.stringify(scores);
        } else {                        
            var scores = [];
            scores[0] = currentPoints;
            localStorage["high-scores"] = JSON.stringify(scores);
        }
    } 
}