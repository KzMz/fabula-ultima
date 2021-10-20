export class FabulaUltimaCombatHud {
    _getBattleElement() {
        return $('<div id="battle-hud">' +
            this._getFF7Hud() +
            '</div>');
    }

    addToScreen() {
        const exists = $("#battle-hud");
        if (exists.length) return;

        const battleHud = this._getBattleElement();
        setTimeout( () => {
            $("div#hud").append(battleHud);
        }, 500);
    }

    deleteFromScreen() {
        $("#battle-hud").remove();
    }

    update() {
        $('#battle-hud').empty();
        $('#battle-hud').append(this._getFF7Hud());
    }

    _getFF7Hud() {
        return '<div class="wrapper">' +
            this._getFF7EnemyList() +
            this._getFF7PlayerList() + '</div>';
    }

    _getFF7EnemyList() {
        let list = '<div class="ff7 enemy-list">';
        for (let enemy in game.combat.combatants.contents.filter(c => c.actor.type === "villain")) {
            list += enemy.name + "<br>";
        }
        for (let enemy in game.combat.combatants.contents.filter(c => c.actor.type === "npc")) {
            list += enemy.name + "<br>";
        }
        list += '</div>';

        return list;
    }

    _getFF7PlayerList() {
        let list = '<div class="ff7 player-list">';
        for (let player in game.combat.combatants.contents.filter(c => c.actor.type === "character")) {
            list += player.name + "<br>";
        }
        list += '</div>';

        return list;
    }
}