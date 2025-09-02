<script lang="ts">
	import type { PocketBaseUser } from '$lib/type';
	export let data: PocketBaseUser;
</script>

<h1>{data.name ?? ''}</h1>
