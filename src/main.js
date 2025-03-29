const deckNumber = 3;
const cardsInDeck = 52;
const totalCards = deckNumber * cardsInDeck;
const baseRoundPlayerCards = 2;
const baseRoundDealerCards = 1;
const baseRoundCards = baseRoundPlayerCards + baseRoundDealerCards;
const hiddenCards = 1;
const maxDrawsByPlayer = 3;
const maxDrawsByDealer = 3;
const maxDraws = hiddenCards + maxDrawsByPlayer + maxDrawsByDealer;
const dealerMinValue = 17;
const blackJack = 21;

const btnHeight = 48;
const btnWidth = 144;

const States = Object.freeze({
    GAME_START: 0,
    INITIAL_SELECT: 1,
    DECISION: 2,
    PLAYER_SELECT: 3,
    CONFIRMATION: 4,
    DEALER_SELECT: 5
});
const Cards = Object.freeze({
    ACE: 1,
    TWO: 2,
    THREE: 3,
    FOUR: 4,
    FIVE: 5,
    SIX: 6,
    SEVEN: 7,
    EIGHT: 8,
    NINE: 9,
    TEN: 10
});
const Amounts = Object.freeze({
    ACE: 12,
    TWO: 12,
    THREE: 12,
    FOUR: 12,
    FIVE: 12,
    SIX: 12,
    SEVEN: 12,
    EIGHT: 12,
    NINE: 12,
    TEN: 48
});
const Hands = Object.freeze({
    PLAYER: 0,
    DEALER: 1
});

class Deck {
    constructor() {
        this.reset();
    }
    reset() {
        this.cards = {};
        this.tCards = totalCards;
        for (let i = Cards.ACE; i <= Cards.TEN; i++) {
            this.cards[i] = Amounts[Object.keys(Cards)[i-1]];
        }
    }
    getCard(card) {
        return this.cards[card];
    }
    getTCards() {
        return this.tCards;
    }
    drawCard(card) {
        if (this.cards[card] > 0) {
            this.cards[card]--;
            this.tCards--;
        }
        if (this.tCards === 0) {
            this.reset()
        }
    }
}
class UsedCards {
    constructor() {
        this.cards = {};
        this.totalUsed = 0;
    }
    useCard(card) {
        this.cards[card] ? this.cards[card]++ : this.cards[card] = 1;
        this.totalUsed++;
    }
    unuseCard(card) {
        if (this.cards[card]) {
            this.cards[card]--;
            this.totalUsed--;
        }
    }
    getUsed(card) {
        return this.cards[card] ? this.cards[card] : 0;
    }
    getTUsed() {
        return this.totalUsed;
    }
}
class Hand {
    constructor(cards) {
        this.cards = [];
        cards.forEach(card => {
            this.cards.push(card);
        });
        this.partValue = cards.reduce((sum, a) => sum + a, 0);
        if (this.soft = this.partValue < 12) {
            this.soft = cards.reduce((s, a) => s || a === Cards.ACE, false);
        }
        this.actualValue = this.soft ? this.partValue + 10 : this.partValue;
    }
    addCard(card) {
        this.cards.push(card);
        this.partValue += card;
        this.soft = (card === Cards.ACE || this.soft) && this.partValue < 12;
        this.actualValue = this.soft ? this.partValue + 10 : this.partValue;
    }
    getCards() {
        return this.cards;
    }
    getSoft() {
        return this.soft;
    }
    getValue() {
        return this.actualValue;
    }
}
class PossibleResult {
    constructor() {
        this.reset();
    }
    reset() {
        this.busts = 0;
        this.wins = 0;
        this.ties = 0;
        this.unsolveds = 0;
        this.losses = 0;
        this.dBusts = 0;
        this.unsolved = 0;
    }
    bust(coef) { this.busts += coef; }
    win(coef) { this.wins+= coef; }
    tie(coef) { this.ties+= coef; }
    unsolve(coef) { this.unsolveds += coef; }
    lose(coef) { this.losses+= coef; }
    dealerBust(coef) { this.dBusts+= coef; }
    getBusts() { return this.busts; }
    getWins() { return this.wins; }
    getTies() { return this.ties; }
    getUnsolveds() { return this.unsolveds; }
    getLosts() { return this.losses; }
    getDealerBusts() { return this.dBusts; }
    getTotal() { return this.busts + this.wins + this.ties + this.losses + this.dBusts + this.unsolveds; }
}

