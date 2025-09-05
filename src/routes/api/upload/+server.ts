import { json } from '@sveltejs/kit';
import PocketBase from 'pocketbase';

export async function POST({ request, locals }) {
	try {
		const formData = await request.formData();
		const files = formData.getAll('documents'); // Access all files uploaded under 'documents'

		if (files.length > 0) {
			const fileList = files.filter((file) => file instanceof File).map((file) => file as File);
			console.log(fileList);
			// Ensure files are correctly attached in the correct format
			const createdRecord = await locals.pb.collection('example').create({
				title: 'Uploaded Files',
				documents: fileList // Attach files to the 'documents' field (no additional array wrapping)
			});

			return json({
				success: true,
				message: 'File(s) uploaded successfully',
				record: createdRecord
			});
		} else {
			return json({ success: false, message: 'No files found' }, { status: 400 });
		}
	} catch (error) {
		console.error('Upload error:', error);
		return json({ success: false, message: 'Upload failed' }, { status: 500 });
	}
}
