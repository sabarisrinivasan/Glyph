<script lang="ts">
	import FileUpload from '$lib/components/file-upload.svelte';
	import Modal from '$lib/components/modal.svelte';
	import CloseIcon from '$lib/icons/close-icon.svelte';
	import CopyIcon from '$lib/icons/copy-icon.svelte';
	import type { Preview, UploadResponse } from '$lib/type';
	import { bytesToSize, handleCopyLink } from '$lib/utils';
	import { toast } from 'svelte-sonner';
	import { fade, fly } from 'svelte/transition';

	// modal states
	let emojis = ['😥', '☹️', ' 😑', '😊', '😁'];
	let name = 'emoji';
	let selected = $state(null);
	let description = $state('');
	let showModal = $state(false);
	const validation = () => {
		if (selected !== '' && description !== '') {
			return false;
		}
		return true;
	};
	// image states
	let loading = $state(false);
	let files = $state<File[]>([]);
	let imageURL = $state<UploadResponse | undefined>();
	let previews = $state<Preview[]>([]);
	let fileInput: HTMLInputElement | null = null;
	const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp']);
	function isValidFileType(file: File) {
		return allowedTypes.has(file.type);
	}
	// handle files for preview images
	const handleFiles = async (newFiles: File[]) => {
		const filtered = newFiles.filter((file) => isValidFileType(file));
		const holdingFiles: Preview[] = filtered.map((files) => {
			const url = URL.createObjectURL(files);
			return {
				id: crypto.randomUUID(),
				file: files,
				src: url,
				name: files.name,
				size: files.size,
				type: files.type,
				isImage: true
			};
		});
		files = [...files, ...filtered];
		previews = [...previews, ...holdingFiles];
	};

	//clear all image
	function clearAll() {
		previews.forEach((pre) => URL.revokeObjectURL(pre.src));
		files = [];
		previews = [];
		if (fileInput) fileInput.value = '';
	}

	// remove file
	function removeFile(index: number) {
		const pre = previews[index];
		if (pre && typeof pre.src === 'string') URL.revokeObjectURL(pre.src);
		files = files.filter((_, i) => i !== index);
		previews = previews.filter((_, i) => i !== index);
	}

	//upload image in api
	const uploadImage = async () => {
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
			showModal = !showModal;
			imageURL = result;
			// clearAll();
			toast.success('Files uploaded successfully!');
		} catch (error) {
			toast.error(
				'Error uploading files: ' + (error instanceof Error ? error.message : 'Unknown error')
			);
		} finally {
			loading = false;
		}
	};

	//handle feedback api
	const handleFeedBack = async () => {
		const data = {
			emoji: selected,
			description: description
		};
		try {
			const response = await fetch('/api/feedback', {
				method: 'POST',
				body: JSON.stringify(data)
			});
			if (!response.ok) {
				throw new Error('Upload failed');
			}
			const result = await response.json();
			toast.success(result?.message);
		} catch (error) {
			toast.error(
				'Error uploading files: ' + (error instanceof Error ? error.message : 'Unknown error')
			);
		} finally {
			showModal = !showModal;
		}
	};
</script>

<section class="flex h-full flex-col items-center justify-center p-5">
	<div class="mx-auto flex h-full min-w-xs flex-col gap-4 p-1.5 md:min-w-2xl lg:min-w-4xl">
		<h1 class="text-2xl font-bold">Upload image</h1>
		<FileUpload {handleFiles} />
		{#if previews.length > 0}
			<div class="h-auto rounded-sm border-2 border-gray-800 p-14 md:min-w-2xl lg:max-w-4xl">
				<div class="flex items-center justify-between">
					<h1>Selected Files {previews.length}</h1>
					<button class="btn rounded-sm btn-primary" onclick={clearAll}>clear All</button>
				</div>
				<!-- preview images from api -->
				<div class="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
					{#if imageURL}
						<div transition:fly={{ y: 200, duration: 500 }}>
							{#each imageURL?.links as item, i}
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
											<h1 class="truncate">{imageURL.files[i].originalName}</h1>
											<p>{bytesToSize(imageURL.files[i].size)}</p>
										</div>
										<button class="btn btn-primary" onclick={() => handleCopyLink(item.url)}>
											<CopyIcon />
										</button>
									</div>
								</div>
							{/each}
						</div>
					{:else}
						<!-- preview when upload image -->
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
	<Modal bind:showModal>
		{#snippet header()}
			<h2>Give feed back</h2>
		{/snippet}
		<div class="flex flex-col gap-10">
			<h2>what do you think about image upload experience</h2>
			<fieldset class="flex w-full justify-between" aria-label="Pick an emoji">
				{#each emojis as emoji}
					<label class="cursor-pointer">
						<input class="peer sr-only" type="radio" {name} value={emoji} bind:group={selected} />
						<span
							class="rounded-md border p-2 text-2xl transition
           peer-checked:border-gray-800 peer-checked:bg-gray-500
           peer-checked:ring-2 peer-checked:ring-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
						>
							{emoji}
						</span>
					</label>
				{/each}
			</fieldset>
			<div class="flex flex-col gap-4">
				<p>what are the main reason for rating?</p>
				<textarea
					class="textarea w-full"
					name="description"
					bind:value={description}
					id="description"
				></textarea>
			</div>
			<div class="flex items-center justify-end gap-4">
				<!-- svelte-ignore a11y_autofocus -->
				<button
					autofocus
					onclick={handleFeedBack}
					disabled={validation()}
					class="btn mt-3.5 btn-primary"
				>
					submit
				</button>
			</div>
		</div>
	</Modal>
</section>