function advanceState(state) {
    this.previousState = this.state;
    this.state = state;
}

function onInit() {
    this.state = States.GAME_START;
    this.deck = new Deck();
    this.possibilities = [new PossibleResult(), new PossibleResult(), new PossibleResult(), new PossibleResult()];
    this.probabilities = [new PossibleResult(), new PossibleResult(), new PossibleResult(), new PossibleResult()];
    this.playerHand = new Hand([]);
    this.dealerHand = new Hand([]);
    this.usedCards = new UsedCards();
    window.addEventListener('resize', () => {drawGameTable()});
    drawGameTable();
    document.addEventListener('keydown', function(event) {
        onKeyPress(event.key);
    });
}

function startRound(pCards, dCard) {
    this.deck.drawCard(pCards[0]);
    this.deck.drawCard(dCard);
    this.deck.drawCard(pCards[1]);
    if (this.deck.getTCards() === 1) {
        let i = Cards.ACE;
        while (this.deck.getCard(i) === 0) {
            i++;
        }
        this.dealerHiddenCard = i;
        this.dealerHand.addCard(i);
        this.dDraftHand.addCard(i);
        this.deck.drawCard(i);
    }
    simulateRound();
}

function hitOnRound(card) {
    if (this.playerHand) {
        const cards = this.playerHand.getCards();
        this.deck.drawCard(cards[cards.length - 1]);
        if (this.deck.getTCards() === 1) {
            let i = Cards.ACE;
            while (this.deck.getCard(i) === 0) {
                i++;
            }
            this.dealerHiddenCard = i;
            this.dealerHand.addCard(i);
            this.dDraftHand.addCard(i);
            this.deck.drawCard(i);
        }
        simulateRound();
    }
}

function simulateRound() {
    this.possibilities = [new PossibleResult(), new PossibleResult(), new PossibleResult(), new PossibleResult()];
    this.probabilities = [new PossibleResult(), new PossibleResult(), new PossibleResult(), new PossibleResult()];
    this.pHandLocked = 0;
    this.dHandLocked = 0;
    drawCards();
    registerProbabilities();
    drawStatsTables();
    return this.probabilities;
}

function endRound(dCards) {
    const startingI = this.dealerHiddenCard === 0 ? 1 : 2;
    for (let i = startingI; i < dCards.length; i++) {
        this.deck.drawCard(dCards[i]);
    }
    this.dealerHiddenCard = 0;
}

function validadeDealer1Draw(card, draw) {
    let ishiddenCardHidden = (this.dealerHiddenCard === 0 || this.dealerHiddenCard === draw);
    let isDrawValid = (card + draw !== 11) || (card !== Cards.ACE && draw !== Cards.ACE);

    return ishiddenCardHidden && isDrawValid;
}

