/**
 * Dataset Dictionary for Eurostat API
 * Defines all available parameters and their possible values for each dataset
 */

export const datasetDictionary = {
    // Energy Balance Complete Dataset (nrg_bal_c)
    "nrg_bal_c": {
        endpoint: "nrg_bal_c",
        description: "Complete energy balance - annual data",
        dimensions: {
            // Units of measurement
            unit: {
                description: "Unit of measure",
                values: {
                    "KTOE": "Thousand tonnes of oil equivalent",
                    "GWH": "Gigawatt hours",
                    "TJ": "Terajoules"
                }
            },
            // Energy Balance Indicators
            nrg_bal: {
                description: "Energy balance indicator",
                values: {
                    // Primary Production and Recovery
                    "PPRD": "Primary production",
                    "RCV_RCY": "Recovered and recycled products",
                    
                    // Trade and Transfers
                    "IMP": "Imports",
                    "EXP": "Exports",
                    "STK_CHG": "Stock changes",
                    "GAE": "Gross available energy",
                    
                    // International Maritime and Aviation
                    "INTMARB": "International maritime bunkers",
                    "INTAVI": "International aviation",
                    
                    // Supply and Consumption Indicators
                    "NRGSUP": "Energy available for final consumption",
                    "GIC": "Gross inland consumption",
                    "FC_E": "Final energy consumption",
                    
                    // Energy Efficiency Directive Indicators
                    "GIC_EED": "Gross inland consumption (Energy Efficiency Directive)",
                    "PEC_EED": "Primary energy consumption",
                    "FEC_EED": "Final energy consumption (Energy Efficiency Directive)",
                    
                    // Transformation Input
                    "TI_E": "Transformation input - energy use",
                    "TI_EHG_E": "Transformation input in electricity and heat generation",
                    "TI_CO_E": "Transformation input in coke ovens",
                    
                    // Transformation Output
                    "TO": "Transformation output - total",
                    "TO_EHG": "Transformation output from electricity and heat generation",
                    
                    // Energy Sector
                    "NRG_E": "Energy sector - energy use",
                    
                    // Final Consumption
                    "FC_IND_E": "Final energy consumption - industry sector",
                    "FC_TRA_E": "Final energy consumption - transport sector",
                    "FC_OTH_E": "Final energy consumption - other sectors",
                    "FC_OTH_HH_E": "Final energy consumption - households",
                    
                    // Statistical Differences
                    "STATDIFF": "Statistical differences"
                }
            },
            // Energy Products (SIEC classification)
            siec: {
                description: "Energy product (Standard International Energy Product Classification)",
                values: {
                    "TOTAL": "Total all products",
                    // Coal and manufactured gases
                    "C0000X0350-0370": "Coal and manufactured gases",
                    "C0110": "Anthracite",
                    "C0121": "Coking coal",
                    
                    // Oil and petroleum products
                    "O4000XBIO": "Oil and petroleum products (excluding biofuel portion)",
                    "O4100_TOT": "Crude oil",
                    "O4200": "Natural gas liquids",
                    "O4300": "Refinery feedstocks",
                    
                    // Natural gas and renewables
                    "G3000": "Natural gas",
                    "RA000": "Renewables and biofuels",
                    "RA100": "Hydro",
                    "RA300": "Wind",
                    "RA410": "Solar photovoltaic",
                    "RA500": "Biofuels",
                    
                    // Electricity and heat
                    "E7000": "Electricity",
                    "H8000": "Heat"
                }
            },
            // Geographical entities
            geo: {
                description: "Geographical entity",
                values: {
                    "EU27_2020": "European Union (27 countries)",
                    "BE": "Belgium",
                    "BG": "Bulgaria",
                    "CZ": "Czech Republic",
                    "DK": "Denmark",
                    "DE": "Germany",
                    "EE": "Estonia",
                    "IE": "Ireland",
                    "EL": "Greece",
                    "ES": "Spain",
                    "FR": "France",
                    "HR": "Croatia",
                    "IT": "Italy",
                    "CY": "Cyprus",
                    "LV": "Latvia",
                    "LT": "Lithuania",
                    "LU": "Luxembourg",
                    "HU": "Hungary",
                    "MT": "Malta",
                    "NL": "Netherlands",
                    "AT": "Austria",
                    "PL": "Poland",
                    "PT": "Portugal",
                    "RO": "Romania",
                    "SI": "Slovenia",
                    "SK": "Slovakia",
                    "FI": "Finland",
                    "SE": "Sweden"
                }
            }
        },
        // Default parameters when not specified
        defaults: {
            unit: "KTOE",
            geo: "EU27_2020"
        },
        // Required parameters that must be included in every query
        required: ["siec", "nrg_bal"],
        // Function to validate and prepare API parameters
        prepareParams: (params) => {
            const prepared = { ...params };
            
            // Ensure required parameters
            if (!prepared.siec) {
                prepared.siec = "TOTAL";
            }
            if (!prepared.nrg_bal) {
                prepared.nrg_bal = "FC_E"; // Default to final energy consumption
            }
            
            // Add default unit if not specified
            if (!prepared.unit) {
                prepared.unit = "KTOE";
            }
            
            // Add default geo if not specified
            if (!prepared.geo) {
                prepared.geo = "EU27_2020";
            }
            
            return prepared;
        },
        // Function to build the API URL with parameters
        buildUrl: (params) => {
            const baseUrl = "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/nrg_bal_c";
            const preparedParams = datasetDictionary.nrg_bal_c.prepareParams(params);
            
            // Convert params object to URL parameters
            const queryParams = new URLSearchParams({
                format: "JSON", // Always JSON format
                ...preparedParams
            });
            
            return `${baseUrl}?${queryParams.toString()}`;
        },
        // Function to parse the response
        parseResponse: (response) => {
            try {
                // Extract the actual data points
                const { value, dimension } = response;
                if (!value || !dimension) {
                    throw new Error("Invalid response structure");
                }
                
                // Create a standardized response format
                return {
                    data: value,
                    metadata: {
                        dimensions: dimension,
                        source: "Eurostat",
                        dataset: "nrg_bal_c"
                    }
                };
            } catch (error) {
                console.error("Error parsing nrg_bal_c response:", error);
                throw error;
            }
        }
    },

    // Oil Trade Dataset (nrg_ti_oil)
    "nrg_ti_oil": {
        endpoint: "nrg_ti_oil",
        description: "Oil and petroleum products trade by partner country - annual data",
        dimensions: {
            // Units of measurement
            unit: {
                description: "Unit of measure",
                values: {
                    "THS_T": "Thousand tonnes"
                }
            },
            // SIEC Classification for oil products
            siec: {
                description: "Energy product (SIEC classification)",
                values: {
                    "O4000": "Oil (total)",
                    "O4000XBIO": "Oil and petroleum products (excluding biofuel portion)",
                    "O4100_TOT_4200-4500": "Crude oil, NGL and other hydrocarbons - total",
                    "O4100_TOT_4200-4500XBIO": "Crude oil, NGL and other hydrocarbons (excluding biofuel portion)",
                    "O4100_TOT": "Crude oil - total",
                    "O4200": "Natural gas liquids (NGL)",
                    "O4300": "Refinery feedstocks",
                    "O4400X4410": "Additives and oxygenates (excluding biofuel portion)",
                    "O4400": "Additives and oxygenates",
                    "O4500": "Other hydrocarbons",
                    "O4600": "Oil products",
                    "O4600XBIO": "Oil products (excluding biofuel portion)",
                    "O4620": "Ethane",
                    "O4630": "Liquefied petroleum gases (LPG)",
                    "O4640": "Naphtha",
                    "O4651": "Motor gasoline",
                    "O4652": "Aviation gasoline",
                    "O4652XR5210B": "Aviation gasoline (excluding bio)",
                    "O4653": "Gasoline-type jet fuel",
                    "O4661": "Kerosene-type jet fuel",
                    "O4661XR5230B": "Kerosene-type jet fuel (excluding bio)",
                    "O4669": "Other kerosene",
                    "O4671": "Gas/diesel oil",
                    "O4671XR5220B": "Gas/diesel oil (excluding bio)",
                    "O46711": "Transport diesel",
                    "O46712": "Heating and other gasoil",
                    "O4680": "Fuel oil",
                    "O4681": "Low sulphur fuel oil",
                    "O4682": "High sulphur fuel oil",
                    "O4691": "White spirit and industrial spirits",
                    "O4692": "Lubricants",
                    "O4693": "Paraffin waxes",
                    "O4694": "Petroleum coke",
                    "O4695": "Bitumen",
                    "O4699": "Other oil products n.e.c.",
                    "R5210B": "Biogasoline",
                    "R5220B": "Biodiesels",
                    "R5230B": "Bio jet kerosene"
                }
            },
            // Geographical entities for reporting country
            geo: {
                description: "Reporting country",
                values: {
                    "EU27_2020": "European Union (27 countries)",
                    "EA20": "Euro area (20 countries)",
                    "BE": "Belgium",
                    "BG": "Bulgaria",
                    "CZ": "Czech Republic",
                    "DK": "Denmark",
                    "DE": "Germany",
                    "EE": "Estonia",
                    "IE": "Ireland",
                    "EL": "Greece",
                    "ES": "Spain",
                    "FR": "France",
                    "HR": "Croatia",
                    "IT": "Italy",
                    "CY": "Cyprus",
                    "LV": "Latvia",
                    "LT": "Lithuania",
                    "LU": "Luxembourg",
                    "HU": "Hungary",
                    "MT": "Malta",
                    "NL": "Netherlands",
                    "AT": "Austria",
                    "PL": "Poland",
                    "PT": "Portugal",
                    "RO": "Romania",
                    "SI": "Slovenia",
                    "SK": "Slovakia",
                    "FI": "Finland",
                    "SE": "Sweden",
                    "IS": "Iceland",
                    "LI": "Liechtenstein",
                    "NO": "Norway",
                    "UK": "United Kingdom",
                    "BA": "Bosnia and Herzegovina",
                    "ME": "Montenegro",
                    "MD": "Moldova",
                    "MK": "North Macedonia",
                    "GE": "Georgia",
                    "AL": "Albania",
                    "RS": "Serbia",
                    "TR": "Turkey",
                    "UA": "Ukraine",
                    "XK": "Kosovo"
                }
            },
            // Partner countries
            partner: {
                description: "Partner country",
                values: {
                    "TOTAL": "Total all partner countries",
                    // European countries
                    "BE": "Belgium",
                    "BG": "Bulgaria",
                    "CZ": "Czech Republic",
                    "DK": "Denmark",
                    "DE": "Germany",
                    "EE": "Estonia",
                    "IE": "Ireland",
                    "EL": "Greece",
                    "ES": "Spain",
                    "FR": "France",
                    "HR": "Croatia",
                    "IT": "Italy",
                    "CY": "Cyprus",
                    "LV": "Latvia",
                    "LT": "Lithuania",
                    "LU": "Luxembourg",
                    "HU": "Hungary",
                    "MT": "Malta",
                    "NL": "Netherlands",
                    "AT": "Austria",
                    "PL": "Poland",
                    "PT": "Portugal",
                    "RO": "Romania",
                    "SI": "Slovenia",
                    "SK": "Slovakia",
                    "FI": "Finland",
                    "SE": "Sweden",
                    "UK": "United Kingdom",
                    "NO": "Norway",
                    "CH": "Switzerland",
                    "RU": "Russia",
                    // Other European
                    "AD": "Andorra",
                    "AL": "Albania",
                    "BA": "Bosnia and Herzegovina",
                    "BY": "Belarus",
                    "GI": "Gibraltar",
                    "ME": "Montenegro",
                    "MD": "Moldova",
                    "MK": "North Macedonia",
                    "RS": "Serbia",
                    "TR": "Turkey",
                    "UA": "Ukraine",
                    "XK": "Kosovo",
                    // Region groups
                    "EUR_OTH": "Other European countries",
                    "EX_SU_OTH": "Former Soviet Union n.e.c.",
                    // African countries
                    "DZ": "Algeria",
                    "EG": "Egypt",
                    "LY": "Libya",
                    "MA": "Morocco",
                    "TN": "Tunisia",
                    "NG": "Nigeria",
                    "ZA": "South Africa",
                    "AO": "Angola",
                    "CD": "Congo DR",
                    "GQ": "Equatorial Guinea",
                    "AFR_OTH": "Other African countries",
                    // Americas
                    "CA": "Canada",
                    "US": "United States",
                    "MX": "Mexico",
                    "AR": "Argentina",
                    "BR": "Brazil",
                    "VE": "Venezuela",
                    "AME_OTH": "Other American countries",
                    // Asia and Middle East
                    "SA": "Saudi Arabia",
                    "IR": "Iran",
                    "IQ": "Iraq",
                    "KW": "Kuwait",
                    "QA": "Qatar",
                    "AE": "United Arab Emirates",
                    "KZ": "Kazakhstan",
                    "CN": "China",
                    "IN": "India",
                    "JP": "Japan",
                    "KR": "South Korea",
                    "ASI_NME_OTH": "Other Near and Middle Eastern countries",
                    "ASI_OTH": "Other Asian countries",
                    // Oceania
                    "AU": "Australia",
                    "NZ": "New Zealand",
                    // Special values
                    "NSP": "Not specified"
                }
            }
        },
        // Default parameters
        defaults: {
            unit: "THS_T",
            siec: "O4100_TOT" // Default to crude oil total
        },
        // Required parameters
        required: ["siec"],
        // Function to validate and prepare API parameters
        prepareParams: (params) => {
            const prepared = { ...params };
            
            // Ensure required parameters
            if (!prepared.siec) {
                prepared.siec = "O4100_TOT"; // Default to crude oil total
            }
            
            // Add default unit if not specified
            if (!prepared.unit) {
                prepared.unit = "THS_T";
            }
            
            // For specific country queries, use geo parameter and TOTAL for partner
            if (prepared.country || prepared.geo) {
                prepared.geo = prepared.country || prepared.geo;
                prepared.partner = "TOTAL"; // Get total imports/exports for the country
            }
            
            return prepared;
        },
        // Function to build the API URL with parameters
        buildUrl: (params) => {
            const baseUrl = "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/nrg_ti_oil";
            const preparedParams = datasetDictionary.nrg_ti_oil.prepareParams(params);
            
            // Convert params object to URL parameters
            const queryParams = new URLSearchParams({
                format: "JSON",
                ...preparedParams
            });
            
            return `${baseUrl}?${queryParams.toString()}`;
        },
        // Function to parse the response
        parseResponse: (response) => {
            try {
                const { value, dimension } = response;
                if (!value || !dimension) {
                    throw new Error("Invalid response structure");
                }
                
                return {
                    data: value,
                    metadata: {
                        dimensions: dimension,
                        source: "Eurostat",
                        dataset: "nrg_ti_oil"
                    }
                };
            } catch (error) {
                console.error("Error parsing nrg_ti_oil response:", error);
                throw error;
            }
        }
    },

    // Natural Gas Trade Dataset (nrg_ti_gas)
    "nrg_ti_gas": {
        endpoint: "nrg_ti_gas",
        description: "Natural gas trade by partner country - annual data",
        dimensions: {
            // Units of measurement
            unit: {
                description: "Unit of measure",
                values: {
                    "MIO_M3": "Million cubic meters",
                    "TJ_GCV": "Terajoules (gross calorific value)"
                }
            },
            // SIEC Classification for gas products
            siec: {
                description: "Energy product (SIEC classification)",
                values: {
                    "G3000": "Natural gas",
                    "G3200": "Liquefied natural gas"
                }
            },
            // Geographical entities for reporting country
            geo: {
                description: "Reporting country",
                values: {
                    "EU27_2020": "European Union (27 countries)",
                    "EA20": "Euro area (20 countries)",
                    "BE": "Belgium",
                    "BG": "Bulgaria",
                    "CZ": "Czech Republic",
                    "DK": "Denmark",
                    "DE": "Germany",
                    "EE": "Estonia",
                    "IE": "Ireland",
                    "EL": "Greece",
                    "ES": "Spain",
                    "FR": "France",
                    "HR": "Croatia",
                    "IT": "Italy",
                    "CY": "Cyprus",
                    "LV": "Latvia",
                    "LT": "Lithuania",
                    "LU": "Luxembourg",
                    "HU": "Hungary",
                    "MT": "Malta",
                    "NL": "Netherlands",
                    "AT": "Austria",
                    "PL": "Poland",
                    "PT": "Portugal",
                    "RO": "Romania",
                    "SI": "Slovenia",
                    "SK": "Slovakia",
                    "FI": "Finland",
                    "SE": "Sweden"
                }
            },
            // Partner countries
            partner: {
                description: "Partner country",
                values: {
                    "TOTAL": "Total all partner countries",
                    "BE": "Belgium",
                    "BG": "Bulgaria",
                    "CZ": "Czech Republic",
                    "DK": "Denmark",
                    "DE": "Germany",
                    "EE": "Estonia",
                    "IE": "Ireland",
                    "EL": "Greece",
                    "ES": "Spain",
                    "FR": "France",
                    "HR": "Croatia",
                    "IT": "Italy",
                    "CY": "Cyprus",
                    "LV": "Latvia",
                    "LT": "Lithuania",
                    "LU": "Luxembourg",
                    "HU": "Hungary",
                    "MT": "Malta",
                    "NL": "Netherlands",
                    "AT": "Austria",
                    "PL": "Poland",
                    "PT": "Portugal",
                    "RO": "Romania",
                    "SI": "Slovenia",
                    "SK": "Slovakia",
                    "FI": "Finland",
                    "SE": "Sweden",
                    "NO": "Norway",
                    "UK": "United Kingdom",
                    "RU": "Russia",
                    "US": "United States",
                    "QA": "Qatar",
                    "DZ": "Algeria",
                    "LY": "Libya",
                    "NG": "Nigeria",
                    "TOTAL": "All countries",
                    "NSP": "Not specified"
                }
            }
        },
        // Default parameters
        defaults: {
            unit: "MIO_M3",
            siec: "G3000"  // Default to natural gas
        },
        // Required parameters
        required: ["siec"],
        // Function to validate and prepare API parameters
        prepareParams: (params) => {
            const prepared = { ...params };
            
            // Ensure required parameters
            if (!prepared.siec) {
                prepared.siec = "G3000"; // Default to natural gas
            }
            
            // Add default unit if not specified
            if (!prepared.unit) {
                prepared.unit = "MIO_M3";
            }
            
            // For specific country queries, use geo parameter and TOTAL for partner
            if (prepared.country || prepared.geo) {
                prepared.geo = prepared.country || prepared.geo;
                prepared.partner = "TOTAL";  // Get total imports for the country
            }
            
            return prepared;
        },
        // Function to build the API URL with parameters
        buildUrl: (params) => {
            const baseUrl = "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/nrg_ti_gas";
            const preparedParams = datasetDictionary.nrg_ti_gas.prepareParams(params);
            
            // Convert params object to URL parameters
            const queryParams = new URLSearchParams({
                format: "JSON", // Always JSON format
                ...preparedParams
            });
            
            return `${baseUrl}?${queryParams.toString()}`;
        },
        // Function to parse the response
        parseResponse: (response) => {
            try {
                // Extract the actual data points
                const { value, dimension } = response;
                if (!value || !dimension) {
                    throw new Error("Invalid response structure");
                }
                
                // Create a standardized response format
                return {
                    data: value,
                    metadata: {
                        dimensions: dimension,
                        source: "Eurostat",
                        dataset: "nrg_ti_gas"
                    }
                };
            } catch (error) {
                console.error("Error parsing nrg_ti_gas response:", error);
                throw error;
            }
        }
    },

    // Crude Oil and Petroleum Products Balance Dataset (nrg_cb_oil)
    "nrg_cb_oil": {
        endpoint: "nrg_cb_oil",
        description: "Crude oil and petroleum products - detailed balance - annual data",
        dimensions: {
            // Units of measurement
            unit: {
                description: "Unit of measure",
                values: {
                    "THS_T": "Thousand tonnes"
                }
            },
            // Energy Balance Indicators
            nrg_bal: {
                description: "Energy balance indicator",
                values: {
                    // Primary Production and Recovery
                    "IPRD": "Indigenous production",
                    "TOS": "Total supply",
                    "TOS_REN": "Of which: from renewables",
                    "TOS_NGAS": "Of which: from natural gas",
                    "RCV_RCY": "Recovered and recycled products",
                    
                    // Trade and Stock Changes
                    "IMP": "Imports",
                    "EXP": "Exports",
                    "STK_CHG": "Stock changes",
                    "STK_CHG_MAIN": "Stock changes at main activity producers",
                    
                    // International Bunkers
                    "INTMARB": "International maritime bunkers",
                    "INTAVI": "International aviation",
                    "INTAVI_E": "International aviation - energy use",
                    "INTAVI_NE": "International aviation - non-energy use",
                    
                    // Transformation and Energy Sector
                    "TI": "Transformation input - total",
                    "TI_E": "Transformation input - energy use",
                    "NRG": "Energy sector - total",
                    "NRG_E": "Energy sector - energy use",
                    
                    // Final Consumption
                    "FC": "Final consumption",
                    "FC_E": "Final energy consumption",
                    "FC_IND": "Final consumption - industry sector",
                    "FC_TRA": "Final consumption - transport sector",
                    "FC_OTH": "Final consumption - other sectors",
                    
                    // Industry Breakdown
                    "FC_IND_IS": "Iron and steel",
                    "FC_IND_CPC": "Chemical and petrochemical",
                    "FC_IND_NFM": "Non-ferrous metals",
                    "FC_IND_NMM": "Non-metallic minerals",
                    "FC_IND_TE": "Transport equipment",
                    "FC_IND_MAC": "Machinery",
                    "FC_IND_FBT": "Food, beverages and tobacco",
                    
                    // Transport Breakdown
                    "FC_TRA_RAIL": "Transport - rail",
                    "FC_TRA_ROAD": "Transport - road",
                    "FC_TRA_DAVI": "Transport - domestic aviation",
                    "FC_TRA_DNAVI": "Transport - domestic navigation",
                    
                    // Other Sectors
                    "FC_OTH_CP": "Commercial and public services",
                    "FC_OTH_HH": "Households",
                    "FC_OTH_AF": "Agriculture and forestry",
                    "FC_OTH_FISH": "Fishing",
                    
                    // Statistical Differences and Flows
                    "STATDIFF": "Statistical differences",
                    "BKFLOW": "Backflows from petrochemical industry",
                    "PPR": "Primary product receipts",
                    "DU": "Direct use"
                }
            },
            // SIEC Classification for oil products
            siec: {
                description: "Energy product (SIEC classification)",
                values: {
                    "O4000": "Oil (total)",
                    "O4000XBIO": "Oil (excluding biofuels)",
                    "O4100_TOT": "Crude oil",
                    "O4200": "Natural gas liquids (NGL)",
                    "O4300": "Refinery feedstocks",
                    "O4400": "Additives and oxygenates",
                    "O4500": "Other hydrocarbons",
                    "O4600": "Oil products",
                    "O4610": "Refinery gas",
                    "O4620": "Ethane",
                    "O4630": "Liquefied petroleum gases (LPG)",
                    "O4640": "Naphtha",
                    "O4651": "Motor gasoline (excluding bio)",
                    "O4652": "Aviation gasoline",
                    "O4661": "Kerosene-type jet fuel",
                    "O4669": "Other kerosene",
                    "O4671": "Gas/diesel oil",
                    "O4680": "Fuel oil",
                    "O4691": "White spirit",
                    "O4692": "Lubricants",
                    "O4693": "Paraffin waxes",
                    "O4694": "Petroleum coke",
                    "O4695": "Bitumen",
                    "O4699": "Other oil products n.e.c."
                }
            },
            // Geographical entities
            geo: {
                description: "Geographical entity",
                values: {
                    "EU27_2020": "European Union (27 countries)",
                    "EA20": "Euro area (20 countries)",
                    "BE": "Belgium",
                    "BG": "Bulgaria",
                    "CZ": "Czech Republic",
                    "DK": "Denmark",
                    "DE": "Germany",
                    "EE": "Estonia",
                    "IE": "Ireland",
                    "EL": "Greece",
                    "ES": "Spain",
                    "FR": "France",
                    "HR": "Croatia",
                    "IT": "Italy",
                    "CY": "Cyprus",
                    "LV": "Latvia",
                    "LT": "Lithuania",
                    "LU": "Luxembourg",
                    "HU": "Hungary",
                    "MT": "Malta",
                    "NL": "Netherlands",
                    "AT": "Austria",
                    "PL": "Poland",
                    "PT": "Portugal",
                    "RO": "Romania",
                    "SI": "Slovenia",
                    "SK": "Slovakia",
                    "FI": "Finland",
                    "SE": "Sweden"
                }
            }
        },
        // Default parameters
        defaults: {
            unit: "THS_T",
            siec: "O4000" // Default to total oil
        },
        // Required parameters
        required: ["siec", "nrg_bal"],
        // Function to validate and prepare API parameters
        prepareParams: (params) => {
            const prepared = { ...params };
            
            // Ensure required parameters
            if (!prepared.siec) {
                prepared.siec = "O4000"; // Default to total oil
            }
            if (!prepared.nrg_bal) {
                prepared.nrg_bal = "FC_E"; // Default to final energy consumption
            }
            
            // Add default unit if not specified
            if (!prepared.unit) {
                prepared.unit = "THS_T";
            }
            
            // Add default geo if not specified
            if (!prepared.geo) {
                prepared.geo = "EU27_2020";
            }
            
            return prepared;
        },
        // Function to build the API URL with parameters
        buildUrl: (params) => {
            const baseUrl = "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/nrg_cb_oil";
            const preparedParams = datasetDictionary.nrg_cb_oil.prepareParams(params);
            
            // Convert params object to URL parameters
            const queryParams = new URLSearchParams({
                format: "JSON", // Always JSON format
                ...preparedParams
            });
            
            return `${baseUrl}?${queryParams.toString()}`;
        },
        // Function to parse the response
        parseResponse: (response) => {
            try {
                const { value, dimension } = response;
                if (!value || !dimension) {
                    throw new Error("Invalid response structure");
                }
                
                return {
                    data: value,
                    metadata: {
                        dimensions: dimension,
                        source: "Eurostat",
                        dataset: "nrg_cb_oil"
                    }
                };
            } catch (error) {
                console.error("Error parsing nrg_cb_oil response:", error);
                throw error;
            }
        }
    },

    // Monthly Oil Balance Dataset (nrg_cb_oilm)
    "nrg_cb_oilm": {
        endpoint: "nrg_cb_oilm",
        description: "Crude oil and petroleum products - monthly balance",
        dimensions: {
            // Units of measurement
            unit: {
                description: "Unit of measure",
                values: {
                    "THS_T": "Thousand tonnes"
                }
            },
            // Energy Balance Indicators
            nrg_bal: {
                description: "Energy balance indicator",
                values: {
                    // Primary Production and Recovery
                    "IPRD": "Indigenous production",
                    "TOS": "Total supply",
                    "RCV_RCY": "Recovered and recycled products",
                    
                    // Trade and Stock Changes
                    "IMP": "Imports",
                    "EXP": "Exports",
                    "STK_CHG": "Stock changes",
                    
                    // International Bunkers
                    "INTMARB": "International maritime bunkers",
                    "INTAVI_E": "International aviation - energy use",
                    
                    // Gross Inland Deliveries
                    "GID_CAL": "Gross inland deliveries calculated",
                    "GID_OBS": "Gross inland deliveries observed",
                    
                    // Transformation and Processing
                    "TI_EHG_MAP": "Main activity producer electricity and heat generation",
                    "TO_RPI_RO": "Refinery output",
                    
                    // Refinery Statistics
                    "RL": "Refinery losses",
                    "RI_CAL": "Refinery intake calculated",
                    "RI_OBS": "Refinery intake observed",
                    "RF": "Refinery fuel",
                    
                    // Transport Sector
                    "FC_TRA_RAIL_DNAVI_E": "Transport - rail and domestic navigation - energy use",
                    "FC_TRA_ROAD_E": "Transport - road - energy use",
                    
                    // Statistical Differences and Flows
                    "STATDIFF": "Statistical differences",
                    "BKFLOW": "Backflows from petrochemical industry",
                    "PPR": "Primary product receipts",
                    "IT": "Interproduct transfers",
                    "PT": "Products transferred",
                    "DU": "Direct use",
                    
                    // Production Indicators
                    "GD_PI": "Gross deliveries to petrochemical industry",
                    "ND_TP": "Net domestic production at refineries from total products"
                }
            },
            // SIEC Classification for oil products
            siec: {
                description: "Energy product (SIEC classification)",
                values: {
                    "O4100_TOT_4200-4500": "Crude oil, NGL and other hydrocarbons - total",
                    "O4100_TOT": "Crude oil - total",
                    "O4200": "Natural gas liquids (NGL)",
                    "O4300": "Refinery feedstocks",
                    "O4400": "Additives and oxygenates",
                    "O4410": "Biofuel additives",
                    "O4500": "Other hydrocarbons",
                    "O4600": "Oil products",
                    "O4610": "Refinery gas",
                    "O4620": "Ethane",
                    "O4630": "Liquefied petroleum gases (LPG)",
                    "O4640": "Naphtha",
                    "O4651": "Motor gasoline",
                    "O4652": "Aviation gasoline",
                    "O4652XR5210B": "Aviation gasoline (excluding bio)",
                    "O4653": "Gasoline-type jet fuel",
                    "O4661": "Kerosene-type jet fuel",
                    "O4661XR5230B": "Kerosene-type jet fuel (excluding bio)",
                    "O4669": "Other kerosene",
                    "O4671": "Gas/diesel oil",
                    "O4671XR5220B": "Gas/diesel oil (excluding bio)",
                    "O46711": "Transport diesel",
                    "O46712": "Heating and other gasoil",
                    "O4680": "Fuel oil",
                    "O4681": "Low sulphur fuel oil",
                    "O4682": "High sulphur fuel oil",
                    "O4690XO4694": "Other oil products excluding petroleum coke",
                    "O4694": "Petroleum coke",
                    "R5210B": "Biogasoline",
                    "R5220B": "Biodiesels",
                    "R5230": "Bio jet kerosene",
                    "R5230B": "Bio jet kerosene (blended)"
                }
            },
            // Geographical entities
            geo: {
                description: "Geographical entity",
                values: {
                    "EU27_2020": "European Union (27 countries)",
                    "BE": "Belgium",
                    "BG": "Bulgaria",
                    "CZ": "Czech Republic",
                    "DK": "Denmark",
                    "DE": "Germany",
                    "EE": "Estonia",
                    "IE": "Ireland",
                    "EL": "Greece",
                    "ES": "Spain",
                    "FR": "France",
                    "HR": "Croatia",
                    "IT": "Italy",
                    "CY": "Cyprus",
                    "LV": "Latvia",
                    "LT": "Lithuania",
                    "LU": "Luxembourg",
                    "HU": "Hungary",
                    "MT": "Malta",
                    "NL": "Netherlands",
                    "AT": "Austria",
                    "PL": "Poland",
                    "PT": "Portugal",
                    "RO": "Romania",
                    "SI": "Slovenia",
                    "SK": "Slovakia",
                    "FI": "Finland",
                    "SE": "Sweden",
                    "IS": "Iceland",
                    "NO": "Norway",
                    "UK": "United Kingdom",
                    "ME": "Montenegro",
                    "MD": "Moldova",
                    "MK": "North Macedonia",
                    "GE": "Georgia",
                    "AL": "Albania",
                    "RS": "Serbia",
                    "TR": "Turkey"
                }
            }
        },
        // Default parameters
        defaults: {
            unit: "THS_T",
            siec: "O4100_TOT" // Default to crude oil total
        },
        // Required parameters
        required: ["siec", "nrg_bal"],
        // Function to validate and prepare API parameters
        prepareParams: (params) => {
            const prepared = { ...params };
            
            // Ensure required parameters
            if (!prepared.siec) {
                prepared.siec = "O4100_TOT"; // Default to crude oil total
            }
            if (!prepared.nrg_bal) {
                prepared.nrg_bal = "TOS"; // Default to total supply for monthly data
            }
            
            // Add default unit if not specified
            if (!prepared.unit) {
                prepared.unit = "THS_T";
            }
            
            // Add default geo if not specified
            if (!prepared.geo) {
                prepared.geo = "EU27_2020";
            }
            
            return prepared;
        },
        // Function to build the API URL with parameters
        buildUrl: (params) => {
            const baseUrl = "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/nrg_cb_oilm";
            const preparedParams = datasetDictionary.nrg_cb_oilm.prepareParams(params);
            
            // Convert params object to URL parameters
            const queryParams = new URLSearchParams({
                format: "JSON",
                ...preparedParams
            });
            
            return `${baseUrl}?${queryParams.toString()}`;
        },
        // Function to parse the response
        parseResponse: (response) => {
            try {
                const { value, dimension } = response;
                if (!value || !dimension) {
                    throw new Error("Invalid response structure");
                }
                
                return {
                    data: value,
                    metadata: {
                        dimensions: dimension,
                        source: "Eurostat",
                        dataset: "nrg_cb_oilm"
                    }
                };
            } catch (error) {
                console.error("Error parsing nrg_cb_oilm response:", error);
                throw error;
            }
        }
    },

    // Monthly Natural Gas Balance Dataset (nrg_cb_gasm)
    "nrg_cb_gasm": {
        endpoint: "nrg_cb_gasm",
        description: "Natural gas - monthly balance",
        dimensions: {
            // Units of measurement
            unit: {
                description: "Unit of measure",
                values: {
                    "MIO_M3": "Million cubic meters",
                    "TJ_GCV": "Terajoules (gross calorific value)"
                }
            },
            // Energy Balance Indicators
            nrg_bal: {
                description: "Energy balance indicator",
                values: {
                    // Production and Supply
                    "IPRD": "Indigenous production",
                    "TOS": "Total supply",
                    
                    // Trade and Storage
                    "IMP": "Imports",
                    "EXP": "Exports",
                    "STK_CHG_CG": "Stock changes - cushion gas",
                    "STK_CHG_MG": "Stock changes - merchant gas",
                    
                    // Consumption and Transformation
                    "INTMARB": "International maritime bunkers",
                    "IC_OBS": "Inland consumption observed",
                    "IC_CAL_MG": "Inland consumption calculated - merchant gas",
                    "TI_EHG_MAP": "Transformation input - main activity producer electricity and heat",
                    
                    // Distribution and Losses
                    "DL": "Distribution losses",
                    "VENT": "Gas vented",
                    "FLARE": "Gas flared",
                    
                    // Final Consumption
                    "FC_IND": "Final consumption - industry",
                    "FC_OTH": "Final consumption - other sectors",
                    
                    // Statistical Differences
                    "STATDIFF": "Statistical differences"
                }
            },
            // SIEC Classification for gas products
            siec: {
                description: "Energy product (SIEC classification)",
                values: {
                    "G3000": "Natural gas"
                }
            },
            // Geographical entities
            geo: {
                description: "Geographical entity",
                values: {
                    "EU27_2020": "European Union (27 countries)",
                    "BE": "Belgium",
                    "BG": "Bulgaria",
                    "CZ": "Czech Republic",
                    "DK": "Denmark",
                    "DE": "Germany",
                    "EE": "Estonia",
                    "IE": "Ireland",
                    "EL": "Greece",
                    "ES": "Spain",
                    "FR": "France",
                    "HR": "Croatia",
                    "IT": "Italy",
                    "CY": "Cyprus",
                    "LV": "Latvia",
                    "LT": "Lithuania",
                    "LU": "Luxembourg",
                    "HU": "Hungary",
                    "MT": "Malta",
                    "NL": "Netherlands",
                    "AT": "Austria",
                    "PL": "Poland",
                    "PT": "Portugal",
                    "RO": "Romania",
                    "SI": "Slovenia",
                    "SK": "Slovakia",
                    "FI": "Finland",
                    "SE": "Sweden",
                    "IS": "Iceland",
                    "NO": "Norway",
                    "UK": "United Kingdom",
                    "ME": "Montenegro",
                    "MD": "Moldova",
                    "MK": "North Macedonia",
                    "GE": "Georgia",
                    "AL": "Albania",
                    "RS": "Serbia",
                    "TR": "Turkey",
                    "UA": "Ukraine",
                    "XK": "Kosovo"
                }
            }
        },
        defaults: {
            unit: "MIO_M3",
            siec: "G3000"
        },
        required: ["siec", "nrg_bal"],
        prepareParams: (params) => {
            const prepared = { ...params };
            
            if (!prepared.siec) {
                prepared.siec = "G3000";
            }
            if (!prepared.nrg_bal) {
                prepared.nrg_bal = "TOS";
            }
            if (!prepared.unit) {
                prepared.unit = "MIO_M3";
            }
            if (!prepared.geo) {
                prepared.geo = "EU27_2020";
            }
            
            return prepared;
        },
        buildUrl: (params) => {
            const baseUrl = "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/nrg_cb_gasm";
            const preparedParams = datasetDictionary.nrg_cb_gasm.prepareParams(params);
            
            return `${baseUrl}?${new URLSearchParams({
                format: "JSON",
                ...preparedParams
            }).toString()}`;
        },
        parseResponse: (response) => {
            try {
                const { value, dimension } = response;
                if (!value || !dimension) {
                    throw new Error("Invalid response structure");
                }
                
                return {
                    data: value,
                    metadata: {
                        dimensions: dimension,
                        source: "Eurostat",
                        dataset: "nrg_cb_gasm"
                    }
                };
            } catch (error) {
                console.error("Error parsing nrg_cb_gasm response:", error);
                throw error;
            }
        }
    },

    // Electricity and Heat Production Dataset (nrg_ind_peh)
    "nrg_ind_peh": {
        endpoint: "nrg_ind_peh",
        description: "Production of electricity and derived heat by type of plant and operator",
        dimensions: {
            // Units of measurement
            unit: {
                description: "Unit of measure",
                values: {
                    "GWH": "Gigawatt hours",
                    "TJ": "Terajoules"
                }
            },
            // Plant Types
            plants: {
                description: "Type of plant",
                values: {
                    "TOTAL": "All plants",
                    "ELC": "Electricity only",
                    "CHP": "Combined heat and power - total",
                    "CHP_FUL": "Combined heat and power - fully utilized",
                    "HEAT": "Heat only - total",
                    "HEAT_AC": "Heat only - actually used"
                }
            },
            // Operator Types
            operator: {
                description: "Type of operator",
                values: {
                    "TOTAL": "All operators",
                    "PRR_MAIN": "Main activity producers",
                    "PRR_AUTO": "Autoproducers"
                }
            },
            // Energy Balance Indicators
            nrg_bal: {
                description: "Energy balance indicator",
                values: {
                    "GEP": "Gross electricity production",
                    "GHP": "Gross heat production",
                    "NEP": "Net electricity production",
                    "NHP": "Net heat production"
                }
            },
            // SIEC Classification for energy products
            siec: {
                description: "Energy product (SIEC classification)",
                values: {
                    "TOTAL": "All products",
                    "CF": "Combustible fuels",
                    "RA100": "Hydro",
                    "RA130": "Pumped hydro",
                    "RA200": "Geothermal",
                    "RA300": "Wind",
                    "RA400": "Solar",
                    "RA500": "Tide, wave and ocean",
                    "RA600": "Ambient heat (heat pumps)",
                    "N9000": "Nuclear heat",
                    "E7000": "Electricity",
                    "H8000": "Heat",
                    "H8000D": "District heat",
                    "X9900H": "Other sources - heat",
                    "X9900": "Other sources",
                    "BA100": "Black coal"
                }
            },
            // Geographical entities
            geo: {
                description: "Geographical entity",
                values: {
                    "EU27_2020": "European Union (27 countries)",
                    "EA20": "Euro area (20 countries)",
                    // ... same geo values as other datasets ...
                }
            }
        },
        defaults: {
            unit: "GWH",
            plants: "TOTAL",
            operator: "TOTAL",
            siec: "TOTAL"
        },
        required: ["nrg_bal"],
        prepareParams: (params) => {
            const prepared = { ...params };
            
            if (!prepared.nrg_bal) {
                prepared.nrg_bal = "GEP";
            }
            if (!prepared.unit) {
                prepared.unit = "GWH";
            }
            if (!prepared.plants) {
                prepared.plants = "TOTAL";
            }
            if (!prepared.operator) {
                prepared.operator = "TOTAL";
            }
            if (!prepared.siec) {
                prepared.siec = "TOTAL";
            }
            if (!prepared.geo) {
                prepared.geo = "EU27_2020";
            }
            
            return prepared;
        },
        buildUrl: (params) => {
            const baseUrl = "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/nrg_ind_peh";
            const preparedParams = datasetDictionary.nrg_ind_peh.prepareParams(params);
            
            return `${baseUrl}?${new URLSearchParams({
                format: "JSON",
                ...preparedParams
            }).toString()}`;
        },
        parseResponse: (response) => {
            try {
                const { value, dimension } = response;
                if (!value || !dimension) {
                    throw new Error("Invalid response structure");
                }
                
                return {
                    data: value,
                    metadata: {
                        dimensions: dimension,
                        source: "Eurostat",
                        dataset: "nrg_ind_peh"
                    }
                };
            } catch (error) {
                console.error("Error parsing nrg_ind_peh response:", error);
                throw error;
            }
        }
    },

    // Renewable Energy Dataset (nrg_ind_ren)
    "nrg_ind_ren": {
        endpoint: "nrg_ind_ren",
        description: "Share of renewable energy in different sectors",
        dimensions: {
            // Units of measurement
            unit: {
                description: "Unit of measure",
                values: {
                    "PC": "Percentage"
                }
            },
            // Energy Balance Indicators for renewables
            nrg_bal: {
                description: "Energy balance indicator",
                values: {
                    "REN": "Share of renewable energy (all sectors)",
                    "REN_TRA": "Share of renewable energy in transport",
                    "REN_ELC": "Share of renewable energy in electricity",
                    "REN_HEAT_CL": "Share of renewable energy in heating and cooling",
                    "REN_HEAT_CL_WHC": "Share of renewable energy in heating and cooling with waste heat and cold",
                    "REN_WHC_DHEAT_DCL": "Share of renewable energy and waste heat and cold in district heating and cooling"
                }
            },
            // Geographical entities
            geo: {
                description: "Geographical entity",
                values: {
                    "EU27_2020": "European Union (27 countries)",
                    "BE": "Belgium",
                    "BG": "Bulgaria",
                    "CZ": "Czech Republic",
                    "DK": "Denmark",
                    "DE": "Germany",
                    "EE": "Estonia",
                    "IE": "Ireland",
                    "EL": "Greece",
                    "ES": "Spain",
                    "FR": "France",
                    "HR": "Croatia",
                    "IT": "Italy",
                    "CY": "Cyprus",
                    "LV": "Latvia",
                    "LT": "Lithuania",
                    "LU": "Luxembourg",
                    "HU": "Hungary",
                    "MT": "Malta",
                    "NL": "Netherlands",
                    "AT": "Austria",
                    "PL": "Poland",
                    "PT": "Portugal",
                    "RO": "Romania",
                    "SI": "Slovenia",
                    "SK": "Slovakia",
                    "FI": "Finland",
                    "SE": "Sweden"
                }
            }
        },
        defaults: {
            unit: "PC",
            nrg_bal: "REN"
        },
        required: ["nrg_bal"],
        prepareParams: (params) => {
            const prepared = { ...params };
            
            if (!prepared.nrg_bal) {
                prepared.nrg_bal = "REN";
            }
            if (!prepared.unit) {
                prepared.unit = "PC";
            }
            if (!prepared.geo) {
                prepared.geo = "EU27_2020";
            }
            
            return prepared;
        }
    },

    // Electricity Balance Dataset (nrg_cb_e)
    "nrg_cb_e": {
        endpoint: "nrg_cb_e",
        description: "Electricity balance",
        dimensions: {
            // Units of measurement
            unit: {
                description: "Unit of measure",
                values: {
                    "GWH": "Gigawatt hours"
                }
            },
            // Energy Balance Indicators
            nrg_bal: {
                description: "Energy balance indicator",
                values: {
                    // Production and Transformation
                    "GEP": "Gross electricity production",
                    "NEP": "Net electricity production",
                    "IMP": "Imports",
                    "EXP": "Exports",
                    
                    // Transformation and Losses
                    "LOSS": "Losses",
                    "DL": "Distribution losses",
                    "DL_NT": "Network losses",
                    "TRANSL": "Transmission losses",
                    
                    // Consumption by Sector
                    "FC": "Final consumption",
                    "FC_IND_E": "Final consumption - industry - electricity",
                    "FC_TRA_E": "Final consumption - transport - electricity",
                    "FC_OTH_E": "Final consumption - other sectors - electricity",
                    "FC_OTH_HH_E": "Final consumption - households - electricity"
                }
            },
            // SIEC Classification
            siec: {
                description: "Energy product (SIEC classification)",
                values: {
                    "E7000": "Electrical energy"
                }
            },
            // Geographical entities
            geo: {
                description: "Geographical entity",
                values: {
                    "EU27_2020": "European Union (27 countries)",
                    "BE": "Belgium",
                    "BG": "Bulgaria",
                    "CZ": "Czech Republic",
                    "DK": "Denmark",
                    "DE": "Germany",
                    "EE": "Estonia",
                    "IE": "Ireland",
                    "EL": "Greece",
                    "ES": "Spain",
                    "FR": "France",
                    "HR": "Croatia",
                    "IT": "Italy",
                    "CY": "Cyprus",
                    "LV": "Latvia",
                    "LT": "Lithuania",
                    "LU": "Luxembourg",
                    "HU": "Hungary",
                    "MT": "Malta",
                    "NL": "Netherlands",
                    "AT": "Austria",
                    "PL": "Poland",
                    "PT": "Portugal",
                    "RO": "Romania",
                    "SI": "Slovenia",
                    "SK": "Slovakia",
                    "FI": "Finland",
                    "SE": "Sweden"
                }
            }
        },
        defaults: {
            unit: "GWH",
            siec: "E7000"
        },
        required: ["nrg_bal"],
        prepareParams: (params) => {
            const prepared = { ...params };
            
            if (!prepared.nrg_bal) {
                prepared.nrg_bal = "GEP";
            }
            if (!prepared.unit) {
                prepared.unit = "GWH";
            }
            if (!prepared.siec) {
                prepared.siec = "E7000";
            }
            if (!prepared.geo) {
                prepared.geo = "EU27_2020";
            }
            
            return prepared;
        }
    },

    // Energy Efficiency Dataset (nrg_ind_eff)
    "nrg_ind_eff": {
        endpoint: "nrg_ind_eff",
        description: "Energy efficiency indicators",
        dimensions: {
            // Units of measurement
            unit: {
                description: "Unit of measure",
                values: {
                    "MTOE": "Million tonnes of oil equivalent",
                    "I05": "Index 2005=100",
                    "PC": "Percentage"
                }
            },
            // Energy Balance Indicators
            nrg_bal: {
                description: "Energy balance indicator",
                values: {
                    "PEC_EED": "Primary energy consumption (Europe 2020-2030)",
                    "FEC_EED": "Final energy consumption (Europe 2020-2030)",
                    "PEC2020-2030": "Primary energy consumption target 2020-2030",
                    "FEC2020-2030": "Final energy consumption target 2020-2030",
                    "PEC_DT2020": "Distance to primary energy 2020 target",
                    "PEC_DT2030": "Distance to primary energy 2030 target",
                    "FEC_DT2020": "Distance to final energy 2020 target",
                    "FEC_DT2030": "Distance to final energy 2030 target"
                }
            },
            // Geographical entities
            geo: {
                description: "Geographical entity",
                values: {
                    "EU27_2020": "European Union (27 countries)",
                    "BE": "Belgium",
                    "BG": "Bulgaria",
                    "CZ": "Czech Republic",
                    "DK": "Denmark",
                    "DE": "Germany",
                    "EE": "Estonia",
                    "IE": "Ireland",
                    "EL": "Greece",
                    "ES": "Spain",
                    "FR": "France",
                    "HR": "Croatia",
                    "IT": "Italy",
                    "CY": "Cyprus",
                    "LV": "Latvia",
                    "LT": "Lithuania",
                    "LU": "Luxembourg",
                    "HU": "Hungary",
                    "MT": "Malta",
                    "NL": "Netherlands",
                    "AT": "Austria",
                    "PL": "Poland",
                    "PT": "Portugal",
                    "RO": "Romania",
                    "SI": "Slovenia",
                    "SK": "Slovakia",
                    "FI": "Finland",
                    "SE": "Sweden"
                }
            }
        },
        defaults: {
            unit: "MTOE",
            nrg_bal: "PEC_EED"
        },
        required: ["nrg_bal", "unit"],
        prepareParams: (params) => {
            const prepared = { ...params };
            
            if (!prepared.nrg_bal) {
                prepared.nrg_bal = "PEC_EED";
            }
            if (!prepared.unit) {
                prepared.unit = "MTOE";
            }
            if (!prepared.geo) {
                prepared.geo = "EU27_2020";
            }
            
            return prepared;
        }
    },

    // Solid Fossil Fuels Dataset (nrg_cb_sff)
    "nrg_cb_sff": {
        endpoint: "nrg_cb_sff",
        description: "Solid fossil fuels - complete balance",
        dimensions: {
            unit: {
                description: "Unit of measure",
                values: {
                    "THS_T": "Thousand tonnes"
                }
            },
            nrg_bal: {
                description: "Energy balance indicator",
                values: {
                    "IPRD": "Indigenous production",
                    "UPRD": "Underground production",
                    "SPRD": "Surface production",
                    "TOS": "Total supply",
                    "TOS_OIL": "Of which from oil",
                    "TOS_REN": "Of which from renewables",
                    "TOS_NGAS": "Of which from natural gas",
                    "IMP": "Imports",
                    "EXP": "Exports",
                    "STK_CHG": "Stock changes",
                    "INTMARB": "International maritime bunkers",
                    "IC_CAL": "Inland consumption calculated",
                    "TI_E": "Transformation input - energy use",
                    "TI_EHG_MAPE_E": "Main activity producer electricity only",
                    "TI_EHG_MAPCHP_E": "Main activity producer CHP",
                    "TI_CO_E": "Coke ovens",
                    "NRG_E": "Energy sector - energy use",
                    "FC": "Final consumption",
                    "FC_IND_E": "Final consumption - industry sector",
                    "FC_TRA_E": "Final consumption - transport sector",
                    "FC_OTH_E": "Final consumption - other sectors"
                }
            },
            siec: {
                description: "Energy product (SIEC classification)",
                values: {
                    "C0000X0350-0370": "Hard coal and derivatives",
                    "C0100": "Hard coal",
                    "C0110": "Anthracite",
                    "C0121": "Coking coal",
                    "C0129": "Other bituminous coal",
                    "C0200": "Brown coal",
                    "C0210": "Sub-bituminous coal",
                    "C0220": "Lignite",
                    "C0311": "Coke oven coke",
                    "C0312": "Gas coke",
                    "C0320": "Patent fuel",
                    "C0330": "Brown coal briquettes",
                    "C0340": "Coal tar",
                    "P1100": "Industrial waste",
                    "P1200": "Municipal waste"
                }
            },
            geo: {
                // ...existing geo values...
            }
        },
        defaults: {
            unit: "THS_T",
            siec: "C0000X0350-0370"
        },
        required: ["nrg_bal", "siec"],
        prepareParams: (params) => {
            const prepared = { ...params };
            
            if (!prepared.nrg_bal) {
                prepared.nrg_bal = "FC";
            }
            if (!prepared.unit) {
                prepared.unit = "THS_T";
            }
            if (!prepared.siec) {
                prepared.siec = "C0000X0350-0370";
            }
            if (!prepared.geo) {
                prepared.geo = "EU27_2020";
            }
            
            return prepared;
        }
    },

    // Non-Fossil Heat and Electricity Production Dataset (nrg_ind_pehnf)
    "nrg_ind_pehnf": {
        endpoint: "nrg_ind_pehnf",
        description: "Production of electricity and derived heat from non-fossil fuels",
        dimensions: {
            unit: {
                description: "Unit of measure",
                values: {
                    "GWH": "Gigawatt hours",
                    "TJ": "Terajoules"
                }
            },
            plants: {
                description: "Type of plant",
                values: {
                    "TOTAL": "All plants",
                    "ELC": "Electricity only",
                    "CHP": "Combined heat and power",
                    "HEAT": "Heat only"
                }
            },
            operator: {
                description: "Type of operator",
                values: {
                    "TOTAL": "All operators",
                    "PRR_MAIN": "Main activity producers",
                    "PRR_AUTO": "Autoproducers"
                }
            },
            nrg_bal: {
                description: "Energy balance indicator",
                values: {
                    "GEP": "Gross electricity production",
                    "GHP": "Gross heat production"
                }
            },
            siec: {
                description: "Energy source",
                values: {
                    "RA100": "Hydro",
                    "RA110": "Pure hydro plants",
                    "RA120": "Mixed hydro plants",
                    "RA130": "Pure pumped storage",
                    "RA200": "Geothermal",
                    "RA300": "Wind",
                    "RA310": "Wind onshore",
                    "RA320": "Wind offshore",
                    "RA410": "Solar photovoltaic",
                    "RA420": "Solar thermal",
                    "RA500": "Tide, wave, ocean",
                    "RA600": "Ambient heat (heat pumps)",
                    "N9000": "Nuclear heat",
                    "E7000": "Electricity",
                    "H8000D": "District heat",
                    "X9900": "Other sources"
                }
            }
        },
        defaults: {
            unit: "GWH",
            plants: "TOTAL",
            operator: "TOTAL"
        },
        required: ["nrg_bal", "siec"],
        prepareParams: (params) => {
            const prepared = { ...params };
            
            if (!prepared.nrg_bal) {
                prepared.nrg_bal = "GEP";
            }
            if (!prepared.unit) {
                prepared.unit = "GWH";
            }
            if (!prepared.plants) {
                prepared.plants = "TOTAL";
            }
            if (!prepared.operator) {
                prepared.operator = "TOTAL";
            }
            if (!prepared.geo) {
                prepared.geo = "EU27_2020";
            }
            
            return prepared;
        }
    },

    // Solid Fossil Fuels Trade Dataset (nrg_ti_sff)
    "nrg_ti_sff": {
        endpoint: "nrg_ti_sff",
        description: "Solid fossil fuels trade by partner country",
        dimensions: {
            unit: {
                description: "Unit of measure",
                values: {
                    "THS_T": "Thousand tonnes"
                }
            },
            siec: {
                description: "Energy product (SIEC classification)",
                values: {
                    "C0000X0350-0370": "Hard coal and derivatives",
                    "C0100": "Hard coal",
                    "C0110": "Anthracite",
                    "C0121": "Coking coal",
                    "C0129": "Other bituminous coal",
                    "C0200": "Brown coal",
                    "C0210": "Sub-bituminous coal",
                    "C0220": "Lignite",
                    "C0311": "Coke oven coke",
                    "C0320": "Patent fuel",
                    "C0330": "Brown coal briquettes",
                    "C0340": "Coal tar",
                    "P1100": "Industrial waste",
                    "P1200": "Municipal waste"
                }
            },
            partner: {
                description: "Partner country",
                values: {
                    "TOTAL": "Total all partner countries",
                    "EU27_2020": "European Union (27 countries)",
                    // European countries
                    "BE": "Belgium",
                    "DE": "Germany",
                    "FR": "France",
                    "PL": "Poland",
                    "UK": "United Kingdom",
                    "NO": "Norway",
                    "RU": "Russia",
                    // Other regions
                    "EUR_OTH": "Other European countries",
                    "AFR_OTH": "Other African countries",
                    "AME_OTH": "Other American countries",
                    "ASI_OTH": "Other Asian countries",
                    "ASI_NME_OTH": "Other Near and Middle Eastern countries"
                }
            }
        },
        defaults: {
            unit: "THS_T",
            siec: "C0000X0350-0370",
            partner: "TOTAL"
        },
        required: ["siec"],
        prepareParams: (params) => {
            const prepared = { ...params };
            
            if (!prepared.siec) {
                prepared.siec = "C0000X0350-0370";
            }
            if (!prepared.unit) {
                prepared.unit = "THS_T";
            }
            if (!prepared.partner) {
                prepared.partner = "TOTAL";
            }
            if (!prepared.geo) {
                prepared.geo = "EU27_2020";
            }
            
            return prepared;
        }
    },

    // Nuclear Infrastructure Dataset (nrg_inf_nuc)
    "nrg_inf_nuc": {
        endpoint: "nrg_inf_nuc",
        description: "Nuclear infrastructure - production capacity and fuel management",
        dimensions: {
            unit: {
                description: "Unit of measure",
                values: {
                    "THS_T": "Thousand tonnes",
                    "KTOE": "Thousand tonnes of oil equivalent",
                    "TSWU": "Tonnes of separative work units",
                    "THM": "Tonnes of heavy metal",
                    "GWD_THM": "Gigawatt days per tonne of heavy metal"
                }
            },
            nrg_bal: {
                description: "Energy balance indicator",
                values: {
                    "IPRD": "Indigenous production",
                    "RCV_RCY": "Recovered and recycled products",
                    "IMP": "Imports",
                    "IMP_FROM_NEU": "Imports from non-EU countries",
                    "EXP": "Exports",
                    "STKOP_NAT": "Opening stock on national territory",
                    "STKCL_NAT": "Closing stock on national territory",
                    "STK_CHG": "Stock changes",
                    "GID_CAL": "Gross inland deliveries calculated",
                    "GID_OBS": "Gross inland deliveries observed",
                    "TI_EHG_MAP": "Transformation input electricity and heat generation - main activity producer",
                    "TI_CO": "Transformation input coke ovens",
                    "FC_IND": "Final consumption - industry sector",
                    "FC_IND_IS": "Final consumption - iron and steel",
                    "FC_OTH": "Final consumption - other sectors",
                    "STATDIFF": "Statistical differences"
                }
            },
            siec: {
                description: "Energy product (SIEC classification)",
                values: {
                    "C0100": "Hard coal",
                    "C0200": "Brown coal",
                    "C0311": "Coke oven coke",
                    "P1100": "Industrial waste",
                    "S2000": "Nuclear fuels and waste"
                }
            },
            plant_tec: {
                description: "Plant technology",
                values: {
                    "CAP_EN": "Enrichment capacity",
                    "PRDCAP_FF": "Fresh fuel production capacity",
                    "PRDCAP_MOXF": "MOX fuel production capacity",
                    "PRD_FF": "Production of fresh fuel",
                    "PRD_MOXF": "Production of MOX fuel",
                    "PRD_NUCH": "Production of nuclear heat",
                    "BAA_IRRADF": "Burn-up of annually discharged irradiated fuel",
                    "PRD_UP": "Production of U/Pu",
                    "CAP_UP": "Capacity of U/Pu"
                }
            }
        },
        defaults: {
            unit: "THS_T"
        },
        required: ["nrg_bal", "siec", "plant_tec"],
        prepareParams: (params) => {
            const prepared = { ...params };
            
            if (!prepared.unit) {
                prepared.unit = "THS_T";
            }
            if (!prepared.geo) {
                prepared.geo = "EU27_2020";
            }
            if (!prepared.nrg_bal) {
                prepared.nrg_bal = "IPRD";
            }
            if (!prepared.siec) {
                prepared.siec = "S2000";
            }
            if (!prepared.plant_tec) {
                prepared.plant_tec = "PRD_NUCH";
            }
            
            return prepared;
        }
    }
};

