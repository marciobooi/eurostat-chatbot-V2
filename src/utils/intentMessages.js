/**
 * message flow for the chat
 * 
 * This implements a comprehensive intent flow processing for the messages 
 * we try to find the word in this dictionaries inside the data folder
 * so better add tokkenization
 * 
 * messages Flow:
 * 1. User Input → Trim + Lowercase
 * 2. Check spelling with nspell
 * 3. greetings
 * 4. find definition (this will be delegate to the ruler we just pass the query)
 * 5. farewell


    all except the point 2 definitions we should provide a ramdom answer
 */