import { jest } from '@jest/globals';
import { MessageService } from '../services/MessageService';
import { welcomeMessages } from '../dictionaries/welcomeMessages';
import { CONFIG } from '../i18n';

// Mock modules using dynamic imports
vi.mock('../utils/storageHandlers', async () => {
  return {
    saveChatToCookie: vi.fn(),
    clearChatFromCookie: vi.fn(),
  };
});

vi.mock('../utils/nlp/contextManager', async () => {
  return {
    clearContext: vi.fn(),
  };
});

describe('MessageService Greeting Tests', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    
    greetings.forEach(greeting => {
      const isGreeting = MessageService.isGreetingMessage(greeting, 'en');
      expect(isGreeting).toBe(true);
    });
  });

  test('should process greeting messages and return appropriate responses', async () => {
    const greetings = ['hello', 'hi', 'hey'];

    for (const greeting of greetings) {
      const messages = await MessageService.processUserInput(greeting, 'en');
      
      // Log the interaction for visibility
      console.log(`\nUser: ${greeting}`);
      console.log(`Bot: ${messages[1].text}`);

      // Verify user message
      expect(messages[0]).toEqual({
        sender: 'user',
        text: greeting,
        language: 'en'
      });

      // Verify bot response
      expect(messages[1]).toEqual(expect.objectContaining({
        sender: 'bot',
        language: 'en'
      }));

      // Verify the bot response is from welcome messages
      const welcomeMessagesList = welcomeMessages['en'] || welcomeMessages[CONFIG.DEFAULT_LANGUAGE];
      expect(welcomeMessagesList).toContain(messages[1].text);
    }
  });
});