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
    "crisis": "FABULAULTIMA.OnCrisis",
    "arcanum": "FABULAULTIMA.OnArcanum",
    "ipSpent": "FABULAULTIMA.OnInventoryPointsSpent",
    "potionCreated": "FABULAULTIMA.OnPotionCreated"
}

FABULAULTIMA.actionTypes = {
    "none": "FABULAULTIMA.None",
    "attack": "FABULAULTIMA.Attack",
    "skill": "FABULAULTIMA.Skill",
    "study": "FABULAULTIMA.Study",
    "guard": "FABULAULTIMA.Guard",
    "inventory": "FABULAULTIMA.Inventory",
    "objective": "FABULAULTIMA.Objective",
    "hinder": "FABULAULTIMA.Hinder",
    "spell": "FABULAULTIMA.Spell"
}

FABULAULTIMA.weaponCategories = {
    "arcane": "FABULAULTIMA.Arcane",
    "bow": "FABULAULTIMA.Bow",
    "flail": "FABULAULTIMA.Flail",
    "firearm": "FABULAULTIMA.Firearm",
    "spear": "FABULAULTIMA.Spear",
    "throw": "FABULAULTIMA.Throw",
    "heavy": "FABULAULTIMA.Heavy",
    "dagger": "FABULAULTIMA.Dagger",
    "fist": "FABULAULTIMA.Fist",
    "sword": "FABULAULTIMA.Sword"
}

FABULAULTIMA.weaponTypes = {
    "melee": "FABULAULTIMA.Melee",
    "ranged": "FABULAULTIMA.Ranged"
}

FABULAULTIMA.damageTypes = {
    "none": "FABULAULTIMA.DamageNone",
    "normal": "FABULAULTIMA.DamageNormal",
    "wind": "FABULAULTIMA.DamageWind",
    "lightning": "FABULAULTIMA.DamageLightning",
    "dark": "FABULAULTIMA.DamageDark",
    "earth": "FABULAULTIMA.DamageEarth",
    "fire": "FABULAULTIMA.DamageFire",
    "ice": "FABULAULTIMA.DamageIce",
    "light": "FABULAULTIMA.DamageLight",
    "poison": "FABULAULTIMA.DamagePoison"
}

FABULAULTIMA.affinityTypes = {
    "vulnerable": "FABULAULTIMA.Vulnerable",
    "neutral": "FABULAULTIMA.Neutral",
    "resistant": "FABULAULTIMA.Resistant",
    "immune": "FABULAULTIMA.Immune",
    "absorb": "FABULAULTIMA.Absorb"
}

FABULAULTIMA.npcRanks = {
    "soldier": "FABULAULTIMA.RankSoldier",
    "elite": "FABULAULTIMA.RankElite",
    "champion": "FABULAULTIMA.RankChampion"
}

FABULAULTIMA.npcTypes = {
    "beast": {
        "label": "FABULAULTIMA.Beast",
        "startingAbilities": 4,
        "rules": {
            "equippable": false
        }
    },
    "construct": {
        "label": "FABULAULTIMA.Construct",
        "startingAbilities": 2,
        "rules": {
            "affinities": {
                "poison": "immune",
                "earth": "resistant"
            },
            "statusImmunities": {
                "poisoned": true
            }
        }
    },
    "demon": {
        "label": "FABULAULTIMA.Demon",
        "startingAbilities": 3,
        "rules": {
            "affinities": {
                "choose": {
                    "from": "any",
                    "qt": 2,
                    "type": "resistant"
                }
            }
        }
    },
    "elemental": {
        "label": "FABULAULTIMA.Elemental",
        "startingAbilities": 2,
        "rules": {
            "affinities": {
                "poison": "immune",
                "choose": {
                    "from": "any",
                    "qt": 1,
                    "type": "resistant"
                }
            },
            "statusImmunities": {
                "poisoned": true
            }
        }
    },
    "monster": {
        "label": "FABULAULTIMA.Monster",
        "startingAbilities": 4,
        "rules": {}
    },
    "undead": {
        "label": "FABULAULTIMA.Undead",
        "startingAbilities": 2,
        "rules": {
            "affinities": {
                "dark": "immune",
                "poison": "immune",
                "light": "vulnerable"
            },
            "statusImmunities": {
                "poison": true
            },
            "damagedByHealing": true
        }
    },
    "plant": {
        "label": "FABULAULTIMA.Plant",
        "startingAbilities": 3,
        "rules": {
            "affinities": {
                "choose": {
                    "from": ["wind", "lightning", "fire", "cold"],
                    "qt": 1,
                    "type": "vulnerable"
                }
            },
            "statusImmunities": {
                "dazed": false,
                "shaken": false,
                "enraged": false
            }
        }
    },
    "humanoid": {
        "label": "FABULAULTIMA.Humanoid",
        "startingAbilities": 3,
        "rules": {
            "equippable": true
        }
    }
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