function drawCards() {
    let decks = new Array(maxDraws);
    let usedCards = new Array(maxDraws);
    let uCards = new UsedCards();
    let cardsLeft = this.deck.getTCards();
    let dHand;
    let pHand = new Array(maxDrawsByPlayer);

    if (cardsLeft < maxDraws) { // Will need new deck/usedCards
        for (let i = 0; i < cardsLeft; i++) {
            decks[i] = this.deck;
            usedCards[i] = uCards;
        }
        let otherDeck = new Deck();
        let otherUsedCards = new UsedCards();
        for (let i = cardsLeft; i < maxDraws; i++) {
            decks[i] = otherDeck;
            usedCards[i] = otherUsedCards;
        }
    } else {                    // Won't need new deck/usedCards
        for (let i = 0; i < maxDraws; i++) {
            decks[i] = this.deck;
            usedCards[i] = uCards;
        }
    }
    

    let i = [1, 1, 1, 1];
    while (i[0] <= Cards.TEN) { // misteryCard - playerDraw0
        if (decks[0].getCard(i[0]) - usedCards[0].getUsed(i[0])) {
            if (validadeDealer1Draw(this.dealerHand.getCards()[0], i[0])) {
                dHand = new Hand(this.dealerHand.getCards());
                if (this.dealerHiddenCard === 0) {
                    dHand.addCard(i[0]);
                    usedCards[0].useCard(i[0]);
                }
                drawDealerCards(decks, usedCards, dHand, this.playerHand, 1);
                while (i[1] <= Cards.TEN) { // playerDraw1
                    if (decks[1].getCard(i[1]) - usedCards[1].getUsed(i[1])) {
                        pHand[0] = new Hand(this.playerHand.getCards());
                        pHand[0].addCard(i[1]);
                        usedCards[1].useCard(i[1]);
                        drawDealerCards(decks, usedCards, dHand, pHand[0], 2);
                        if (pHand[0].getValue() < blackJack) {
                            while (i[2] <= Cards.TEN) { // playerDraw2
                                if (decks[2].getCard(i[2]) - usedCards[2].getUsed(i[2])) {
                                    pHand[1] = new Hand(pHand[0].getCards());
                                    pHand[1].addCard(i[2]);
                                    usedCards[2].useCard(i[2])
                                    drawDealerCards(decks, usedCards, dHand, pHand[1], 3);
                                    if (pHand[1].getValue() < blackJack) {
                                        while (i[3] <= Cards.TEN) { // playerDraw3
                                            if (decks[3].getCard(i[3]) - usedCards[3].getUsed(i[3])) {
                                                pHand[2] = new Hand(pHand[1].getCards());
                                                pHand[2].addCard(i[3]);
                                                usedCards[3].useCard(i[3]);
                                                drawDealerCards(decks, usedCards, dHand, pHand[2], 4);
                                                usedCards[3].unuseCard(i[3]);
                                            }
                                            i[3]++;
                                        }
                                        i[3] = 1;
                                    }
                                    usedCards[2].unuseCard(i[2]);
                                }
                                i[2]++;
                            }
                            i[2] = 1;
                        }
                        usedCards[1].unuseCard(i[1]);
                    }
                    i[1]++;
                }
                i[1] = 1;
                if (this.dealerHiddenCard === 0) {
                    usedCards[0].unuseCard(i[0]);
                }
            }
        }
        i[0]++;
    }
}

function drawDealerCards(decks, usedCards, dealerHand, playerHand, d) { // d = diff, delta, etc
    let i = [1, 1, 1];
    let dHand = new Array(maxDrawsByDealer);

    if (playerHand.getValue() > blackJack) {
        registerPossibilities(dealerHand, playerHand, decks, usedCards, d - 1);
    } else {
        if (dealerHand.getValue() < dealerMinValue) {
            while (i[0] <= Cards.TEN) { // dealerDraw1
                if (decks[0 + d].getCard(i[0]) - usedCards[0 + d].getUsed(i[0])) {
                    dHand[0] = new Hand(dealerHand.getCards());
                    dHand[0].addCard(i[0]);
                    usedCards[0 + d].useCard(i[0]);
                    if (dHand[0].getValue() < dealerMinValue) {
                        while (i[1] <= Cards.TEN) { // dealerDraw2
                            if (decks[1 + d].getCard(i[1]) - usedCards[1 + d].getUsed(i[1])) {
                                dHand[1] = new Hand(dHand[0].getCards());
                                dHand[1].addCard(i[1]);
                                usedCards[1 + d].useCard(i[1]);
                                if (dHand[1].getValue() < dealerMinValue) {
                                    while (i[2] <= Cards.TEN) { // dealerDraw3
                                        if (decks[2 + d].getCard(i[2]) - usedCards[2 + d].getUsed(i[2])) {
                                            dHand[2] = new Hand(dHand[1].getCards());
                                            dHand[2].addCard(i[2]);
                                            usedCards[2 + d].useCard(i[2]);
                                            registerPossibilities(dHand[2], playerHand, decks, usedCards, d - 1);
                                            usedCards[2 + d].unuseCard(i[2]);
                                        }
                                        i[2]++;
                                    }
                                    i[2] = 1;
                                } else {
                                    registerPossibilities(dHand[1], playerHand, decks, usedCards, d - 1);
                                }
                                usedCards[1 + d].unuseCard(i[1]);
                            }
                            i[1]++;
                        }
                        i[1] = 1;
                    } else {
                        registerPossibilities(dHand[0], playerHand, decks, usedCards, d - 1);
                    }
                    usedCards[0 + d].unuseCard(i[0]);
                }
                i[0]++;
            }
        } else {
            registerPossibilities(dealerHand, playerHand, decks, usedCards, d - 1);
        }
    }
}

