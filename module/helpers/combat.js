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
        for (let enemy of game.combat.combatants.contents.filter(c => c.actor.type === "villain")) {
            list += "<span class='enemy-name";
            if (enemy.actor.isCrisis())
                list += " crisis";
            list += "'>" + enemy.name + "</span><br>";
        }
        for (let enemy of game.combat.combatants.contents.filter(c => c.actor.type === "npc")) {
            list += "<span class='enemy-name";
            if (enemy.actor.isCrisis())
                list += " crisis";
            list += "'>" + enemy.name + "</span><br>";
        }
        list += '</div>';

        return list;
    }

    _getFF7PlayerList() {
        let list = '<div class="ff7 player-list">';
        for (let player of game.combat.combatants.contents.filter(c => c.actor.type === "character")) {
            list += this._getFF7PlayerHud(player);
        }
        list += '</div>';

        return list;
    }

    _getFF7PlayerHud(player) {
        let add = "";
        if (player.actor.isCrisis())
            add = " class='crisis'";

        let p = "<div class='player-wrapper' data-player='" + player.id + "'><span class='combatant-name";
            if (player.actor.isCrisis())
                p += " crisis";

            p += "'>" + player.name + "</span>";
            p += '<div class="player-stat-wrapper">';
                p += '<div style="flex: 0 0 33%; margin: 0; padding: 0; display: flex; flex-direction: column;">';
                    p += '<div style="display: flex; justify-content: end; padding-right: 10px; margin: 0; margin-bottom: -3px;">' +
                        '<span' + add + '>' +
                        player.actor.data.data.health.value + '</span>' +
                        '<span' + add + '>/</span>' +
                        '<span' + add + '>' +
                        player.actor.data.data.health.max + '</span></div>';
                    p += '<progress class="health-progress" value="' + player.actor.data.data.health.value + '" max="' + player.actor.data.data.health.max + '"></progress>';
                p += '</div>';
                p += '<div style="flex: 0 0 33%; margin: 0; padding: 0; display: flex; flex-direction: column;">';
                    p += '<div style="display: flex; justify-content: end; padding-right: 10px; margin: 0; margin-bottom: -3px;">' +
                        '<span' + add + '>' +
                        player.actor.data.data.mind.value + '</span>' +
                        '<span' + add + '>/</span>' +
                        '<span' + add + '>' +
                        player.actor.data.data.mind.max + '</span></div>';
                    p += '<progress class="mind-progress" value="' + player.actor.data.data.mind.value + '" max="' + player.actor.data.data.mind.max + '"></progress>';
                p += '</div>';
                p += '<div style="flex: 0 0 33%; margin: 0; padding: 0; display: flex; flex-direction: column;">';
                    p += '<div style="display: flex; justify-content: end; padding-right: 10px; margin: 0; margin-bottom: -3px;">' +
                        '<span' + add + '>' +
                        player.actor.data.data.inventory.value + '</span>' +
                        '<span' + add + '>/</span>' +
                        '<span' + add + '>' +
                        player.actor.data.data.inventory.max + '</span></div>';
                    p += '<progress class="inventory-progress" value="' + player.actor.data.data.inventory.value + '" max="' + player.actor.data.data.inventory.max + '"></progress>';
                p += '</div>';
            p += '</div>';
        p += '</div>';

        return p;
    }
}