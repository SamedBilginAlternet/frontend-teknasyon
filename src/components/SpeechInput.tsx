/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square } from "lucide-react";

type Props = {
  onResult: (text: string) => void;
};

// Use the global types if available, otherwise fallback to 'any'
// Define types for SpeechRecognition if not available
type SpeechRecognitionType = typeof window extends { SpeechRecognition: infer T }
  ? T
  : typeof window extends { webkitSpeechRecognition: infer T }
  ? T
  : any;

type RecType = SpeechRecognitionType;

export const SpeechInput: React.FC<Props> = ({ onResult }) => {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const Recognition = useMemo<RecType | null>(() => {
    if (typeof window === "undefined") return null;
    const W = window as any;
    return W.SpeechRecognition || W.webkitSpeechRecognition || null;
  }, []);

  useEffect(() => {
    setSupported(Boolean(Recognition));
    if (!Recognition) return;

    try {
      const rec: any = new (Recognition as any)();
      rec.lang = "tr-TR";
      rec.interimResults = true;
      rec.continuous = true;

      rec.onstart = () => setListening(true);
      rec.onend = () => setListening(false);

      rec.onerror = (e: any) => {
        console.error("[SpeechInput] recognition error:", e?.error || e);
        setListening(false);
      };

      rec.onresult = (event: any) => {
        try {
          let transcript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          // Sadece final olduğunda göndermek isterseniz:
          const last = event.results[event.results.length - 1];
          if (last && last.isFinal) {
            onResult(transcript.trim());
          }
        } catch (err) {
          console.error("[SpeechInput] onresult handler failed:", err);
        }
      };

      recognitionRef.current = rec;
      return () => {
        try {
          rec.onstart = null;
          rec.onend = null;
          rec.onerror = null;
          rec.onresult = null;
          rec.stop?.();
        // eslint-disable-next-line no-empty
        } catch {}
      };
    } catch (err) {
      console.error("[SpeechInput] init failed:", err);
      setSupported(false);
    }
  }, [Recognition, onResult]);

  const start = () => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.start();
    } catch (err) {
      // start iki kez çağrılırsa NotAllowed/InvalidState gelebilir
      console.warn("[SpeechInput] start failed:", err);
    }
  };

  const stop = () => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
    } catch (err) {
      console.warn("[SpeechInput] stop failed:", err);
    }
  };

  if (!supported) {
    return (
      <Button variant="outline" type="button" disabled title="Tarayıcı konuşmayı desteklemiyor">
        <Mic className="h-4 w-4" />
      </Button>
    );
  }

  return listening ? (
    <Button variant="destructive" type="button" onClick={stop} title="Dinlemeyi durdur">
      <Square className="h-4 w-4" />
    </Button>
  ) : (
    <Button variant="secondary" type="button" onClick={start} title="Konuşmayı başlat">
      <Mic className="h-4 w-4" />
    </Button>
  );
};

export default SpeechInput;