function calculatePossibilities(nDeck, nUsed) {
    let mult = 1;
    for (let i = nDeck; i > (nDeck - nUsed); i--) {
        mult *= i;
    }
    return mult;
}

function adjustNotDrawnPossibilities(decks, usedCards, nCardsDrawnPlayer, nCardsDrawnDealer) {
    let mult = 1;
    // nCardsDrawnDealer -= this.dealerHiddenCard === 0 ? 0 : 1;
    const startingI = hiddenCards + nCardsDrawnPlayer + nCardsDrawnDealer;
    let multiplier = decks[startingI - 1].getTCards() - usedCards[startingI - 1].getTUsed() + 1; // + 1 for if the first deck is the same as the previous
    
    for (let i = startingI; i < startingI + (maxDrawsByDealer - nCardsDrawnDealer); i++) {
        if (decks[i] !== decks[i - 1]) {
            multiplier = decks[i].getTCards() - usedCards[i].getTUsed() + 1;
        } else {
            multiplier--;
        }
        mult *= multiplier;
    }
    return mult;
}

function registerPossibilities(dHand, pHand, decks, usedCards, playerDraws) {
    let cards = [Object.keys(usedCards[0].cards), Object.keys(usedCards[maxDraws - 1].cards)];
    let poss = 1;
    let dealerDraws = dHand.getCards().length - 2;
    
    cards[0].forEach((card) => {
        poss *= calculatePossibilities(decks[0].getCard(card), usedCards[0].getUsed(card));
    });

    if (decks[0] !== decks[maxDraws - 1]) {
        cards[1].forEach((card) => {
            poss *= calculatePossibilities(decks[maxDraws - 1].getCard(card), usedCards[maxDraws - 1].getUsed(card));
        });
    }
    poss *= adjustNotDrawnPossibilities(decks, usedCards, playerDraws, dealerDraws);


    if (pHand.getValue() > blackJack) {
        this.possibilities[playerDraws].bust(poss);
    } else if (dHand.getValue() > blackJack) {
        this.possibilities[playerDraws].dealerBust(poss);
        
    } else if (dHand.getValue() < dealerMinValue) {
        this.possibilities[playerDraws].unsolve(poss);
    } else if (pHand.getValue() > dHand.getValue()) {
        this.possibilities[playerDraws].win(poss);
    } else if (pHand.getValue() === dHand.getValue()) {
        this.possibilities[playerDraws].tie(poss);
    } else {
        this.possibilities[playerDraws].lose(poss);
    }
}

function registerProbabilities() {
    const total = [this.possibilities[0].getTotal(), this.possibilities[1].getTotal(), this.possibilities[2].getTotal(), this.possibilities[3].getTotal()];

    for (let i = 0; i <= maxDrawsByPlayer; i++) {
        if (total[i] !== 0) {
            this.probabilities[i].bust(this.possibilities[i].getBusts() / total[i]);
            this.probabilities[i].win(this.possibilities[i].getWins() / total[i]);
            this.probabilities[i].tie(this.possibilities[i].getTies() / total[i]);
            this.probabilities[i].unsolve(this.possibilities[i].getUnsolveds() / total[i]);
            this.probabilities[i].lose(this.possibilities[i].getLosts() / total[i]);
            this.probabilities[i].dealerBust(this.possibilities[i].getDealerBusts() / total[i]);
        }
    }
}

function formatPercentage(probability) {
    let prob = (100 * probability).toFixed(2);
    return prob < 10 ? ` ${prob}%` : `${prob}%`;
}

