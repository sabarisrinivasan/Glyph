<script lang="ts">
	export let data: { slug: string; target: string };
	console.log(data.target);
</script>

<section class="p-6">
	<!-- <div class="w-full flex border h-[50%] p-10">
     <div class="w-[50%] h-[50%]  border">
 <img
      src={data.target}
      alt={data.slug}
      class="h-full w-full object-cover"
      loading="eager"
      decoding="async"
      on:error={() => console.warn('Image failed to load:', data.target)}
    />
     
     </div>
     <div class="w-[50%] border"></div>
  </div> -->

	<h1 class="text-lg font-semibold">Preview: {data.slug}</h1>
	<img
		src={data.target}
		alt={data.slug}
		class="h-auto max-w-full rounded-xl"
		loading="eager"
		decoding="async"
		on:error={() => console.warn('Image failed to load:', data.target)}
	/>

	<p class="text-sm break-all text-neutral-500">URL: {data.target}</p>
</section>
