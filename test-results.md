# Test Execution Report

**Run Date:** Fri, 06 Sep 2024 09:47:45 GMT

**Overall Summary:**
- **Total Test Suites:** 2
- **Passed Test Suites:** 2
- **Failed Test Suites:** 0
- **Total Tests:** 18
- **Passed Tests:** 18
- **Failed Tests:** 0
- **Start Time:** 2024-09-06T09:47:40.360Z

## Individual Suite Results:
---
**Suite:** `/app/src/utils/nlp/contextManager.test.js`
**Status:** passed
**Duration:** 1049 ms
**Tests:** 13 passed, 0 failed, 0 pending - Total 13 tests.

**Test Details:**
- `ContextManager.resolveAnaphora Energy Type Pronoun Resolution should replace "it" when referring to energy type in production queries`: **passed** (10ms)
- `ContextManager.resolveAnaphora Energy Type Pronoun Resolution should replace "its" near energy keywords like "data"`: **passed** (2ms)
- `ContextManager.resolveAnaphora Energy Type Pronoun Resolution should replace "it" in "what about it" if energy type is in context`: **passed** (10ms)
- `ContextManager.resolveAnaphora Energy Type Pronoun Resolution should not replace "it" if not clearly referring to energy type context`: **passed** (3ms)
- `ContextManager.resolveAnaphora Country Pronoun Resolution should replace "they" when referring to country in production queries`: **passed** (2ms)
- `ContextManager.resolveAnaphora Country Pronoun Resolution should replace "them" near country keywords like "data for them"`: **passed** (3ms)
- `ContextManager.resolveAnaphora Country Pronoun Resolution should replace "it" in "about it" if country is in context and no energyType`: **passed** (3ms)
- `ContextManager.resolveAnaphora Country Pronoun Resolution should not replace "they" if not clearly referring to country context`: **passed** (3ms)
- `ContextManager.resolveAnaphora No Context or No Anaphora should return text unchanged if no lastMentioned entities`: **passed** (1ms)
- `ContextManager.resolveAnaphora No Context or No Anaphora should return text unchanged if no pronouns are present`: **passed** (1ms)
- `ContextManager.resolveAnaphora No Context or No Anaphora should handle empty string input`: **passed** (1ms)
- `ContextManager.resolveAnaphora Overlapping Pronoun Resolution (it/its) should prefer energy type for "its production" when both contexts exist`: **passed** (1ms)
- `ContextManager.resolveAnaphora Overlapping Pronoun Resolution (it/its) should replace country for "their data" when both contexts exist`: **passed** (1ms)

---
**Suite:** `/app/src/services/MessageService.test.js`
**Status:** passed
**Duration:** 4266 ms
**Tests:** 5 passed, 0 failed, 0 pending - Total 5 tests.

**Test Details:**
- `MessageService Response Phrasing createBotResponse varied introductions should use the first introductory phrase and fill topic`: **passed** (11ms)
- `MessageService Response Phrasing createBotResponse varied introductions should use a different introductory phrase if mock is changed`: **passed** (1ms)
- `MessageService Response Phrasing createBotResponse varied introductions should verify multiple calls can produce different intros (conceptual, requires unmocked or more complex mock)`: **passed** (1ms)
- `MessageService Response Phrasing processUserInput varied Eurostat responses should use the first Eurostat phrase and fill placeholders`: **passed** (2ms)
- `MessageService Response Phrasing processUserInput varied Eurostat responses should use a different Eurostat phrase if mock is changed`: **passed** (2ms)
