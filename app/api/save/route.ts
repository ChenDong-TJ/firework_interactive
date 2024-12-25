import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

function hslToRgb(hue: number, saturation: number = 1, lightness: number = 0.5): [number, number, number] {
  /**
   * Converts HSL to RGB.
   * 
   * @param hue {number} - Hue angle in degrees (0–360).
   * @param saturation {number} - Saturation as a fraction (0–1).
   * @param lightness {number} - Lightness as a fraction (0–1).
   * @returns {[number, number, number]} - RGB values (0–255).
   */
  const c = (1 - Math.abs(2 * lightness - 1)) * saturation; // Chroma
  const x = c * (1 - Math.abs((hue / 60) % 2 - 1));
  const m = lightness - c / 2;

  let r = 0, g = 0, b = 0;

  if (hue >= 0 && hue < 60) [r, g, b] = [c, x, 0];
  else if (hue >= 60 && hue < 120) [r, g, b] = [x, c, 0];
  else if (hue >= 120 && hue < 180) [r, g, b] = [0, c, x];
  else if (hue >= 180 && hue < 240) [r, g, b] = [0, x, c];
  else if (hue >= 240 && hue < 300) [r, g, b] = [x, 0, c];
  else if (hue >= 300 && hue <= 360) [r, g, b] = [c, 0, x];

  // Convert to 8-bit RGB values
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return [r, g, b];
}

function formatVariables(variables: any) {
  return {
    color1: hslToRgb(variables.color1, 1, 0.5), // Saturation = 100%, Lightness = 50%
    color2: hslToRgb(variables.color2, 1, 0.5), // Saturation = 100%, Lightness = 50%
    maxBrightness: Math.round((variables.slider1 / 100) * 255),
    launchMode: variables.button1,
    gradientMode: variables.button2,
    explodeMode: variables.button3,
    laserColor: variables.button4,
    mirrorAngle: Math.round((variables.slider2 / 100) * 30),
    explosionLEDCount: Math.round((variables.slider3 / 100) * 50),
    speedDelay: Math.round((variables.slider4 / 100) * 8),
  };
}

export async function POST(request: Request) {
  try {
    // Parse incoming variables
    const variables = await request.json();
    const formattedVariables = formatVariables(variables);

    // Construct the command to execute the Python save script
    const command = `python3 save_script.py '${JSON.stringify(formattedVariables)}'`;

    // Execute the script and capture the output
    const { stdout, stderr } = await execAsync(command);

    if (stderr) {
      console.error("Python script error:", stderr);
      return NextResponse.json({ error: "Failed to save variables" }, { status: 500 });
    }

    // Respond with success message
    return NextResponse.json({ message: stdout.trim() });
  } catch (error) {
    console.error("Save API error:", error);
    return NextResponse.json({ error: "Failed to save variables" }, { status: 500 });
  }
}
