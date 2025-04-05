const max = 100;
const baseBet = 100;
const ratio = 1.5;

const Mults = Object.freeze({
    0: 1,
    1: 1,
    2: 1,
    3: 15,
});

const Probs = Object.freeze({
    0: 0.48,
    1: 0.49,
    2: 0.5,
    3: 0.51,
});

function moneyFromRound(constWins, constLosses, d) {
    return baseBet * (Math.abs(d - Probs[constWins]) * 100) * Mults[constWins];
}

function moneyFromRoundLosing(constWins, constLosses, d) {
    return (baseBet * (ratio === 0 ? 1 : ratio ** constLosses)) * (Math.abs(d - Probs[constWins]) * 100) * Mults[constWins];;
}

function doThing(win, constWins, constLosses, n) {
    let money = 0;
    if (constWins === 0) {
        if (win) {
            money += moneyFromRoundLosing(constWins, constLosses, 0);
            constWins++;
            constLosses = 0;
        } else {
            money -= moneyFromRound(constWins, constLosses, 1);
            constLosses++;
        }
    } else if (constWins === 1) {
        if (win) {
            money += moneyFromRound(constWins, constLosses, 0);
            constWins++;
        } else {
            money -= moneyFromRound(constWins, constLosses, 1);
            constWins = 0;
            constLosses++;
        }
    } else if (constWins === 2) {
        if (win) {
            money += moneyFromRound(constWins, constLosses, 0);
            constWins++;
        } else {
            money -= moneyFromRound(constWins, constLosses, 1);
            constWins = 0;
            constLosses++;
        }
    } else if (constWins === 3) {
        if (win) {
            money += moneyFromRound(constWins, constLosses, 0);
        } else {
            money -= moneyFromRound(constWins, constLosses, 1);
            constWins = 0;
            constLosses++;
        }
    }
    n--;
    if (n === 0) {
        return money;
    } else {
        return money * 2 + doThing(true, constWins, constLosses, n) + doThing(false, constWins, constLosses, n);
    }
}
console.log(doThing(true, 0, 0, 10) + doThing(false, 0, 0, 10));

// doThing(true, 0, 0, 2);
// doThing(false, 0, 0, 2);

let prob = 48;
let constWins = 0;
let constLosses = 0;
let money = 0;
// this.prob = 0;
for (let a = 0; a < 2; a++) {
    constWins = 0;
    if (a) {
        // money += baseBet * Probs[constWins] * Mults[constWins] * 100;
        constWins += 1;
    } else {
        // money -= baseBet * (1 - Probs[constWins]) * Mults[constWins] * 100;
        constWins = 0;
    }
    for (let b = 0; b < 2; b++) {
        if (b) {
            money += baseBet * Probs[constWins] * Mults[constWins] * 100;
            constWins++;
        } else {
            money -= baseBet * (1 - Probs[constWins]) * Mults[constWins] * 100;
            constWins = 0;
        }
        // for (let c = 0; c < 2; c++) {
        //     for (let d = 0; d < 2; d++) {
        //         for (let e = 0; e < 2; e++) {
        //             for (let f = 0; f < 2; f++) {
    
        //             }
        //         }
        //     }
        // }
    }
}