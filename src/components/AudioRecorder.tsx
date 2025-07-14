import { useState } from 'react';
import { useReactMediaRecorder } from 'react-media-recorder';
import { MicrophoneIcon, StopIcon, PlayIcon, PauseIcon, DocumentTextIcon } from '@heroicons/react/24/solid';
import { transcribeAudio } from '../services/transcriptionService';

interface AudioRecorderProps {
  onRecordingComplete: (audioBlob: string) => void;
  onTranscriptionComplete?: (transcription: string) => void;
}

export function AudioRecorder({ onRecordingComplete, onTranscriptionComplete }: AudioRecorderProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionError, setTranscriptionError] = useState<string | null>(null);
  
  const { status, startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({
    audio: true,
    onStop: async (blobUrl) => {
      onRecordingComplete(blobUrl);
      // Automatically trigger transcription when recording stops
      if (onTranscriptionComplete) {
        setIsTranscribing(true);
        setTranscriptionError(null);
        try {
          const transcription = await transcribeAudio(blobUrl);
          onTranscriptionComplete(transcription);
        } catch (error) {
          setTranscriptionError(error instanceof Error ? error.message : 'Une erreur est survenue');
        } finally {
          setIsTranscribing(false);
        }
      }
    },
  });

  const handlePlayPause = () => {
    const audio = document.querySelector('audio');
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTranscribe = async () => {
    if (!mediaBlobUrl || !onTranscriptionComplete) return;
    
    setIsTranscribing(true);
    setTranscriptionError(null);
    
    try {
      const transcription = await transcribeAudio(mediaBlobUrl);
      onTranscriptionComplete(transcription);
    } catch (error) {
      setTranscriptionError(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setIsTranscribing(false);
    }
  };

  return (
    <div className="flex flex-col space-y-3">
      <div className="flex items-center space-x-3">
        {status !== 'recording' ? (
          <button
            onClick={startRecording}
            type="button"
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <MicrophoneIcon className="h-5 w-5" />
            <span className="text-sm font-medium">
              {mediaBlobUrl ? 'Enregistrer à nouveau' : 'Enregistrer la réponse'}
            </span>
          </button>
        ) : (
          <button
            onClick={stopRecording}
            type="button"
            className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors"
          >
            <StopIcon className="h-5 w-5" />
            <span className="text-sm font-medium">Arrêter l'enregistrement</span>
          </button>
        )}

        {mediaBlobUrl && (
          <>
            <div className="h-8 w-px bg-gray-200" />
            <button
              onClick={handlePlayPause}
              type="button"
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              {isPlaying ? (
                <PauseIcon className="h-5 w-5" />
              ) : (
                <PlayIcon className="h-5 w-5" />
              )}
              <span className="text-sm font-medium">
                {isPlaying ? 'Pause' : 'Écouter'}
              </span>
            </button>

            <div className="h-8 w-px bg-gray-200" />
            <button
              onClick={handleTranscribe}
              disabled={isTranscribing}
              type="button"
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors disabled:text-gray-400"
            >
              <DocumentTextIcon className="h-5 w-5" />
              <span className="text-sm font-medium">
                {isTranscribing ? 'Transcription...' : 'Transcrire'}
              </span>
            </button>
          </>
        )}

        <audio
          src={mediaBlobUrl}
          onEnded={() => setIsPlaying(false)}
          className="hidden"
        />
      </div>

      {isTranscribing && (
        <p className="text-sm text-blue-600">Transcription en cours...</p>
      )}

      {transcriptionError && (
        <p className="text-sm text-red-600">{transcriptionError}</p>
      )}
    </div>
  );
} 