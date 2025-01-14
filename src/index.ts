enum LandType {
    NonLand,
    Basic,
    Legendary,
    Vesuva,
    EchoingDeeps,
    CrumblingVestige,
    LotusField,
}

type Card = {
    cardType: LandType;
}

type ZoneInit = {
    count: number;
    landCount: number;
    legendaryCount: number;
    hasVesuva: boolean;
    hasEchoingDeeps: boolean;
    hasCrumblingVestige: boolean;
    hasLotusField: boolean;
}


type Zone = {
    cards: Card[];
}

type Game = {
    Deck: Zone,
    Graveyard: Zone,
    Battlefield: Zone,
    NantukoTriggers: number,
    FloatingMana: number,
    MaximumManaGenerated: number,
}

const shuffle = (deck: Zone): Zone => {
    // Shuffle the deck
    deck.cards.sort(() => Math.random() - 0.5);

    return deck;
}

function buildZone(zoneInit: ZoneInit) {
    let deck: Zone = {
        cards: [],
    };

    const nonLandCount = zoneInit.count - zoneInit.landCount;
    const legendaryCount = zoneInit.legendaryCount;
    const vesuvaCount = zoneInit.hasVesuva ? 1 : 0;
    const echoingDeepsCount = zoneInit.hasEchoingDeeps ? 1 : 0;
    const crumblingVestigeCount = zoneInit.hasCrumblingVestige ? 1 : 0;
    const lotusFieldCount = zoneInit.hasLotusField ? 1 : 0;
    const basicLandCount = zoneInit.landCount - (legendaryCount + vesuvaCount + echoingDeepsCount + crumblingVestigeCount + lotusFieldCount);

    for (let j = 0; j < nonLandCount; j++) {
        deck.cards.push({cardType: LandType.NonLand});
    }
    for (let j = 0; j < basicLandCount; j++) {
        deck.cards.push({cardType: LandType.Basic});
    }
    for (let j = 0; j < legendaryCount; j++) {
        deck.cards.push({cardType: LandType.Legendary});
    }
    for (let j = 0; j < vesuvaCount; j++) {
        deck.cards.push({cardType: LandType.Vesuva});
    }
    for (let j = 0; j < echoingDeepsCount; j++) {
        deck.cards.push({cardType: LandType.EchoingDeeps});
    }
    for (let j = 0; j < crumblingVestigeCount; j++) {
        deck.cards.push({cardType: LandType.CrumblingVestige});
    }
    for (let j = 0; j < lotusFieldCount; j++) {
        deck.cards.push({cardType: LandType.LotusField});
    }

    shuffle(deck);

    return deck;
}

const build = (deckInit: ZoneInit, graveyardInit: ZoneInit, battlefieldInit: ZoneInit, mana: number, nantukoTriggers: number): Game => {

    const Deck = buildZone(deckInit);

    const Graveyard = buildZone(graveyardInit);

    const Battlefield = buildZone(battlefieldInit);

    return {
        Deck,
        Graveyard,
        Battlefield,
        NantukoTriggers: nantukoTriggers,
        FloatingMana: mana,
        MaximumManaGenerated: mana,
    }
}

