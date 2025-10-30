<script lang="ts">
	import CloseIcon from '$lib/icons/close-icon.svelte';
	import DotIcon from '$lib/icons/dot-icon.svelte';
	import Edit from '$lib/icons/edit.svelte';
	import { DropdownMenu } from 'bits-ui';

	let { handleAction } = $props();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger class="cursor-pointer rounded-full bg-primary p-1.5 active:scale-90">
		<DotIcon />
	</DropdownMenu.Trigger>
	<DropdownMenu.Portal>
		<DropdownMenu.Content
			class="shadow-popover w-[229px] rounded-md border-2 border-gray-800 bg-black px-1 py-1.5 outline-hidden focus-visible:outline-hidden"
			sideOffset={10}
		>
			<DropdownMenu.Item
				class="flex h-10   items-center rounded-md py-3 pr-1.5 pl-3 text-sm font-medium ring-0! ring-transparent! select-none hover:bg-primary focus-visible:outline-none"
				onSelect={() => handleAction('rename')}
			>
				<div class="flex items-center">
					<Edit class="mr-2 size-5" />
					Rename
				</div>
			</DropdownMenu.Item>
			<DropdownMenu.Item
				class="data-highlighted:bg-muted flex  h-10 items-center rounded-md py-3 pr-1.5 pl-3 text-sm font-medium ring-0! ring-transparent! select-none hover:bg-red-300 focus-visible:outline-none"
				onSelect={() => handleAction('delete')}
			>
				<div class="flex items-center text-red-500">
					<CloseIcon class="mr-2 size-5 stroke-red-500" />
					Delete
				</div>
			</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Portal>
</DropdownMenu.Root>
