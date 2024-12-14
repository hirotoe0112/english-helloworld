declare module 'astro:content' {
	interface RenderResult {
		Content: import('astro/runtime/server/index.js').AstroComponentFactory;
		headings: import('astro').MarkdownHeading[];
		remarkPluginFrontmatter: Record<string, any>;
	}
	interface Render {
		'.md': Promise<RenderResult>;
	}

	export interface RenderedContent {
		html: string;
		metadata?: {
			imagePaths: Array<string>;
			[key: string]: unknown;
		};
	}
}

declare module 'astro:content' {
	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	/** @deprecated Use `getEntry` instead. */
	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	/** @deprecated Use `getEntry` instead. */
	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E,
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E,
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown,
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E,
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[],
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[],
	): Promise<CollectionEntry<C>[]>;

	export function render<C extends keyof AnyEntryMap>(
		entry: AnyEntryMap[C][string],
	): Promise<RenderResult>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C,
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
				}
			: {
					collection: C;
					id: keyof DataEntryMap[C];
				}
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C,
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"blog": Record<string, {
  id: string;
  slug: string;
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">;
  render(): Render[".md"];
}>;
"posts": {
"2022/05/28.md": {
	id: "2022/05/28.md";
  slug: "i-start-an-english-diary";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2022/05/29.md": {
	id: "2022/05/29.md";
  slug: "dragons-dogma-is-a-lot-of-fun";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2022/05/30.md": {
	id: "2022/05/30.md";
  slug: "i-think-about-whether-i-should-change-a-job-or-not";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2022/05/31.md": {
	id: "2022/05/31.md";
  slug: "job-interview";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2022/06/01.md": {
	id: "2022/06/01.md";
  slug: "job-search-sites";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2022/06/03.md": {
	id: "2022/06/03.md";
  slug: "cold-chinese-dumpling";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2022/06/07.md": {
	id: "2022/06/07.md";
  slug: "interviews";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2022/06/10.md": {
	id: "2022/06/10.md";
  slug: "life-is-hard";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2022/06/12.md": {
	id: "2022/06/12.md";
  slug: "so-delicious";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2022/06/14.md": {
	id: "2022/06/14.md";
  slug: "communication-ability";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2022/07/04.md": {
	id: "2022/07/04.md";
  slug: "i-finished-all-job-interviews";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2023/03/12.md": {
	id: "2023/03/12.md";
  slug: "new-company";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2023/03/19.md": {
	id: "2023/03/19.md";
  slug: "spicy-ramen";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2023/03/23.md": {
	id: "2023/03/23.md";
  slug: "health";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2023/03/30.md": {
	id: "2023/03/30.md";
  slug: "english-books";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2023/06/30.md": {
	id: "2023/06/30.md";
  slug: "convey";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2024/03/19.md": {
	id: "2024/03/19.md";
  slug: "this-is-a-test-post";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2024/03/27.md": {
	id: "2024/03/27.md";
  slug: "planning";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2024/03/28.md": {
	id: "2024/03/28.md";
  slug: "morning";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2024/03/29.md": {
	id: "2024/03/29.md";
  slug: "really-interesting-book-series";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2024/04/01.md": {
	id: "2024/04/01.md";
  slug: "april";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2024/04/03.md": {
	id: "2024/04/03.md";
  slug: "scrum-event";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2024/04/04.md": {
	id: "2024/04/04.md";
  slug: "google-cloud-certification-in-english";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2024/04/08.md": {
	id: "2024/04/08.md";
  slug: "percy-jackson-book-4";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2024/04/15.md": {
	id: "2024/04/15.md";
  slug: "travel-and-exam";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2024/04/16.md": {
	id: "2024/04/16.md";
  slug: "the-day-before-scrum-event";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2024/04/17.md": {
	id: "2024/04/17.md";
  slug: "english-russian-and-kansi";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2024/04/18.md": {
	id: "2024/04/18.md";
  slug: "learning-russian-in-english";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2024/04/19.md": {
	id: "2024/04/19.md";
  slug: "how-can-i-improve-my-english";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2024/04/20.md": {
	id: "2024/04/20.md";
  slug: "kanji-day";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2024/04/22.md": {
	id: "2024/04/22.md";
  slug: "songs-of-mine";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2024/04/23.md": {
	id: "2024/04/23.md";
  slug: "stuck";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2024/04/24.md": {
	id: "2024/04/24.md";
  slug: "the-progress-of-learning";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2024/04/27.md": {
	id: "2024/04/27.md";
  slug: "soy-source";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2024/04/28.md": {
	id: "2024/04/28.md";
  slug: "tired";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2024/04/29.md": {
	id: "2024/04/29.md";
  slug: "detective-conan";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2024/04/30.md": {
	id: "2024/04/30.md";
  slug: "end-of-april";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2024/05/01.md": {
	id: "2024/05/01.md";
  slug: "golden-week";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2024/05/03.md": {
	id: "2024/05/03.md";
  slug: "kanji-kanji-kanji";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2024/05/04.md": {
	id: "2024/05/04.md";
  slug: "soundcloud";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2024/05/07.md": {
	id: "2024/05/07.md";
  slug: "next-book";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2024/05/08.md": {
	id: "2024/05/08.md";
  slug: "to-be-good";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2024/05/20.md": {
	id: "2024/05/20.md";
  slug: "be-back";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2024/05/21.md": {
	id: "2024/05/21.md";
  slug: "simple";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2024/08/05.md": {
	id: "2024/08/05.md";
  slug: "resume";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2024/08/06.md": {
	id: "2024/08/06.md";
  slug: "studing-english";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2024/08/07.md": {
	id: "2024/08/07.md";
  slug: "richard-preston";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2024/08/08.md": {
	id: "2024/08/08.md";
  slug: "the-rule";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2024/08/09.md": {
	id: "2024/08/09.md";
  slug: "tendency";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2024/09/01.md": {
	id: "2024/09/01.md";
  slug: "college";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2024/09/07.md": {
	id: "2024/09/07.md";
  slug: "impressions";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2024/09/are-you-still-struggling-with-wordpress.md": {
	id: "2024/09/are-you-still-struggling-with-wordpress.md";
  slug: "are-you-still-struggling-with-wordpress";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2024/10/scorching-summer-was-over.md": {
	id: "2024/10/scorching-summer-was-over.md";
  slug: "scorching-summer-was-over";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	export type ContentConfig = typeof import("../../src/content/config.js");
}
