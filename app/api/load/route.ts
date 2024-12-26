import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(request: Request) {
  try {
    // Parse the request body to extract the ID
    const { id } = await request.json();

    if (typeof id !== "number" || id <= 0) {
      return NextResponse.json({ error: "Invalid ID provided" }, { status: 400 });
    }

    // Construct the command to execute the Python load script
    const command = `python3 load_script.py ${id}`;

    // Execute the script and capture the output
    const { stdout, stderr } = await execAsync(command);

    if (stderr) {
      console.error("Python script error:", stderr);
      return NextResponse.json({ error: "Failed to load variables" }, { status: 500 });
    }

    // Return the response from the Python script
    return NextResponse.json({ message: stdout.trim() });
  } catch (error) {
    console.error("Load API error:", error);
    return NextResponse.json({ error: "Failed to load variables" }, { status: 500 });
  }
}
