export class FabulaUltimaChatHelper {
  static async rerollWithFabulaPoint(message, html, data) {
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

  static async rollFreeAttack(message, html, data, isOffHand) {
    const featureRoot = html.find('.feature-card');
    if (featureRoot)
    {
      const actorId = featureRoot.data("actor-id");
      const actor = game.actors.get(actorId);
      
      const itemId = featureRoot.data("item-id");
      const item = actor.items.get(itemId);

      let bonus = 0, damage = 0;
      if (item)
      {
        bonus = item.system.active.addLevelToPrecision ? item.system.level : 0;
        damage = item.system.active.addLevelToDamage ? item.system.level : 0;
      }

      console.log(item);

      let weapon = actor.items.find(item => item.id === actor.system.equipped.mainHand);
      if (isOffHand && actor.system.equipped.offHand)
        weapon = actor.items.find(item => item.id === actor.system.equipped.offHand);

      return actor.rollFreeAttack(weapon, bonus, damage);
    }
  }
}