<script>
	let { showModal = $bindable(), header, children } = $props();

	let dialog = $state(); // HTMLDialogElement

	$effect(() => {
		if (!dialog) return;
		if (showModal && !dialog.open) dialog.showModal();
		if (!showModal && dialog.open) dialog.close();
	});
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<dialog
	bind:this={dialog}
	class="rounded-lg border-none p-0 shadow-xl backdrop:bg-black/50 open:inset-0 open:m-auto"
	onclose={() => (showModal = false)}
	onclick={(e) => {
		if (e.target === dialog) dialog.close();
	}}
>
	<div class="w-full max-w-lg rounded-lg border bg-white p-6 dark:bg-black">
		{@render header?.()}
		{@render children?.()}
		<!-- svelte-ignore a11y_autofocus -->
	</div>
</dialog>
