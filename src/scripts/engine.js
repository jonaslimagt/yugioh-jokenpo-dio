const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.querySelector("#score_points")
    },
    cardSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    fieldCards: {
        player: document.querySelector("#player-field-card"),
        computer: document.querySelector("#computer-field-card"),
    },
    playerSides: {
        player: "player-cards",
        playerBOX: document.querySelector("#player-cards"),
        computer: "computer-cards",
        computerBOX: document.querySelector("#computer-cards"),
    },
    actions: {
        button: document.getElementById("next-duel")
    }
}

const playerSides = {
    player: "player-cards",
    computer: "computer-cards"
}

const pathImages = "./src/assets/icons/";

const cardData = [
    {
        id: 0, 
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: `${pathImages}dragon.png`,
        winsOver: [1],
        losesTo: [2]
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img: `${pathImages}magician.png`,
        winsOver: [2],
        losesTo: [0]
    },
    {
        id: 2,
        name: "Exodia", 
        type: "Scissors",
        img: `${pathImages}exodia.png`,
        winsOver: [0],
        losesTo: [1]
    },
];

async function getRandomCardId() {
    const randomIdex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIdex].id;
}

async function createCardImage(idCard, fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", idCard);
    cardImage.classList.add("card");

    if (fieldSide === playerSides.player) {
        
        cardImage.addEventListener("mouseover", () => {
            drawSelectedCard(idCard);
        });

        cardImage.addEventListener("click", () => {
            setCardsField(cardImage.getAttribute("data-id"));
        });
    }

    return cardImage;
}

async function setCardsField(cardId) {
    await removeAllCardsImages();
    let computerCardId = await getRandomCardId();

    await showCardFields(true);
    await drawCardsOnField(cardId, computerCardId);

    let duelResults = await checkDuelResults(cardId, computerCardId);

    await updateScore(); 
    await drawButton(duelResults);
}

async function checkDuelResults(cardId, computerCardId) {
    let duelResults = "draw";
    let playerCard = cardData[cardId];

    if (playerCard.winsOver.includes(computerCardId)) {
        duelResults = "win";
        playAudio(duelResults);
        state.score.playerScore++;
    } else if (playerCard.losesTo.includes(computerCardId)){
        duelResults = "loss";
        playAudio(duelResults);
        state.score.computerScore++;
    }

    return duelResults;
}

async function drawButton(text) {
    state.actions.button.innerText = text;
    state.actions.button.style.display = "block";
}

async function updateScore() {
    state.score.scoreBox.innerText = `Wins: ${state.score.playerScore} | Losses: ${state.score.computerScore}`;
}

async function removeAllCardsImages() {
    let {computerBOX, playerBOX} = state.playerSides;
    let imgElements = computerBOX.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

    imgElements = playerBOX.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());
}

async function drawSelectedCard(index) {
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = "Attribute: " + cardData[index].type;
}

async function drawCards(numberOfCards, fieldSide){
    for (let i = 0; i < numberOfCards; i++) {
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);
        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

async function showCardFields(value) {
    if (value) {
        state.fieldCards.player.style.display = "block";
        state.fieldCards.computer.style.display = "block";
    } else {
        state.fieldCards.player.style.display = "none";
        state.fieldCards.computer.style.display = "none";
    }
}

async function drawCardsOnField(cardId, computerCardId) {
    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;
}

async function hideCardDetails() {
    state.cardSprites.avatar.src = "";
    state.cardSprites.name.innerText = "";
    state.cardSprites.type.innerText = "";
}

async function resetDuel() {
    hideCardDetails();
    state.actions.button.style.display = "none";
    await showCardFields(false);

    init();
}

async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    try{
        audio.play();
    } catch {}
}

function init(){
    showCardFields(false);

    drawCards(5, playerSides.player);
    drawCards(5, playerSides.computer);

    const bgm = document.getElementById("bgm");
    bgm.volume = 0.4;
    bgm.play();
}

init();