<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';
	let { data, children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<section>
	<nav class="flex items-center justify-between border-b px-10 py-6">
		<div class="font-bold">Flipopay Image host</div>
		<div class="flex gap-3">
			{#if data.name}
				<form action="/api/logout" method="POST">
					<button class="btn btn-primary">Logout</button>
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
