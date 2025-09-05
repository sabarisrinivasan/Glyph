import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.pb.authStore.isValid) {
		throw redirect(303, '/login');
	}
};

export const actions: Actions = {
	upload: async ({ request, locals }) => {
		const formData = await request.formData();

		// Get the file(s) from formData
		const files = formData.getAll('files') as File[];

		if (files.length === 0) {
			return { error: 'No files selected' };
		}

		// Process each file
		for (const file of files) {
			// Handle the file (for example, store it or save it to disk)
			console.log('File received:', file);

			// Example: Save to disk or handle as necessary
			// const buffer = await file.arrayBuffer();
			// Save to a directory, or process buffer for upload.
		}

		return { success: true };
	}
};
