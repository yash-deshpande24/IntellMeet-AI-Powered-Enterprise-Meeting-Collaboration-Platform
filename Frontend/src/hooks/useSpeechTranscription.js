import { useCallback, useEffect, useRef, useState } from 'react';

export function useSpeechTranscription({ onFinalText, lang = 'en-US' }) {
  const recognitionRef = useRef(null);
  const wantListeningRef = useRef(false);
  const callbackRef = useRef(onFinalText);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState([]);

  callbackRef.current = onFinalText;

  const SpeechRecognition =
    typeof window !== 'undefined' &&
    (window.SpeechRecognition || window.webkitSpeechRecognition);
  const supported = Boolean(SpeechRecognition);

  const start = useCallback(() => {
    if (!supported || recognitionRef.current) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = lang;

    recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          const text = event.results[i][0].transcript.trim();
          if (text) callbackRef.current?.(text);
        }
      }
    };

    // Chrome stops after silence, so restart while the user wants it on
    recognition.onend = () => {
      recognitionRef.current = null;
      if (wantListeningRef.current) start();
      else setListening(false);
    };

    recognition.onerror = (e) => console.warn('[Speech]', e.error);

    wantListeningRef.current = true;
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }, [SpeechRecognition, supported, lang]);

  const stop = useCallback(() => {
    wantListeningRef.current = false;
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  useEffect(() => () => stop(), [stop]);
  useEffect(() => {
  const handler = (chunk) => setTranscript((prev) => [...prev, chunk]);
  socket.on('receive-transcript-chunk', handler);
  return () => socket.off('receive-transcript-chunk', handler);
}, []);

  return { supported, listening, start, stop };
}