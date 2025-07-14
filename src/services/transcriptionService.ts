const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export async function transcribeAudio(audioBlob: string): Promise<string> {
  try {
    // Convert the blob URL to a Blob object
    const response = await fetch(audioBlob);
    const blob = await response.blob();

    // Create FormData and append the audio file
    const formData = new FormData();
    formData.append('file', blob, 'audio.webm');
    formData.append('model', 'whisper-1');
    formData.append('language', 'fr');
    formData.append('response_format', 'text');

    // Send to OpenAI Whisper API
    const transcriptionResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: formData
    });

    if (!transcriptionResponse.ok) {
      throw new Error(`Transcription failed: ${transcriptionResponse.statusText}`);
    }

    const transcription = await transcriptionResponse.text();
    return transcription;
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw new Error('La transcription audio a échoué. Veuillez réessayer.');
  }
} 