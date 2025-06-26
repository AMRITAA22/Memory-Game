const cardContainer = document.querySelector(".cards");
const fruits = ["apple", "banana", "cherry", "grapes", "kiwi", "raspberry", "strawberry", "watermelon"];
const images = [...fruits, ...fruits].sort(() => Math.random() - 0.5);
const flipSound = new Audio("Sounds/flip.mp3");
const matchSound = new Audio("Sounds/match.mp3");
const wrongSound = new Audio("Sounds/wrong.mp3");
const winSound = new Audio("Sounds/win.mp3");

// Dynamically create 16 cards
images.forEach(imgName => {
    const card = document.createElement("li");
    card.className = "card";
    card.innerHTML = `
        <div class="view front-view">
            <span class="material-icons">?</span>
        </div>
        <div class="view back-view">
            <img src="Images/${imgName}.png" alt="card-img">
        </div>
    `;
    cardContainer.appendChild(card);
});

const cards = document.querySelectorAll(".card");
let matchedCard = 0;
let cardOne, cardTwo;
let disableDeck = false;

function flipCard(e) {
    let clickedCard = e.currentTarget;
    if (clickedCard !== cardOne && !disableDeck) {
        clickedCard.classList.add("flip");
        flipSound.play();
        if (!cardOne) return cardOne = clickedCard;

        cardTwo = clickedCard;
        disableDeck = true;

        let cardOneImg = cardOne.querySelector("img").src;
        let cardTwoImg = cardTwo.querySelector("img").src;

        matchCards(cardOneImg, cardTwoImg);
    }
}

function matchCards(img1, img2) {
    if (img1 === img2) {
        matchedCard++;
        matchSound.play();

        if (matchedCard === fruits.length) {
            // Delay win effects for smoother UX
            setTimeout(() => {
                winSound.play();

                // Show message
                const msg = document.querySelector(".message");
                msg.classList.add("show");

                // Confetti burst
                confetti({
                    particleCount: 350,
                    spread: 50,
                    origin: { y: 0.9}
                });

                // Hide message & reshuffle after 3s
                setTimeout(() => {
                    msg.classList.remove("show");
                    shuffleCards();
                }, 3000);
            }, 500);
        }

        cardOne.removeEventListener("click", flipCard);
        cardTwo.removeEventListener("click", flipCard);
        resetCards();
    } else {
        setTimeout(() => {
            cardOne.classList.add("shake");
            cardTwo.classList.add("shake");
        }, 400);
        wrongSound.play();

        setTimeout(() => {
            cardOne.classList.remove("shake", "flip");
            cardTwo.classList.remove("shake", "flip");
            resetCards();
        }, 1200);
    }
}


function resetCards() {
    [cardOne, cardTwo, disableDeck] = [null, null, false];
}

function shuffleCards() {
    matchedCard = 0;
    resetCards();

    const shuffledImages = [...fruits, ...fruits].sort(() => Math.random() - 0.5);
    const imgTags = document.querySelectorAll(".card img");

    imgTags.forEach((img, i) => {
        img.src = `Images/${shuffledImages[i]}.png`;
        img.closest(".card").classList.remove("flip");
    });

    cards.forEach(card => card.addEventListener("click", flipCard));
}

// Add event listeners
cards.forEach(card => card.addEventListener("click", flipCard));
