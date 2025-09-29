<script lang="ts">
	import type { Snippet } from 'svelte';

	type PropsType = {
		text: string;
		duration?: number;
		icon: Snippet;
		copyIcon: Snippet;
	};
	let { text, duration = 2000, icon, copyIcon }: PropsType = $props();
	let copied = $state(false);
	let timeoutId: number | undefined;

	$effect(() => {
		return () => clearTimeout(timeoutId);
	});

	async function copy() {
		try {
			await navigator.clipboard.writeText(text);
			copied = true;

			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => (copied = false), duration);
		} catch (err) {
			console.error('Failed to copy text: ', err);
		}
	}
</script>

<button onclick={copy} class="rounded-full bg-primary p-1.5 active:scale-90" type="button">
	{#if copied}
		{@render copyIcon()}
	{:else}
		<!-- Copy SVG -->
		{@render icon()}
	{/if}
</button>
