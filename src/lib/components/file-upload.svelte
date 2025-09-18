<script lang="ts">
	import CloudDownload from '$lib/icons/cloud-download.svelte';
	let { handleFiles }: { handleFiles: (newFiles: File[]) => void } = $props();
	let hover = $state(false);

	let fileInput: HTMLInputElement | null = null;

	const handleDragEnter = (e: DragEvent) => {
		e.preventDefault();
	};

	const handleDragOver = (e: DragEvent) => {
		e.preventDefault();
		hover = true;
	};

	const handleDragLeave = (e: DragEvent) => {
		e.preventDefault();
		hover = false;
	};

	const handleDrop = (e: DragEvent) => {
		e.preventDefault();
		hover = false;
		const droppedFiles = Array.from(e.dataTransfer?.files ?? []);
		if (droppedFiles.length) {
			handleFiles(droppedFiles);
		}
	};

	function openFileDialog() {
		if (fileInput) {
			fileInput.click();
		}
	}
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
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
