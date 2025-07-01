import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faDownload,
  faUpload,
  faTrash,
  faToggleOn,
  faToggleOff,
  faChartBar,
  faDatabase,
  faInfo
} from '@fortawesome/free-solid-svg-icons';
import {
  getUserPreferences,
  updateUserPreferences,
  getChartSettings,
  updateChartSettings,
  exportData,
  importData,
  clearAllStorage,
  getStorageInfo,
  clearChatHistory,
  clearSearchHistory
} from '../utils/storage.js';
import './SettingsModal.css';

const SettingsModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [preferences, setPreferences] = useState({});
  const [chartSettings, setChartSettings] = useState({});
  const [storageInfo, setStorageInfo] = useState({});
  const [activeTab, setActiveTab] = useState('preferences');

  useEffect(() => {
    if (isOpen) {
      loadSettings();
    }
  }, [isOpen]);

  // Apply dark mode class to body
  useEffect(() => {
    if (preferences.darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [preferences.darkMode]);

  // Initialize dark mode on component mount
  useEffect(() => {
    const currentPreferences = getUserPreferences();
    if (currentPreferences.darkMode) {
      document.body.classList.add('dark-mode');
    }
  }, []);

  const loadSettings = async () => {
    setPreferences(getUserPreferences());
    setChartSettings(getChartSettings());
    setStorageInfo(getStorageInfo());
  };

  const handlePreferenceChange = (key, value) => {
    const updated = { ...preferences, [key]: value };
    setPreferences(updated);
    updateUserPreferences({ [key]: value });
  };

  const handleChartSettingChange = (key, value) => {
    const updated = { ...chartSettings, [key]: value };
    setChartSettings(updated);
    updateChartSettings({ [key]: value });
  };  const handleExportData = () => {
    try {
      const data = exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `eurostat-chatbot-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(t('toast.dataExported'));
    } catch (error) {
      toast.error(t('toast.exportFailed') + ': ' + error.message);
    }
  };  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        const success = importData(data);
        if (success) {
          toast.success(t('toast.dataImported'));
          loadSettings();
        } else {
          toast.error(t('toast.importFailed'));
        }
      } catch (error) {
        toast.error(t('toast.invalidFileFormat') + ': ' + error.message);
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset file input
  };  // Custom confirmation function using toast
  const showConfirmation = (message, onConfirm) => {
    toast((toastInstance) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div>{message}</div>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            style={{
              padding: '6px 12px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
            onClick={() => {
              toast.dismiss(toastInstance.id);
              onConfirm();
            }}
          >
            {t('toast.confirm')}
          </button>
          <button
            style={{
              padding: '6px 12px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
            onClick={() => toast.dismiss(toastInstance.id)}
          >
            {t('toast.cancel')}
          </button>
        </div>
      </div>
    ), {
      duration: Infinity,
      position: 'top-center',
    });
  };

  const handleClearAllData = () => {
    showConfirmation(t('toast.confirmClearAll'), () => {
      clearAllStorage();
      toast.success(t('toast.dataCleared'));
      loadSettings();
    });
  };

  const handleClearChatHistory = () => {
    showConfirmation(t('toast.confirmClearChat'), () => {
      clearChatHistory();
      toast.success(t('toast.chatHistoryCleared'));
      loadSettings();
    });
  };

  const handleClearSearchHistory = () => {
    showConfirmation(t('toast.confirmClearSearch'), () => {
      clearSearchHistory();
      toast.success(t('toast.searchHistoryCleared'));
      loadSettings();
    });
  };

  if (!isOpen) return null;

  return (
    <div className="settings-modal-overlay" onClick={onClose}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>        <div className="settings-header">
          <h2>{t('settings.title')}</h2>
          <button className="close-button" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>        <div className="settings-tabs">
          <button
            className={`tab-button ${activeTab === 'preferences' ? 'active' : ''}`}
            onClick={() => setActiveTab('preferences')}
          >
            <FontAwesomeIcon icon={faToggleOn} />
            {t('settings.tabs.preferences')}
          </button>
          <button
            className={`tab-button ${activeTab === 'charts' ? 'active' : ''}`}
            onClick={() => setActiveTab('charts')}
          >
            <FontAwesomeIcon icon={faChartBar} />
            {t('settings.tabs.charts')}
          </button>
          <button
            className={`tab-button ${activeTab === 'data' ? 'active' : ''}`}
            onClick={() => setActiveTab('data')}
          >
            <FontAwesomeIcon icon={faDatabase} />
            {t('settings.tabs.data')}
          </button>
        </div>

        <div className="settings-content">          {activeTab === 'preferences' && (
            <div className="settings-section">
              <h3>{t('settings.preferences.title')}</h3>
              
              <div className="setting-item">
                <label>
                  <span>{t('settings.preferences.autoSave')}</span>
                  <button
                    className={`toggle-button ${preferences.autoSave ? 'on' : 'off'}`}
                    onClick={() => handlePreferenceChange('autoSave', !preferences.autoSave)}
                  >
                    <FontAwesomeIcon icon={preferences.autoSave ? faToggleOn : faToggleOff} />
                  </button>
                </label>
                <p className="setting-description">
                  {t('settings.preferences.autoSaveDesc')}
                </p>
              </div>

              <div className="setting-item">
                <label>
                  <span>{t('settings.preferences.showWelcome')}</span>
                  <button
                    className={`toggle-button ${preferences.showWelcomeMessage ? 'on' : 'off'}`}
                    onClick={() => handlePreferenceChange('showWelcomeMessage', !preferences.showWelcomeMessage)}
                  >
                    <FontAwesomeIcon icon={preferences.showWelcomeMessage ? faToggleOn : faToggleOff} />
                  </button>
                </label>
                <p className="setting-description">
                  {t('settings.preferences.showWelcomeDesc')}
                </p>
              </div>

              <div className="setting-item">
                <label>
                  <span>{t('settings.preferences.defaultCountry')}</span>
                  <select
                    value={preferences.defaultCountry || 'EU27_2020'}
                    onChange={(e) => handlePreferenceChange('defaultCountry', e.target.value)}
                  >
                    <option value="EU27_2020">{t('countries.EU27_2020')}</option>                    <option value="DE">{t('countries.DE')}</option>
                    <option value="FR">{t('countries.FR')}</option>
                    <option value="IT">{t('countries.IT')}</option>
                    <option value="ES">{t('countries.ES')}</option>
                    <option value="NL">{t('countries.NL')}</option>
                    <option value="BE">{t('countries.BE')}</option>
                    <option value="PL">{t('countries.PL')}</option>
                  </select>
                </label>                <p className="setting-description">
                  {t('settings.preferences.defaultCountryDesc')}
                </p>
              </div>

              <div className="setting-item">
                <label>
                  <span>{t('settings.preferences.maxMessages')}</span>
                  <select
                    value={preferences.maxChatHistory || 100}
                    onChange={(e) => handlePreferenceChange('maxChatHistory', parseInt(e.target.value))}
                  >
                    <option value="50">50 messages</option>
                    <option value="100">100 messages</option>
                    <option value="200">200 messages</option>
                    <option value="500">500 messages</option>
                  </select>
                </label>
                <p className="setting-description">
                  {t('settings.preferences.maxMessagesDesc')}
                </p>
              </div>

              <div className="setting-item">
                <label>
                  <span>{t('settings.preferences.darkMode')}</span>
                  <button
                    className={`toggle-button ${preferences.darkMode ? 'on' : 'off'}`}
                    onClick={() => handlePreferenceChange('darkMode', !preferences.darkMode)}
                  >
                    <FontAwesomeIcon icon={preferences.darkMode ? faToggleOn : faToggleOff} />
                  </button>
                </label>
                <p className="setting-description">
                  {t('settings.preferences.darkModeDesc')}
                </p>
              </div>
            </div>
          )}          {activeTab === 'charts' && (
            <div className="settings-section">
              <h3>{t('settings.charts.title')}</h3>
              
              <div className="setting-item">
                <label>
                  <span>{t('settings.charts.showLegend')}</span>
                  <button
                    className={`toggle-button ${chartSettings.showLegend ? 'on' : 'off'}`}
                    onClick={() => handleChartSettingChange('showLegend', !chartSettings.showLegend)}
                  >
                    <FontAwesomeIcon icon={chartSettings.showLegend ? faToggleOn : faToggleOff} />
                  </button>
                </label>
                <p className="setting-description">
                  {t('settings.charts.showLegendDesc')}
                </p>
              </div>

              <div className="setting-item">
                <label>
                  <span>{t('settings.charts.showTooltips')}</span>
                  <button
                    className={`toggle-button ${chartSettings.showTooltip ? 'on' : 'off'}`}
                    onClick={() => handleChartSettingChange('showTooltip', !chartSettings.showTooltip)}
                  >
                    <FontAwesomeIcon icon={chartSettings.showTooltip ? faToggleOn : faToggleOff} />
                  </button>
                </label>
                <p className="setting-description">
                  {t('settings.charts.showTooltipsDesc')}
                </p>
              </div>

              <div className="setting-item">
                <label>
                  <span>{t('settings.charts.enableAnimations')}</span>
                  <button
                    className={`toggle-button ${chartSettings.animationEnabled ? 'on' : 'off'}`}
                    onClick={() => handleChartSettingChange('animationEnabled', !chartSettings.animationEnabled)}
                  >
                    <FontAwesomeIcon icon={chartSettings.animationEnabled ? faToggleOn : faToggleOff} />
                  </button>
                </label>
                <p className="setting-description">
                  {t('settings.charts.enableAnimationsDesc')}
                </p>
              </div>

              <div className="setting-item">
                <label>
                  <span>{t('settings.charts.defaultType')}</span>
                  <select
                    value={chartSettings.defaultType || 'pie'}
                    onChange={(e) => handleChartSettingChange('defaultType', e.target.value)}
                  >
                    <option value="pie">{t('settings.charts.chartTypes.pie')}</option>
                    <option value="bar">{t('settings.charts.chartTypes.column')}</option>
                    <option value="line">{t('settings.charts.chartTypes.line')}</option>
                    <option value="stacked">{t('settings.charts.chartTypes.stacked')}</option>
                  </select>
                </label>
                <p className="setting-description">
                  {t('settings.charts.defaultTypeDesc')}
                </p>
              </div>
            </div>
          )}          {activeTab === 'data' && (
            <div className="settings-section">
              <h3>{t('settings.data.title')}</h3>
              
              <div className="storage-info">
                <h4>{t('settings.data.storage')}</h4>
                <div className="info-grid">
                  <div className="info-item">
                    <FontAwesomeIcon icon={faInfo} />
                    <span>{t('settings.data.localStorage')}: {storageInfo.localStorage?.available ? t('settings.data.available') : t('settings.data.notAvailable')}</span>
                  </div>
                  <div className="info-item">
                    <FontAwesomeIcon icon={faInfo} />
                    <span>{t('settings.data.sessionStorage')}: {storageInfo.sessionStorage?.available ? t('settings.data.available') : t('settings.data.notAvailable')}</span>
                  </div>
                </div>
              </div>

              <div className="data-actions">
                <h4>{t('settings.data.exportImport')}</h4>
                <div className="action-buttons">
                  <button className="action-button primary" onClick={handleExportData}>
                    <FontAwesomeIcon icon={faDownload} />
                    {t('settings.data.exportDataAction')}
                  </button>
                  <label className="action-button secondary">
                    <FontAwesomeIcon icon={faUpload} />
                    {t('settings.data.importDataAction')}
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportData}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
                <p className="action-description">
                  {t('settings.data.exportImportDesc')}
                </p>
              </div>

              <div className="data-actions">
                <h4>{t('settings.data.clearDataSection')}</h4>
                <div className="action-buttons">
                  <button className="action-button danger" onClick={handleClearChatHistory}>
                    <FontAwesomeIcon icon={faTrash} />
                    {t('settings.data.clearChatHistory')}
                  </button>
                  <button className="action-button danger" onClick={handleClearSearchHistory}>
                    <FontAwesomeIcon icon={faTrash} />
                    {t('settings.data.clearSearchHistory')}
                  </button>
                  <button className="action-button danger" onClick={handleClearAllData}>
                    <FontAwesomeIcon icon={faTrash} />
                    {t('settings.data.clearData')}
                  </button>
                </div>
                <p className="action-description warning">
                  {t('settings.data.clearDataWarning')}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
