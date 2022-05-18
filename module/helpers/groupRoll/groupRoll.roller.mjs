export class FabulaUltimaGroupRollRoller extends Application {
    constructor(actors, data) {
        super();
        this.actors = actors;
        this.data = data;
        this.message = data.message;
        this.dc = data.dc;
        this.firstAbility = data.firstAbility;
        this.secondAbility = data.secondAbility;

        if (data.title) {
            this.options.title = data.title;
        }
    }

    static get defaultOptions() {
        const options = super.defaultOptions;
        options.title = game.i18n.localize("FABULAUTIMA.Title");
        options.template = "systems/fabulaultima/templates/groupRoll/groupRoll-roller.html";
        options.popOut = true;
        options.width = 400;
        options.height = "auto";
        options.classes = ["fabulaultima", "fabulaultima-grouproll-roller"];

        return options;
    }

    async getData() {
        const data = {
            actors: this.actors,
            abilities: this.abilities,
            message: this.message,
        };

        return data;
    }

    activateListeners(html) {
        super.activateListeners(html);

        this.element.find(".group-roll-check").click(this._onGroupRoll.bind(this));
    }

    _tagMessage(candidate, data, options) {
        let update = {flags: {lmrtfy: {"message": this.data.message, "data": this.data.attach}}};
        candidate.data.update(update);
    }

    async _onGroupRoll(evt) {
        evt.preventDefault();

        for (let actor of this.actors) {
            console.log(actor);
            Hooks.once("preCreateChatMessage", this._tagMessage.bind(this));

            //await actor.
        }

        evt.currentTarget.disabled = true;
        this.close();
    }
}