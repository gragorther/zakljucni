import db from '$lib/db';
import { json } from '@sveltejs/kit';

import OpenAI from 'openai';

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY
});

export async function POST({ request }) {
	const data = await request.json();

	let chat;
	let chatID = data.chatID;
	const message = data.message;

	if (chatID === null) {
		chat = await db.chat.create({
			data: {
				title: 'New chat',
				messages: {}
			}
		});
		chatID = chat.id;
	}
	chat = await db.chat.update({
		where: {
			id: chatID
		},
		data: {
			messages: {
				create: {
					content: message,
					userType: 'human'
				}
			}
		}
	});

	const AIResponse = `Tvoje sporočilo je: ${message}`;
	await db.message.create({
		data: {
			chatId: chatID,
			content: AIResponse,
			userType: 'assistant'
		}
	});

	return json({
		response: AIResponse,
		chatId: chatID
	});
}
