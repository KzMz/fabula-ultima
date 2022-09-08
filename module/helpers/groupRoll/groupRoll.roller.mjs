export class FabulaUltimaGroupRollRoller extends Application {
    constructor(actors, data) {
        super();
        this.actors = actors;
        this.data = data;
        this.message = data.message;
        this.dc = data.dc;
        this.firstAbility = data.firstAbility;
        this.secondAbility = data.secondAbility;
        this.isInitiative = data.isInitiative;

        if (game.user.character)
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
            isLeader: this.isLeader
        };

        return data;
    }

    activateListeners(html) {
        super.activateListeners(html);

        this.element.find(".group-roll-check").click(this._onGroupRoll.bind(this));
        this.bondBonus = parseInt(this.element.find('[name=bondbonus]').val());
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
                if (actor.id === game.user.character.id)
                    continue;

                const messageList = game.messages.filter(i => i.roll && ((i.data.speaker.actor === actor.id) || (i.data.speaker.alias === actor.name)) && (Date.now() - i.data.timestamp) < 2 * 60000);

                const last = messageList.length - 1;
                if (messageList[last] && messageList[last].roll && messageList[last].roll.total >= 10) {
                    bonus++;
                }
            }

            this.bondBonus = parseInt(this.element.find('[name=bondbonus]').val());
            if (!isNaN(this.bondBonus))
                bonus += this.bondBonus;

            if (this.isInitiative) {
                await game.user.character.initiativeRoll(bonus);
            } else {
                await game.user.character.roll(this.firstAbility, this.secondAbility, bonus);
            }
        } else {
            if (this.isInitiative) {   
                await game.user.character.initiativeRoll(0);
            } else {
                await game.user.character.roll(this.firstAbility, this.secondAbility);
            }
        }

        evt.currentTarget.disabled = true;
        this.close();
    }
}