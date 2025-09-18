<script lang="ts">
	type PropsType = {
		height?: string;
	};
	let { height = '24' }: PropsType = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	width="24"
	{height}
	viewBox="0 0 24 24"
	fill="none"
	stroke="#ffffff"
	stroke-width="2"
	stroke-linecap="round"
	stroke-linejoin="round"
	class="lucide lucide-check-icon lucide-check"><path d="M20 6 9 17l-5-5" /></svg
>
