import { ChangeEvent } from 'react';

interface ControlsProps {
  rate: number;
  onRateChange: (rate: number) => void;
  pitch: number;
  onPitchChange: (pitch: number) => void;
  onSpeak: () => void;
  onStop: () => void;
  onExport: () => void;
  isSpeaking: boolean;
  isOnline: boolean;
}

export default function Controls({
  rate,
  onRateChange,
  pitch,
  onPitchChange,
  onSpeak,
  onStop,
  onExport,
  isSpeaking,
  isOnline,
}: ControlsProps) {
  return (
    <>
      <div className="slider-container">
        <div className="slider-header">
          <label htmlFor="rate-slider">Speed</label>
          <span className="slider-value">{rate.toFixed(1)}x</span>
        </div>
        <input
          id="rate-slider"
          type="range"
          className="slider-input"
          min="0.5"
          max="2"
          step="0.1"
          value={rate}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onRateChange(parseFloat(e.target.value))
          }
        />
      </div>

      <div className="slider-container">
        <div className="slider-header">
          <label htmlFor="pitch-slider">Pitch</label>
          <span className="slider-value">{pitch.toFixed(1)}</span>
        </div>
        <input
          id="pitch-slider"
          type="range"
          className="slider-input"
          min="0.5"
          max="2"
          step="0.1"
          value={pitch}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onPitchChange(parseFloat(e.target.value))
          }
        />
      </div>

      <div className="divider" />

      <div className="button-group">
        <button
          className="btn btn-primary"
          onClick={onSpeak}
          disabled={isSpeaking}
          aria-pressed={isSpeaking}
        >
          <span className="btn-icon">🔊</span>
          <span>Speak</span>
        </button>
        <button
          className="btn btn-danger"
          onClick={onStop}
          disabled={!isSpeaking}
        >
          <span className="btn-icon">🛑</span>
          <span>Stop</span>
        </button>
      </div>

      <button
        className="btn btn-success"
        onClick={onExport}
        disabled={!isOnline}
        title={!isOnline ? 'Requires internet connection' : ''}
      >
        <span className="btn-icon">⬇️</span>
        <span>Export Audio</span>
      </button>
    </>
  );
}
