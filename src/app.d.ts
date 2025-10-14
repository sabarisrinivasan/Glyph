// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type PocketBase from 'pocketbase';
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			pb: PocketBase;
			user: Record<string, any> | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};

declare namespace svelteHTML {
	interface HTMLAttributes<T> {
		'on:click_outside'?: CompositionEventHandler;
	}
}
export type ImageCollection = {
	collectionId: string;
	collectionName: string;
	created: string;
	documents: string[];
	documents_meta: documentsMeta[];
	id: string;
	updated: string;
	user: string;
}[];

export type documentsMeta = {
	originalName: string;
	size: number;
	storedName: string;
	type: string;
	url: string;
	createdAt: number;
	favorite: boolean;
};

export type ImageUrlCollection = {
	collectionId: string;
	collectionName: string;
	created: string;
	id: string;
	imageDetails: documentsMeta;
	slug: string;
	target: string;
	updated: string;
	user: string;
};
