export const FABULAULTIMA = {};

/**
 * The set of Ability Scores used within the system.
 * @type {Object}
 */
 FABULAULTIMA.abilities = {
    "dex": "FABULAULTIMA.AbilityDex",
    "int": "FABULAULTIMA.AbilityInt",
    "vig": "FABULAULTIMA.AbilityVig",
    "vol": "FABULAULTIMA.AbilityVol",
};

FABULAULTIMA.abilityAbbreviations = {
    "dex": "FABULAULTIMA.AbilityDexAbbr",
    "int": "FABULAULTIMA.AbilityIntAbbr",
    "vig": "FABULAULTIMA.AbilityVigAbbr",
    "vol": "FABULAULTIMA.AbilityVolAbbr"
};

FABULAULTIMA.costResources = {
    "mp": "FABULAULTIMA.MindPoints",
    "hp": "FABULAULTIMA.HealthPoints",
    "fp": "FABULAULTIMA.FabulaPoints",
    "ip": "FABULAULTIMA.InventoryPoints"
}

FABULAULTIMA.statuses = {
    "slow": {
        "label": "FABULAULTIMA.Slow",
        "affects": ["dex"]
    },
    "dazed": {
        "label": "FABULAULTIMA.Dazed",
        "affects": ["int"]
    },
    "weak": {
        "label": "FABULAULTIMA.Weak",
        "affects": ["vig"]
    },
    "shaken": {
        "label": "FABULAULTIMA.Shaken",
        "affects": ["vol"]
    },
    "enraged": {
        "label": "FABULAULTIMA.Enraged",
        "affects": [
            "dex", "int"
        ]
    },
    "poisoned": {
        "label": "FABULAULTIMA.Poisoned",
        "affects": [
            "vol", "vig"
        ]
    }
}