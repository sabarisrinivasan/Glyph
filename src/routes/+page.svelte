<script lang="ts">
	import CloseIcon from '$lib/icons/close-icon.svelte';
	import CloudDownload from '$lib/icons/cloud-download.svelte';
	import PlaceholderIcon from '$lib/icons/placeholder-icon.svelte';
	import { fade, fly } from 'svelte/transition';

	let hover = $state(false);
	let files = $state<File[]>([]);
	type Preview = {
		id: string;
		file: File;
		src: string | typeof PlaceholderIcon;
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

	const handleFiles = (newFiles: File[]) => {
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
			// Create FormData for PocketBase upload
			const formData = new FormData();

			// Add each file to the FormData
			// For PocketBase, you typically upload to a specific field name
			files.forEach((file, index) => {
				formData.append('documents', file); // 'documents' should match your PocketBase collection field name
			});

			// You can add other fields to the record if needed
			// formData.append('title', 'My Upload');
			// formData.append('description', 'Uploaded files');

			// Make request to your SvelteKit API endpoint that handles PocketBase upload
			const response = await fetch('/api/upload', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				throw new Error('Upload failed');
			}

			const result = await response.json();
			console.log('Upload successful:', result);

			// Clear files after successful upload
			clearAll();
			alert('Files uploaded successfully!');
		} catch (error) {
			console.error('Error uploading files:', error);
			alert('Error uploading files: ' + (error instanceof Error ? error.message : 'Unknown error'));
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
			class={`flex w-full cursor-pointer justify-center border border-dashed p-14 ${hover ? 'bg-secondary' : ''}`}
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
			<div class="h-auto border border-dashed p-14 md:min-w-2xl lg:max-w-4xl">
				<div class="flex items-center justify-between">
					<h1>Selected Files {previews.length}</h1>
					<button class="btn btn-primary" onclick={clearAll}>clear All</button>
				</div>
				<div class="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
					{#each previews as preview, index (preview.id)}
						<div class="h-auto w-full">
							<div class="relative h-26 w-full" in:fly={{ y: 200, duration: 500 }} out:fade>
								{#if typeof preview.src === 'string'}
									<img src={preview.src} alt={preview.name} class="h-full w-full object-cover" />
								{/if}
								<button
									title="remove file"
									onclick={() => removeFile(index)}
									class="btn absolute top-0 right-0 btn-error"
								>
									<CloseIcon />
								</button>
							</div>
						</div>
					{/each}
				</div>
				<div class="flex justify-end">
					<button class="btn mt-4 btn-primary" onclick={uploadImage}>Upload</button>
				</div>
			</div>
		{/if}
	</div>
</section>
