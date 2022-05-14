import {onManageActiveEffect, prepareActiveEffectCategories} from "../helpers/effects.mjs";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class FabulaUltimaActorSheet extends ActorSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["fabulaultima", "sheet", "actor"],
      template: "systems/fabulaultima/templates/actor/actor-sheet.html",
      width: 600,
      height: 600,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "features" }]
    });
  }

  /** @override */
  get template() {
    return `systems/fabulaultima/templates/actor/actor-${this.actor.data.type}-sheet.html`;
  }

  /* -------------------------------------------- */

  /** @override */
  async getData() {
    // Retrieve the data structure from the base sheet. You can inspect or log
    // the context variable to see the structure, but some key properties for
    // sheets are the actor object, the data object, whether or not it's
    // editable, the items array, and the effects array.
    const context = super.getData();

    // Use a safe clone of the actor data for further operations.
    const actorData = context.actor.data;

    // Add the actor's data to context.data for easier access, as well as flags.
    context.data = actorData.data;
    context.flags = actorData.flags;

    // Prepare character data and items.
    if (actorData.type == 'character') {
      this._prepareItems(context);
      await this._prepareCharacterData(context);
    }

    // Prepare NPC data and items.
    if (actorData.type == 'npc') {
      this._prepareItems(context);
    }

    context.data.crisisHealth = Math.floor(context.data.health.max / 2);

    // Add roll data for TinyMCE editors.
    context.rollData = context.actor.getRollData();

    // Prepare active effects
    context.effects = prepareActiveEffectCategories(this.actor.effects);

    return context;
  }

  /**
   * Organize and classify Items for Character sheets.
   *
   * @param {Object} actorData The actor to prepare.
   *
   * @return {undefined}
   */
  async _prepareCharacterData(context) {
    // Handle ability scores.
    context.data.orderedAbilities = {};

    for (const k in CONFIG.FABULAULTIMA.abilities) {
      if (Number(context.data.abilities[k].value) > Number(context.data.abilities[k].max)) {
        context.data.abilities[k].value = context.data.abilities[k].max;
      }

      context.data.abilities[k].label = game.i18n.localize(CONFIG.FABULAULTIMA.abilities[k]) ?? k;
      context.data.abilities[k].abbrLabel = game.i18n.localize(CONFIG.FABULAULTIMA.abilityAbbreviations[k]) ?? k;

      context.data.orderedAbilities[k] = context.data.abilities[k];
    }

    const statuses1 = {};
    const statuses2 = {};
    for (let [k, v] of Object.entries(CONFIG.FABULAULTIMA.statuses)) {
      if (v.affects.length > 1)
      {
        statuses2[k] = v;
        statuses2[k].label = game.i18n.localize(v.label);
        statuses2[k].value = context.data.status[k];
        continue;
      }

      statuses1[k] = v;
      statuses1[k].label = game.i18n.localize(v.label);
      statuses1[k].value = context.data.status[k];
    }

    context.data.statuses1 = statuses1;
    context.data.statuses2 = statuses2;

    this._updateCharacterLevel(context);
    this._updateCharacterPoints(context);
    this._updateCharacterAttributes(context);
    await this._updateEquipmentBasedStats(context);
  }

  async _updateEquipmentBasedStats(context) {
    context.data.initiativeBonus = 0;
    context.data.defense = parseInt(context.data.abilities.dex.value);
    context.data.magicDefense = parseInt(context.data.abilities.int.value);

    if (context.data.equipped.armor !== "") {
      const armor = this.actor.items.get(context.data.equipped.armor);
      if (armor) {
        console.log(armor);

        context.data.initiativeBonus = parseInt(armor.data.data.initiativeBonus);
        
        if (armor.data.data.defenseFormula.includes("@")) {
          const roll = await new Roll(armor.data.data.defenseFormula, this.actor.getRollData()).roll();
          console.log(roll);
          context.data.defense = parseInt(roll.total);
        } else {
          context.data.defense = parseInt(armor.data.data.defenseFormula);
        }

        console.log(context.data.defense);

        if (armor.data.data.magicDefenseFormula.includes("@")) {
          const roll = await new Roll(armor.data.data.magicDefenseFormula, this.actor.getRollData()).roll();
          context.data.magicDefense = parseInt(roll.total);
        } else {
          context.data.magicDefense = parseInt(armor.data.data.defenseFormula);
        }
      }
    }

    if (context.data.equipped.mainHand !== "") {
      const mainHand = this.actor.items.get(context.data.equipped.mainHand);
      if (mainHand) {
        console.log(mainHand);

        context.data.initiativeBonus += parseInt(mainHand.data.data.quality.initiativeBonus);
        context.data.defense += parseInt(mainHand.data.data.quality.defenseBonus);
        context.data.magicDefense += parseInt(mainHand.data.data.quality.magicDefenseBonus);

        context.data.defense += parseInt(mainHand.data.data.defenseBonus);
        context.data.magicDefense += parseInt(mainHand.data.data.magicDefenseBonus);
      }
    }

    if (context.data.equipped.offHand !== "") {
      const offHand = this.actor.items.get(context.data.equipped.offHand);
      if (offHand && mainHand.id !== offHand.id) {
        context.data.initiativeBonus += parseInt(offHand.data.data.quality.initiativeBonus);
        context.data.defense += parseInt(offHand.data.data.quality.defenseBonus);
        context.data.magicDefense += parseInt(offHand.data.data.quality.magicDefenseBonus);

        context.data.defense += parseInt(offHand.data.data.defenseBonus);
        context.data.magicDefense += parseInt(offHand.data.data.magicDefenseBonus);
      }
    }

    if (context.data.equipped.accessory !== "") {
      const acc = this.actor.items.get(context.data.equipped.accessory);
      if (acc) {
        context.data.initiativeBonus += parseInt(acc.data.data.quality.initiativeBonus);
        context.data.defense += parseInt(acc.data.data.quality.defenseBonus);
        context.data.magicDefense += parseInt(acc.data.data.quality.magicDefenseBonus);
      }
    }
  }

  /**
   * Organize and classify Items for Character sheets.
   *
   * @param {Object} actorData The actor to prepare.
   *
   * @return {undefined}
   */
  _prepareItems(context) {
    // Initialize containers.
    const bonds = [];
    const weapons = [];
    const shields = [];
    const armor = [];
    const accessories = [];
    const classes = [];
    const spells = {};

    // Iterate through items, allocating to containers
    for (let i of context.items) {
      i.img = i.img || DEFAULT_TOKEN;
      // Append to gear.
      if (i.type === 'weapon') {
        i.formula = this.actor.getItemFormula(i);
 
        i.data.category = game.i18n.localize(CONFIG.FABULAULTIMA.weaponCategories[i.data.category]);
        i.data.type = game.i18n.localize(CONFIG.FABULAULTIMA.weaponTypes[i.data.type]);
        i.data.damage.type = game.i18n.localize(CONFIG.FABULAULTIMA.damageTypes[i.data.damage.type]);

        if (i.data.twoHanded) {
          if (context.data.equipped.mainHand === i._id) {
            i.status = game.i18n.localize("FABULAULTIMA.EquipTwoHanded");
            context.data.equipped.offHand = context.data.equipped.mainHand;
          } else {
            i.status = "";
          }
        } else {
          if (context.data.equipped.mainHand === i._id) {
            i.status = game.i18n.localize("FABULAULTIMA.MainHand");
          } else if (context.data.equipped.offHand === i._id) {
            i.status = game.i18n.localize("FABULAULTIMA.OffHand");
          } else {
            i.status = "";
          }
        }

        weapons.push(i);
      }
      else if (i.type === "shield") {
        if (context.data.equipped.mainHand === i._id) {
          i.status = game.i18n.localize("FABULAULTIMA.MainHand");
        } else if (context.data.equipped.offHand === i._id) {
          i.status = game.i18n.localize("FABULAULTIMA.OffHand");
        } else {
          i.status = "";
        }

        shields.push(i);
      }
      else if (i.type === "armor") {
        i.data.defenseFormula = this.actor.getArmorFormula(i, false);
        i.data.magicDefenseFormula = this.actor.getArmorFormula(i, true);

        if (context.data.equipped.armor === i._id) {
          i.status = game.i18n.localize("FABULAULTIMA.Equipped");
        } else {
          i.status = "";
        }

        armor.push(i);
      }
      else if (i.type === "accessory") {
        if (context.data.equipped.accessory === i._id) {
          i.status = game.i18n.localize("FABULAULTIMA.Equipped");
        } else {
          i.status = "";
        }

        accessories.push(i);
      }
      // Append to features.
      else if (i.type === 'class') {
        i.skills = [];
        classes.push(i);
      }
      else if (i.type === 'bond') {
        bonds.push(i);
      }
    }

    for (let i of context.items) {
      i.img = i.img || DEFAULT_TOKEN;
      if (i.type === 'feature') { 
        i.data.cost.resource = game.i18n.localize(CONFIG.FABULAULTIMA.costResources[i.data.cost.resource]);

        const cls = i.data.class;
        const c = classes.find(cl => cl.data.abbr === cls);
        if (c) {
          c.skills.push(i);
        }
      }
      // Append to spells.
      else if (i.type === 'spell') {
        const cls = i.data.class;
        if (!spells.hasOwnProperty(cls))
          spells[cls] = [];

        spells[cls].push(i);
      }
    }

    // Assign and return
    context.bonds = bonds;
    
    context.weapons = weapons;
    context.armor = armor;
    context.accessories = accessories;
    context.shields = shields;

    context.classes = classes;
    context.spells = spells;
  }

  _updateCharacterLevel(context) {
    let level = 0;

    for (let c of context.classes) {
      level += c.data.level;
    }

    context.data.attributes.level.value = level;
  }

  _updateCharacterPoints(context) {
    let startingHealth = context.data.abilities.vig.max * 5;
    startingHealth += context.data.attributes.level.value;

    let startingMind = context.data.abilities.vol.max * 5;
    startingMind += context.data.attributes.level.value;

    let startingInventory = 6;

    for (let c of context.classes) {
      startingHealth += Number(c.data.healthBonus);
      startingMind += Number(c.data.mindBonus);
      startingInventory += Number(c.data.inventoryBonus);

      for (let f of c.skills) {
        startingHealth += Number(f.data.passive.hpBonus) * f.data.level;
        startingMind += Number(f.data.passive.mpBonus) * f.data.level;
        startingInventory += Number(f.data.passive.ipBonus);
      }
    }

    context.data.health.max = startingHealth;
    context.data.mind.max = startingMind;
    context.data.inventory.max = startingInventory;
  }

  _updateCharacterAttributes(context) {
    for (let status in context.data.statuses1) {
      const s = context.data.statuses1[status];
      if (!s.value) continue; 

      for (let affected of s.affects) {
        context.data.abilities[affected].value = (Number(context.data.abilities[affected].value) - 2) + "";
      }
    }

    for (let status in context.data.statuses2) {
      const s = context.data.statuses2[status];
      if (!s.value) continue;

      for (let affected of s.affects) {
        context.data.abilities[affected].value = (Number(context.data.abilities[affected].value) - 2) + "";
      }
    }
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Render the item sheet for viewing/editing prior to the editable check.
    html.find('.item-edit').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.sheet.render(true);
    });

    // -------------------------------------------------------------
    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Add Inventory Item
    //html.find('.item-create').click(this._onItemCreate.bind(this));

    html.find('.item-equipMain').click(async ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));

      const equipped = this.actor.items.get(this.actor.data.data.equipped.mainHand);
      const other = this.actor.items.get(this.actor.data.data.equipped.offHand);
      const values = {
        "data.equipped.mainHand": item.id
      };

      if (item.data.data.twoHanded) {
        values["data.equipped.offHand"] = item.id;
      } else if (equipped && equipped.data.data.twoHanded) {
        values["data.equipped.offHand"] = "";
      }
      
      if (other && other.id === item.id) {
        values["data.equipped.offHand"] = "";
      }

      await this.actor.update(values);
    });
    html.find('.item-equipOff').click(async ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));

      const equipped = this.actor.items.get(this.actor.data.data.equipped.offHand);
      const other = this.actor.items.get(this.actor.data.data.equipped.mainHand);
      const values = {
        "data.equipped.offHand": item.id
      };

      if (item.data.data.twoHanded) {
        values["data.equipped.mainHand"] = item.id;
      } else if (equipped && equipped.data.data.twoHanded) {
        values["data.equipped.mainHand"] = "";
      } 

      if (other && other.id === item.id) {
        values["data.equipped.mainHand"] = "";
      }

      await this.actor.update(values);
    });
    html.find('.item-equipArmor').click(async ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));

      const values = {
        "data.equipped.armor": item.id
      };
      await this.actor.update(values);
    });
    html.find('.item-equipAccessory').click(async ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));

      const values = {
        "data.equipped.accessory": item.id
      };
      await this.actor.update(values);
    });

    // Delete Inventory Item
    html.find('.item-delete').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.delete();
      li.slideUp(200, () => this.render(false));
    });
    html.find('.class-delete').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("classId"));
      item.delete();
      li.slideUp(200, () => this.render(false));
    });

    html.find('[name="bond.who"]').change(async ev => {
      ev.preventDefault();
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));

      await item.update({
          "data.who": $(ev.currentTarget).val()
      });
    });
    html.find('.feeling-checkbox').click(async ev => {
      ev.preventDefault();
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      const checkbox = $(ev.currentTarget);

      const prop = "data." + ev.currentTarget.dataset.prop;
      const feeling = checkbox.attr('name');

      $("[data-prop='" + ev.currentTarget.dataset.prop + "']").not("[name='" + feeling + "']")[0].checked = false;

      const values = {};

      if (checkbox[0].checked)
        values[prop] = feeling;
      else
        values[prop] = "";

      await item.update(values);
    });
    html.find('.status-checkbox').click(async ev => {
      ev.preventDefault();
      const checkbox = $(ev.currentTarget);
      const status = checkbox.attr('name');

      const values = {};
      values[status] = checkbox[0].checked;

      await this.actor.update(values);
    });

    // Active Effect management
    html.find(".effect-control").click(ev => onManageActiveEffect(ev, this.actor));

    // Rollable abilities.
    html.find('.rollable').click(this._onRoll.bind(this));

    // Drag events for macros.
    if (this.actor.owner) {
      let handler = ev => this._onDragStart(ev);
      html.find('li.item').each((i, li) => {
        if (li.classList.contains("inventory-header")) return;
        li.setAttribute("draggable", true);
        li.addEventListener("dragstart", handler, false);
      });
    }
  }

  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
   * @param {Event} event   The originating click event
   * @private
   */
  async _onItemCreate(event) {
    event.preventDefault();
    const header = event.currentTarget;
    const type = header.dataset.type;
    const data = duplicate(header.dataset);
    const name = `New ${type.capitalize()}`;
    const itemData = {
      name: name,
      type: type,
      data: data
    };
    // Remove the type from the dataset since it's in the itemData.type prop.
    delete itemData.data["type"];

    // Finally, create the item!
    return await Item.create(itemData, {parent: this.actor});
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  _onRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;

    // Handle item rolls.
    if (dataset.rollType) {
      /*if (dataset.rollType == 'item') {
        const itemId = element.closest('.item').dataset.itemId;
        const item = this.actor.items.get(itemId);
        if (item) return item.roll();
      } */
      
      if (dataset.rollType === "weapon") {
        const itemId = element.closest('.item').dataset.itemId;
        const item = this.actor.items.get(itemId);

        return this.actor.rollWeapon(item);
      }
    }

    // Handle rolls that supply the formula directly.
    /*if (dataset.roll) {
      let label = dataset.label ? `[roll] ${dataset.label}` : '';
      let roll = new Roll(dataset.roll, this.actor.getRollData()).roll();
      roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: label,
        rollMode: game.settings.get('core', 'rollMode'),
      });
      return roll;
    }*/
  }

  /** @override */
  async _onDrop(event) {
    event.preventDefault();

    let data;
    try {
      data = JSON.parse(event.dataTransfer.getData("text/plain"));
    } catch (err) {
      return false;
    }

    if (this.actor.data.type === "character") {
      return this._onDropCharacter(event, data);
    }
    return super._onDrop(event);
  }

  _onDropCharacter(event, data) {
    const item = game.items.get(data["id"]);
    const other = this.actor.items.filter(i => i.name === item.name);
    if (item.type === "class") {
      if (other.length === 0) {
        return super._onDrop(event);
      } else {
        other[0].update({
          "data.level": other[0].data.data.level + 1
        });
      }
    } else if (item.type === "feature") {
      if (other.length === 0) {
        return super._onDrop(event);
      } else {
        other[0].update({
          "data.level": other[0].data.data.level + 1
        });
      }
    } else if (item.type === "weapon" || item.type === "armor" || item.type === "accessory" || item.type === "shield") {
      return super._onDrop(event);
    }

    return false;
  }
}
