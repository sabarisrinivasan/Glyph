<script lang="ts">
	import CopyIcon from '$lib/icons/copy-icon.svelte';
	import Tick from '$lib/icons/tick.svelte';
	import { bytesToSize, handleCopyLink } from '$lib/utils';

	export let data: {
		slug: string;
		target: string;
		fileData: {
			storedName: string;
			originalName: string;
			size: number;
			type: string;
			url: string;
		};
	};
	console.log(data.target);
</script>

<svelte:head>
	<title>Image Details - GLYPH</title>
	<meta name="description" content="View details of your uploaded image on GLYPH." />
</svelte:head>

<section class="h-[calc(100vh-90px)] p-6">
	<!-- Grid: 2 cols; rows = main area + recents strip -->
	<div class="grid h-full grid-cols-1 gap-4 lg:grid-cols-[auto_500px]">
		<!-- LEFT: Main image (fully visible, no cropping) -->
		<div class="relative overflow-hidden rounded-lg bg-neutral-900">
			<div class="flex h-full w-full items-center justify-center p-4">
				<img
					src={data.target}
					alt={data.slug}
					class="max-h-full max-w-full object-contain"
					loading="lazy"
					decoding="async"
				/>
			</div>
		</div>

		<!-- RIGHT: Details panel (scrolls if long) -->
		<aside class="flex flex-col gap-10 overflow-auto rounded-lg border-2 border-gray-800 p-4">
			<h1 class="mb-2 truncate text-xl font-semibold">{data.fileData.originalName}</h1>

			<!-- <p class="mb-4 text-sm break-all text-neutral-500">
				URL: {data.target}
			</p> -->

			<!-- Put whatever metadata you have here -->
			<div class="space-y-2 text-sm">
				<div class="flex items-center justify-between">
					<span class="text-neutral-500">Format</span>
					<span>{data.fileData.type}</span>
				</div>
				<div class="flex items-center justify-between">
					<span class="text-neutral-500">Dimensions</span>
					<span>Auto-detected</span>
				</div>
				<div class="flex items-center justify-between">
					<span class="text-neutral-500">Size</span>
					<span>{bytesToSize(data.fileData.size)}</span>
				</div>
				<!-- Add real fields from your data model -->
			</div>
			<div class="flex flex-col gap-4">
				<div class="group flex items-center justify-between gap-3">
					<label for="imageLink">Image Link</label>
					<input type="text" value={data.target} readonly class="input relative" />
					<button
						onclick={() => handleCopyLink(data.target)}
						class="absolute right-11 z-10 bg-gray-900 p-1.5 opacity-0
           transition-opacity group-focus-within:opacity-100
           group-hover:opacity-100"
					>
						<CopyIcon />
					</button>
				</div>
				<div class="group flex items-center justify-between gap-3">
					<label for="imageLink">HTML</label>
					<input
						type="text"
						value={`<a href='${data.target}'><img src="${data.target}" /><a/>`}
						readonly
						class="input"
					/>
					<button
						onclick={async () =>
							handleCopyLink(`<a href='${data.target}'><img src="${data.target}" /><a/>`)}
						class="absolute right-11 z-10 bg-gray-900 p-1.5 opacity-0
           transition-opacity group-focus-within:opacity-100
           group-hover:opacity-100"
					>
						<CopyIcon />
					</button>
				</div>
			</div>
		</aside>
	</div>
</section>