function drawStatsTables() {
    let probabilities = new Array(4);
    const simulationsTable = document.getElementById('simulationsTableBody');
    const ramainingTable = document.getElementById('remainingTableBody');
    for (let i = 0; i <= maxDrawsByPlayer; i++) {
        probabilities[i] = new Array(9);
        probabilities[i][0] = formatPercentage(this.probabilities[i].getDealerBusts());
        probabilities[i][1] = formatPercentage(this.probabilities[i].getWins());
        probabilities[i][2] = formatPercentage(this.probabilities[i].getTies());
        probabilities[i][3] = formatPercentage(this.probabilities[i].getUnsolveds());
        probabilities[i][4] = formatPercentage(this.probabilities[i].getLosts());
        probabilities[i][5] = formatPercentage(this.probabilities[i].getBusts());
        probabilities[i][6] = '';
        probabilities[i][7] = formatPercentage(this.probabilities[i].getDealerBusts() + this.probabilities[i].getWins());
        probabilities[i][8] = formatPercentage(this.probabilities[i].getBusts() + this.probabilities[i].getLosts());
    }

    const rows = ['Dealer Bust', 'Win', 'Tie', 'Unsolved', 'Lost', 'Bust', '', 'T Win', 'T Lost'];
    let tableContent = "";

    for (let i = 0; i < rows.length; i++) {
        tableContent += `<tr><td class="simulationsTableItem">${rows[i]}</td>`;
        for (let j = 0; j <= maxDrawsByPlayer; j++) {
            tableContent += `<td class="simulationsTableItem">${probabilities[j][i]}</td>`
        }
        tableContent += '</tr>';
    }



    simulationsTable.innerHTML = tableContent;
    tableContent = '';

    for (let i = Cards.ACE; i <= Cards.TEN; i++) {
        let remaining = getRemainingFromCard(i);
        let totalRemaining = formatPercentage(remaining / (this.deck.getTCards() - this.usedCards.getTUsed()));
        tableContent += `<tr>
                            <td class="remainingTableFRow">${i}</td><td class="remainingTableCRow">${remaining}</td><td class="remainingTableCRow">${totalRemaining}</td>
                        </tr>`
    }
    ramainingTable.innerHTML = tableContent;
}

function drawCard(card) {
    this.deck.drawCard(card);
}

function onNewGameButtonClick() {
    advanceState(States.INITIAL_SELECT);
    this.usedCards = new UsedCards();
    this.playerHand = new Hand([]);
    this.dealerHand = new Hand([]);
    this.pDraftHand = new Hand([]);
    this.dDraftHand = new Hand([]);
    this.dealerHiddenCard = 0;
    drawGameTable();
}

function onSelectCard(card) {
    this.usedCards.useCard(card);
    switch (this.state) {
        case States.INITIAL_SELECT:
            if (this.pDraftHand.getCards().length < baseRoundPlayerCards) {
                this.pDraftHand.addCard(card);
            } else {
                this.dDraftHand.addCard(card);
            }
            if (this.pDraftHand.getCards().length + this.dDraftHand.getCards().length >= baseRoundCards) {
                advanceState(States.CONFIRMATION);
            }
            break;
        case States.PLAYER_SELECT:
            this.pDraftHand.addCard(card);
            advanceState(States.CONFIRMATION);
            break;
        case States.DEALER_SELECT:
            this.dDraftHand.addCard(card);
            if (this.playerHand.getValue() > blackJack && this.dDraftHand.getCards().length > baseRoundDealerCards) {
                advanceState(States.CONFIRMATION);
            } else if (this.playerHand.getValue() === blackJack && this.playerHand.getCards().length === baseRoundPlayerCards) {
                advanceState(States.CONFIRMATION);
            } else if (this.dDraftHand.getValue() >= dealerMinValue) {
                advanceState(States.CONFIRMATION);
            }
            break;
    }
    drawGameTable();
}

function onUnselectCard(hand, pos) {
    if (hand !== null && hand !== undefined) {
        if (hand === Hands.PLAYER) {
            this.usedCards.unuseCard(pDraftHand.getCards()[pos]);
            this.pDraftHand.getCards().splice(pos, 1);
            this.pDraftHand = new Hand(this.pDraftHand.getCards());
        } else {
            this.usedCards.unuseCard(dDraftHand.getCards()[pos]);
            this.dDraftHand.getCards().splice(pos, 1);
            this.dDraftHand = new Hand(this.dDraftHand.getCards());
        }
        if (this.state === States.CONFIRMATION) {
            advanceState(this.previousState);
        }
        if (this.state === States.DEALER_SELECT && this.dDraftHand.getValue() >= dealerMinValue) {
            advanceState(States.CONFIRMATION);
        }
        drawGameTable();
    }
}

