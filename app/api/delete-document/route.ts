// app/api/delete-document/route.ts
import { connectToDatabase } from '@/lib/mongodb';
import { DocumentModel } from '@/models/Document';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ message: 'Missing document id' }, { status: 400 });
  }

  await connectToDatabase();
  console.log('Attempting to delete id:', id);
  const result = await DocumentModel.findOneAndDelete({ id: id });
  console.log('Found document:', result);
  if (!result) {
    return NextResponse.json({ message: 'Document not found' }, { status: 404 });
  }

  return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 });
}
