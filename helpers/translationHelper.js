// Import your JSON files directly
const en = require('../i18n/en.json');
const es = require('../i18n/es.json');
const ca = require('../i18n/ca.json');
const fr = require('../i18n/fr.json');

const RESOURCES = { en, es, ca, fr };
const DEFAULT_LANG = 'es';

/**
 * Translates a key into the target language with optional parameters.
 * @param {string} lang - The target language code ('es', 'ca', etc.)
 * @param {string} key - The JSON key (e.g., 'new_obs_title')
 * @param {object} params - Object containing variables to replace (e.g., { user: 'Roger' })
 */
const t = (lang, key, params = {}) => {
    const selectedResources = RESOURCES[lang] || RESOURCES[DEFAULT_LANG];

    let text = selectedResources[key] || RESOURCES[DEFAULT_LANG][key];

    if (!text) return key; // Return key if absolutely nothing found

    Object.keys(params).forEach(paramKey => {
        const regex = new RegExp(`{{${paramKey}}}`, 'g'); // Create regex for {{key}}
        text = text.replace(regex, params[paramKey]);
    });

    return text;
};

module.exports = { t };