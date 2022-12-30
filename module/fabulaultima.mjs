// Import document classes.
import { FabulaUltimaActor } from "./documents/actor.mjs";
import { FabulaUltimaItem } from "./documents/item.mjs";
// Import sheet classes.
import { FabulaUltimaActorSheet } from "./sheets/actor-sheet.mjs";
import { FabulaUltimaItemSheet } from "./sheets/item-sheet.mjs";
// Import helper/utility classes and constants.
import { preloadHandlebarsTemplates } from "./helpers/templates.mjs";
import { FABULAULTIMA } from "./helpers/config.mjs";
import { FabulaUltimaCombatHud } from "./helpers/combat.js";
import { FabulaUltimaGroupRoll } from "./helpers/groupRoll/groupRoll.mjs";

/* -------------------------------------------- */
/*  Init Hook                                   */
/* -------------------------------------------- */

Hooks.once('init', async function() {

  // Add utility classes to the global game object so that they're more easily
  // accessible in global contexts.
  game.fabulaultima = {
    FabulaUltimaActor,
    FabulaUltimaItem,
    rollItemMacro,
    combatHud: new FabulaUltimaCombatHud()
  };

  // Add custom constants for configuration.
  CONFIG.FABULAULTIMA = FABULAULTIMA;

  /**
   * Set an initiative formula for the system
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: "1d@abilities.dex.value + 1d@abilities.int.value",
    decimals: 2
  };

  // Define custom Document classes
  CONFIG.Actor.documentClass = FabulaUltimaActor;
  CONFIG.Item.documentClass = FabulaUltimaItem;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("fabulaultima", FabulaUltimaActorSheet, { makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("fabulaultima", FabulaUltimaItemSheet, { makeDefault: true });

  game.settings.register("fabulaultima", "usePeculiarities", {
    name: "FABULAULTIMA.UsePeculiarities",
    hint: "FABULAULTIMA.UsePeculiaritiesHint",
    scope: "world",
    config: true,
    type: Boolean,
    default: true
  });
  game.settings.register("fabulaultima", "useLimits", {
    name: "FABULAULTIMA.UseLimits",
    hint: "FABULAULTIMA.UseLimitsHint",
    scope: "world",
    config: true,
    type: Boolean,
    default: false
  });
  game.settings.register("fabulaultima", "usePartnerLimits", {
    name: "FABULAULTIMA.UsePartnerLimits",
    hint: "FABULAULTIMA.UsePartnerLimitsHint",
    scope: "world",
    config: true,
    type: Boolean,
    default: false
  });

  // Preload Handlebars templates.
  return preloadHandlebarsTemplates();
});

/* -------------------------------------------- */
/*  Handlebars Helpers                          */
/* -------------------------------------------- */

// If you need to add Handlebars helpers, here are a few useful examples:
Handlebars.registerHelper('concat', function() {
  var outStr = '';
  for (var arg in arguments) {
    if (typeof arguments[arg] != 'object') {
      outStr += arguments[arg];
    }
  }
  return outStr;
});

Handlebars.registerHelper('toLowerCase', function(str) {
  return str.toLowerCase();
});

Handlebars.registerHelper('option', function (value, label, selectedValue) {
  var selectedProp = value == selectedValue ? 'selected="selected"' : '';
  return new Handlebars.SafeString('<option value="' + value + '" ' + selectedProp + '>' + label + "</option>");
});

/* -------------------------------------------- */
/*  Ready Hook                                  */
/* -------------------------------------------- */

Hooks.once("ready", async function() {
  // Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
  Hooks.on("hotbarDrop", (bar, data, slot) => createItemMacro(data, slot));

  if (game.combat)
    game.fabulaultima.combatHud.addToScreen();
});

Hooks.once("socketlib.ready", () => {
  console.log("Fabula Ultima | Ready");

  FabulaUltimaGroupRoll.ready();
  FabulaUltimaCombatHud.ready();
});

Hooks.on("createCombat", async function() {
  game.fabulaultima.combatHud.addToScreen();
});

Hooks.on("deleteCombat", async function () {
  game.fabulaultima.combatHud.deleteFromScreen();
});

Hooks.on("createCombatant", async function () {
  game.fabulaultima.combatHud.update();
});

Hooks.on("deleteCombatant", async function () {
  game.fabulaultima.combatHud.update();
});

Hooks.on("updateActor", async function (actor) {
  if (game.combat)
    game.fabulaultima.combatHud.update();
});

Hooks.on('getSceneControlButtons', async function (buttons) {
  FabulaUltimaGroupRoll.getSceneControlButtons(buttons);
});

/* -------------------------------------------- */
/*  Hotbar Macros                               */
/* -------------------------------------------- */

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {Object} data     The dropped data
 * @param {number} slot     The hotbar slot to use
 * @returns {Promise}
 */
async function createItemMacro(data, slot) {
  if (data.type !== "Item") return;
  if (!("data" in data)) return ui.notifications.warn("You can only create macro buttons for owned Items");
  const item = data.data;

  // Create the macro command
  const command = `game.fabulaultima.rollItemMacro("${item.name}");`;
  let macro = game.macros.entities.find(m => (m.name === item.name) && (m.command === command));
  if (!macro) {
    macro = await Macro.create({
      name: item.name,
      type: "script",
      img: item.img,
      command: command,
      flags: { "fabulaultima.itemMacro": true }
    });
  }
  game.user.assignHotbarMacro(macro, slot);
  return false;
}

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {string} itemName
 * @return {Promise}
 */
function rollItemMacro(itemName) {
  const speaker = ChatMessage.getSpeaker();
  let actor;
  if (speaker.token) actor = game.actors.tokens[speaker.token];
  if (!actor) actor = game.actors.get(speaker.actor);
  const item = actor ? actor.items.find(i => i.name === itemName) : null;
  if (!item) return ui.notifications.warn(`Your controlled Actor does not have an item named ${itemName}`);

  // Trigger the item roll
  return item.roll();
}