import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "dashboard_variables.json");

export async function GET() {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json({ error: "Failed to read variables" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const variables = await request.json();
    await fs.writeFile(filePath, JSON.stringify(variables, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to write variables" }, { status: 500 });
  }
}