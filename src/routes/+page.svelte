<script lang="ts">
	import CloseIcon from '$lib/icons/close-icon.svelte';
	import CloudDownload from '$lib/icons/cloud-download.svelte';
	import CopyIcon from '$lib/icons/copy-icon.svelte';
	import PlaceholderIcon from '$lib/icons/placeholder-icon.svelte';
	import { bytesToSize, handleCopyLink } from '$lib/utils';
	import { toast } from 'svelte-sonner';
	import { fade, fly } from 'svelte/transition';

	type meta = {
		storedName: string;
		originalName: string;
		size: number;
		type: string;
		url: string;
	};
	type UploadResponse = {
		success: boolean;
		recordId: string;
		files: meta[];
		links: {
			filename: string;
			url: string;
			short: string;
		}[];
	};

	let hover = $state(false);
	let loading = $state(false);
	let files = $state<File[]>([]);
	let imageURL = $state<UploadResponse | undefined>();
	type Preview = {
		id: string;
		file: File;
		src: string | typeof PlaceholderIcon | undefined;
		name: string;
		size: number;
		type: string;
		isImage: boolean;
	};

	let previews = $state<Preview[]>([]);
	let fileInput: HTMLInputElement | null = null;
	const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

	const handleDragEnter = (e: DragEvent) => {
		e.preventDefault();
		console.log('drag enter');
	};

	const handleDragOver = (e: DragEvent) => {
		e.preventDefault();
		hover = true;
		console.log('drag over');
	};

	const handleDragLeave = (e: DragEvent) => {
		e.preventDefault();
		hover = false;
		console.log('drag leave');
	};

	const handleDrop = (e: DragEvent) => {
		e.preventDefault();
		hover = false;
		const droppedFiles = Array.from(e.dataTransfer?.files ?? []);
		if (droppedFiles.length) {
			handleFiles(droppedFiles);
		}
		console.log('drop');
	};

	const handleFiles = async (newFiles: File[]) => {
		files = [...files, ...newFiles];
		newFiles.forEach((file) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onloadend = function (e) {
				const result = e.target?.result;
				const preview = {
					id: crypto.randomUUID(),
					file: file,
					src: isValidFileType(file)
						? typeof result === 'string'
							? result
							: PlaceholderIcon
						: PlaceholderIcon,
					name: file.name,
					size: file.size,
					type: file.type,
					isImage: isValidFileType(file)
				};
				previews = [...previews, preview];
			};
		});
	};
	function isValidFileType(file: File) {
		return allowedTypes.includes(file.type);
	}
	function clearAll() {
		files = [];
		previews = [];
		if (fileInput) {
			fileInput.value = '';
		}
	}
	function removeFile(index: number) {
		files = files.filter((_, i) => i !== index);
		previews = previews.filter((_, i) => i !== index);
	}
	function openFileDialog() {
		if (fileInput) {
			fileInput.click();
		}
	}
	async function uploadImage() {
		if (files.length === 0) {
			alert('No files selected');
			return;
		}

		try {
			loading = true;
			const formData = new FormData();
			files.forEach((file, index) => {
				formData.append('documents', file);
			});
			const response = await fetch('/api/upload', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				throw new Error('Upload failed');
			}

			const result = (await response.json()) as UploadResponse;
			console.log('Upload successful:', result);
			imageURL = result;
			// clearAll();
			toast.success('Files uploaded successfully!');
		} catch (error) {
			console.error('Error uploading files:', error);
			toast.error(
				'Error uploading files: ' + (error instanceof Error ? error.message : 'Unknown error')
			);
		} finally {
			loading = false;
		}
	}
</script>

<section class="flex h-full flex-col items-center justify-center p-5">
	<div class="mx-auto flex h-full min-w-xs flex-col gap-4 p-1.5 md:min-w-2xl lg:min-w-4xl">
		<h1 class="text-2xl font-bold">Upload image</h1>
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
		<div
			role="region"
			ondrop={handleDrop}
			ondragleave={handleDragLeave}
			ondragenter={handleDragEnter}
			ondragover={handleDragOver}
			onclick={openFileDialog}
			tabindex="0"
			onkeydown={(e) => e.key === 'Enter' && openFileDialog()}
			class={`flex w-full cursor-pointer justify-center rounded-sm border-2 border-dashed border-gray-700 p-14 ${hover ? 'bg-secondary' : ''}`}
		>
			<div class="flex flex-col items-center gap-4">
				<CloudDownload height="50" />
				<div class="flex flex-col gap-4">
					<div class="text-center">
						<p>Drag and drop an image here</p>
						<span>or</span>
						<p>Click here to Upload</p>
					</div>
				</div>

				<input
					multiple
					hidden
					type="file"
					bind:this={fileInput}
					onchange={(e) => handleFiles(Array.from((e.target as HTMLInputElement).files ?? []))}
				/>
			</div>
		</div>
		{#if previews.length > 0}
			<div class="h-auto rounded-sm border-2 border-gray-800 p-14 md:min-w-2xl lg:max-w-4xl">
				<div class="flex items-center justify-between">
					<h1>Selected Files {previews.length}</h1>
					<button class="btn rounded-sm btn-primary" onclick={clearAll}>clear All</button>
				</div>
				<div class="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
					{#if imageURL}
						<div transition:fly={{ y: 200, duration: 500 }}>
							{#each imageURL?.links as item}
								<div class="h-auto w-full rounded-sm border-2 border-gray-800 p-2">
									<div class="h-26 w-full rounded-sm border border-gray-800">
										<a href={item.short}>
											<img
												src={item.url}
												alt={item.filename}
												class="h-full w-full object-contain"
												loading="lazy"
											/>
										</a>
									</div>
									<div class="flex w-full items-center justify-between gap-2.5 p-2">
										<div class="w-[50%]">
											<h1 class="truncate">{imageURL.files[0].originalName}</h1>
											<p>{bytesToSize(imageURL.files[0].size)}</p>
										</div>
										<button class="btn btn-primary" onclick={() => handleCopyLink(item.url)}>
											<CopyIcon />
										</button>
									</div>
								</div>
							{/each}
						</div>
					{:else}
						{#each previews as preview, index (preview.id)}
							<div
								class="h-auto w-full rounded-sm border-2 border-gray-800 p-2"
								in:fly={{ y: 200, duration: 500 }}
								out:fade
							>
								<div class=" h-26 w-full rounded-sm border border-gray-800">
									{#if typeof preview.src === 'string'}
										<img
											src={preview.src}
											alt={preview.name}
											class="h-full w-full object-contain"
										/>
									{/if}
								</div>
								<div class="flex w-full items-center justify-between gap-2.5 p-2">
									<div class="w-[50%]">
										<h1 class="truncate">{preview.name}</h1>
										<p>{bytesToSize(preview.size)}</p>
									</div>
									<button
										title="remove file"
										onclick={() => removeFile(index)}
										class=" cursor-pointer rounded-full bg-red-500 p-2"
									>
										<CloseIcon />
									</button>
								</div>
							</div>
						{/each}
					{/if}
				</div>
				{#if imageURL === undefined}
					<div class="flex justify-end">
						<button
							class="btn mt-4 rounded-sm btn-primary"
							disabled={loading}
							onclick={uploadImage}
						>
							{#if loading}
								<span class="loading loading-xs loading-bars"></span>
							{:else}
								upload
							{/if}
						</button>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</section>
