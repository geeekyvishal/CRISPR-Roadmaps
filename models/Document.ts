import mongoose, { Schema, Document as MongooseDocument, models } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface IDocument extends MongooseDocument {
  id: string;
  title: string;
  description?: string;
  author: string;
  nodes: any[];
  edges: any[];
  createdAt: Date;
  updatedAt: Date;
}

const DocumentSchema = new Schema<IDocument>({
  id: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  author: {
    type: String,
    required: true,
  },
  nodes: {
    type: [Schema.Types.Mixed as any],
    default: [],
  },
  edges: {
    type: [Schema.Types.Mixed as any],
    default: [],
  },
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
  updatedAt: {
    type: Date,
    default: () => new Date(),
  },
});

export const DocumentModel = models.Document || mongoose.model<IDocument>('Document', DocumentSchema);


