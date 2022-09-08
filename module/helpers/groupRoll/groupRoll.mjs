import { FabulaUltimaGroupRollRequestor } from "./groupRoll.requestor.mjs";
import { FabulaUltimaGroupRollRoller } from "./groupRoll.roller.mjs";

export class FabulaUltimaGroupRoll {
    static MSG_ID = "system.fabulaultima.grouproll";
    static Socket;

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
        FabulaUltimaGroupRoll.Socket = socketlib.registerSystem("fabulaultima");
        FabulaUltimaGroupRoll.Socket.register("grouproll", (message) => {
          FabulaUltimaGroupRoll.onMessage(message);
        });
    }

    static onMessage(message) {
        if (game.user.isGM) return;

        let actors = message.actors.map(aid => {
            const user = game.users.find(u => u.character && u.character.id === aid);
            if (user)
                return user.character;
            
            return null;
        });

        actors = actors.filter(a => a);
        if (actors.length === 0) 
            return;

        new FabulaUltimaGroupRollRoller(actors, message).render(true);
    }

    static groupRoll() {
        if (FabulaUltimaGroupRoll.requestor === undefined) {
            FabulaUltimaGroupRoll.requestor = new FabulaUltimaGroupRollRequestor();
        }
        FabulaUltimaGroupRoll.requestor.render(true);
    }
}