<script lang="ts">
	import '../app.css';
	import { Toaster } from 'svelte-sonner';
	import favicon from '$lib/assets/favicon.png';
	import { page } from '$app/state';
	import { enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
	import Upload from '$lib/icons/upload.svelte';
	import Gallery from '$lib/icons/gallery.svelte';
	import LogOut from '$lib/icons/log-out.svelte';
	import { MediaQuery } from 'svelte/reactivity';
	import Logo from '$lib/images/logo.png';
	import GitLogo from '$lib/icons/git-logo.svelte';

	let { data, children } = $props();
	let loading = $state(false);
	const currentPath = $derived(page.url.pathname);
	const shouldShowDock = $derived(
		data.userIsValid && currentPath !== '/login' && currentPath !== '/register'
	);

	const large = new MediaQuery('min-width: 800px');

	function handleLogout() {
		loading = true;
		return async ({ action }: any) => {
			const res = await fetch(action, { method: 'POST' });
			if (res.redirected) {
				await goto(res.url);
				invalidateAll();
			} else if (res.ok) {
				location.reload();
			} else {
				console.error('Logout failed', await res.text());
			}
			loading = false;
		};
	}
</script>

<svelte:head>
	<title>GLYPH - Image Hosting</title>
	<meta name="description" content="Upload and manage your images with GLYPH." />
	<link rel="icon" href={favicon} />
</svelte:head>
<Toaster position="top-right" />

<section>
	<nav
		class="sticky top-0 flex items-center justify-between overflow-hidden border-b-2 border-gray-800 bg-black px-10"
	>
		<div class="flex items-center gap-2 p-6 font-bold">
			<img src={Logo} alt="logo" class="h-6 w-6 object-contain" />
			<span>GLYPH</span>
		</div>
		<div class="hidden items-center gap-10 md:flex">
			{#if data.userIsValid}
				<ul class="flex gap-5">
					<a href="/"><li class={`${currentPath === '/' ? 'border-b-2 ' : ''}p-6`}>Upload</li></a>
					<a href="/gallery"
						><li class={`${currentPath === '/gallery' ? 'border-b-2 ' : ''}p-6`}>Gallery</li></a
					>
				</ul>
			{/if}
			<div>
				<a href="https://github.com/sabarisrinivasan/Glyph" title="facing any issues?">
					<GitLogo /></a
				>
			</div>
			{#if data.record?.name}
				<form action="/api/logout" method="POST" use:enhance={handleLogout}>
					<button type="submit" class="btn rounded-md btn-primary" disabled={loading}>
						{#if loading}
							<span class="loading loading-xs loading-bars"></span>
						{:else}
							Logout
						{/if}
					</button>
				</form>
			{/if}
		</div>
	</nav>
	{@render children?.()}
	{#if shouldShowDock && !large.current}
		<div class="dock border-t-2 border-gray-800">
			<a href="/" class={`${currentPath === '/' ? 'dock-active' : ''}`}>
				<Upload class="size-[1.2em]" />
				<span class="dock-label">Upload</span>
			</a>

			<a href="/gallery" class={`${currentPath === '/gallery' ? 'dock-active' : ''}`}>
				<Gallery class="size-[1.2em]" />
				<span class="dock-label">Gallery</span>
			</a>

			<form action="/api/logout" method="POST" use:enhance={handleLogout}>
				<button type="submit" disabled={loading}>
					{#if loading}
						<span class="loading loading-xs loading-bars"></span>
					{:else}
						<LogOut class="size-[1.2em]" />
						<span class="dock-label">Logout</span>
					{/if}
				</button>
			</form>
		</div>
	{/if}
</section>
