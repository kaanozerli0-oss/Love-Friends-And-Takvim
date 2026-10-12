// Web Audio API Ambient Romantic Melody Player
// Synthesizes soothing piano/harp-like gentle chords and melodies client-side

class RomanticSynthesizer {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private timer: number | null = null;
  private volumeNode: GainNode | null = null;
  private melodyType: 'piano-waltz' | 'lofi-twilight' | 'acoustic-warmth' = 'piano-waltz';

  private chordProgressions = [
    // Cmaj7 - Am7 - Fmaj7 - G7
    [
      [261.63, 329.63, 392.00, 493.88], // C E G B
      [220.00, 261.63, 329.63, 392.00], // A C E G
      [174.61, 220.00, 261.63, 329.63], // F A C E
      [196.00, 246.94, 293.66, 349.23], // G B D F
    ],
    // Dm9 - G13 - Cmaj9 - A7b13
    [
      [293.66, 349.23, 440.00, 523.25],
      [196.00, 246.94, 329.63, 440.00],
      [261.63, 329.63, 392.00, 587.33],
      [220.00, 277.18, 329.63, 415.30],
    ],
  ];

  private currentProgressionIndex = 0;
  private stepIndex = 0;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.volumeNode = this.ctx.createGain();
      this.volumeNode.gain.setValueAtTime(0.2, this.ctx.currentTime);
      this.volumeNode.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private playTone(freq: number, duration: number, delaySec: number) {
    if (!this.ctx || !this.volumeNode) return;

    const startTime = this.ctx.currentTime + delaySec;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Gentle bell-like / electric piano tone
    osc.type = this.melodyType === 'lofi-twilight' ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(0.12, startTime + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.volumeNode);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  public setMelody(type: 'piano-waltz' | 'lofi-twilight' | 'acoustic-warmth') {
    this.melodyType = type;
  }

  public start() {
    if (this.isPlaying) return;
    this.initContext();
    this.isPlaying = true;

    const playNextBar = () => {
      if (!this.isPlaying || !this.ctx) return;

      const chords = this.chordProgressions[this.currentProgressionIndex % this.chordProgressions.length];
      const chord = chords[this.stepIndex % chords.length];

      // Arpeggiate chord notes smoothly
      chord.forEach((freq, idx) => {
        const offset = idx * 0.45;
        this.playTone(freq, 2.8, offset);
      });

      // Add a higher bell accent
      const topNote = chord[chord.length - 1] * (this.stepIndex % 2 === 0 ? 1.5 : 1.25);
      this.playTone(topNote, 2.2, 1.2);

      this.stepIndex++;
      if (this.stepIndex >= chords.length) {
        this.stepIndex = 0;
        this.currentProgressionIndex++;
      }

      this.timer = window.setTimeout(playNextBar, 3200);
    };

    playNextBar();
  }

  public stop() {
    this.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const romanticAudio = new RomanticSynthesizer();
