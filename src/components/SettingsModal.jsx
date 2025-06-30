import React, { useState, useEffect } from 'react';
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
  const [preferences, setPreferences] = useState({});
  const [chartSettings, setChartSettings] = useState({});
  const [storageInfo, setStorageInfo] = useState({});
  const [activeTab, setActiveTab] = useState('preferences');

  useEffect(() => {
    if (isOpen) {
      loadSettings();
    }
  }, [isOpen]);

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
  };

  const handleExportData = () => {
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
    } catch (error) {
      alert('Failed to export data: ' + error.message);
    }
  };

  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        const success = importData(data);
        if (success) {
          alert('Data imported successfully!');
          loadSettings();
        } else {
          alert('Failed to import data. Please check the file format.');
        }
      } catch (error) {
        alert('Invalid file format: ' + error.message);
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset file input
  };

  const handleClearAllData = () => {
    if (window.confirm('Are you sure you want to clear all stored data? This action cannot be undone.')) {
      clearAllStorage();
      alert('All data cleared successfully!');
      loadSettings();
    }
  };

  const handleClearChatHistory = () => {
    if (window.confirm('Are you sure you want to clear your chat history?')) {
      clearChatHistory();
      alert('Chat history cleared successfully!');
      loadSettings();
    }
  };

  const handleClearSearchHistory = () => {
    if (window.confirm('Are you sure you want to clear your search history?')) {
      clearSearchHistory();
      alert('Search history cleared successfully!');
      loadSettings();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="settings-modal-overlay" onClick={onClose}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2>Settings</h2>
          <button className="close-button" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="settings-tabs">
          <button
            className={`tab-button ${activeTab === 'preferences' ? 'active' : ''}`}
            onClick={() => setActiveTab('preferences')}
          >
            <FontAwesomeIcon icon={faToggleOn} />
            Preferences
          </button>
          <button
            className={`tab-button ${activeTab === 'charts' ? 'active' : ''}`}
            onClick={() => setActiveTab('charts')}
          >
            <FontAwesomeIcon icon={faChartBar} />
            Charts
          </button>
          <button
            className={`tab-button ${activeTab === 'data' ? 'active' : ''}`}
            onClick={() => setActiveTab('data')}
          >
            <FontAwesomeIcon icon={faDatabase} />
            Data
          </button>
        </div>

        <div className="settings-content">
          {activeTab === 'preferences' && (
            <div className="settings-section">
              <h3>General Preferences</h3>
              
              <div className="setting-item">
                <label>
                  <span>Auto-save chat history</span>
                  <button
                    className={`toggle-button ${preferences.autoSave ? 'on' : 'off'}`}
                    onClick={() => handlePreferenceChange('autoSave', !preferences.autoSave)}
                  >
                    <FontAwesomeIcon icon={preferences.autoSave ? faToggleOn : faToggleOff} />
                  </button>
                </label>
                <p className="setting-description">
                  Automatically save your chat messages for future sessions
                </p>
              </div>

              <div className="setting-item">
                <label>
                  <span>Show welcome message</span>
                  <button
                    className={`toggle-button ${preferences.showWelcomeMessage ? 'on' : 'off'}`}
                    onClick={() => handlePreferenceChange('showWelcomeMessage', !preferences.showWelcomeMessage)}
                  >
                    <FontAwesomeIcon icon={preferences.showWelcomeMessage ? faToggleOn : faToggleOff} />
                  </button>
                </label>
                <p className="setting-description">
                  Display a welcome message when starting a new chat
                </p>
              </div>

              <div className="setting-item">
                <label>
                  <span>Default country</span>
                  <select
                    value={preferences.defaultCountry || 'EU27_2020'}
                    onChange={(e) => handlePreferenceChange('defaultCountry', e.target.value)}
                  >
                    <option value="EU27_2020">European Union</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                    <option value="IT">Italy</option>
                    <option value="ES">Spain</option>
                    <option value="NL">Netherlands</option>
                    <option value="BE">Belgium</option>
                    <option value="PL">Poland</option>
                  </select>
                </label>
                <p className="setting-description">
                  Default country for energy data queries
                </p>
              </div>

              <div className="setting-item">
                <label>
                  <span>Max chat history</span>
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
                  Maximum number of chat messages to keep in history
                </p>
              </div>
            </div>
          )}

          {activeTab === 'charts' && (
            <div className="settings-section">
              <h3>Chart Settings</h3>
              
              <div className="setting-item">
                <label>
                  <span>Show legend</span>
                  <button
                    className={`toggle-button ${chartSettings.showLegend ? 'on' : 'off'}`}
                    onClick={() => handleChartSettingChange('showLegend', !chartSettings.showLegend)}
                  >
                    <FontAwesomeIcon icon={chartSettings.showLegend ? faToggleOn : faToggleOff} />
                  </button>
                </label>
                <p className="setting-description">
                  Show chart legend for pie and stacked charts
                </p>
              </div>

              <div className="setting-item">
                <label>
                  <span>Show tooltips</span>
                  <button
                    className={`toggle-button ${chartSettings.showTooltip ? 'on' : 'off'}`}
                    onClick={() => handleChartSettingChange('showTooltip', !chartSettings.showTooltip)}
                  >
                    <FontAwesomeIcon icon={chartSettings.showTooltip ? faToggleOn : faToggleOff} />
                  </button>
                </label>
                <p className="setting-description">
                  Show tooltips when hovering over chart elements
                </p>
              </div>

              <div className="setting-item">
                <label>
                  <span>Enable animations</span>
                  <button
                    className={`toggle-button ${chartSettings.animationEnabled ? 'on' : 'off'}`}
                    onClick={() => handleChartSettingChange('animationEnabled', !chartSettings.animationEnabled)}
                  >
                    <FontAwesomeIcon icon={chartSettings.animationEnabled ? faToggleOn : faToggleOff} />
                  </button>
                </label>
                <p className="setting-description">
                  Enable chart animations and transitions
                </p>
              </div>

              <div className="setting-item">
                <label>
                  <span>Default chart type</span>
                  <select
                    value={chartSettings.defaultType || 'pie'}
                    onChange={(e) => handleChartSettingChange('defaultType', e.target.value)}
                  >
                    <option value="pie">Pie Chart</option>
                    <option value="bar">Bar Chart</option>
                    <option value="line">Line Chart</option>
                    <option value="stacked">Stacked Chart</option>
                  </select>
                </label>
                <p className="setting-description">
                  Default chart type for data visualizations
                </p>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="settings-section">
              <h3>Data Management</h3>
              
              <div className="storage-info">
                <h4>Storage Information</h4>
                <div className="info-grid">
                  <div className="info-item">
                    <FontAwesomeIcon icon={faInfo} />
                    <span>Local Storage: {storageInfo.localStorage?.available ? 'Available' : 'Not Available'}</span>
                  </div>
                  <div className="info-item">
                    <FontAwesomeIcon icon={faInfo} />
                    <span>Session Storage: {storageInfo.sessionStorage?.available ? 'Available' : 'Not Available'}</span>
                  </div>
                </div>
              </div>

              <div className="data-actions">
                <h4>Export & Import</h4>
                <div className="action-buttons">
                  <button className="action-button primary" onClick={handleExportData}>
                    <FontAwesomeIcon icon={faDownload} />
                    Export Data
                  </button>
                  <label className="action-button secondary">
                    <FontAwesomeIcon icon={faUpload} />
                    Import Data
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportData}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
                <p className="action-description">
                  Export your data for backup or import data from a previous export
                </p>
              </div>

              <div className="data-actions">
                <h4>Clear Data</h4>
                <div className="action-buttons">
                  <button className="action-button danger" onClick={handleClearChatHistory}>
                    <FontAwesomeIcon icon={faTrash} />
                    Clear Chat History
                  </button>
                  <button className="action-button danger" onClick={handleClearSearchHistory}>
                    <FontAwesomeIcon icon={faTrash} />
                    Clear Search History
                  </button>
                  <button className="action-button danger" onClick={handleClearAllData}>
                    <FontAwesomeIcon icon={faTrash} />
                    Clear All Data
                  </button>
                </div>
                <p className="action-description warning">
                  Warning: These actions cannot be undone. Consider exporting your data first.
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
