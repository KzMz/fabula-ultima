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

FABULAULTIMA.timings = {
    "action": "FABULAULTIMA.Action",
    "reaction": "FABULAULTIMA.Reaction",
    "free": "FABULAULTIMA.Free",
    "beforeConflict": "FABULAULTIMA.BeforeConflict",
    "beforeDamage": "FABULAULTIMA.BeforeDamage",
    "guard": "FABULAULTIMA.OnGuard",
    "crisis": "FABULAULTIMA.OnCrisis"
}

FABULAULTIMA.actionTypes = {
    "none": "FABULAULTIMA.None",
    "attack": "FABULAULTIMA.Attack",
    "skill": "FABULAULTIMA.Skill",
    "study": "FABULAULTIMA.Study",
    "guard": "FABULAULTIMA.Guard",
    "inventory": "FABULAULTIMA.Inventory",
    "objective": "FABULAULTIMA.Objective",
    "hinder": "FABULAULTIMA.Hinder"
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