function onConfirmButtonClick() {
    switch (this.previousState) {
        case States.INITIAL_SELECT:
            this.playerHand = new Hand(this.pDraftHand.getCards());
            this.dealerHand = new Hand(this.dDraftHand.getCards());
            startRound(this.playerHand.getCards(), this.dealerHand.getCards());
            if (this.playerHand.getValue() < blackJack) {
                advanceState(States.DECISION);
                this.usedCards = new UsedCards();
            } else {
                advanceState(States.DEALER_SELECT);
                this.usedCards = new UsedCards();
            }
            break;
        case States.PLAYER_SELECT:
            this.playerHand = new Hand(this.pDraftHand.getCards());
            hitOnRound();
            if (this.playerHand.getValue () < blackJack) {
                advanceState(States.DECISION);
            } else {
                advanceState(States.DEALER_SELECT);
            }
            if (this.playerHand.getValue() > blackJack && this.dealerHand.getCards().length > baseRoundDealerCards) {
                advanceState(States.PLAYER_SELECT);
                advanceState(States.GAME_START);
            }
            this.usedCards = new UsedCards();
            break;
        case States.DEALER_SELECT:
            for (let i = this.dealerHand.getCards().length; i < this.dDraftHand.getCards().length; i++) {
                this.deck.drawCard(this.dDraftHand.getCards()[i]);
            }
            this.dealerHand = new Hand(this.dDraftHand.getCards());
            this.probabilities = [new PossibleResult(), new PossibleResult(), new PossibleResult(), new PossibleResult()];
            advanceState(States.GAME_START);
            this.usedCards = new UsedCards();
            break;
    }
    drawGameTable();
}

function onHitButtonClick() {
    advanceState(States.PLAYER_SELECT);
    this.usedCards = new UsedCards();
    drawGameTable();
}

function onStandButtonClick() {
    if (this.dealerHand.getValue() < dealerMinValue) {
        advanceState(States.DEALER_SELECT);
    } else {
        advanceState(States.GAME_START);
    }
    this.usedCards = new UsedCards();
    drawGameTable();
}

function getRemainingFromCard(card) {
    return this.deck.getCard(card) - this.usedCards.getUsed(card);
}

function drawGameTable() {
    const center = document.getElementsByClassName('center');
    const table = document.getElementById('gameTableCenter');
    const cardSelector = document.getElementById('cardSelector');
    const bigAce = document.getElementById('bigAce');
    const gameCards = document.getElementById('gameCards');
    const tableWidth = table.offsetWidth;
    table.style.height = `${tableWidth*2/5 + 52.86}px`;
    const tableHeight = table.offsetHeight;
    const centerWidth = center[0].clientWidth;
    const centerHeight = center[0].clientHeight;
    
    const cardSelectorHeight = centerHeight - (tableHeight + 60)
    cardSelector.style.height = `${cardSelectorHeight}px`;


    if (this.state === States.GAME_START) {
        gameCards.style.display = 'none';
        bigAce.style.display = 'block';
        displayStartGameButton(centerWidth, cardSelectorHeight);
    } else {
        bigAce.style.display = 'none';
        gameCards.style.display = 'block';
        fillGameTable(tableWidth);
    }

    if (this.state === States.INITIAL_SELECT || this.state === States.PLAYER_SELECT || this.state === States.DEALER_SELECT) {
        displayCardSelector(centerWidth / 11);
    }
    if (this.state === States.DECISION) {
        displayHitStandButtons(centerWidth, cardSelectorHeight);
    }
    if (this.state === States.CONFIRMATION) {
        displayConfirmButton(centerWidth, cardSelectorHeight);
    }
    drawStatsTables();
}

function getCardHTMLByContainerWidth(num, width, inTable, draft, hand, pos) {
    const cardWidth = width/1.42;
    const containerWidth = cardWidth * 1.2;
    const containerMargin = (width - containerWidth)/2;
    const containerPadding = cardWidth / 10;
    const containerHeight = (cardWidth * 1.25);
    // const active = getRemainingFromCard(num) > 0;

    let a = (1.67 * width/1.42) + width * 0.22/1.42;

    // const onclick = active ? (inTable ? (draft ? `onclick="onUnselectCard(${hand}, ${pos})"` : '') : `onclick="onSelectCard(${num})"`) : (draft ? `onclick="onUnselectCard(${hand}, ${pos})"` : '');
    const onclick = inTable ? (draft ? `onclick="onUnselectCard(${hand}, ${pos})"` : '') : `onclick="onSelectCard(${num})"`;

    return `<div class="cardContainer ${ inTable ? (draft ? 'draft' : '') : 'inSelector' }" height="${containerHeight}px" width="${containerWidth}px" style="padding: ${containerPadding}px; margin: 0px ${containerMargin}px;" ${onclick}>
                <img width="${cardWidth}px" src="../img/cards/${num}.png">
            </div>`
}

