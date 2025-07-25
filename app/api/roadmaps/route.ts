import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { DocumentModel } from "@/models/Document"

export async function GET() {
  try {
    await connectToDatabase()
    const roadmaps = await DocumentModel.find()
    return NextResponse.json(roadmaps)
  } catch (error) {
    console.error("Failed to fetch roadmaps:", error)
    return NextResponse.json(
      { error: "Failed to fetch roadmaps" },
      { status: 500 }
    )
  }
}
