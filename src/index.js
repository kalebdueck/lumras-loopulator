"use strict";
var LandType;
(function (LandType) {
    LandType[LandType["NonLand"] = 0] = "NonLand";
    LandType[LandType["Basic"] = 1] = "Basic";
    LandType[LandType["Legendary"] = 2] = "Legendary";
    LandType[LandType["Vesuva"] = 3] = "Vesuva";
    LandType[LandType["EchoingDeeps"] = 4] = "EchoingDeeps";
    LandType[LandType["CrumblingVestige"] = 5] = "CrumblingVestige";
    LandType[LandType["LotusField"] = 6] = "LotusField";
})(LandType || (LandType = {}));
const shuffle = (deck) => {
    // Shuffle the deck
    deck.cards.sort(() => Math.random() - 0.5);
    return deck;
};
function buildZone(zoneInit) {
    let deck = {
        cards: [],
    };
    for (let i = 0; i < zoneInit.count; i++) {
        const nonLandCount = zoneInit.count - zoneInit.landCount;
        const legendaryCount = zoneInit.legendaryCount;
        const vesuvaCount = zoneInit.hasVesuva ? 1 : 0;
        const echoingDeepsCount = zoneInit.hasEchoingDeeps ? 1 : 0;
        const crumblingVestigeCount = zoneInit.hasCrumblingVestige ? 1 : 0;
        const lotusFieldCount = zoneInit.hasLotusField ? 1 : 0;
        const basicLandCount = zoneInit.landCount - (legendaryCount + vesuvaCount + echoingDeepsCount + crumblingVestigeCount + lotusFieldCount);
        for (let j = 0; j < nonLandCount; j++) {
            deck.cards.push({ cardType: LandType.NonLand });
        }
        for (let j = 0; j < basicLandCount; j++) {
            deck.cards.push({ cardType: LandType.Basic });
        }
        for (let j = 0; j < legendaryCount; j++) {
            deck.cards.push({ cardType: LandType.Legendary });
        }
        for (let j = 0; j < vesuvaCount; j++) {
            deck.cards.push({ cardType: LandType.Vesuva });
        }
        for (let j = 0; j < echoingDeepsCount; j++) {
            deck.cards.push({ cardType: LandType.EchoingDeeps });
        }
        for (let j = 0; j < crumblingVestigeCount; j++) {
            deck.cards.push({ cardType: LandType.CrumblingVestige });
        }
        for (let j = 0; j < lotusFieldCount; j++) {
            deck.cards.push({ cardType: LandType.LotusField });
        }
    }
    shuffle(deck);
    return deck;
}
const build = (deckInit, graveyardInit, battlefieldInit, mana) => {
    const Deck = buildZone(deckInit);
    const Graveyard = buildZone(graveyardInit);
    const Battlefield = buildZone(battlefieldInit);
    return {
        Deck,
        Graveyard,
        Battlefield,
        NantukoTriggers: 0,
        FloatingMana: mana,
    };
};
const loop = (game) => {
    //Pop 4 cards from the deck into the Graveyard
    for (let i = 0; i < 4; i++) {
        //If the deck is empty, break
        if (game.Deck.cards.length < 1) {
            break;
        }
        game.Graveyard.cards.push(game.Deck.cards.pop());
    }
    //Pop all lands from the graveyard into a holding area
    //Increment nantuuko triggers for each land
    //Increment mana for each land
    const lands = [];
    while (game.Graveyard.cards[game.Graveyard.cards.length - 1].cardType !== LandType.NonLand) {
        lands.push(game.Graveyard.cards.pop());
        game.NantukoTriggers++;
        game.FloatingMana++;
    }
    // Analyze the lands, it gets complicated here
    for (let i = 0; i < lands.length; i++) {
        // If the lands are echoing deeps, and another land in the holding area is legendary, put it back into the graveyard
        // If another land in the holding area is vesuva and there's a legendary land in the battlefield, put it into the graveyard
        // otherwise put it into the battlefield
        if (lands[i].cardType === LandType.EchoingDeeps) {
            if (lands.some(land => land.cardType === LandType.Legendary)) {
                game.Graveyard.cards.push(lands[i]);
            }
            else {
                if (lands.some(land => land.cardType === LandType.Vesuva) && game.Battlefield.cards.some(land => land.cardType === LandType.Legendary)) {
                    game.Graveyard.cards.push(lands[i]);
                }
                else {
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
            }
            else {
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
            if (game.Battlefield.cards.some(land => land.cardType !== LandType.NonLand)) {
                game.Graveyard.cards.push(game.Battlefield.cards.pop());
            }
        }
    }
    return game;
};
const play = (game) => {
    while (game.Deck.cards.length > 0) {
        if (game.NantukoTriggers < 1 || game.FloatingMana < 2) {
            return game;
        }
        game = loop(game);
    }
    return game;
};
//Lets start with a simple game
const battlefieldInit = {
    count: 3,
    landCount: 3,
    legendaryCount: 0,
    hasVesuva: false,
    hasEchoingDeeps: false,
    hasCrumblingVestige: false,
    hasLotusField: false,
};
const graveyardInit = {
    count: 0,
    landCount: 0,
    legendaryCount: 0,
    hasVesuva: false,
    hasEchoingDeeps: false,
    hasCrumblingVestige: false,
    hasLotusField: false,
};
const deckInit = {
    count: 88,
    landCount: 44,
    legendaryCount: 0,
    hasVesuva: true,
    hasEchoingDeeps: true,
    hasCrumblingVestige: true,
    hasLotusField: true,
};
const game = play(build(deckInit, graveyardInit, battlefieldInit, 0));
console.log(game);
