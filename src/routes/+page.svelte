<script lang="ts">
	import { UserType } from '@prisma/client';
	import { PanelRight } from 'lucide-svelte';

	export let data;

	let chats = data.chats;

	let sidebarOpen = true;
	let messages = [];

	let newMessage = '';
	let loading = false;

	let currentChatID: number | null = null;

	function switchChat(newChatID: number) {
		const chat = chats.find((c) => c.id === newChatID);
		messages = chat.messages;

		currentChatID = newChatID;
	}

	async function handleSubmit() {
		loading = true;
		messages = [...messages, { content: newMessage, userType: 'human' }];

		const messageContent = newMessage;
		newMessage = '';

		const response = await fetch('/api/chat', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },

			body: JSON.stringify({ message: messageContent, chatID: currentChatID })
		});
		const data = await response.json();

		messages = [...messages, { content: data.response, userType: 'assistant' }];

		if (currentChatID !== data.chatId) {
			chats = [{ id: data.chatId, title: 'New Chat', messages: messages }, ...chats];
			currentChatID = data.chatId;
		} else {
			chats = chats.map((c) => {
				if (c.id === data.chatId) {
					return {
						...c,
						messages: messages
					};
				}
				return c;
			});
		}
		loading = false;
	}
</script>

<main class="flex h-screen">
	<div class="w-64 bg-gray-200 flex flex-col {sidebarOpen ? '' : 'hidden'} ">
		{#each chats as chat}
			<button
				on:click={() => switchChat(chat.id)}
				class="border border-pink-500 rounded-md m-1 p-1 text-xl {currentChatID == chat.id
					? 'bg-slate-300'
					: 'bg-slate-100'}"
				><h2>
					{chat.title}
				</h2></button
			>
		{/each}
	</div>
	<div class="flex-1 flex flex-col bg-blue-200">
		<button
			on:click={() => {
				sidebarOpen = !sidebarOpen;
			}}
			class="p-4 bg-blue-500 rounded-r-xl mt-2 w-fit"><PanelRight /></button
		>
		<div class="flex-1 overflow-y-auto space-y-4">
			{#each messages as message}
				<div class="flex {message.userType == 'human' ? 'justify-end' : 'justify-start'}">
					<div
						class="border border-pink-500 text-2xl m-2 rounded-xl p-2 break-all max-w-md {message.userType ==
						'human'
							? 'bg-blue-500'
							: 'bg-gray-400'}"
					>
						{message.content}
					</div>
				</div>
			{/each}
		</div>
		<form class="bg-slate-200 p-4 flex" on:submit={handleSubmit}>
			<input
				class="flex-1 border rounded-md"
				placeholder="write your message"
				bind:value={newMessage}
			/>
			<button type="submit" class="px-4 py-2 bg-blue-600 text-white" disabled={loading}
				>SUBMIT!</button
			>
		</form>
	</div>
</main>
