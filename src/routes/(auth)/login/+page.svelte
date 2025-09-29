<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { toast } from 'svelte-sonner';

	let { form } = $props();
	let emailError = $derived(form?.error?.email?.errors[0]);
	let passwordError = $derived(form?.error?.password?.errors[0]);
	let loading = $state(false);
	let authError = $derived(form?.message);

	$effect(() => {
		if (authError) {
			toast.error(authError);
		}
	});
	const handleSubmission: SubmitFunction = () => {
		loading = true;
		return async ({ update }) => {
			await update();
			loading = false;
		};
	};
</script>

<main class="flex h-[90dvh] items-center justify-center">
	<form
		action="?/login"
		method="POST"
		use:enhance={handleSubmission}
		class="flex w-full max-w-md flex-col gap-9 p-2.5"
	>
		<h1 class="text-2xl font-bold">Login</h1>
		<div>
			<label for="email" class="mb-3.5">Email</label>
			<input
				type="email"
				class={`input w-full rounded-sm ${emailError ? 'input-error' : ''}`}
				value={form?.data?.email ?? ''}
				placeholder="email"
				name="email"
				id="email"
				required
				autocomplete="email"
			/>
			<span class="text-red-500">{emailError ?? ''}</span>
		</div>

		<div>
			<label for="password">Password</label>
			<input
				type="password"
				class={`input w-full rounded-sm ${passwordError ? 'input-error' : ''}`}
				placeholder="password"
				name="password"
				id="password"
				value={form?.data?.password ?? ''}
				required
				autocomplete="current-password"
			/>
			<span class="text-red-500">{passwordError ?? ''}</span>
		</div>

		<button class={`btn w-full rounded-sm btn-primary`} disabled={loading}>
			{#if loading}
				<span class="loading loading-xs loading-bars"></span>
			{:else}
				Login
			{/if}
		</button>
	</form>
</main>