/**
 * Helper function to validate parameters against dataset configuration
 * @param {string} dataset - Dataset identifier
 * @param {Object} params - Parameters to validate
 * @returns {Object} Validation result
 */
export const validateDatasetParams = (dataset, params) => {
    const config = datasetDictionary[dataset];
    if (!config) {
        return { valid: false, error: "Dataset not found" };
    }
    
    const errors = [];
    
    // Check required parameters
    config.required.forEach(param => {
        if (!params[param]) {
            errors.push(`Missing required parameter: ${param}`);
        }
    });
    
    // Validate parameter values against allowed values
    Object.entries(params).forEach(([key, value]) => {
        const dimension = config.dimensions[key];
        if (dimension && dimension.values) {
            if (!dimension.values[value]) {
                errors.push(`Invalid value for ${key}: ${value}`);
            }
        }
    });
    
    return {
        valid: errors.length === 0,
        errors
    };
};

/**
 * Helper function to get all possible values for a dataset parameter
 * @param {string} dataset - Dataset identifier
 * @param {string} parameter - Parameter name
 * @returns {Object} Parameter values and descriptions
 */
export const getDatasetParameterValues = (dataset, parameter) => {
    const config = datasetDictionary[dataset];
    if (!config || !config.dimensions[parameter]) {
        return null;
    }
    
    return config.dimensions[parameter].values;
};

export default {
    datasetDictionary,
    validateDatasetParams,
    getDatasetParameterValues
};