<script>
	import { enhance } from '$app/forms';
</script>

<main class="flex h-[90dvh] items-center justify-center">
	<form
		action="?/login"
		method="POST"
		use:enhance
		class="flex w-full max-w-md flex-col gap-9 p-2.5"
	>
		<h1 class="text-2xl font-bold">Login</h1>
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

		<button class="btn w-full btn-primary">Login</button>
	</form>
</main>
