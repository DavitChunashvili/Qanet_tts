export interface TTSOptions {
  text: string;
  locale: string;
  rate: number;
  pitch: number;
}

export async function getTTSAudio(options: TTSOptions): Promise<Buffer> {
  const provider = (process.env.TTS_PROVIDER || 'mock').toLowerCase();

  switch (provider) {
    case 'google':
      return getGoogleTTS(options);
    case 'azure':
      return getAzureTTS(options);
    case 'aws':
      return getAWSPollyTTS(options);
    case 'mock':
    default:
      return getMockTTS(options);
  }
}

async function getGoogleTTS(options: TTSOptions): Promise<Buffer> {
  try {
    const textToSpeech = await import('@google-cloud/text-to-speech');
    const client = new textToSpeech.TextToSpeechClient();

    const request = {
      input: { text: options.text },
      voice: {
        languageCode: options.locale,
        name: `${options.locale}-Neural2-A`,
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: options.rate,
        pitch: (options.pitch - 1) * 20, // Convert 0.5-2.0 to -10 to 20
      },
    };

    const [response] = await client.synthesizeSpeech(request as any);
    return Buffer.from(response.audioContent as any);
  } catch (error) {
    console.error('Google TTS error:', error);
    return getMockTTS(options);
  }
}

async function getAzureTTS(options: TTSOptions): Promise<Buffer> {
  try {
    const key = process.env.AZURE_TTS_KEY;
    const region = process.env.AZURE_TTS_REGION || 'westus';

    if (!key) {
      throw new Error('AZURE_TTS_KEY not configured');
    }

    const languageMap: { [key: string]: string } = {
      'en-US': 'en-US',
      'es-ES': 'es-ES',
    };

    const language = languageMap[options.locale] || 'en-US';
    const voiceMap: { [key: string]: string } = {
      'en-US': 'en-US-AriaNeural',
      'es-ES': 'es-ES-ElviraNeural',
    };
    const voice = voiceMap[language] || 'en-US-AriaNeural';

    const response = await fetch(
      `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`,
      {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': key,
          'Content-Type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat': 'audio-16khz-32kbitrate-mono-mp3',
        },
        body: `<speak version='1.0' xml:lang='${language}'>
          <voice name='${voice}'>
            <prosody rate='${(options.rate - 1) * 50}%' pitch='${(options.pitch - 1) * 50}%'>
              ${escapeXML(options.text)}
            </prosody>
          </voice>
        </speak>`,
      }
    );

    if (!response.ok) {
      throw new Error(`Azure TTS error: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    console.error('Azure TTS error:', error);
    return getMockTTS(options);
  }
}

async function getAWSPollyTTS(options: TTSOptions): Promise<Buffer> {
  try {
    const { Polly } = await import('@aws-sdk/client-polly');
    const client = new Polly({ region: process.env.AWS_REGION || 'us-east-1' });

    const voiceMap: { [key: string]: string } = {
      'en-US': 'Joanna',
      'es-ES': 'Lucia',
    };

    const voice = voiceMap[options.locale] || 'Joanna';

    const response = await client.synthesizeSpeech({
      Text: options.text,
      VoiceId: voice,
      OutputFormat: 'mp3',
      Engine: 'neural',
      Rate: Math.round(options.rate * 100).toString(),
      Pitch: ((options.pitch - 1) * 50).toString(),
    });

    const chunks: Buffer[] = [];
    if (response.AudioStream) {
      for await (const chunk of response.AudioStream as any) {
        chunks.push(Buffer.from(chunk));
      }
    }
    return Buffer.concat(chunks);
  } catch (error) {
    console.error('AWS Polly error:', error);
    return getMockTTS(options);
  }
}

function getMockTTS(options: TTSOptions): Buffer {
  // Generate a simple WAV beep (tone) instead of trying MP3
  // WAV is easier to generate and works universally
  const sampleRate = 22050;
  const frequency = 800; // Hz (a pleasant beep)
  const duration = 0.5; // seconds
  const numSamples = Math.floor(sampleRate * duration);

  // Create PCM audio data (16-bit signed integers)
  const audioData = new Int16Array(numSamples);
  const amplitude = 15000; // Volume level

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const sineValue = Math.sin(2 * Math.PI * frequency * t);
    audioData[i] = Math.round(sineValue * amplitude);
  }

  // Build WAV file structure
  const numChannels = 1; // Mono
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const subchunk2Size = numSamples * blockAlign;

  // Create WAV header (44 bytes)
  const wavHeader = Buffer.alloc(44);
  let offset = 0;

  // "RIFF" chunk descriptor
  wavHeader.write('RIFF', offset); offset += 4;
  wavHeader.writeUInt32LE(36 + subchunk2Size, offset); offset += 4;
  wavHeader.write('WAVE', offset); offset += 4;

  // "fmt " subchunk
  wavHeader.write('fmt ', offset); offset += 4;
  wavHeader.writeUInt32LE(16, offset); offset += 4; // Subchunk1Size
  wavHeader.writeUInt16LE(1, offset); offset += 2; // Audio format (1 = PCM)
  wavHeader.writeUInt16LE(numChannels, offset); offset += 2;
  wavHeader.writeUInt32LE(sampleRate, offset); offset += 4;
  wavHeader.writeUInt32LE(byteRate, offset); offset += 4;
  wavHeader.writeUInt16LE(blockAlign, offset); offset += 2;
  wavHeader.writeUInt16LE(bitsPerSample, offset); offset += 2;

  // "data" subchunk
  wavHeader.write('data', offset); offset += 4;
  wavHeader.writeUInt32LE(subchunk2Size, offset);

  // Combine header and audio data into final buffer
  const audioBuffer = Buffer.from(audioData.buffer, audioData.byteOffset, audioData.byteLength);
  return Buffer.concat([wavHeader, audioBuffer]);
}

function escapeXML(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
