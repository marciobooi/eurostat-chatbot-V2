/**
 * Centralized bot response dictionary
 * Contains various types of responses organized by category and language
 * All individual response dictionaries are imported and consolidated here
 */

// Import individual response dictionaries
import { welcomeMessages } from "./welcomeMessages";
import { farewellMessages } from "./farewellMessages";
import { gratitudeMessages } from "./gratitudeMessages";
import { promptMessages } from "./promptMessages";
import { errorMessages } from "./errorMessages";
import { thinkingMessages } from "./thinkingMessages";
import { unknownResponses } from "./unknownResponses";
import { empathyPhrases } from "./empathyPhrases";
import { reassurancePhrases } from "./reassurancePhrases";


// Consolidated bot responses
export const botResponses = {
  // Greeting responses
  greeting: welcomeMessages,

  // Farewell responses
  farewell: farewellMessages,

  // Gratitude responses
  gratitude: gratitudeMessages,

  // Prompt responses (used to prompt the user for more information)
  prompt: promptMessages,

  // Error responses
  error: errorMessages,

  // Thinking responses (displayed while the bot is "thinking")
  thinking: thinkingMessages,

  // Confused/unknown responses (when the bot doesn't understand)
  confused: unknownResponses,

  // Empathy phrases (to make responses more human-like)
  empathy: empathyPhrases,

  // Reassurance phrases (to reassure the user)
  reassurance: reassurancePhrases,

  // Solid fossil fuels responses
  solidFossilFuels: {
    en: {
      production: "Here is the production data for solid fossil fuels {timeframe}. This includes both underground and surface mining of hard coal and lignite.",
      imports: "These are the imports of solid fossil fuels {timeframe}. The data covers hard coal, lignite and their derivatives like coke.",
      exports: "Here are the exports of solid fossil fuels {timeframe}. This includes both raw coal and processed products.",
      consumption: "This shows the consumption of solid fossil fuels {timeframe}, broken down by sector including power generation, industry and heating.",
      overview: "Here's an overview of solid fossil fuels {timeframe}, showing production, trade and consumption patterns."
    },
    fr: {
      production: "Voici les données de production des combustibles fossiles solides {timeframe}. Cela inclut l'extraction souterraine et à ciel ouvert du charbon et du lignite.",
      imports: "Voici les importations de combustibles fossiles solides {timeframe}. Les données couvrent le charbon, le lignite et leurs dérivés comme le coke.",
      exports: "Voici les exportations de combustibles fossiles solides {timeframe}. Cela inclut à la fois le charbon brut et les produits transformés.",
      consumption: "Voici la consommation de combustibles fossiles solides {timeframe}, répartie par secteur, y compris la production d'électricité, l'industrie et le chauffage.",
      overview: "Voici un aperçu des combustibles fossiles solides {timeframe}, montrant les tendances de production, de commerce et de consommation."
    },
    de: {
      production: "Hier sind die Produktionsdaten für feste fossile Brennstoffe {timeframe}. Dies umfasst sowohl Unter- als auch Übertagebau von Steinkohle und Braunkohle.",
      imports: "Dies sind die Importe fester fossiler Brennstoffe {timeframe}. Die Daten umfassen Steinkohle, Braunkohle und deren Derivate wie Koks.",
      exports: "Hier sind die Exporte fester fossiler Brennstoffe {timeframe}. Dies umfasst sowohl Rohkohle als auch verarbeitete Produkte.",
      consumption: "Dies zeigt den Verbrauch fester fossiler Brennstoffe {timeframe}, aufgeschlüsselt nach Sektoren wie Stromerzeugung, Industrie und Heizung.",
      overview: "Hier ist ein Überblick über feste fossile Brennstoffe {timeframe}, der Produktions-, Handels- und Verbrauchsmuster zeigt."
    }
  },

  // Non-fossil heat responses
  nonFossilHeat: {
    en: {
      production: "Here is the heat production from non-fossil sources {timeframe}. This includes geothermal, solar thermal, and heat pumps.",
      district: "This shows the district heating supply {timeframe}, which distributes heat to multiple buildings through a network.",
      efficiency: "Here are the efficiency indicators for non-fossil heat production {timeframe}, including conversion rates and distribution losses.",
      overview: "Here's an overview of non-fossil heat production {timeframe}, showing both electricity and heat generation from renewable and nuclear sources."
    },
    fr: {
      production: "Voici la production de chaleur à partir de sources non fossiles {timeframe}. Cela inclut le géothermique, le solaire thermique et les pompes à chaleur.",
      district: "Voici l'approvisionnement en chauffage urbain {timeframe}, qui distribue la chaleur à plusieurs bâtiments via un réseau.",
      efficiency: "Voici les indicateurs d'efficacité pour la production de chaleur non fossile {timeframe}, y compris les taux de conversion et les pertes de distribution.",
      overview: "Voici un aperçu de la production de chaleur non fossile {timeframe}, montrant la production d'électricité et de chaleur à partir de sources renouvelables et nucléaires."
    },
    de: {
      production: "Hier ist die Wärmeproduktion aus nicht-fossilen Quellen {timeframe}. Dies umfasst Geothermie, Solarthermie und Wärmepumpen.",
      district: "Dies zeigt die Fernwärmeversorgung {timeframe}, die Wärme über ein Netzwerk an mehrere Gebäude verteilt.",
      efficiency: "Hier sind die Effizienzindikatoren für die nicht-fossile Wärmeerzeugung {timeframe}, einschließlich Umwandlungsraten und Verteilungsverluste.",
      overview: "Hier ist ein Überblick über die nicht-fossile Wärmeerzeugung {timeframe}, der sowohl die Strom- als auch die Wärmeerzeugung aus erneuerbaren und nuklearen Quellen zeigt."
    }
  },

  // Renewable energy responses
  renewableEnergy: {
    en: {
      share: "Here is the share of renewable energy {timeframe}. This shows the percentage of renewables in total energy consumption.",
      transport: "This shows the share of renewable energy in transport {timeframe}, including biofuels and renewable electricity.",
      electricity: "Here is the share of renewable electricity {timeframe}, including hydro, wind, solar and other renewable sources.",
      heating: "This shows the share of renewables in heating and cooling {timeframe}, including biomass, heat pumps and solar thermal.",
      overview: "Here's an overview of renewable energy shares {timeframe} across different sectors: total, transport, electricity, and heating/cooling."
    },
    fr: {
      share: "Voici la part des énergies renouvelables {timeframe}. Cela montre le pourcentage des renouvelables dans la consommation totale d'énergie.",
      transport: "Voici la part des énergies renouvelables dans les transports {timeframe}, y compris les biocarburants et l'électricité renouvelable.",
      electricity: "Voici la part d'électricité renouvelable {timeframe}, y compris l'hydraulique, l'éolien, le solaire et autres sources renouvelables.",
      heating: "Voici la part des renouvelables dans le chauffage et le refroidissement {timeframe}, y compris la biomasse, les pompes à chaleur et le solaire thermique.",
      overview: "Voici un aperçu des parts d'énergies renouvelables {timeframe} dans différents secteurs : total, transport, électricité et chauffage/refroidissement."
    },
    de: {
      share: "Hier ist der Anteil erneuerbarer Energien {timeframe}. Dies zeigt den Prozentsatz der Erneuerbaren am Gesamtenergieverbrauch.",
      transport: "Dies zeigt den Anteil erneuerbarer Energien im Verkehr {timeframe}, einschließlich Biokraftstoffe und erneuerbarem Strom.",
      electricity: "Hier ist der Anteil erneuerbarer Elektrizität {timeframe}, einschließlich Wasserkraft, Wind, Solar und andere erneuerbare Quellen.",
      heating: "Dies zeigt den Anteil der Erneuerbaren an Heizung und Kühlung {timeframe}, einschließlich Biomasse, Wärmepumpen und Solarthermie.",
      overview: "Hier ist ein Überblick über die Anteile erneuerbarer Energien {timeframe} in verschiedenen Sektoren: Gesamt, Verkehr, Elektrizität und Heizung/Kühlung."
    }
  },

  // Energy efficiency responses
  energyEfficiency: {
    en: {
      primary: "Here is the primary energy consumption {timeframe}, showing progress towards efficiency targets.",
      final: "This shows the final energy consumption {timeframe} and how it compares to efficiency targets.",
      progress: "Here's the progress towards energy efficiency targets {timeframe}, showing the distance to 2030 goals.",
      overview: "Here's an overview of energy efficiency indicators {timeframe}, including both primary and final energy consumption."
    },
    fr: {
      primary: "Voici la consommation d'énergie primaire {timeframe}, montrant les progrès vers les objectifs d'efficacité.",
      final: "Voici la consommation finale d'énergie {timeframe} et sa comparaison avec les objectifs d'efficacité.",
      progress: "Voici les progrès vers les objectifs d'efficacité énergétique {timeframe}, montrant la distance aux objectifs 2030.",
      overview: "Voici un aperçu des indicateurs d'efficacité énergétique {timeframe}, incluant la consommation d'énergie primaire et finale."
    },
    de: {
      primary: "Hier ist der Primärenergieverbrauch {timeframe}, der die Fortschritte bei den Effizienzzielen zeigt.",
      final: "Dies zeigt den Endenergieverbrauch {timeframe} und wie er sich zu den Effizienzzielen verhält.",
      progress: "Hier sind die Fortschritte bei den Energieeffizienzzielen {timeframe}, die den Abstand zu den 2030-Zielen zeigen.",
      overview: "Hier ist ein Überblick über die Energieeffizienzindikatoren {timeframe}, einschließlich Primär- und Endenergieverbrauch."
    }
  }
};

/**
 * Get a specific type of response
 * @param {string} type - The type of response to get
 * @param {string} language - The language code
 * @returns {Array} Array of responses of the specified type
 */
export const getResponseByType = (type, language = "en") => {
  if (!botResponses[type]) {
    console.warn(`Response type not found: ${type}`);
    return [];
  }

  const responses = botResponses[type][language] || botResponses[type].en;
  return responses || [];
};

export default botResponses;
