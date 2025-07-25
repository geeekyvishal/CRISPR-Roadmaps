import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/mongodb';
import { DocumentModel } from '@/models/Document';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end('Method not allowed');

  try {
    await connectToDatabase();

    const { author } = req.query;
    if (!author || Array.isArray(author)) return res.status(400).json({ message: 'Missing author' });

    const docs = await DocumentModel.find({ author }).sort({ updatedAt: -1 });
    return res.status(200).json(docs);
  } catch (error: any) {
    console.error('[GetUserRoadmapsError]', error);
    return res.status(500).json({ message: 'Error fetching documents', error: error.message });
  }
}
