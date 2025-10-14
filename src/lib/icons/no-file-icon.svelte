<script lang="ts">
	type PropsType = {
		height?: string;
		width?: string;
		class?: string;
	};
	let { height = '24', width = '24', class: className }: PropsType = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	{width}
	{height}
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width="2"
	stroke-linecap="round"
	stroke-linejoin="round"
	class={`lucide lucide-folder-x-icon lucide-folder-x ${className}`}
	><path
		d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"
	/><path d="m9.5 10.5 5 5" /><path d="m14.5 10.5-5 5" /></svg
>
