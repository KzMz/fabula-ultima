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

    _getFF7Hud() {
        return '<div style="width: 100%">' +
            this._getFF7EnemyList() +
            this._getFF7PlayerList();
    }

    _getFF7EnemyList() {
        return '<div class="ff7 enemy-list">' +
        'TEST' +
        '</div>';
    }

    _getFF7PlayerList() {
        return '<div class="ff7 player-list">' +
        'TEST' +
        '</div>';
    }
}