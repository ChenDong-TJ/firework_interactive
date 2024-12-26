import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET() {
  try {
    const { stdout, stderr } = await execAsync('python3 loop_effects.py');
    if (stderr) {
      console.error('Error playing effects:', stderr);
      return NextResponse.json({ error: 'Failed to play effects' }, { status: 500 });
    }
    return NextResponse.json({ message: stdout.trim() });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to play effects' }, { status: 500 });
  }
}
    