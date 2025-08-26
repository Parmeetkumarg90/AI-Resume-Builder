import { createClient } from '@deepgram/sdk';
import fs from 'fs/promises';

const deepgramApiKey = process.env.DEEPGRAM_API_KEY;
const deepgram = createClient(deepgramApiKey, { timeout: 20000 });

const getTextFromAudio = async (path) => {
    let fileBuffer = await fs.readFile(path);
    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
        fileBuffer,
        {
            model: 'nova-3',
            language: 'en',
        },
    );

    if (error) {
        console.error(error);
        return null;
    } else {
        // console.dir(result, { depth: null });
        return result?.results?.channels?.[0]?.alternatives?.[0]?.transcript || '';
    }
}

export default getTextFromAudio;