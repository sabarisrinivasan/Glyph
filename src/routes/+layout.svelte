<script lang="ts">
	import '../app.css';
	import { Toaster } from 'svelte-sonner';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	let { data, children } = $props();
	let loading = $state(false);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>
<Toaster position="top-right" />
<section>
	<nav class="flex items-center justify-between border-b px-10 py-6">
		<div class="font-bold">Flipopay Image host</div>
		<div class="flex gap-3">
			{#if data.name}
				<form
					action="/api/logout"
					method="POST"
					use:enhance={() => {
						loading = true;
						return async ({ action }) => {
							const res = await fetch(action, { method: 'POST' });
							if (res.redirected) {
								await goto(res.url);
							} else if (res.ok) {
								location.reload();
							} else {
								console.error('Logout failed', await res.text());
							}
							loading = false;
						};
					}}
				>
					<button class="btn btn-primary" disabled={loading}>
						{#if loading}
							<span class="loading loading-xs loading-bars"></span>
						{:else}
							Logout
						{/if}
					</button>
				</form>
			{:else if page.url.pathname === '/login'}
				<a href="/register"><button class="btn btn-primary"> Register</button></a>
			{:else}
				<a href="/login"><button class="btn btn-primary">Login</button></a>
			{/if}
		</div>
	</nav>
	{@render children?.()}
</section>
