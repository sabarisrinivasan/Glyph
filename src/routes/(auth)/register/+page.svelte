<script>
	import { enhance } from '$app/forms';
</script>

<main class="flex h-[90dvh] items-center justify-center">
	<form
		action="?/register"
		method="POST"
		use:enhance
		class="flex w-full max-w-md flex-col gap-9 p-2.5"
	>
		<h1 class="text-2xl font-bold">Register for an account</h1>
		<div>
			<label for="email" class="mb-3.5">Email</label>
			<input type="email" class="input w-full" placeholder="email" name="email" id="email" />
		</div>

		<div>
			<label for="password">Password</label>
			<input
				type="password"
				class="input w-full"
				placeholder="password"
				name="password"
				id="password"
			/>
		</div>
		<div>
			<label for="passwordConfirm">Confirm Password</label>
			<input
				type="password"
				class="input w-full"
				placeholder="password"
				name="passwordConfirm"
				id="passwordConfirm"
			/>
		</div>
		<button class="btn w-full btn-primary">register</button>
	</form>
</main>
