import { json } from '@sveltejs/kit';

type ShortLinkRecord = {
	id: string;
	slug?: string;
	target: string;
	imageDetails?: string;
	user: string;
};

function getFileName(documents: unknown): string[] {
	if (!documents) return [];
	if (Array.isArray(documents)) return documents as string[];
	return [documents as string];
}

export async function POST({ request, locals }) {
	try {
		const formData = await request.formData();

		// All files uploaded under 'documents'
		const files = formData.getAll('documents').filter((f) => f instanceof File) as File[];
		if (files.length === 0) {
			return json({ success: false, message: 'No files found' }, { status: 400 });
		}

		// Create the images record with the files
		const record = await locals.pb.collection('images').create({
			title: 'Uploaded Files',
			documents: files,
			user: locals.pb.authStore.record?.id
		});

		// PocketBase returns stored filenames
		const filenames: string[] = getFileName(record.documents);

		// Build per-file metadata
		const meta = filenames.map((storedName, idx) => {
			const fileData = files[idx];
			return {
				storedName,
				originalName: fileData?.name ?? storedName,
				size: fileData?.size ?? 0,
				type: fileData?.type ?? 'application/octet-stream',
				url: locals.pb.files.getURL(record, storedName)
			};
		});

		// Persist metadata back to the same record
		const updated = await locals.pb.collection('images').update(record.id, {
			documents_meta: meta,
			user: locals.pb.authStore.record?.id
		});

		// Prepare short links: use the PocketBase record id as the slug
		const links = await Promise.all(
			meta.map(async (m) => {
				const longUrl = locals.pb.files.getURL(updated, m.storedName);

				const created = await locals.pb.collection('short_links').create({
					target: longUrl,
					imageDetails: JSON.stringify(m),
					user: locals.pb.authStore.record?.id
				});

				const slug = created.id;
				await locals.pb.collection('short_links').update(created.id, { slug });

				return {
					filename: m.storedName,
					url: longUrl,
					short: slug
				};
			})
		);

		return json({
			success: true,
			recordId: updated.id,
			files: meta,
			links
		});
	} catch (error) {
		console.log(error);
		return json({ success: false, message: 'Upload failed' }, { status: 500 });
	}
}
