let shuffledCards = []; // create an array of shuffled cards.
let cardFlips = []; // create an array of cardFlips
let idxArray =[];   // index of Array
let cardCount = 12; // create a card count of 12
let playerCards = []; // player cards array to keep track of how many cards the player has when matched.
let matchCards = []; // an array to perform a match of the player cards and the random cards.

const cards = Array.from(document.querySelectorAll('.card')); // select all  divs with class card
const randomCards = []; // an array for random cards
const frontCardImage = Array.from(document.querySelectorAll('.frontCard')); // front of card
const backCardImage = Array.from(document.querySelectorAll('.backCard')); // back of card
const backCardElement = Array.from(document.querySelectorAll('.back')); // image of back of card

async function getCards (api)  { // fetch function for getting all the images from a database db.json
        try {
            const url = api;
            const response = await fetch(url);
            if(!response.ok) {
                throw new Error(`Response Status: ${response.status}`);
            }

            const data = await response.json();
            return data; // return data
        } catch (error) {
            console.error(error.message);
        }

    }

const generateRandomCards = (cardObj,cardCount) => { // generate random cards
        let tempCards = [...cardObj]; // create a card array and duplicate the card object
        randomCards.length = 0; // clear the randomCards.length
        for(let i = 0; i < cardCount / 2 ; i++) {
            let randomIndex = Math.floor(Math.random() * tempCards.length);
            let selectedCard = tempCards.splice(randomIndex, 1)[0];
            randomCards.push(selectedCard, selectedCard); // generate two of the same random cards
        }
        return randomCards; // return cards
    }

const shuffleCards = (cards) => { // Fisher-Yates shuffle function
    let cardsArray = [...cards]; //  create an array of the cards
    let randomNumber, tempCard; // variables for random number and a temporary card
  
    for (let i = cardsArray.length - 1; i > 0; i--) { 
      randomNumber = Math.floor(Math.random() * (i + 1)); 
      tempCard = cardsArray[i];
      cardsArray[i] = cardsArray[randomNumber];
      cardsArray[randomNumber] = tempCard;
    }
  
    shuffledCards = [...cardsArray]; // Update shuffledCards with the shuffled array
    return shuffledCards; 
  }



const displayCards = (shuffledCards) => { // display shuffled cards
        for (let i=0; i < shuffledCards.length; i++) {
            frontCardImage[i].setAttribute('data-name',shuffledCards[i].name); // set the front of the card to a random image
            frontCardImage[i].src = shuffledCards[i].icon; // set the src of the image of the card
            backCardImage[i].setAttribute('data-name',shuffledCards[i].name); // set the back of the card
            backCardImage[i].src = './assets/exploding.png'; // back of cards all have the same image
        }
}


const handleClick = (event) => { // create a click event to flip the cards
    flipCards(event);
}

const flipCards = (cards) => { // flip the cards 
    let cardName = cards.target.dataset.name; // get the name of the card from the dataset of the card
    let cardFlipped = cards.target.parentNode; // create a variable to set the chosen card  choosing the parent node of the div to flip the entire card
    if (cardFlipped.classList.contains('collapse')) {
        return;
    }
    cardFlipped.classList.add('collapse'); // add a css style class to collapse the image revealing the front of the card
    compareCards(cardName,cardFlipped); // call the function to compare the cards in shuffled cards and the chosen card
}

const compareCards =  (cardName, cardFlipped) => { // compare cards to shuffled cards
    playerCards.push(cardName);  // push the card name and the card that is flipped with id to an array playerCards
    cardFlips.push(cardFlipped); // push the card that is flipped containing the id to the cardFlips array 

    if(playerCards.length < 2) return; // Do not perfrom any actions if the player cards array length is less than 2; provides the ability for the user to select two cards.

    for(let i = 0; i < playerCards.length; i++) {
        let idx = playerCards.indexOf(playerCards[i]); // get the index of the player cards array 
        if(playerCards[0] !== playerCards[i]){ // if the second pushed card is not equal to any of the player cards
            playerCards.splice(idx,1); // remove the second card
            cardFlips.splice(idx,1); // remove the second chosen card in the array if the chosen card is incorrect
            setTimeout(() => {
                cardFlipped.classList.remove('collapse'); // provide a time limit to remove the class collapse flipping the card back to 
            },500) // its original state
        }

        if(playerCards[0] === playerCards[i]) { // if both cards that are flipped are equall 
            cardFlips.forEach(card => { // for each card that is equal
                const parent = card.parentNode; // get the parent node
                const children = Array.from(parent.children); // get the children from the parent node
                const frontChild = children[0]; // create a variable for the flipped card
                frontChild.style.backgroundColor = 'black'; // style the background of the card to a certain color to verify that the chosen
            }) // cards are correct
        }
    }
    keepCount(); // keep count of the matched cards
}

const keepCount = () => {
    let count = 0;
    shuffledCards.reduce((nameOfCard, names) => { // reducer function to track the count of the cards
        nameOfCard = playerCards[0];
        let name = names.name; // if all matching cards are in the array from the shuffled deck. 
        if(nameOfCard === name) { 
            count++; // add to couont
        }
    }, shuffledCards[0].name)
    matchedCard(count); // create a function to keep track of the matched cards
}

const matchedCard = (count) => {
    setTimeout(() => { // create a timeout function to verify the length of the playercards and count
        if(playerCards.length === count) {
            const matches = document.getElementById('matches'); // variable to get all the matching cards
            matchCards.push(playerCards.length); // push all matching cards into an array
            const matched = matchCards.reduce((acc,cur) => acc + cur) // count all matching cards
            matches.innerHTML = matched; // display number of matching cards

            if(matched === cardCount) {
                const newGameButton = document.getElementById('new-game');
                newGameButton.disabled = false;
            }
           playerCards = []; // empty the playerCards array after the total number of matching cards have been created.
        }
    },1000)
}

function newGame() {
    shuffledCards = [];
    cardFlips = [];
    playerCards = [];
    matchCards.length = 0;
    document.getElementById('matches').innerHTML = 0;
   
    init();
    backCardElement.forEach((card) => card.classList.remove('collapse'));
    const newGameButton = document.getElementById('new-game');
    newGameButton.disabled = true;
}


async function init () { // init function to generate and play the game
        const cardObj = await getCards('./emojiCard.json');
        generateRandomCards(cardObj,cardCount);
        shuffleCards(randomCards);
        displayCards(shuffledCards); 
        backCardElement.forEach(card => card.addEventListener('click', handleClick));
    }

init();
