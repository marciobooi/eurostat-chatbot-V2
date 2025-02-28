import { getRelatedTopics } from './energyDictionary';
import { getRandomFromArray } from '../utils/random';

const followUpTemplates = {
  en: [
    'Would you like to explore more about {{topic}}?',
    'Shall we dive deeper into {{topic}} topics?',
    'Would you like to know more about {{topic}}?',
    'Should we continue exploring {{topic}}?',
    'Do you want to continue exploring {{topic}} topics?',
    'Shall we discuss more about {{topic}}?',
    'Would you like to learn more about {{topic}} and its uses?',
    'Should we explore other aspects of {{topic}}?'
  ],
  fr: [
    'Voulez-vous en savoir plus sur {{topic}}?',
    'Souhaitez-vous approfondir les sujets liés à {{topic}}?',
    'Voulez-vous explorer davantage {{topic}}?',
    'Continuons-nous avec {{topic}}?',
    'Voulez-vous continuer à explorer les sujets liés à {{topic}}?',
    'Souhaitez-vous en savoir plus sur {{topic}}?',
    'Désirez-vous découvrir d\'autres aspects de {{topic}}?'
  ],
  de: [
    'Möchten Sie mehr über {{topic}} erfahren?',
    'Sollen wir tiefer in {{topic}}-Themen eintauchen?',
    'Möchten Sie mehr über {{topic}} wissen?',
    'Erforschen wir weitere {{topic}}-Themen?',
    'Möchten Sie die Themen rund um {{topic}} weiter erkunden?',
    'Sollen wir mehr über {{topic}} sprechen?',
    'Möchten Sie weitere Aspekte von {{topic}} kennenlernen?'
  ]
};

export const getFollowUpQuestion = (topic, language) => {
  const templates = followUpTemplates[language] || followUpTemplates.en;
  const template = getRandomFromArray(templates);
  return template.replace('{{topic}}', topic);
};

export const getFollowUpSuggestion = (topic, language) => {
  const baseTopic = topic.split('_')[0].toLowerCase();
  const question = getFollowUpQuestion(baseTopic, language);
  const relatedTopics = getRelatedTopics(baseTopic, language);
  
  return relatedTopics?.length > 0 ? {
    question,
    topics: relatedTopics
  } : null;
};