const loop = (game: Game): Game => {
    game.MaximumManaGenerated = Math.max(game.MaximumManaGenerated, game.FloatingMana);

    //Pop 4 cards from the deck into the Graveyard
    for (let i = 0; i < 4; i++) {
        //If the deck is empty, break
        if (game.Deck.cards.length < 1) {
            break;
        }
        game.Graveyard.cards.push(game.Deck.cards.pop()!);
    }
    //console.log('Yard after mill', game.Graveyard.cards);

    //Push all lands from the graveyard into a holding area
    //Increment nantuuko triggers for each land
    //Increment mana for each land
    const lands: Card[] = [];
    game.Graveyard.cards.forEach((card, i) => {
        if (card.cardType === LandType.NonLand) {
            return;
        }

        lands.push(card);
        game.NantukoTriggers++;
        game.FloatingMana++;
    });

    //Remove all lands from the graveyard
    game.Graveyard.cards = game.Graveyard.cards.filter(card => card.cardType === LandType.NonLand);


    //console.log('Lands in yard', lands);
    //console.log('Other cards in yard', game.Graveyard.cards);

    // Analyze the lands, it gets complicated here
    for (let i = 0; i < lands.length; i++) {
        // If the lands are echoing deeps, and another land in the holding area is legendary, put it back into the graveyard
        // If another land in the holding area is vesuva and there's a legendary land in the battlefield, put it into the graveyard
        // otherwise put it into the battlefield
        if (lands[i].cardType === LandType.EchoingDeeps) {
            if (lands.some(land => land.cardType === LandType.Legendary)) {
                game.Graveyard.cards.push(lands[i]);
            } else {
                if (lands.some(land => land.cardType === LandType.Vesuva) && game.Battlefield.cards.some(land => land.cardType === LandType.Legendary)) {
                    game.Graveyard.cards.push(lands[i]);
                } else {
                    game.Battlefield.cards.push(lands[i]);
                }
            }
        }

        // If the lands are basic or legendary, put them into the battlefield
        if (lands[i].cardType === LandType.Basic || lands[i].cardType === LandType.Legendary) {
            game.Battlefield.cards.push(lands[i]);
        }

        // If the lands are vesuva, check if there's a legendary land in the battlefield,
        // if so, put it into the graveyard, otherwise put it into the battlefield
        if (lands[i].cardType === LandType.Vesuva) {
            if (game.Battlefield.cards.some(land => land.cardType === LandType.Legendary)) {
                game.Graveyard.cards.push(lands[i]);
            } else {
                // If there's a Crumbling Vestige in the battlefield, we copy that instead and increment mana
                if (game.Battlefield.cards.some(land => land.cardType === LandType.CrumblingVestige)) {
                    game.FloatingMana++;
                }
                game.Battlefield.cards.push(lands[i]);
            }
        }

        // If the lands are crumbling vestige, put them on the battlefield and increment mana
        if (lands[i].cardType === LandType.CrumblingVestige) {
            game.Battlefield.cards.push(lands[i]);
            game.FloatingMana++;
        }

        // If the land is lotus field, put into the graveyard and pop 1 land from the battlefield into the graveyard
        if (lands[i].cardType === LandType.LotusField) {
            game.Graveyard.cards.push(lands[i]);

            // If there's at least 1 land in the battlefield, pop it into the graveyard
            for (let i = 0; i < game.Battlefield.cards.length; i++) {
                if (game.Battlefield.cards[i].cardType !== LandType.NonLand) {
                    game.Graveyard.cards.push(game.Battlefield.cards[i]);
                    game.Battlefield.cards.splice(i, 1);
                    break;
                }
            }
        }

    }
    return game;
}

const play = (game: Game): Game => {
    let loopCount = 0;
    while (game.Deck.cards.length > 0) {
        /*
        console.log('Looping with', [
            'Loop Count', loopCount,
            'Deck', game.Deck.cards.length,
            'Nantuko Triggers', game.NantukoTriggers,
            'Floating Mana', game.FloatingMana,
        ]);
        */
        loopCount++;
        if (game.NantukoTriggers < 1 || game.FloatingMana < 2) {
            //console.log('Game Over');
            break;
        }

        //Decrement nantuko triggers and mana
        game.NantukoTriggers--;
        game.FloatingMana = game.FloatingMana - 2;

        game = loop(game);

    }

    //console.log('Loop Count', loopCount);

    return game;
}

const isSuccessful = (game: Game): boolean => {
    return game.Deck.cards.length === 0;
}


//Lets start with a simple game
const battlefieldInit: ZoneInit = {
    count: 3,
    landCount: 3,
    legendaryCount: 0,
    hasVesuva: false,
    hasEchoingDeeps: false,
    hasCrumblingVestige: false,
    hasLotusField: false,
}
const graveyardInit: ZoneInit = {
    count: 0,
    landCount: 0,
    legendaryCount: 0,
    hasVesuva: false,
    hasEchoingDeeps: false,
    hasCrumblingVestige: false,
    hasLotusField: false,
}

const deckInit: ZoneInit = {
    count: 88,
    landCount: 44,
    legendaryCount: 5,
    hasVesuva: true,
    hasEchoingDeeps: true,
    hasCrumblingVestige: true,
    hasLotusField: true,
}

const nantukoTriggers = 1;
const floatingMana = 2;
const timesToLoop = 100000;
let successfulGames = 0;
let failedGamesOver5Mana = 0;

console.log('Playing', timesToLoop, 'games, with the following initial conditions');

console.log('Deck Init', deckInit);
console.log('Graveyard Init', graveyardInit);
console.log('Battlefield Init', battlefieldInit);


for (let i = 0; i < timesToLoop; i++) {
    const game = play(build(deckInit, graveyardInit, battlefieldInit, floatingMana, nantukoTriggers));
    if (isSuccessful(game)) {
        successfulGames++;
    } else {
        if (game.MaximumManaGenerated >= 5) {
            failedGamesOver5Mana++;
        }
    }
}

console.log('Successful Games', successfulGames, 'out of', timesToLoop);
console.log('Failed Games with over 5 mana', failedGamesOver5Mana, 'out of', timesToLoop);





