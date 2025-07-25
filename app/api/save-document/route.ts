// app/api/save-document/route.ts

import { connectToDatabase } from '@/lib/mongodb';
import { DocumentModel } from '@/models/Document';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const {id, title, description, author, nodes, edges } = body;

    const newDocument = await DocumentModel.create({
    id,
      title,
      description,
      author,
      nodes,
      edges,
    });

    return NextResponse.json(newDocument, { status: 201 });
  } catch (error: any) {
    console.error('[SaveDocumentError]', error);
    return NextResponse.json(
      { message: 'Error saving document', error: error.message },
      { status: 500 }
    );
  }
}
