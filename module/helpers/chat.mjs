export class FabulaUltimaChatHelper {
  static async rerollWithFabulaPoint(message, html, data) {
    console.log(message);
    console.log(html);
    console.log(data);

    const weaponRoot = html.find('.weapon-card');
    if (weaponRoot)
    {
        const actorId = weaponRoot.data("actor-id");
        const itemId = weaponRoot.data("item-id");
        const actor = game.actors.get(actorId);
        const item = actor.items.get(itemId);

        const fabulaPoints = actor.data.data.fabulaPoints;
        await actor.update({
            "system.fabulaPoints": fabulaPoints - 1
        });

        return actor.rollWeapon(item);
    }
  }
}