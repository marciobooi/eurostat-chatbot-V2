const COUNTRY_MAP = {
    EU27_2020: ["European Union - 27 countries", "Union européenne (27 pays)", "Europäische Union (27 Länder)"],
    BE: ["belgium", "belgique", "belgie"],
    BG: ["bulgaria", "bulgarie", "bulgarien"],
    CZ: ["czechia", "czech republic", "tchequie", "tschechien"],
    DK: ["denmark", "danmark", "dänemark"],
    DE: ["germany", "deutschland", "allemagne"],
    EE: ["estonia", "estland", "estonie"],
    IE: ["ireland", "irlande", "irl"],
    GR: ["greece", "grece", "griechenland"],
    ES: ["spain", "espagne", "spanien"],
    FR: ["france", "frankreich", "france"],
    HR: ["croatia", "croatie", "kroatien"],
    IT: ["italy", "italie", "italien"],
    CY: ["cyprus", "chipre", "kypros"],
    LV: ["latvia", "lettonie", "lettland"],
    LT: ["lithuania", "lituanie", "litauen"],
    LU: ["luxembourg", "luxembourg", "luxemburg"],
    HU: ["hungary", "hongrie", "ungarn"],
    MT: ["malta", "malte", "malta"],
    NL: ["netherlands", "nederland", "pays-bas"],
    AT: ["austria", "autriche", "österreich"],
    PL: ["poland", "pologne", "polen"],
    PT: ["portugal", "portugal", "portugal"],
    RO: ["romania", "roumanie", "rumänien"],
    SI: ["slovenia", "slovenie", "slowenien"],
    SK: ["slovakia", "slovaquie", "slowakei"],
    FI: ["finland", "finlande", "finnland"],
    SE: ["sweden", "suede", "schweden"],
  };
  
  export const extractCountry = (query) => {
    const normalizedQuery = query.toLowerCase();
    // Loop over each country code in the mapping
    for (const [isoCode, synonyms] of Object.entries(COUNTRY_MAP)) {
      // If any synonym is found in the query, return the country object.
      if (synonyms.some((syn) => normalizedQuery.includes(syn))) {
        // Optionally, you could return the first synonym as the "display name"
        return { name: synonyms[0], code: isoCode };
      }
    }
    return null;
  };
  