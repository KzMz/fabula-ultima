import { FabulaUltimaGroupRoll } from "./groupRoll.mjs";

export class FabulaUltimaGroupRollRequestor extends FormApplication {
    static MSG_ID = "system.fabulaultima.grouproll";

    constructor(...args) {
        super(...args);
        game.users.apps.push(this);

        this.abilities = CONFIG.FABULAULTIMA.abilities;
    }

    static get defaultOptions() {
        const options = super.defaultOptions;
        options.title = game.i18n.localize("FABULAULTIMA.GroupRoll");
        options.id = "fabulaultima-grouproll";
        options.template = "systems/fabulaultima/templates/groupRoll/groupRoll-request.html";
        options.closeOnSubmit = false;
        options.popOut = true;
        options.width = 600;
        options.height = "auto";
        options.classes = ["fabulaultima", "fabulaultima-grouproll-requestor"];

        return options;
    }

    async getData() {
        // Return data to the template
        const actors = game.actors.entities || game.actors.contents;
        const users = game.users.entities || game.users.contents;
        // Note: Maybe these work better at a global level, but keeping things simple
        const abilities = this.abilities;

        return {
            actors,
            users,
            abilities
        };
    }

    render(force, context={}) {
        const {action, data} = context;
        if (action && !["create", "update", "delete"].includes(action)) return;
        if (action === "update" && !data.some(d => "character" in d)) return;
        if (force !== true && !action) return;

        return super.render(force, context);
    }

    activateListeners(html) {
        super.activateListeners(html);
        this.element.find('select[name=user]').change(this._onUserChange.bind(this));
        this.element.find('input[name=isInitiative]').change(this._onIsInitiativeChange.bind(this));

        this._onUserChange();
    }

    setActorSelection(evt, enabled) {
        evt.preventDefault();
        this.element.find('.groupRoll-actor input').prop("checked", enabled);
    }

    _getUserActorIds(leaderId) {
        let actors = [];
        if (leaderId === "character") {
            const gameUsers = game.users.entities || game.users.contents;
            actors = gameUsers.map(u => u.character?.id).filter(a => a);
        } else if (leaderId === "tokens") {
            actors = Array.from(new Set(canvas.tokens.placeables.map(t => t.data.actorId))).filter(a => a);
        } else {
            const user = game.users.get(leaderId);
            if (user) {
                const gameActors = game.actors.contents || game.actors.entities;
                actors = gameActors.filter(a => a.testUserPermission(user, "OWNER")).map(a => a.id);
            }
        }
        return actors;
    }

    _onIsInitiativeChange() {
        const isInitiative = this.element.find('input[name=isInitiative]').is(":checked");
        if (isInitiative) {
            this.element.find("input[name=firstAbility]").val("dex").change();
            this.element.find("input[name=secondAbility]").val("int").change();
        }
    }

    _onUserChange() {
        const userId = this.element.find('select[name=user]').val();
        const actors = this._getUserActorIds(userId);
        this.element.find(".group-roll-actor").hide().filter((i, e) => actors.includes(e.dataset.id)).show();
    }

    async _updateObject(event, formData) {
        const dc = parseInt(formData.dc);
        const firstAbility = formData.firstAbility;
        const secondAbility = formData.secondAbility;
        const isInitiative = formData.isInitiative;

        const keys = Object.keys(formData);
        const user_actors = this._getUserActorIds(formData.user).map(id => `actor-${id}`);
        const actors = keys.filter(k => k.startsWith("actor-")).reduce((acc, k) => {
            if (formData[k] && user_actors.includes(k)) 
                acc.push(k.slice(6));
            return acc;
        }, []);

        const gameActors = game.actors.contents || game.actors.entities;

        const socketData = {
            actors: gameActors.map(a => a.id),
            user: formData.user,
            dc: dc,
            firstAbility: firstAbility,
            secondAbility: secondAbility,
            isInitiative: isInitiative,
            title: formData.title,
            message: formData.message,
            leader: actors[0]
        };

        FabulaUltimaGroupRoll.Socket.executeForEveryone("grouproll", socketData);

        //FabulaUltimaGroupRoll.onMessage(socketData);
        ui.notifications.info(game.i18n.localize("FABULAULTIMA.GroupRollNotification"));
    }
}