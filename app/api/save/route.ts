import { NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

export async function POST(request: Request) {
  try {
    const variables = await request.json()
    
    // Execute the Python script
    const { stdout, stderr } = await execAsync(`python save_script.py '${JSON.stringify(variables)}'`)
    
    if (stderr) {
      console.error("Python script error:", stderr)
      return NextResponse.json({ error: "'Failed to save variables'" }, { status: 500 })
    }
    
    return NextResponse.json({ message: stdout.trim() })
  } catch (error) {
    console.error("'Save error:'", error)
    return NextResponse.json({ error: "'Failed to save variables'" }, { status: 500 })
  }
}
