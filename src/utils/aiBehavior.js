import i18n from '../i18n';
import { getRandomFromArray } from './random';

const thinkingTimes = [1000, 1500, 2000]; // Thinking time in milliseconds
const typingSpeed = 50; // Base typing speed (ms per character)
const typingVariation = 20; // Random variation in typing speed

export const calculateThinkingTime = (input) => {
  const baseTime = getRandomFromArray(thinkingTimes);
  const inputComplexity = input.length / 10; // Longer inputs = more thinking time
  return Math.min(baseTime + (inputComplexity * 100), 3000); // Cap at 3 seconds
};

export const calculateTypingTime = (text) => {
  if (!text) return 0;
  const baseTime = text.length * typingSpeed;
  const variation = Math.random() * typingVariation * text.length;
  return Math.min(baseTime + variation, 4000); // Cap at 4 seconds
};

export const getContextAwareResponse = (query, previousMessages, energyInfo) => {
  const currentLang = i18n.language;
  const followUpPhrases = i18n.t('followUpPhrases', { returnObjects: true });
  
  // Check if this is a follow-up question
  const isFollowUp = previousMessages.length > 0 && 
    followUpPhrases.some(phrase => 
      query.toLowerCase().includes(phrase.toLowerCase())
    );

  if (isFollowUp) {
    const lastBotMessage = previousMessages
      .filter(msg => msg.sender === 'bot')
      .pop();
    
    if (lastBotMessage) {
      return i18n.t('followUp', {
        topic: lastBotMessage.text.substring(0, 50)
      }) + ' ' + energyInfo;
    }
  }

  return energyInfo;
};
