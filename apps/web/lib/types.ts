export interface Space {
  _id: string;
  name: string;
  description?: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Article {
  _id: string;
  title: string;
  content: string;
  spaceId: string;
  authorId: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}
