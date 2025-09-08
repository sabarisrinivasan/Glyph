<script lang="ts">
  export let data: { slug: string; target: string };
console.log(data.target)
</script>

<section class="mx-auto max-w-3xl p-6 space-y-4">
  <h1 class="text-lg font-semibold">Preview: {data.slug}</h1>

    <img
      src={data.target}
      alt={data.slug}
      class="max-w-full h-auto rounded-xl"
      loading="eager"
      decoding="async"
      on:error={() => console.warn('Image failed to load:', data.target)}
    />

  <p class="text-sm text-neutral-500 break-all">URL: {data.target}</p>
</section>
