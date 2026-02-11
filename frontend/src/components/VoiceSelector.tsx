import { ChangeEvent } from 'react';

interface VoiceSelectorProps {
  locale: string;
  onLocaleChange: (locale: string) => void;
  voicesLoaded: boolean;
  onLoadVoices: () => void;
}

const localeOptions = [
  { value: 'en-US', label: 'English (US)' },
  { value: 'es-ES', label: 'Spanish (Spain)' },
];

export default function VoiceSelector({
  locale,
  onLocaleChange,
  voicesLoaded,
  onLoadVoices,
}: VoiceSelectorProps) {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onLocaleChange(e.target.value);
  };

  return (
    <div className="voices-section">
      <div className="form-group">
        <label htmlFor="locale-select">Language/Locale</label>
        <select id="locale-select" value={locale} onChange={handleChange}>
          {localeOptions.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {!voicesLoaded && (
        <>
          <div className="voices-info">
            ℹ️ Voices not loaded. Tap below to load them.
          </div>
          <button className="btn btn-secondary small-btn" onClick={onLoadVoices}>
            Load Voices
          </button>
        </>
      )}

      {voicesLoaded && (
        <div className="voices-info">
          ✅ Voices ready
        </div>
      )}
    </div>
  );
}
