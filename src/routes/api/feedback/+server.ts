import { json } from '@sveltejs/kit';

type ApiResponse = {
	emoji: string;
	description: string;
};
export const POST = async ({ request, locals }) => {
	try {
		const data = (await request.json()) as ApiResponse;
		const record = await locals.pb.collection('feedback').create({
			title: 'feedback',
			description: data.description,
			reactions: data.emoji
		});

		return json({
			success: true,
			message: 'feedback is successfully sent'
		});
	} catch (error) {
		return json({ success: false, message: 'Upload failed' }, { status: 500 });
	}
};
