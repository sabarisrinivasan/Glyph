import { toast } from 'svelte-sonner';

export function bytesToSize(bytes: number, separator: string = ''): string {
	const sizes: string[] = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

	if (bytes === 0) return 'n/a';

	const i: number = Math.floor(Math.log(bytes) / Math.log(1024));

	if (i === 0) {
		return `${bytes}${separator}${sizes[i]}`;
	}

	return `${(bytes / 1024 ** i).toFixed(1)}${separator}${sizes[i]}`;
}

export const handleCopyLink = async (url: string) => {
	try {
		navigator.clipboard.writeText(url);
		toast.success('copied!');
	} catch (err) {
		toast.error('Failed to copy ');
	}
};
