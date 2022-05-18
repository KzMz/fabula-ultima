export class FabulaUltimaGroupRollRoller extends Application {
    constructor(actors, data) {
        super();
        this.actors = actors;
        this.data = data;
        this.message = data.message;
        this.dc = data.dc;
        this.firstAbility = data.firstAbility;
        this.secondAbility = data.secondAbility;
        this.isLeader = game.user.character.id === data.leader;
        this.bondBonus = 0;

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
        this.bondBonus = parseInt(this.element.find('[name=bondbonus]').value);
    }

    _tagMessage(candidate, data, options) {
        let update = {flags: {grouproll: {"message": this.data.message, "data": this.data.attach}}};
        candidate.data.update(update);
    }

    async _onGroupRoll(evt) {
        evt.preventDefault();

        if (this.isLeader) {
            let bonus = 0;
            for (const actor of this.actors) {
                const messageList = game.messages.filter(i => i.roll && ((i.data.speaker.actor && i.data.speaker.actor.id === actor.id) || (i.data.speaker.token && i.data.speaker.token === actor.token.id)));
                console.log(messageList);

                const last = messageList.length - 1;
                const total = messageList[last].roll.total;
                if (total >= 10) {
                    bonus++;
                }
            }

            if (!isNaN(this.bondBonus))
                bonus += this.bondBonus;

            await game.user.character.roll(this.firstAbility, this.secondAbility, bonus);
        } else {
            await game.user.character.roll(this.firstAbility, this.secondAbility);
        }

        evt.currentTarget.disabled = true;
        this.close();
    }
}