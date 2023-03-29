const { Translate } = require('@google-cloud/translate').v2;

const projectId = 'fluent-languages';

const translate = new Translate({ projectId });

async function googleTranslate(text, targetLanguage) {
    try {
        const [translation] = await translate.translate(text, targetLanguage);

        return translation;
    } catch (error) {
        console.error(error);
        return null;
    }
}

module.exports = { googleTranslate };
