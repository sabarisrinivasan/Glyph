<script>
	import { enhance } from '$app/forms';
	let data = $props();
	$inspect(data);
	let nameError = $derived(data?.form?.error?.name?.errors[0]);
	let emailError = $derived(data?.form?.error?.email?.errors[0]);
	let passwordError = $derived(data?.form?.error?.password?.errors[0]);
	let passwordConfirmError = $derived(data?.form?.error?.passwordConfirm?.errors[0]);
	let loading = $state(false);
</script>

<main class="flex h-[80dvh] items-center justify-center">
	<form
		action="?/register"
		method="POST"
		use:enhance={() => {
			loading = true;
			return async ({ update }) => {
				await update();
				loading = false;
			};
		}}
		class="flex w-full max-w-md flex-col gap-9 p-2.5"
	>
		<h1 class="text-2xl font-bold">Register for an account</h1>
		<div>
			<label for="name" class="mb-3.5">Name</label>
			<input
				type="name"
				class={`input w-full ${nameError ? 'input-error' : ''}`}
				value={data?.form?.data?.name ?? ''}
				placeholder="name"
				name="name"
				id="name"
			/>
			<span class="text-red-500">{nameError ?? ''}</span>
		</div>

		<div>
			<label for="email" class="mb-3.5">Email</label>
			<input
				type="email"
				class={`input w-full ${emailError ? 'input-error' : ''}`}
				value={data?.form?.data?.email ?? ''}
				placeholder="email"
				name="email"
				id="email"
			/>
			<span class="text-red-500">{emailError ?? ''}</span>
		</div>

		<div>
			<label for="password">Password</label>
			<input
				type="password"
				class={`input w-full ${passwordError ? 'input-error' : ''}`}
				placeholder="password"
				name="password"
				id="password"
				value={data?.form?.data?.password ?? ''}
			/>
			<span class="text-red-500">{passwordError ?? ''}</span>
		</div>
		<div>
			<label for="passwordConfirm">Confirm Password</label>
			<input
				type="password"
				class={`input w-full ${passwordConfirmError ? 'input-error' : ''}`}
				placeholder="password"
				name="passwordConfirm"
				id="passwordConfirm"
				value={data?.form?.data?.passwordConfirm ?? ''}
			/>
			<span class="text-red-500">{passwordConfirmError ?? ''}</span>
		</div>
		<button class="btn w-full btn-primary" disabled={loading}>
			{#if loading}
				<span class="loading loading-xs loading-bars"></span>
			{:else}
				Register
			{/if}
		</button>
	</form>
</main>
