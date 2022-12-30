import { FabulaUltimaGroupRoll } from "./groupRoll/groupRoll.mjs";

export class FabulaUltimaCombatHud {
    currentTurn = "";
    static Socket;

    static ready() {
        FabulaUltimaGroupRoll.Socket.register("notice", (side) => {
            console.log(side);
            FabulaUltimaCombatHud.onMessage(side);
        });
    }

    _getBattleElement() {
        return $('<div id="battle-hud">' +
            this._getFF7Hud() +
            '</div>');
    }

    addToScreen() {
        const exists = $("#battle-hud");
        if (exists.length) {
            this._setupEvents(exists);
            return;
        }

        const battleHud = this._getBattleElement();
        this._setupEvents(battleHud);
        setTimeout( () => {
            $("div#hud").append(battleHud);
        }, 500);
    }

    _setupEvents(hud) {
        hud.find(".enemy-turn").on('click', () => {
            if (!game.user.isGM) return;

            this.showNotice("enemy");
        });
        hud.find(".player-turn").on('click', () => {
            if (!game.user.isGM) return;

            this.showNotice("player");
        });
    }

    static onMessage(side) {
        if (game.user.isGM) return;
        game.fabulaultima.combatHud.showNotice(side);
    }

    showNotice(side) {
        FabulaUltimaGroupRoll.Socket.executeForEveryone("notice", side);

        this.currentTurn = side;

        $("#battle-hud #turn-notice").html(game.i18n.localize(side === "enemy" ? "FABULAULTIMA.EnemyTurn" : "FABULAULTIMA.PlayerTurn"));
        $("#battle-hud #turn-notice").addClass(side);
        setTimeout(() => {
            $("#battle-hud #turn-notice").removeClass("enemy player");
        }, 5000);
    }

    deleteFromScreen() {
        $("#battle-hud").remove();
    }

    update() {
        $('#battle-hud').empty();
        $('#battle-hud').append(this._getFF7Hud());

        this._setupEvents($("#battle-hud"));
    }

    _getFF7Hud() {
        let hud = "<div id='turn-notice'>" + game.i18n.localize("FABULAULTIMA.PlayerTurn") +  "</div>";
        if (game.user.isGM) {
            hud += '<div class="turn-buttons"><button class="player-turn">' + game.i18n.localize("FABULAULTIMA.PlayerTurn") + '</button>' + 
                '<button class="enemy-turn">' + game.i18n.localize("FABULAULTIMA.EnemyTurn") + '</button></div>';
        } 
        
        return hud + '<div class="wrapper">' +
            this._getFF7EnemyList() +
            this._getFF7PlayerList() + '</div>';
    }

    _getFF7EnemyList() {
        let list = '<div class="ff7 enemy-list">';
        for (let enemy of game.combat.combatants.contents.filter(c => c.actor.type === "villain")) {
            list += "<span class='enemy-name";
            if (enemy.actor.isCrisis())
                list += " crisis";
            list += "'>" + enemy.name + "</span>";
        }
        for (let enemy of game.combat.combatants.contents.filter(c => c.actor.type === "npc")) {
            list += "<span class='enemy-name";
            if (enemy.actor.isCrisis())
                list += " crisis";
            list += "'>" + enemy.name + "</span>";
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

        const maxHealth = player.actor.getMaxHealthPoints();
        const maxMind = player.actor.getMaxMindPoints();
        const maxInventory = player.actor.getMaxInventoryPoints();

        let flex = "33%";
        if (game.settings.get("fabulaultima", "useLimits"))
            flex = "25%";

        let p = "<div class='player-wrapper' data-player='" + player.id + "'><span class='combatant-name";
            if (player.actor.isCrisis())
                p += " crisis";

            p += "'>" + player.name + "</span>";
            p += '<div class="player-stat-wrapper">';
                p += '<div style="flex: 0 0 ' + flex + '; margin: 0; padding: 0; display: flex; flex-direction: column;">';
                    p += '<div style="display: flex; justify-content: end; padding-right: 10px; margin: 0; margin-bottom: -3px;">' +
                        '<span' + add + '>' +
                        player.actor.system.health.value + '</span>' +
                        '<span' + add + '>/</span>' +
                        '<span' + add + '>' +
                        maxHealth + '</span></div>';
                    p += '<progress class="health-progress" value="' + player.actor.system.health.value + '" max="' + maxHealth + '"></progress>';
                p += '</div>';
                p += '<div style="flex: 0 0 ' + flex + '; margin: 0; padding: 0; display: flex; flex-direction: column;">';
                    p += '<div style="display: flex; justify-content: end; padding-right: 10px; margin: 0; margin-bottom: -3px;">' +
                        '<span' + add + '>' +
                        player.actor.system.mind.value + '</span>' +
                        '<span' + add + '>/</span>' +
                        '<span' + add + '>' +
                        maxMind + '</span></div>';
                    p += '<progress class="mind-progress" value="' + player.actor.system.mind.value + '" max="' + maxMind + '"></progress>';
                p += '</div>';
                p += '<div style="flex: 0 0 ' + flex + '; margin: 0; padding: 0; display: flex; flex-direction: column;">';
                    p += '<div style="display: flex; justify-content: end; padding-right: 10px; margin: 0; margin-bottom: -3px;">' +
                        '<span' + add + '>' +
                        player.actor.system.inventory.value + '</span>' +
                        '<span' + add + '>/</span>' +
                        '<span' + add + '>' +
                        maxInventory + '</span></div>';
                    p += '<progress class="inventory-progress" value="' + player.actor.system.inventory.value + '" max="' + maxInventory + '"></progress>';
                p += '</div>';

                if (game.settings.get("fabulaultima", "useLimits")) {
                    p += '<div style="flex: 0 0 ' + flex + '; margin: 0; padding: 0; display: flex; flex-direction: column;">';
                        p += '<div style="display: flex; justify-content: end; padding-right: 10px; margin: 0; margin-bottom: -3px;">' +
                            '<span' + add + '>' +
                            player.actor.system.limit.value + '</span>' +
                            '<span' + add + '>/</span>' +
                            '<span' + add + '>' +
                            player.actor.system.limit.max + '</span></div>';
                        p += '<progress class="limit-progress" value="' + player.actor.system.limit.value + '" max="' + player.actor.system.limit.max + '"></progress>';
                    p += '</div>';
                }

            p += '</div>';
        p += '</div>';

        return p;
    }
}