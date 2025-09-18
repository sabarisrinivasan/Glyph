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
export type meta = {
	storedName: string;
	originalName: string;
	size: number;
	type: string;
	url: string;
};
export type UploadResponse = {
	success: boolean;
	recordId: string;
	files: meta[];
	links: {
		filename: string;
		url: string;
		short: string;
	}[];
};

export type Preview = {
	id: string;
	file: File;
	src: string | typeof PlaceholderIcon | undefined;
	name: string;
	size: number;
	type: string;
	isImage: boolean;
};
