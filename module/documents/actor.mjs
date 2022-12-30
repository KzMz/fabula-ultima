/**
 * Extend the base Actor document by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class FabulaUltimaActor extends Actor {

  /** @override */
  prepareData() {
    // Prepare data for the actor. Calling the super version of this executes
    // the following, in order: data reset (to clear active effects),
    // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
    // prepareDerivedData().
    super.prepareData();
  }

  /** @override */
  prepareBaseData() {
    // Data modifications in this step occur before processing embedded
    // documents or derived data.
  }

  /**
   * @override
   * Augment the basic actor data with additional dynamic data. Typically,
   * you'll want to handle most of your calculated/derived data in this step.
   * Data calculated in this step should generally not exist in template.json
   * (such as ability modifiers rather than ability scores) and should be
   * available both inside and outside of character sheets (such as if an actor
   * is queried and has a roll executed directly from it).
   */
  prepareDerivedData() {
    const actorData = this.system;

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
    this._prepareCharacterData(actorData);
    this._prepareNpcData(actorData);
  }

  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData(actorData) {
    if (this.type !== 'character') return;

    // Make modifications to data here. For example:
    //const data = actorData.data;

    // Loop through ability scores, and add their modifiers to our sheet output.
    //for (let [key, ability] of Object.entries(data.abilities)) {
      // Calculate the modifier using d20 rules.
      //ability.mod = Math.floor((ability.value - 10) / 2);
    //}
  }

  /**
   * Prepare NPC type specific data.
   */
  _prepareNpcData(actorData) {
    if (actorData.type !== 'npc') return;

    // Make modifications to data here. For example:
    //const data = actorData.data;
    //data.xp = (data.cr * data.cr) * 100;
  }

  /**
   * Override getRollData() that's supplied to rolls.
   */
  getRollData() {
    const data = super.getRollData();

    // Prepare character roll data.
    this._getCharacterRollData(data);
    this._getNpcRollData(data);

    return data;
  }

  isCrisis() {
    return this.system.health.value <= Math.floor(this.getMaxHealthPoints() / 2);
  }

  async initiativeRoll(bondBonus = 0) {
    return this.roll("dex", "int", bondBonus + this.getInitiativeBonus(), "FABULAULTIMA.InitiativeTest");
  }

  async roll(firstAbility, secondAbility, bonus = 0, label = "FABULAULTIMA.GenericTest") {
    const templateData = {
      actor: this,
      type: this.type
    };

    let formula = this.getBaseRollFormula(firstAbility, secondAbility, bonus);

    const roll = await new Roll(formula, this.getRollData()).roll({async: true});
    const d = roll.dice;

    const maxVal = d.reduce(function (a, b) {
      return Math.max(a.total, b.total);
    });

    const isFumble = d.every(die => die.total === 1);
    const isCrit = d.every(die => die.total === d[0].total && die.total !== 1 && die.total > 5); // TODO frenesia

    templateData["formula"] = this.getGenericFormula(firstAbility, secondAbility, bonus);
    templateData["total"] = roll.total;
    templateData["dice"] = roll.dice;
    templateData["isCritical"] = isCrit;
    templateData["isFumble"] = isFumble;
    templateData["label"] = game.i18n.localize(label);

    const template = "systems/fabulaultima/templates/chat/base-card.html";
    const html = await renderTemplate(template, templateData);

    const chatData = {
      user: game.user._id,
      type: CONST.CHAT_MESSAGE_TYPES.ROLL,
      content: html,
      rollMode: game.settings.get("core", "rollMode"),
      roll: roll,
      speaker: {
        token: this.token ? this.token.id : null,
        alias: this.token ? this.token.name : this.name,
        actor: this._id
      }
    };

    return ChatMessage.create(chatData);
  }  

  async rollFeature(feature) {
    const templateData = {
      actor: this,
      feature: feature,
      type: this.type,
      flavor: feature.name
    };

    const template = "systems/fabulaultima/templates/chat/feature-card.html";
    const html = await renderTemplate(template, templateData);

    let token = this.token;
    if (!token) {
      token = this.getActiveTokens()[0];
    }

    const chatData = {
      user: game.user._id,
      type: CONST.CHAT_MESSAGE_TYPES.OTHER,
      content: html,
      speaker: {
        token: this.token ? this.token.id : null,
        alias: this.token ? this.token.name : this.name,
        actor: this.id
      }
    };

    return ChatMessage.create(chatData);
  }

  async rollSpell(spell) {

  }

  async rest() {
    const values = {
      "system.health.value": this.system.health.max,
      "system.mind.value": this.system.mind.max
    };
    return this.update(values);
  }

  async rollWeapon(weapon) {
    const flavour = game.i18n.localize("FABULAULTIMA.RollPrecisionTest");

    const templateData = {
      actor: this,
      item: weapon.data,
      type: this.type,
      flavor: flavour
    };
    
    let formula = this.getRollFormula(weapon.data);

    const roll = await new Roll(formula, this.getRollData()).roll({async: true});
    const d = roll.dice;

    const maxVal = d.reduce(function (a, b) {
      return Math.max(a.total, b.total);
    });

    const isFumble = d.every(die => die.total === 1);
    const isCrit = d.every(die => die.total === d[0].total && die.total !== 1 && die.total > 5);

    templateData["formula"] = this.getItemFormula(weapon.data);
    templateData["total"] = roll.total;
    templateData["dice"] = roll.dice;
    templateData["damageType"] = weapon.data.data.damage.type;
    templateData["damageTypeLoc"] = game.i18n.localize(CONFIG.FABULAULTIMA.damageTypes[templateData["damageType"]]);
    templateData["damage"] = maxVal + this.getWeaponTotalDamage(weapon);
    templateData["isCritical"] = isCrit;
    templateData["isFumble"] = isFumble;

    const template = "systems/fabulaultima/templates/chat/weapon-card.html";
    const html = await renderTemplate(template, templateData);

    let token = this.token;
    if (!token) {
      token = this.getActiveTokens()[0];
    }

    const chatData = {
      user: game.user._id,
      type: CONST.CHAT_MESSAGE_TYPES.ROLL,
      content: html,
      rollMode: game.settings.get("core", "rollMode"),
      roll: roll,
      speaker: {
        token: this.token ? this.token.id : null,
        alias: this.token ? this.token.name : this.name,
        actor: this.id
      }
    };

    return ChatMessage.create(chatData);
  }

  getWeaponTotalDamage(weapon) {
    let baseDamage = weapon.data.data.damage.bonus;
    const isMelee = weapon.data.data.type === "melee";

    const features = this.items.filter(i => i.type === "feature");
    for (const feature of features) {
      const bonus = Number(isMelee ? feature.data.data.passive.meleeDamageBonus : feature.data.data.passive.rangedDamageBonus);
      const level = Number(feature.data.data.level);
      if (isNaN(bonus) || isNaN(level)) continue;
      if (!this.checkFeatureCondition(feature)) continue;

      baseDamage += (bonus * level);
    }

    return baseDamage;
  }

  getItemFormula(item) {
    if (item.type === "weapon")
      return this.getWeaponFormula(item);

    return "";
  }

  getWeaponFormula(item) {
    let weaponBonus = item.data.precisionBonus;
    const isMelee = item.data.type === "melee";

    const features = this.items.filter(i => i.type === "feature");
    for (const feature of features) {
      const bonus = Number(isMelee ? feature.data.data.passive.meleePrecisionBonus : feature.data.data.passive.rangedPrecisionBonus);
      const level = Number(feature.data.data.level);
      if (isNaN(bonus) || isNaN(level)) continue;
      if (!this.checkFeatureCondition(feature)) continue;

      weaponBonus += (bonus * level);
    }

    let base = "【" + item.data.firstAbility.toUpperCase() + " + " + item.data.secondAbility.toUpperCase() + "】"; 
    if (weaponBonus !== 0) {
      base += " + " + weaponBonus;
    }
    return base;
  }

  getLevel() {
    let level = 0;

    const classes = this.items.filter(i => i.type === "class");
    for (let c of classes) {
      level += c.system.level;
    }

    return level;
  }

  getMaxHealthPoints() {
    let startingHealth = this.system.abilities.vig.max * 5;
    startingHealth += this.getLevel();

    const classes = this.items.filter(i => i.type === "class");
    for (let c of classes) {
      startingHealth += Number(c.system.healthBonus);
    }

    const skills = this.items.filter(i => i.type === "feature");
    for (let f of skills) {
      startingHealth += Number(f.system.passive.hpBonus) * f.system.level;
    }

    return startingHealth;
  }

  getMaxMindPoints() {
    let startingMind = this.system.abilities.vol.max * 5;
    startingMind += this.getLevel();

    const classes = this.items.filter(i => i.type === "class");
    for (let c of classes) {
      startingMind += Number(c.system.mindBonus);
    }

    const skills = this.items.filter(i => i.type === "feature");
    for (let f of skills) {
      startingMind += Number(f.system.passive.mpBonus) * f.system.level;
    }

    return startingMind;
  }

  getMaxInventoryPoints() {
    let startingInventory = 6;

    const classes = this.items.filter(i => i.type === "class");
    for (let c of classes) {
      startingInventory += Number(c.system.inventoryBonus);
    }

    const skills = this.items.filter(i => i.type === "feature");
    for (let f of skills) {
      startingInventory += Number(f.system.passive.ipBonus);
    }

    return startingInventory;
  }

  getArmorFormula(item, magic) {
    let base = item.data.defenseFormula;
    if (magic)
      base = item.data.magicDefenseFormula;

    if (base.includes("@")) {
      for (const ability in CONFIG.FABULAULTIMA.abilities) {
        base = base.replace("@" + ability, ability.toUpperCase());
      }
    }

    return base;
  }

  getGenericFormula(firstAbility, secondAbility, bonus = 0) {
    let base = "【" + firstAbility.toUpperCase() + "+ " + secondAbility.toUpperCase() + "】"; 
    if (bonus !== 0) {
      base += " + " + bonus;
    }
    return base;
  }

  getRollFormula(item) {
    let weaponBonus = item.data.precisionBonus;
    const isMelee = item.data.type === "melee";

    const features = this.items.filter(i => i.type === "feature");
    for (const feature of features) {
      const bonus = Number(isMelee ? feature.data.data.passive.meleePrecisionBonus : feature.data.data.passive.rangedPrecisionBonus);
      const level = Number(feature.data.data.level);
      if (isNaN(bonus) || isNaN(level)) continue;
      if (!this.checkFeatureCondition(feature)) continue;

      weaponBonus += (bonus * level);
    }

    return this.getBaseRollFormula(item.data.firstAbility, item.data.secondAbility, weaponBonus);
  }

  checkFeatureCondition(feature) {
    if (!feature.data.data.passive.condition || feature.data.data.passive.condition === "")
      return true;

    if (feature.data.data.passive.condition === "crisis")
      return this.isCrisis();
    if (feature.data.data.passive.condition === "fullhealth")
      return this.system.health.value === this.system.health.max;

    if (feature.data.data.passive.condition.includes("effect:")) {
      const effect = feature.data.data.passive.condition.split(":")[1];
      if (effect && effect !== "")
        return this.effects.some(e => e.name === effect || e.data.label === effect);
    }

    return false;
  }

  getInitiativeBonus() {
    let bonus = 0;

    if (this.system.equipped.armor !== "") {
      const armor = this.items.get(this.system.equipped.armor);
      if (armor) {
        bonus += parseInt(armor.data.data.initiativeBonus);
      }
    }

    let mainHand;
    if (this.system.equipped.mainHand !== "") {
      mainHand = this.items.get(this.system.equipped.mainHand);
      if (mainHand) {
        if (mainHand.data.data.quality) {
          bonus += parseInt(mainHand.data.data.quality.initiativeBonus);
        }
      }
    }

    if (this.system.equipped.offHand !== "") {
      const offHand = this.items.get(this.system.equipped.offHand);
      if (offHand && mainHand && mainHand.id !== offHand.id) {
        if (offHand.data.data.quality) {
          bonus += parseInt(offHand.data.data.quality.initiativeBonus);
        }
      }
    }

    if (this.system.equipped.accessory !== "") {
      const acc = this.items.get(this.system.equipped.accessory);
      if (acc && acc.data.data.quality) {
        bonus += parseInt(acc.data.data.quality.initiativeBonus);
      }
    }

    if (this.system.equipped.accessory2 !== "") {
      const acc = this.items.get(this.system.equipped.accessory2);
      if (acc && acc.data.data.quality) {
        bonus += parseInt(acc.data.data.quality.initiativeBonus);
      }
    }

    return bonus;
  }

  getBaseRollFormula(firstAbility, secondAbility, bonus = 0) {
    let base = "1d@" + firstAbility + " + 1d@" + secondAbility;
    if (bonus !== 0) {
      base += " + " + bonus;
    }
    return base;
  }

  /**
   * Prepare character roll data.
   */
  _getCharacterRollData(data) {
    if (this.data.type !== 'character') return;

    // Copy the ability scores to the top level, so that rolls can use
    // formulas like `@str.mod + 4`.
    if (data.abilities) {
      for (let [k, v] of Object.entries(data.abilities)) {
        data[k] = (foundry.utils.deepClone(v)).value;
      }
    }

    // Add level for easier access, or fall back to 0.
    /*if (data.attributes.level) {
      data.lvl = data.attributes.level.value ?? 0;
    }*/
  }

  /**
   * Prepare NPC roll data.
   */
  _getNpcRollData(data) {
    if (this.data.type !== 'npc') return;

    // Process additional NPC data here.
  }

}