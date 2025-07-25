// app/api/update-document/route.ts

import { connectToDatabase } from '@/lib/mongodb';
import { DocumentModel } from '@/models/Document';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const { id, title, description, author, nodes, edges } = body;
    console.log(id);
    if (!id) {
      return NextResponse.json({ message: 'Missing document id' }, { status: 400 });
    }
    console.log(id);

    const updated = await DocumentModel.findOneAndUpdate(
      { id },
      { title, description, author, nodes, edges, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json({ message: 'Document not found' }, { status: 404 });
    }
    console.log(id);

    return NextResponse.json(updated, { status: 200 });
  } catch (error: any) {
    console.error('[UpdateDocumentError]', error);
    return NextResponse.json(
      { message: 'Error updating document', error: error.message },
      { status: 500 }
    );
  }
}
