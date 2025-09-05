<script>
	import { enhance } from '$app/forms';

	let data = $props();
	$inspect(data);
	let emailError = $derived(data?.form?.error?.email?.errors[0]);
	let passwordError = $derived(data?.form?.error?.password?.errors[0]);
	$inspect(emailError);
</script>

<main class="flex h-[80dvh] items-center justify-center">
	<form
		action="?/login"
		method="POST"
		use:enhance
		class="flex w-full max-w-md flex-col gap-9 p-2.5"
	>
		<h1 class="text-2xl font-bold">Login</h1>
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

		<button class="btn w-full btn-primary">Login</button>
	</form>
</main>
