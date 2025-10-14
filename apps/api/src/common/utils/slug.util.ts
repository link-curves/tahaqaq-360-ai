import { nanoid } from 'nanoid';
import slugify from 'slugify';

export function createSlug(text: string, addNano: boolean = true): string {
  const slug = slugify(text, {
    lower: true,
    strict: true,
    trim: true,
  });

  return addNano ? `${slug}-${nanoid(8)}` : slug;
}