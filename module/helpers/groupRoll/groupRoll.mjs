import { FabulaUltimaGroupRollRequestor } from "./groupRoll.requestor.mjs";
import { FabulaUltimaGroupRollRoller } from "./groupRoll.roller.mjs";

export class FabulaUltimaGroupRoll {
    static MSG_ID = "system.fabulaultima.grouproll";

    static fromUuid(uuid) {
        let parts = uuid.split(".");
        let doc;

        if (parts.length === 1) return game.actors.get(uuid);
        // Compendium Documents
        if (parts[0] === "Compendium") {
            return undefined;
        }

        // World Documents
        else {
            const [docName, docId] = parts.slice(0, 2);
            parts = parts.slice(2);
            const collection = CONFIG[docName].collection.instance;
            doc = collection.get(docId);
        }

        // Embedded Documents
        while (parts.length > 1) {
            const [embeddedName, embeddedId] = parts.slice(0, 2);
            doc = doc.getEmbeddedDocument(embeddedName, embeddedId);
            parts = parts.slice(2);
        }
        if (doc.actor) doc = doc.actor;
        return doc || undefined;
    }

    static getSceneControlButtons(buttons) {
        let tokenButton = buttons.find(b => b.name == "token")

        if (tokenButton) {
            tokenButton.tools.push({
                name: "fu-group-roll",
                title: game.i18n.localize('FABULAULTIMA.GroupRoll'),
                icon: "fas fa-dice-d20",
                visible: game.user.isGM,
                onClick: () => FabulaUltimaGroupRoll.groupRoll(),
                button: true
            });
        }
    }

    static ready() {
        game.socket.on(FabulaUltimaGroupRoll.MSG_ID, FabulaUltimaGroupRoll.onMessage);
    }

    static onMessage(message) {
        if (data.user === "character" &&
            (!game.user.character || !data.actors.includes(game.user.character.id)))
            return;
        else if (!["character", "tokens"].includes(data.user) && data.user !== game.user.id)
            return;

        let actors = [];
        if (data.user === "character")
            actors = [game.user.character];
        else if (data.user === "tokens")
            actors = canvas.tokens.controlled.map(t => t.actor).filter(a => data.actors.includes(a.id));
        else
            actors = data.actors.map(aid => LMRTFY.fromUuid(aid));

        actors = actors.filter(a => a);
        if (actors.length === 0) 
            return;

        new FabulaUltimaGroupRollRoller(actors, data);
    }

    static groupRoll() {
        if (FabulaUltimaGroupRoll.requestor === undefined) {
            FabulaUltimaGroupRoll.requestor = new FabulaUltimaGroupRollRequestor();
        }
        FabulaUltimaGroupRoll.requestor.render(true);
    }
}