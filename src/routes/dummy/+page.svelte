<script lang="ts">
	import CopyClipboard from '$lib/components/copy-clipboard.svelte';
	import LinkIcon from '$lib/icons/link-icon.svelte';
	import VerifyIcon from '$lib/icons/verify-icon.svelte';
</script>

<CopyClipboard text="hello">
	{#snippet icon()}
		<LinkIcon />
	{/snippet}
	{#snippet copyIcon()}
		<VerifyIcon />
	{/snippet}
</CopyClipboard>
