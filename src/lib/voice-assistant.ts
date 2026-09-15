'use client';

// Web Speech API Voice Assistant for Hands-Free Driver Guidance in Mountain Corridors
export function speakTacticalAlert(text: string, lang: 'en' | 'hi' | 'bn' | 'as' = 'en') {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported on this browser.');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Set language voice
  const langMap: Record<string, string> = {
    en: 'en-IN',
    hi: 'hi-IN',
    bn: 'bn-IN',
    as: 'as-IN',
  };
  utterance.lang = langMap[lang] || 'en-IN';
  utterance.rate = 0.95; // slightly slower for radio clarity
  utterance.pitch = 1.0;

  // Try to find native voice
  const voices = window.speechSynthesis.getVoices();
  const selectedVoice = voices.find(v => v.lang.startsWith(utterance.lang) || v.lang.includes('IN'));
  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }

  window.speechSynthesis.speak(utterance);
}

export function stopTacticalAlert() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