function displayCardSelector(width) {
    const cardSelector = document.getElementById('cardSelector');

    let content = "";
    for (let i = Cards.ACE; i <= Cards.TEN; i++) {
        content += getCardHTMLByContainerWidth(i, width, false, false);
    }
    
    cardSelector.style.paddingLeft = `${width / 2}px`;
    cardSelector.style.paddingTop = `${ (cardSelector.offsetHeight - (width * 1.67/1.42)) / 2}px`;
    cardSelector.innerHTML = content;
}

function displayStartGameButton(width, height) {
    const cardSelector = document.getElementById('cardSelector');

    cardSelector.style.paddingLeft = `${(width - btnWidth)/2}px`;
    cardSelector.style.paddingTop = `${(height - btnHeight)/2}px`;
    cardSelector.innerHTML = `<button type="button" class="btn btn-primary btn-lg" onclick="onNewGameButtonClick()">New Game</button>`;
}

function displayHitStandButtons(width, height) {
    const cardSelector = document.getElementById('cardSelector');
    const padding = 40;

    let content = '';
    content += `<div style="padding-right: ${padding}px; float: left;"><button type="button" class="btn btn-primary btn-lg" onclick="onHitButtonClick()">Hit</button></div>`;
    content += `<div style="padding-left: ${padding}px; float: left;"><button type="button" class="btn btn-success btn-lg" onclick="onStandButtonClick()">Stand</button></div>`;

    cardSelector.style.paddingLeft = `${width/2 - (btnWidth + padding)}px`;
    cardSelector.style.paddingTop = `${(height - btnHeight)/2}px`;
    cardSelector.innerHTML = content;
}

function displayConfirmButton(width, height) {
    const cardSelector = document.getElementById('cardSelector');

    cardSelector.style.paddingLeft = `${(width - btnWidth)/2}px`;
    cardSelector.style.paddingTop = `${(height - btnHeight)/2}px`;
    cardSelector.innerHTML = `<button type="button" class="btn btn-primary btn-lg" onclick="onConfirmButtonClick()">Confirm</button>`;
}

function fillGameTable(width) {
    const cardWidth = width / 8;
    const hands = [
        {
            cards: Array.from(this.pDraftHand.getCards()),
            soft: this.pDraftHand.getSoft(),
            value: this.pDraftHand.getValue(),
            locked: this.playerHand.getCards().length,
            div: document.getElementById('playerHand'),
            valueDiv: document.getElementById('playerHandValue'),
            content: ''
        },
        {
            cards: Array.from(this.dDraftHand.getCards()),
            soft: this.dDraftHand.getSoft(),
            value: this.dDraftHand.getValue(),
            locked: this.dealerHand.getCards().length,
            div: document.getElementById('dealerHand'),
            valueDiv: document.getElementById('dealerHandValue'),
            content: ''
        }
    ]

    switch (this.state) {
        case States.INITIAL_SELECT:
            while (hands[0].cards.length < baseRoundPlayerCards) {
                hands[0].cards.push('empty');
            }
            if (hands[1].cards.length < baseRoundDealerCards) {
                hands[1].cards.push('empty');
            }
            if (hands[1].cards.length <= baseRoundDealerCards) {
                hands[1].cards.push('hidden');
            }
            break;
        case States.CONFIRMATION:
            switch (this.previousState) {
                case States.INITIAL_SELECT:
                    if (hands[1].cards.length <= baseRoundDealerCards) {
                        hands[1].cards.push('hidden');
                    }
                    break;
                case States.DECISION:
                    if (hands[1].cards.length <= baseRoundDealerCards) {
                        hands[1].cards.push('hidden');
                    }
                    break;
                case States.PLAYER_SELECT:
                    if (hands[1].cards.length <= baseRoundDealerCards) {
                        hands[1].cards.push('hidden');
                    }
                    break;
            }
            break;
        case States.DECISION:
            if (hands[1].cards.length <= baseRoundDealerCards) {
                hands[1].cards.push('hidden');
            }
            break;
        case States.PLAYER_SELECT:
            if (this.pDraftHand.getCards().length === this.playerHand.getCards().length) {
                hands[0].cards.push('empty');
            }
            if (hands[1].cards.length <= baseRoundDealerCards) {
                hands[1].cards.push('hidden');
            }
            break;
        case States.DEALER_SELECT:
            if (this.dDraftHand.getValue() < 17) {
                hands[1].cards.push('empty');
            }
            break;
    }

    const cardCount = Math.max(hands[0].cards.length, hands[1].cards.length);
    const offset = cardCount > 6 ? 0 : cardCount > 5 ? 0.5 : 1;

    for (let i = 0; i < hands.length; i++) {
        for (let j = 0; j < hands[i].cards.length; j++) {
            let draft = j >= hands[i].locked && hands[i].cards[j] !== 'empty' && hands[i].cards[j] !== 'hidden';
            hands[i].content += getCardHTMLByContainerWidth(hands[i].cards[j], cardWidth, true, draft, i, j);
        }

        hands[i].div.innerHTML = hands[i].content;
        hands[i].valueDiv.innerHTML = `<label>Value: ${hands[i].value} ${hands[i].soft ? 'S' : ''}</label>`;
        hands[i].div.style.height = `${cardWidth * 8/5}px`;
        hands[i].div.style.paddingTop = `${cardWidth * 2/5}px`;
        hands[i].div.style.marginLeft = `${cardWidth * (offset + 1/2)}px`;
        hands[i].valueDiv.style.paddingLeft = `${cardWidth * (offset + 3/4)}px`;
    }
}

