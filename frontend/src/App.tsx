import { useState, useEffect, useRef } from 'react';
import VoiceSelector from './components/VoiceSelector';
import TextInput from './components/TextInput';
import Controls from './components/Controls';
import Status from './components/Status';
import './index.css';

type StatusType = 'idle' | 'speaking' | 'stopped' | 'exporting' | 'done' | 'error' | 'success' | 'warning';

function App() {
  const [text, setText] = useState('Hello, this is a test of the text to speech service.');
  const [locale, setLocale] = useState('en-US');
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [status, setStatus] = useState<StatusType>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const speakingRef = useRef(false);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
        setVoicesLoaded(true);
      }
    };

    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const handleLoadVoices = () => {
    const availableVoices = speechSynthesis.getVoices();
    setVoices(availableVoices);
    if (availableVoices.length > 0) {
      setVoicesLoaded(true);
      setStatus('success');
      setStatusMessage(`${availableVoices.length} voices loaded!`);
      setTimeout(() => setStatus('idle'), 3000);
    } else {
      setStatus('warning');
      setStatusMessage('No voices available. Try again in a moment.');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const handleSpeak = () => {
    if (!text.trim()) {
      setStatus('error');
      setStatusMessage('Please enter some text to speak.');
      setTimeout(() => setStatus('idle'), 3000);
      return;
    }

    if (!voicesLoaded && voices.length === 0) {
      setStatus('error');
      setStatusMessage('Voices not loaded. Tap "Load Voices" first.');
      setTimeout(() => setStatus('idle'), 3000);
      return;
    }

    // Cancel any existing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = pitch;

    // Find voice matching locale
    const selectedVoice = voices.find(v => v.lang === locale) || voices[0];
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setStatus('speaking');
      setStatusMessage('Speaking...');
      speakingRef.current = true;
    };

    utterance.onend = () => {
      if (speakingRef.current) {
        setIsSpeaking(false);
        setStatus('idle');
        setStatusMessage('');
        speakingRef.current = false;
      }
    };

    utterance.onerror = (event) => {
      setIsSpeaking(false);
      setStatus('error');
      setStatusMessage(`Error: ${event.error}`);
      speakingRef.current = false;
      setTimeout(() => setStatus('idle'), 3000);
    };

    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  };

  const handleStop = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
    speakingRef.current = false;
    setStatus('stopped');
    setStatusMessage('Playback stopped.');
    setTimeout(() => setStatus('idle'), 2000);
  };

  const handleExport = async () => {
    if (!text.trim()) {
      setStatus('error');
      setStatusMessage('Please enter some text to export.');
      setTimeout(() => setStatus('idle'), 3000);
      return;
    }

    if (!isOnline) {
      setStatus('error');
      setStatusMessage('Export requires internet connection.');
      setTimeout(() => setStatus('idle'), 3000);
      return;
    }

    setStatus('exporting');
    setStatusMessage('Exporting audio...');

    try {
      const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:3001';
      const response = await fetch(`${apiBase}/api/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          locale,
          rate,
          pitch
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const filename = `tts-${timestamp}.mp3`;

      // Try to download
      const navAny = navigator as any;
      if (navigator.share && navAny.canShare?.({ files: [] })) {
        const file = new File([blob], filename, { type: 'audio/mpeg' });
        navigator.share({ files: [file], title: 'Audio File', text: 'Exported TTS audio' })
          .catch(() => {
            // If share fails, fall back to download
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          });
      } else {
        // Standard download
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }

      setStatus('done');
      setStatusMessage('Audio exported successfully!');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      setStatus('error');
      setStatusMessage(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <div className="app">
      <main className="container" role="main">
        <div className="header">
          <h1>🎙️ QANet TTS</h1>
          <p>Text-to-Speech PWA</p>
        </div>

        <section className="card-section">
          <TextInput value={text} onChange={setText} />
        </section>

        <VoiceSelector
          locale={locale}
          onLocaleChange={setLocale}
          voicesLoaded={voicesLoaded}
          onLoadVoices={handleLoadVoices}
        />

        <Controls
          rate={rate}
          onRateChange={setRate}
          pitch={pitch}
          onPitchChange={setPitch}
          onSpeak={handleSpeak}
          onStop={handleStop}
          onExport={handleExport}
          isSpeaking={isSpeaking}
          isOnline={isOnline}
        />

        <Status type={status} message={statusMessage} />
      </main>
    </div>
  );
}

export default App;
