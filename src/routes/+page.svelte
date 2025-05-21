<script lang="ts">
	import { UserType } from '@prisma/client';
	import { PanelRight } from 'lucide-svelte';

	export let data;

	const chats = data.chats;

	let sidebarOpen = true;

	let currentChat = chats[0];
</script>

<main class="flex h-screen">
	<div class="w-64 bg-gray-200 flex flex-col {sidebarOpen ? '' : 'hidden'} ">
		{#each chats as chat}
			<h2 class="border border-pink-500 rounded-md bg-gray-400 m-1 p-1 text-xl">{chat.title}</h2>
		{/each}
	</div>
	<div class="flex-1 bg-blue-200">
		<button
			on:click={() => {
				sidebarOpen = !sidebarOpen;
			}}
			class="p-4 bg-blue-500 rounded-r-xl mt-2"><PanelRight /></button
		>
		<div class="flex-1 overflow-y-auto space-y-4">
			{#each currentChat.messages as message}
				<div class="flex {message.userType == 'human' ? 'justify-end' : 'justify-start'}">
					<div
						class="border border-pink-500 text-2xl m-2 rounded-xl p-2 {message.userType == 'human'
							? 'bg-blue-500'
							: 'bg-gray-400'}"
					>
						{message.content}
					</div>
				</div>
			{/each}
		</div>
	</div>
</main>
