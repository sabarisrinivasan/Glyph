<script lang="ts">
	import CopyClipboard from '$lib/components/copy-clipboard.svelte';
	import DownloadIcon from '$lib/icons/download-icon.svelte';
	import HeartIcon from '$lib/icons/heart-icon.svelte';
	import LinkIcon from '$lib/icons/link-icon.svelte';
	import VerifyIcon from '$lib/icons/verify-icon.svelte';
	import { bytesToSize, distanceToNow } from '$lib/utils.js';
	import { fade, fly } from 'svelte/transition';
	import type { ImageUrlCollection } from '../../app.js';
	import { invalidate } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import DropDown from '$lib/components/drop-down.svelte';
	import { tick } from 'svelte';
	// Removed incorrect import of KeyboardEvent from 'react'

	let { data } = $props();
	let imageData = $state(data.images);

	let renameId: string | null = $state(null);
	let inputRef: HTMLInputElement | null = $state(null);

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

	const handleAction = async (action: 'rename' | 'delete', item: ImageUrlCollection) => {
		if (action === 'rename') {
			renameId = item.id;
			await tick();
			if (inputRef) {
				inputRef?.focus();
				const val = inputRef.value;
				inputRef?.setSelectionRange(val.length, val.length);
				inputRef?.select();
			}

			inputRef?.select();
		} else if (action === 'delete') {
			if (!confirm(`Are you sure you want to delete "${item.imageDetails.storedName}"?`)) {
				return;
			}

			if (pending.has(item.id)) return;
			pending.add(item.id);

			try {
				const res = await fetch('/api/delete', {
					method: 'POST',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify({ id: item.id })
				});
				const { success } = await res.json();

				if (!success) {
					toast.error('Failed to delete image');
					return;
				}

				imageData = imageData.filter((d) => d.id !== item.id);
				toast.success('Image deleted successfully');
				await invalidate('/gallery');
			} catch (e) {
				toast.error('Something went wrong');
			} finally {
				pending.delete(item.id);
			}
		}
	};

	const handleRenameKey = async (e: KeyboardEvent, item: ImageUrlCollection) => {
		if (e.key === 'Enter') {
			console.log(inputRef?.value);
			renameId = null;
			if (pending.has(item.id)) return;
			pending.add(item.id);
			imageData = imageData.map((d) =>
				d.id === item.id
					? {
							...d,
							imageDetails: {
								...d.imageDetails,
								storedName: inputRef?.value ?? d.imageDetails.storedName
							}
						}
					: d
			);
			try {
				const res = await fetch('/api/rename', {
					method: 'POST',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify({ id: item.id, storedName: inputRef?.value })
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
					e.id === item.id
						? {
								...e,
								imageDetails: {
									...e.imageDetails,
									storedName: inputRef?.value ?? e.imageDetails.storedName
								}
							}
						: e
				);
			} finally {
				pending.delete(item.id);
			}
		} else if (e.key === 'Escape') {
			renameId = null;
		}
	};
</script>

<svelte:head>
	<title>Gallery - GLYPH</title>
	<meta name="description" content="Browse and manage your uploaded images in the GLYPH gallery." />
</svelte:head>
<section class="h-[calc(100vh-90px)] w-full overflow-y-auto px-5 pt-5 pb-20 lg:p-5">
	<h1 class="text-3xl">Gallery</h1>
	<div
		class=" grid grid-cols-1 items-center justify-items-center gap-10 p-5 md:grid-cols-2 lg:grid-cols-4"
	>
		{#each imageData as item, i}
			<div
				class="flex h-80 w-full scale-100 flex-col gap-2 rounded-sm border-2 border-gray-800 bg-black p-2"
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
						{#if renameId === item.id}
							<input
								type="text"
								class="truncate rounded-sm border-none px-1 leading-8 font-bold text-white outline-none"
								onkeypress={(e) => handleRenameKey(e, item)}
								value={item.imageDetails.storedName}
								bind:this={inputRef}
							/>
						{:else}
							<h1 class="truncate leading-8 font-bold">{item.imageDetails.storedName}</h1>
						{/if}

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
						<!-- <button class="cursor-pointer rounded-full bg-primary p-1.5 active:scale-90">
							<DotIcon />
						</button> -->
						<DropDown handleAction={(action: 'rename' | 'delete') => handleAction(action, item)} />
					</div>
				</div>
			</div>
		{/each}
	</div>
</section>