function onKeyPress(key) {
    if (!this.isKeyPressed) {
        this.isKeyPressed = true;

        if (/^\d$/.test(key)) {
            if (this.state === States.INITIAL_SELECT || this.state === States.PLAYER_SELECT || this.state === States.DEALER_SELECT) {
                if (key === '0') {
                    key = '10';
                }
                onSelectCard(Number(key));
            }
            this.isKeyPressed = false;
        } else {
            switch (key) {
                case 'n': case 'N': case 'g': case 'G':
                    if (this.state === States.GAME_START) {
                        onNewGameButtonClick();
                    }
                    break;
                case 'b': case 'B':
                    if ((((this.previousState === States.DECISION || this.previousState === States.CONFIRMATION) && (this.state === States.PLAYER_SELECT || this.state === States.DEALER_SELECT)) || (this.state === States.CONFIRMATION && this.previousState !== States.INITIAL_SELECT)) && this.pDraftHand.getValue() < blackJack) {
                        this.pDraftHand = new Hand(this.playerHand.getCards());
                        this.dDraftHand = new Hand(this.dealerHand.getCards());
                        this.usedCards = new UsedCards();
                        advanceState(States.DECISION);
                        console.log('back');
                    }
                    break;
                case 'Backspace': case 'Delete':
                    switch (this.state) {
                        case States.CONFIRMATION:
                            advanceState(this.previousState);
                        case States.INITIAL_SELECT: case States.PLAYER_SELECT: case States.DEALER_SELECT:
                            let dCards = this.dDraftHand.getCards();
                            let pCards = this.pDraftHand.getCards();    
                            if (this.dealerHand.getCards().length < dCards.length) {
                                this.usedCards.unuseCard(dCards.pop());
                                this.dDraftHand = new Hand(dCards);
                            } else if (this.playerHand.getCards().length < this.pDraftHand.getCards().length) {
                                this.usedCards.unuseCard(pCards.pop());
                                this.pDraftHand = new Hand(pCards);
                            }
                        
                        break;
                    }
                    break;
                case 'c': case 'C':
                    if (this.state === States.CONFIRMATION) {
                        onConfirmButtonClick();
                    }
                    break;
                case 'h': case 'H':
                    if (this.state === States.DECISION) {
                        onHitButtonClick();
                    }
                    break;
                case 's': case 'S':
                    if (this.state === States.DECISION) {
                        onStandButtonClick();
                    }
                    break;
                case 'Enter':
                    if (this.state === States.CONFIRMATION) {
                        onConfirmButtonClick();
                    } else if (this.state === States.GAME_START) {
                        onNewGameButtonClick();
                    }
                    break;
            }
            drawGameTable();
            this.isKeyPressed = false;
        }
    }
}