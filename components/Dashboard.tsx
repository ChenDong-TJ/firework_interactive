'use client';

import { useState, useEffect } from 'react';
import { ColorWheel } from './ColorWheel';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Numpad } from './Numpad';
import { DisplayPanel } from './DisplayPanel';

export function Dashboard() {
  const [variables, setVariables] = useState({
    color1: 0,
    color2: 180,
    slider1: 50,
    slider2: 50,
    slider3: 50,
    slider4: 50,
    button1: 0,
    button2: 0,
    button3: 0,
    button4: 0,
    button5: 0,
    numpad: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [lastActionTime, setLastActionTime] = useState(Date.now());
  const [isPlayingLoop, setIsPlayingLoop] = useState(false);

  useEffect(() => {
    const fetchVariables = async () => {
      try {
        const response = await fetch('/api/variables');
        const data = await response.json();
        setVariables((prevVars) => ({ ...prevVars, ...data }));
      } catch (error) {
        console.error('Failed to fetch variables:', error);
      }
    };

    fetchVariables();
    const interval = setInterval(fetchVariables, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      if (!isPlayingLoop && now - lastActionTime > 10000) {
        startLoopingEffects();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastActionTime, isPlayingLoop]);

  const updateVariable = async (name: string, value: any) => {
    setLastActionTime(Date.now());
    const newVariables = { ...variables, [name]: value };
    setVariables(newVariables);

    try {
      await fetch('/api/variables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVariables),
      });
    } catch (error) {
      console.error('Failed to update variables:', error);
    }
  };

const handleNumpadInput = async () => {
  try {
    const response = await fetch('/api/load', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: parseInt(variables.numpad, 10) }), // 直接发送 numpad ID
    });

    if (response.ok) {
      const result = await response.json();
      console.log('Effect triggered successfully:', result.message);
    } else {
      const error = await response.json();
      console.error('Failed to trigger effect:', error.error);
    }
  } catch (error) {
    console.error('Failed to handle numpad input:', error);
  }
};


  const handleAction = async (action: 'preview' | 'save') => {
    setLastActionTime(Date.now());
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`/api/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(variables),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.error || `Failed to ${action} variables`);
        return;
      }

      setMessage(result.message || `${action.charAt(0).toUpperCase() + action.slice(1)} successful`);
    } catch (error) {
      console.error(`Failed to ${action} variables:`, error);
      setMessage(`Failed to ${action} variables`);
    } finally {
      setLoading(false);
    }
  };

  const startLoopingEffects = async () => {
    console.log("Starting looping effects...");
    if (isPlayingLoop) {
      console.log("Already playing effects, skipping.");
      return;
    }
    setIsPlayingLoop(true);
    try {
      const response = await fetch('/api/effects');
      const result = await response.json();
      console.log("Looping effects response:", result.message);
    } catch (error) {
      console.error('Failed to play effects:', error);
    } finally {
      setIsPlayingLoop(false);
      console.log("Finished looping effects.");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Color Wheels Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Color Wheels</h2>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div>
            <ColorWheel hue={variables.color1} onChange={(hue) => updateVariable('color1', hue)} />
            <p className="mt-2 text-center">Primary Color: {Math.round(variables.color1)}°</p>
          </div>
          <div>
            <ColorWheel hue={variables.color2} onChange={(hue) => updateVariable('color2', hue)} />
            <p className="mt-2 text-center">Secondary Color: {Math.round(variables.color2)}°</p>
          </div>
        </div>
      </div>

      {/* Sliders Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Adjustments</h2>
        {[1, 2, 3, 4].map((i) => {
          const sliderLabels = ["Max Brightness", "Mirror Angle", "Explosion LED Count", "Speed Delay"];
          return (
            <div key={i} className="mb-4">
              <Slider
                value={[variables[`slider${i}` as keyof typeof variables] as number]}
                onValueChange={(value) => updateVariable(`slider${i}`, value[0])}
                max={100}
                step={1}
                className="w-full"
              />
              <span className="text-sm text-gray-500">
                {sliderLabels[i - 1]}: {variables[`slider${i}` as keyof typeof variables]}
              </span>
            </div>
          );
        })}
      </div>

      {/* Buttons Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Modes</h2>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5].map((i) => {
            const buttonLabels = ["Launch Mode", "Gradient Mode", "Explode Mode", "Laser Color", "Reset"];
            const currentValue = variables[`button${i}` as keyof typeof variables] as number;
            const variant = currentValue === 0 ? 'default' : currentValue === 1 ? 'outline' : 'destructive';

            return (
              <Button
                key={i}
                variant={variant}
                onClick={() => {
                  const nextValue = (currentValue + 1) % 3;
                  updateVariable(`button${i}`, nextValue);
                }}
                className="w-full h-12"
              >
                {buttonLabels[i - 1]}: {currentValue}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Numpad Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Numpad</h2>
        <Numpad
          value={variables.numpad}
          onChange={(value) => updateVariable('numpad', value)}
        />
        <Button
          onClick={handleNumpadInput}
          variant="default"
          className="w-full mt-4"
        >
          Confirm Numpad Input
        </Button>
      </div>

      {/* Preview and Save Buttons */}
      <div className="col-span-1 md:col-span-2 flex justify-between items-center">
        <Button variant="outline" className="w-1/3" disabled={loading} onClick={() => handleAction('preview')}>
          Preview
        </Button>
        <Button variant="default" className="w-1/3" disabled={loading} onClick={() => handleAction('save')}>
          Save
        </Button>
      </div>

      {/* Message Section */}
      {message && (
        <div className="col-span-1 md:col-span-2 mt-4 text-center">
          <p className={`text-lg ${message.includes('Failed') ? 'text-red-500' : 'text-green-500'}`}>{message}</p>
        </div>
      )}

      {/* Display Panel Section */}
      <div className="col-span-1 md:col-span-2">
        <h2 className="text-2xl font-bold mb-4">Display Panel</h2>
        <DisplayPanel variables={variables} />
      </div>
    </div>
  );
}

