import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const ChatInputForm = ({ input, setInput, handleSendMessage, isTyping, t }) => {
  return (
    <form
      onSubmit={handleSendMessage}
      className="input-container"
      role="form"
    >
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={t('chat.placeholder')}
        disabled={isTyping}
        // inputRef can be passed as a prop if needed, or managed internally if ChatBot doesn't need direct access post-refactor
        className="chat-input"
        aria-label={t('accessibility.input_field')}
        role="textbox"
      />
      <button
        type="submit"
        className="send-button"
        disabled={!input.trim() || isTyping}
        aria-label={t('accessibility.send_button')}
      >
        <FontAwesomeIcon icon={faPaperPlane} aria-hidden="true" />
      </button>
    </form>
  );
};

ChatInputForm.propTypes = {
  input: PropTypes.string.isRequired,
  setInput: PropTypes.func.isRequired,
  handleSendMessage: PropTypes.func.isRequired,
  isTyping: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
};

export default ChatInputForm;
