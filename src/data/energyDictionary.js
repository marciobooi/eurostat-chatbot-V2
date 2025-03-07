/**
 * Energy dictionary with multilingual support
 * Contains information about energy topics across multiple languages
 */

import { energyDefinitionsEn } from './energyDefinitionsEn';
import { energyDefinitionsFr } from './energyDefinitionsFr';
import { energyDefinitionsDe } from './energyDefinitionsDe';

export const energyDictionary = {
    en: {
        "natural gas": {
            text: "Natural gas is a fossil fuel primarily composed of methane.",
            dataset: "nrg_bal_c",
            additionalDatasets: [
                "nrg_ti_gas",   // For trade data
                "nrg_cb_gasm"   // For monthly balance data
            ],
            dimensions: ["unit", "nrg_bal", "siec", "geo", "time"],
            siec: "G3000",
            unit: "TJ_GCV",
            hasVisualization: true,
            visualizationType: ["line", "bar", "pie"],
            balanceCodes: {
                production: "PPRD",
                imports: "IMP",
                exports: "EXP",
                consumption: "FC_E"
            }
        },
        "oil": {
            text: "Crude oil and petroleum products statistics.",
            dataset: "nrg_cb_oil",
            additionalDatasets: [
                "nrg_ti_oil",   // For trade data
                "nrg_cb_oilm"   // For monthly balance data
            ],
            dimensions: ["unit", "nrg_bal", "siec", "geo", "time"],
            siec: "O4000",
            unit: "THS_T",
            hasVisualization: true,
            visualizationType: ["line", "bar", "pie"],
            balanceCodes: {
                production: "PPRD",
                imports: "IMP",
                exports: "EXP",
                consumption: "FC_E"
            }
        },
        "electricity": {
            text: "Electricity production and consumption statistics.",
            dataset: "nrg_bal_c",
            additionalDatasets: [
                "nrg_ind_peh"   // For detailed production data
            ],
            dimensions: ["unit", "nrg_bal", "siec", "geo", "time"],
            siec: "E7000",
            unit: "GWH",
            hasVisualization: true,
            visualizationType: ["line", "bar", "pie"],
            balanceCodes: {
                production: "GEP",  // Gross electricity production
                consumption: "FC_E",
                totalConsumption: "FC"
            }
        },
        "solid fossil fuels": {
            title: "Solid Fossil Fuels",
            text: "Solid fossil fuels including hard coal, lignite, and derivatives like coke and patent fuel. Covers production, trade, and consumption across different sectors.",
            dataset: "nrg_cb_sff",
            siec: "C0000X0350-0370",
            unit: "THS_T",
            hasVisualization: true,
            visualizationType: ["line", "bar"],
            relatedTopics: ["coal", "energy consumption", "industrial energy"],
            balanceCodes: {
                production: "IPRD",
                imports: "IMP",
                exports: "EXP",
                consumption: "FC"
            },
            keywords: ["coal", "lignite", "coke", "solid fuels", "mining"]
        },
        "solid fossil fuels trade": {
            title: "Solid Fossil Fuels Trade",
            text: "International trade of solid fossil fuels including hard coal, lignite, and their derivatives, broken down by partner country.",
            dataset: "nrg_ti_sff",
            siec: "C0000X0350-0370",
            unit: "THS_T",
            hasVisualization: true,
            visualizationType: ["line", "pie", "bar"],
            relatedTopics: ["solid fossil fuels", "coal", "energy trade"],
            balanceCodes: {
                imports: "IMP",
                exports: "EXP"
            },
            keywords: ["coal trade", "coal imports", "coal exports", "fossil fuel trade"]
        },
        "non-fossil heat": {
            title: "Non-Fossil Heat and Electricity",
            text: "Production of electricity and heat from non-fossil sources including hydro, wind, solar, geothermal, and nuclear power.",
            dataset: "nrg_ind_pehnf",
            unit: "GWH",
            hasVisualization: true,
            visualizationType: ["line", "pie", "bar"],
            relatedTopics: ["renewable energy", "electricity production", "heat production"],
            balanceCodes: {
                electricityProduction: "GEP",
                heatProduction: "GHP"
            },
            keywords: ["renewable", "nuclear", "clean energy", "heat production", "power generation"]
        },
        "district heat": {
            title: "District Heat",
            text: "Heat distributed through a network to multiple buildings or facilities for space heating and hot water.",
            dataset: "nrg_ind_pehnf",
            siec: "H8000D",
            unit: "TJ",
            hasVisualization: true,
            visualizationType: ["line", "bar"],
            relatedTopics: ["heat production", "energy efficiency", "urban energy"],
            balanceCodes: {
                production: "GHP",
                distribution: "FC"
            },
            keywords: ["district heating", "heat network", "urban heating", "space heating"]
        },
        "renewable energy": {
            relatedDatasets: ["nrg_ind_pehnf", "nrg_ind_ren"],
            balanceCodes: {
                total: "REN",
                transport: "REN_TRA",
                electricity: "REN_ELC",
                heating: "REN_HEAT_CL",
                districtHeat: "REN_WHC_DHEAT_DCL"
            }
        },
        "electricity production": {
            relatedDatasets: ["nrg_cb_e", "nrg_ind_pehnf"],
            balanceCodes: {
                grossProduction: "GEP",
                netProduction: "NEP",
                losses: "LOSS",
                consumption: "FC"
            }
        },
        "energy efficiency": {
            relatedDatasets: ["nrg_ind_eff"],
            balanceCodes: {
                primaryConsumption: "PEC_EED",
                finalConsumption: "FEC_EED",
                target2030: "PEC2020-2030",
                progress2030: "PEC_DT2030"
            }
        },
        "nuclear fuel": {
            title: "Nuclear Fuel",
            text: "Nuclear fuel production, capacity and management including fresh fuel, MOX fuel, and nuclear heat production.",
            dataset: "nrg_inf_nuc",
            siec: "S2000",
            unit: "THS_T",
            hasVisualization: true,
            visualizationType: ["line", "bar"],
            relatedTopics: ["nuclear energy", "electricity production", "energy capacity"],
            balanceCodes: {
                production: "IPRD",
                imports: "IMP",
                exports: "EXP",
                stocks: "STK_CHG"
            },
            keywords: ["nuclear fuel", "uranium", "MOX", "nuclear waste", "fuel cycle"]
        },
        "nuclear infrastructure": {
            title: "Nuclear Infrastructure",
            text: "Nuclear power infrastructure including enrichment capacity, fuel production facilities, and fuel management.",
            dataset: "nrg_inf_nuc",
            siec: "S2000",
            unit: "TSWU",
            hasVisualization: true,
            visualizationType: ["line", "bar"],
            relatedTopics: ["nuclear fuel", "nuclear energy", "energy capacity"],
            balanceCodes: {
                enrichmentCapacity: "CAP_EN",
                fuelProduction: "PRD_FF",
                moxProduction: "PRD_MOXF",
                nuclearHeat: "PRD_NUCH"
            },
            keywords: ["nuclear facilities", "enrichment", "fuel fabrication", "nuclear capacity"]
        }
    },
    // Add translations for other languages...
    fr: {
        "natural gas": {
            text: "Le gaz naturel est un combustible fossile principalement composé de méthane.",
            // Same configuration as English...
        },
        "oil": {
            text: "Statistiques sur le pétrole brut et les produits pétroliers.",
            // Same configuration as English...
        },
        "electricity": {
            text: "Statistiques sur la production et la consommation d'électricité.",
            // Same configuration as English...
        }
    },
    de: {
        "natural gas": {
            text: "Erdgas ist ein fossiler Brennstoff, der hauptsächlich aus Methan besteht.",
            // Same configuration as English...
        },
        "oil": {
            text: "Statistiken zu Rohöl und Erdölprodukten.",
            // Same configuration as English...
        },
        "electricity": {
            text: "Statistiken zur Stromerzeugung und zum Stromverbrauch.",
            // Same configuration as English...
        }
    }
};

export default energyDictionary;

// Export helper functions for working with the dictionary

/**
 * Get related topics for a specific topic
 * @param {string} topic - The topic to find related topics for
 * @param {string} language - The language code
 * @returns {string[]} - Array of related topics
 */
export const getRelatedTopics = (topic, language = 'en') => {
  const dict = energyDictionary[language] || energyDictionary.en;
  return dict[topic.toLowerCase()]?.related || [];
};

/**
 * Get keywords for a specific topic
 * @param {string} topic - The topic to find keywords for
 * @param {string} language - The language code
 * @returns {string[]} - Array of keywords
 */
export const getKeywords = (topic, language = 'en') => {
  const dict = energyDictionary[language] || energyDictionary.en;
  return dict[topic.toLowerCase()]?.keywords || [];
};