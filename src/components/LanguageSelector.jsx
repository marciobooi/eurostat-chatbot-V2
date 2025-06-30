import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { changeLanguage, availableLanguages, getCurrentLanguage } from '../i18n';
import './LanguageSelector.css';

const LanguageSelector = ({ variant = "default" }) => {
  const { t } = useTranslation();
  const currentLang = getCurrentLanguage();

  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode);
  };

  return (
    <div className={`language-selector ${variant}`}>
      <div className="language-icon">
        <FontAwesomeIcon icon={faGlobe} />
      </div>
      <select 
        value={currentLang} 
        onChange={(e) => handleLanguageChange(e.target.value)}
        className="language-select"
        aria-label={t('settings.preferences.language')}
      >
        {availableLanguages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
