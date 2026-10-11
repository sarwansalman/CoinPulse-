import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StorageService } from '../../services/storageService';
import { PlatformSettings } from '../../types';
import { Volume2, VolumeX, Bell, Clock, RotateCcw, ShieldCheck, Check } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { resetBalance, addToast } = useApp();
  const [settings, setSettings] = useState<PlatformSettings>(StorageService.getSettings());
  const [saved, setSaved] = useState(false);

  const handleToggleSound = () => {
    const updated = { ...settings, soundEnabled: !settings.soundEnabled };
    setSettings(updated);
    StorageService.updateSettings(updated);
    addToast('info', 'Settings Updated', `Sound effects ${updated.soundEnabled ? 'enabled' : 'disabled'}`);
  };

  const handleDurationChange = (sec: number) => {
    const updated = { ...settings, defaultDurationSeconds: sec };
    setSettings(updated);
    StorageService.updateSettings(updated);
    addToast('info', 'Settings Updated', `Default duration set to ${sec}s`);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="p-5 sm:p-6 rounded-2xl bg-[#101927] border border-[#233147]">
        <h2 className="text-xl font-bold font-['Space_Grotesk'] text-[#F1F5FB]">
          Platform Settings
        </h2>
        <p className="text-xs text-[#9AA8BB] mt-1">
          Customize your trading terminal environment and audio feedback.
        </p>

        <div className="mt-6 divide-y divide-[#1A2637] space-y-5">
          {/* Audio Feedback */}
          <div className="pt-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-semibold text-[#F1F5FB] flex items-center gap-2">
                {settings.soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-[#28D7E5]" />
                ) : (
                  <VolumeX className="w-4 h-4 text-[#6E7D92]" />
                )}
                Trading Terminal Audio FX
              </label>
              <p className="text-xs text-[#9AA8BB]">
                Synthesized sound cues for order placement, round win, and expiration.
              </p>
            </div>
            <button
              onClick={handleToggleSound}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings.soundEnabled ? 'bg-[#28D7E5]' : 'bg-[#1A273A]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-[#080D16] absolute top-0.5 transition-transform ${
                  settings.soundEnabled ? 'right-0.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* Default Duration */}
          <div className="pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <label className="text-sm font-semibold text-[#F1F5FB] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#28D7E5]" />
                Default Prediction Duration
              </label>
              <p className="text-xs text-[#9AA8BB]">
                Pre-select your preferred round duration when loading the trading terminal.
              </p>
            </div>
            <div className="flex items-center gap-1.5 bg-[#0C1320] p-1 rounded-lg border border-[#233147]">
              {[15, 30, 60].map((sec) => (
                <button
                  key={sec}
                  onClick={() => handleDurationChange(sec)}
                  className={`px-3 py-1 rounded text-xs font-mono font-medium transition-colors ${
                    settings.defaultDurationSeconds === sec
                      ? 'bg-[#28D7E5] text-[#06131A] font-bold'
                      : 'text-[#9AA8BB] hover:text-[#F1F5FB]'
                  }`}
                >
                  {sec}s
                </button>
              ))}
            </div>
          </div>

          {/* Replenish / Reset Demo Balance */}
          <div className="pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <label className="text-sm font-semibold text-[#F1F5FB] flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#F5B942]" />
                Reset Demo Balance
              </label>
              <p className="text-xs text-[#9AA8BB]">
                Replenish your virtual wallet back to 200,000 coins ($1,000 demo equivalent).
              </p>
            </div>
            <button
              onClick={resetBalance}
              className="h-9 px-4 rounded-lg bg-[#141F30] hover:bg-[#1A273A] border border-[#233147] text-xs font-semibold text-[#F1F5FB] transition-colors"
            >
              Reset to 200,000 Coins
            </button>
          </div>

          {/* Theme Indicator */}
          <div className="pt-5 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-sm font-semibold text-[#F1F5FB]">Theme Display</span>
              <p className="text-xs text-[#9AA8BB]">
                CoinPulse High-Contrast Dark Terminal (Official color tokens applied).
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-md bg-[#0C1320] border border-[#233147] text-xs font-mono font-semibold text-[#28D7E5]">
              #080D16 Dark
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
