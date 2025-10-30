import { formatDistanceToNow } from 'date-fns';
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
		return true;
	} catch (err) {
		toast.error('Failed to copy ');
		return false;
	}
};

export function clickOutside(node: Element) {
	const handleClick = (event: Event) => {
		if (!node.contains(<Node>event.target)) {
			node.dispatchEvent(new CustomEvent('outclick'));
		}
	};

	document.addEventListener('click', handleClick, true);

	return {
		destroy() {
			document.removeEventListener('click', handleClick, true);
		}
	};
}

export const distanceToNow = (data: number) => {
	if (data) {
		return formatDistanceToNow(data, { addSuffix: true });
	}
};
export function getOS(): string {
	const platform = navigator.userAgent;
	let osName = 'Unknown OS';
	if (platform.includes('Win')) {
		osName = 'Windows';
	} else if (platform.includes('Mac')) {
		osName = 'MacOS';
	} else if (platform.includes('X11') || platform.includes('Linux')) {
		osName = 'Linux';
	}
	return osName;
}
