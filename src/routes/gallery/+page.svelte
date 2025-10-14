<script lang="ts">
	import CopyClipboard from '$lib/components/copy-clipboard.svelte';
	import DotIcon from '$lib/icons/dot-icon.svelte';
	import DownloadIcon from '$lib/icons/download-icon.svelte';
	import HeartIcon from '$lib/icons/heart-icon.svelte';
	import LinkIcon from '$lib/icons/link-icon.svelte';
	import VerifyIcon from '$lib/icons/verify-icon.svelte';
	import { bytesToSize, distanceToNow } from '$lib/utils.js';
	import { fade, fly } from 'svelte/transition';
	import type { ImageUrlCollection } from '../../app.js';
	import { invalidate } from '$app/navigation';
	import { toast } from 'svelte-sonner';

	let { data } = $props();
	let imageData = $state(data.images);

	const pending = new Set<string>();

	const handleToggle = async (item: ImageUrlCollection) => {
		if (pending.has(item.id)) return;
		pending.add(item.id);
		const prev = Boolean(item.imageDetails.favorite);
		imageData = imageData.map((d) =>
			d.id === item.id ? { ...d, imageDetails: { ...d.imageDetails, favorite: !prev } } : d
		);
		try {
			const res = await fetch('/api/favorite', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ id: item.id })
			});
			const { success, record } = await res.json();
			if (!success) {
				toast.error('something went wrong');
			}
			imageData.map((d) => {
				d.id === item.id ? { ...d, imageData: record.imageDetails } : d;
			});
			await invalidate('/gallery');
		} catch (e) {
			imageData = imageData.map((e) =>
				e.id === item.id ? { ...e, imageDetails: { ...e.imageDetails, favorite: prev } } : e
			);
		} finally {
			pending.delete(item.id);
		}
	};

	async function downloadFile(imageData: ImageUrlCollection) {
		try {
			// Fetch file data as blob
			const res = await fetch(imageData.imageDetails.url);
			if (!res.ok) throw new Error('Failed to fetch file');

			const blob = await res.blob();
			const url = URL.createObjectURL(blob);

			// Create a link to trigger download
			const link = document.createElement('a');
			link.href = url;
			link.download = imageData.imageDetails.originalName;
			link.click();

			URL.revokeObjectURL(url);
		} catch (err) {
			console.error('Download error:', err);
		}
	}

	
</script>

<section class="h-[calc(100vh-90px)] w-full overflow-y-auto p-5">
	<h1 class="text-3xl">Gallery</h1>
	<div
		class=" grid grid-cols-1 items-center justify-items-center gap-10 p-5 md:grid-cols-2 lg:grid-cols-4"
	>
		{#each imageData as item, i}
			<div
				class="flex h-80 w-full scale-100 flex-col gap-2 rounded-sm border-2 border-gray-800 p-2 transition-transform duration-300 ease-in-out hover:scale-110 bg-black"
				in:fly={{ y: 200, duration: 500 }}
				out:fade
			>
				<div class="relative h-50 w-full rounded-sm border-2 border-gray-800 p-1">
					<button
						class="absolute top-2 right-2 cursor-pointer rounded-full bg-primary p-1.5 active:scale-90"
						onclick={() => handleToggle(item)}
					>
						<HeartIcon class={`${item.imageDetails.favorite ? 'fill-red-500 stroke-0' : ''}`} />
					</button>
					<a href={item.slug}>
						<img
							src={item.imageDetails.url}
							alt={item.imageDetails.storedName}
							class="h-full w-full rounded-sm object-contain hover:bg-gray-900"
						/>
					</a>
				</div>
				<div class="gap flex w-full justify-between p-2">
					<div class="flex w-[50%] flex-col">
						<h1 class="truncate leading-8 font-bold">{item.imageDetails.originalName}</h1>
						<p class="text-xs text-gray-400">{bytesToSize(item.imageDetails.size)}</p>
						<p class="text-xs text-gray-400">{distanceToNow(item.imageDetails.createdAt)}</p>
					</div>
					<div>
						<CopyClipboard text={item.imageDetails.url}>
							{#snippet icon()}
								<LinkIcon />
							{/snippet}
							{#snippet copyIcon()}
								<VerifyIcon />
							{/snippet}
						</CopyClipboard>
						<button
							class=" cursor-pointer rounded-full bg-primary p-1.5 active:scale-90"
							onclick={() => downloadFile(item)}
						>
							<DownloadIcon />
						</button>
						<button class="cursor-pointer rounded-full bg-primary p-1.5 active:scale-90">
							<DotIcon />
						</button>
					</div>
				</div>
			</div>
		{/each}
	</div>

	
</section>
