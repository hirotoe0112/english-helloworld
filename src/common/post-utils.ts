import { getCollection, type CollectionEntry } from 'astro:content';
import { fromIsoToDateForSlug, fromIsoToLocaleDate } from './date-utils';

type Post = {
  slug: string;
  title: string;
  pubDate: Date;
  formattedDate: string;
  tags: string[];
};

export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection("posts");
  return posts.map((entry) => ({
    slug: fromIsoToDateForSlug(entry.data.pubDate) + '-' + entry.slug,
    title: entry.data.title,
    pubDate: entry.data.pubDate,
    formattedDate: fromIsoToLocaleDate(entry.data.pubDate),
    tags: entry.data.tags,
  }));
}

export function sortByDateDesc(posts: Post[]): Post[] {
  const sortedArray = posts.sort(
    (a: Post, b: Post) =>
      b.pubDate.getTime() - a.pubDate.getTime()
  );
  return sortedArray;
}