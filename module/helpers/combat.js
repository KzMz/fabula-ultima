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
            list += enemy.name + "<br>";
        }
        for (let enemy of game.combat.combatants.contents.filter(c => c.actor.type === "npc")) {
            list += enemy.name + "<br>";
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
        let p = "<div class='player-wrapper' data-player='" + player.id + "'><span class='combatant-name'>" + player.name + "</span>";
        p += '<div class="player-stat-wrapper">';
        p += '<div style="flex: 0 0 33%; margin: 0; padding: 0; display: flex; flex-direction: column;">';
        p += '<div style="height: 12px; display: flex; justify-content: end; padding-right: 10px;"><span>50</span><span>/</span><span>50</span></div>';
        p += '<progress class="health-progress" value="' + player.actor.data.data.health.value + '" max="' + player.actor.data.data.health.max + '"></progress>';
        p += '</div>';
        p += '<div style="flex: 0 0 33%; margin: 0; padding: 0; display: flex; flex-direction: column;">';
        p += '<div style="height: 12px; display: flex; justify-content: end; padding-right: 10px;"><span>50</span><span>/</span><span>50</span></div>';
        p += '<progress class="mind-progress" value="' + player.actor.data.data.mind.value + '" max="' + player.actor.data.data.mind.max + '"></progress>';
        p += '</div>';
        p += '<div style="flex: 0 0 33%; margin: 0; padding: 0; display: flex; flex-direction: column;">';
        p += '<div style="height: 12px; display: flex; justify-content: end; padding-right: 10px;"><span>50</span><span>/</span><span>50</span></div>';
        p += '<progress class="inventory-progress" value="' + player.actor.data.data.inventory.value + '" max="' + player.actor.data.data.inventory.max + '"></progress>';
        p += '</div>';
        p += '</div>';
        p += "<br>";

        return p;
    }
}