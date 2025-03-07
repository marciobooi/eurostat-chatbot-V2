/**
 * Helper functions for handling temporal aspects of Eurostat datasets
 */

import { datePatterns } from '../data/datePatterns';

// Map of dataset codes to their temporal frequencies
const datasetFrequencies = {
    'nrg_cb_gasm': 'monthly',
    'nrg_cb_oilm': 'monthly',
    'nrg_ti_gas': 'annual',
    'nrg_ti_oil': 'annual',
    'nrg_cb_oil': 'annual',
    'nrg_bal_c': 'annual',
    'nrg_ind_peh': 'annual'
};

/**
 * Get temporal frequency for a dataset
 * @param {string} datasetCode - Dataset identifier
 * @returns {string} Temporal frequency ('monthly' or 'annual')
 */
export const getDatasetFrequency = (datasetCode) => {
    return datasetFrequencies[datasetCode] || 'annual';
};

/**
 * Format date for dataset query
 * @param {Date|string} date - Date to format
 * @param {string} frequency - Temporal frequency ('monthly' or 'annual')
 * @returns {string} Formatted date string (YYYY-MM for monthly, YYYY for annual)
 */
export const formatDateForDataset = (date, frequency = 'annual') => {
    const d = new Date(date);
    if (frequency === 'monthly') {
        const month = String(d.getMonth() + 1).padStart(2, '0');
        return `${d.getFullYear()}-${month}`;
    }
    return d.getFullYear().toString();
};

/**
 * Get time range parameters for dataset
 * @param {Object} options - Time range options
 * @param {string} options.startDate - Start date (YYYY-MM-DD or YYYY)
 * @param {string} options.endDate - End date (YYYY-MM-DD or YYYY)
 * @param {string} options.frequency - Temporal frequency ('monthly' or 'annual')
 * @returns {Object} Time parameters for dataset query
 */
export const getTimeParameters = (options) => {
    const { startDate, endDate, frequency = 'annual' } = options;
    
    let timeParams = {};
    if (startDate && endDate) {
        timeParams.startPeriod = formatDateForDataset(startDate, frequency);
        timeParams.endPeriod = formatDateForDataset(endDate, frequency);
    } else if (startDate) {
        timeParams.time = formatDateForDataset(startDate, frequency);
    } else {
        // Default to current year/month
        const now = new Date();
        if (frequency === 'monthly') {
            // For monthly data, use previous month as default
            now.setMonth(now.getMonth() - 1);
        }
        timeParams.time = formatDateForDataset(now, frequency);
    }
    
    return timeParams;
};

/**
 * Extract time period information from query text
 * @param {string} query - Query text
 * @param {string} language - Language code (en, fr, de)
 * @returns {Object} Time period parameters
 */
export const extractTimePeriod = (query, language = 'en') => {
    if (!query) return null;

    const timeInfo = datePatterns.extractTimePeriod(query, language);
    
    // Convert the time info into the format expected by the dataset API
    if (timeInfo) {
        switch (timeInfo.type) {
            case 'monthRange':
                return {
                    startDate: `${timeInfo.startYear}-${String(timeInfo.startMonth).padStart(2, '0')}-01`,
                    endDate: `${timeInfo.endYear}-${String(timeInfo.endMonth).padStart(2, '0')}-01`,
                    frequency: 'monthly'
                };
            case 'month':
                return {
                    startDate: `${timeInfo.year}-${String(timeInfo.month).padStart(2, '0')}-01`,
                    frequency: 'monthly'
                };
            case 'yearRange':
                return {
                    startDate: `${timeInfo.startYear}-01-01`,
                    endDate: `${timeInfo.endYear}-12-31`,
                    frequency: 'annual'
                };
            case 'year':
                return {
                    startDate: `${timeInfo.year}-01-01`,
                    frequency: 'annual'
                };
            default:
                return {
                    startDate: `${new Date().getFullYear()}-01-01`,
                    frequency: 'annual'
                };
        }
    }

    // Default to current year if no time period found
    return {
        startDate: `${new Date().getFullYear()}-01-01`,
        frequency: 'annual'
    };
};

export default {
    getDatasetFrequency,
    formatDateForDataset,
    getTimeParameters,
    extractTimePeriod
};