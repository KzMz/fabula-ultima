export const FABULAULTIMA = {};

// Define constants here, such as:
FABULAULTIMA.foobar = {
  'bas': 'FABULAULTIMA.bas',
  'bar': 'FABULAULTIMA.bar'
};

/**
 * The set of Ability Scores used within the system.
 * @type {Object}
 */
 FABULAULTIMA.abilities = {
  "vig": "FABULAULTIMA.AbilityVig",
  "dex": "FABULAULTIMA.AbilityDex",
  "int": "FABULAULTIMA.AbilityInt",
  "vol": "FABULAULTIMA.AbilityVol",
};

FABULAULTIMA.abilityAbbreviations = {
  "vig": "FABULAULTIMA.AbilityVigAbbr",
  "dex": "FABULAULTIMA.AbilityDexAbbr",
  "int": "FABULAULTIMA.AbilityIntAbbr",
  "vol": "FABULAULTIMA.AbilityVolAbbr"
};

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