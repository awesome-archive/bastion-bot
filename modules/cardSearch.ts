import * as Eris from "eris";
import { Card } from "ygopro-data/dist/Card";
import { bot } from "./bot";
import { data } from "./data";

export function cardSearch(msg: Eris.Message): void {
    const baseRegex = /{(.+)}/g;
    const baseResult = baseRegex.exec(msg.content);
    if (baseResult) {
        baseResult.forEach(async (res, i) => {
            // ignore full match
            if (i > 0) {
                const card = await data.getCard(res, "en");
                if (card) {
                    bot.createMessage(msg.channel.id, generateCardProfile(card));
                }
            }
        });
    }

    /*const imageRegex = /<(.+)>/g;
    const imageResult = imageRegex.exec(msg.content);
    if (imageResult) {
        imageResult.forEach(async (res, i) => {
            // ignore full match
            if (i > 0) {
                const card = await data.getCard(res, "en");
                if (card) {
                    bot.createMessage(msg.channel.id, generateCardProfile(card, true));
                }
            }
        });
    }*/

    const mobileRegex = /\[(.+)\]/g;
    const mobileResult = mobileRegex.exec(msg.content);
    if (mobileResult) {
        mobileResult.forEach(async (res, i) => {
            // ignore full match
            if (i > 0) {
                const card = await data.getCard(res, "en");
                if (card) {
                    bot.createMessage(msg.channel.id, generateCardProfile(card, true));
                }
            }
        });
    }
}

function generateCardProfile(card: Card, mobile: boolean = false): Eris.MessageContent {
    let stats: string = "";
    if (card.setNames.length > 0) {
        stats += "**Archetype**: " + card.setNames.join(", ");
    }
    stats += "\n";
    let type = "**Type**: " + card.typeNames.join("/");
    if (card.raceNames.length > 0) {
        type = type.replace("Monster", card.raceNames.join("|"));
    }
    stats += type;
    if (card.attributeNames.length > 0) {
        stats += " **Attribute**: " + card.attributeNames.join("|");
    }
    stats += "\n";
    if (card.typeNames.includes("Monster")) {
        stats += "**Level**: " + card.level + " **ATK**: " + card.atk + " **DEF**: " + card.def + "\n";
    }

    if (mobile) {
        const outString =
            "__**" + card.name + "**__\n**ID**: " + card.code + "\n" + stats + "**Card Text**:\n" + card.desc_m;
        return outString;
    }
    const outEmbed: Eris.MessageContent = {
        embed: {
            description: stats,
            fields: [
                {
                    name: "Card Text",
                    value: card.desc_m
                }
            ],
            footer: { text: card.code.toString() },
            title: card.name
        }
    };
    return outEmbed;
}