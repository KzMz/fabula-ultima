export class FabulaUltimaCombatHud {
    _getBattleElement() {
        return $('<div id="battle-hud">' +
            this._getFF7Hud() +
            '</div>');
    }

    addToScreen() {
        const battleHud = this._getBattleElement();
        setTimeout( () => {
            $("div#hud").append(battleHud);
        }, 500);
    }

    _getFF7Hud() {
        return '<div>' +
            '<div class="ff7 enemy-list">' +
            'TEST' +
            '</div>' +
            '<div class="ff7 player-list">' +
            'TEST' +
            '</div>';
    }
}