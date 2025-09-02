export type PocketBaseUser = {
	id: string;
	collectionId: string;
	collectionName: string;
	created: string; // ISO date string
	updated: string; // ISO date string
	email: string;
	emailVisibility: boolean;
	name: string;
	avatar: string;
	verified: boolean;
};
