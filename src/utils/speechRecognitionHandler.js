/**
 * Dedicated handler for speech recognition functionality
 * Provides a more reliable interface especially for iOS devices
 */

class SpeechRecognitionHandler {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.onResult = null;
    this.onEnd = null;
    this.onError = null;
    this.language = "en-US";
    this.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  }

  isSupported() {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  init() {
    if (this.recognition) return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("Speech recognition not supported in this browser");
      return false;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;
    this.recognition.lang = this.language;

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (this.onResult) this.onResult(transcript);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (this.onEnd) this.onEnd();

      // Handle iOS-specific cleanup
      if (this.isIOS) {
        this._releaseMicrophoneOnIOS();
      }
    };

    this.recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      this.isListening = false;
      if (this.onError) this.onError(event);
    };

    return true;
  }

  setLanguage(langCode) {
    // Convert i18n language codes to SpeechRecognition language codes
    const langMap = {
      en: "en-US",
      fr: "fr-FR",
      de: "de-DE",
      es: "es-ES",
      it: "it-IT",
    };

    this.language = langMap[langCode] || "en-US";

    if (this.recognition) {
      this.recognition.lang = this.language;
    }
  }

  start() {
    if (this.isListening) return true;

    if (!this.recognition && !this.init()) {
      return false;
    }

    try {
      this.recognition.start();
      this.isListening = true;
      return true;
    } catch (error) {
      console.error("Failed to start speech recognition:", error);

      // On error, reset and try again
      this.stop();
      this.recognition = null;

      try {
        this.init();
        this.recognition.start();
        this.isListening = true;
        return true;
      } catch (retryError) {
        console.error(
          "Failed to restart speech recognition after error:",
          retryError
        );
        this.isListening = false;
        return false;
      }
    }
  }

  stop() {
    if (!this.isListening || !this.recognition) return true;

    try {
      this.recognition.stop();
      this.isListening = false;

      // Additional iOS cleanup
      if (this.isIOS) {
        this._releaseMicrophoneOnIOS();
      }

      return true;
    } catch (error) {
      console.error("Failed to stop speech recognition:", error);

      // Force cleanup on error
      this.isListening = false;
      this.recognition = null;
      return false;
    }
  }

  toggle() {
    return this.isListening ? this.stop() : this.start();
  }

  // iOS-specific handling
  _releaseMicrophoneOnIOS() {
    try {
      // Reset recognition instance for iOS
      this.recognition = null;

      // Force the audio stream to be released on iOS
      if (
        "mediaDevices" in navigator &&
        "getUserMedia" in navigator.mediaDevices
      ) {
        navigator.mediaDevices
          .getUserMedia({ audio: false })
          .catch((e) => console.log("iOS audio connection reset"));
      }
    } catch (e) {
      console.error("Error releasing iOS microphone resources:", e);
    }
  }
}

export default new SpeechRecognitionHandler();
