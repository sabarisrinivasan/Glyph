import { json } from '@sveltejs/kit';

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp']);
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_FILES = 20;

function getFileName(documents: unknown): string[] {
	if (!documents) return [];
	if (Array.isArray(documents)) return documents as string[];
	return [documents as string];
}

export async function POST({ request, locals }) {
	// Must be authenticated
	if (!locals.pb.authStore.isValid) {
		return json({ success: false, message: 'Unauthorized' }, { status: 401 });
	}

	try {
		const formData = await request.formData();

		// All files uploaded under 'documents'
		const files = formData.getAll('documents').filter((f) => f instanceof File) as File[];
		if (files.length === 0) {
			return json({ success: false, message: 'No files found' }, { status: 400 });
		}

		if (files.length > MAX_FILES) {
			return json({ success: false, message: `Max ${MAX_FILES} files per upload` }, { status: 400 });
		}

		// Server-side type and size validation
		for (const file of files) {
			if (!ALLOWED_TYPES.has(file.type)) {
				return json(
					{ success: false, message: `File type not allowed: ${file.type}. Use JPEG, PNG, GIF or WebP.` },
					{ status: 400 }
				);
			}
			if (file.size > MAX_FILE_SIZE) {
				return json(
					{ success: false, message: `File too large: ${file.name}. Max size is 10 MB.` },
					{ status: 400 }
				);
			}
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
				createdAt: fileData?.lastModified,
				favorite: false,
				url: locals.pb.files.getURL(record, storedName)
			};
		});

		// Persist metadata back to the same record
		const updated = await locals.pb.collection('images').update(record.id, {
			documents_meta: meta,
			user: locals.pb.authStore.record!.id
		});

		// Prepare short links: use the PocketBase record id as the slug
		const links: Array<{ filename: string; url: string; short: string }> = [];
		for (const m of meta) {
			const longUrl = locals.pb.files.getURL(updated, m.storedName);

			// send real JSON to a JSON field; no JSON.stringify needed
			const created = await locals.pb.collection('short_links').create(
				{
					target: longUrl,
					imageDetails: m,
					user: locals.pb.authStore.record!.id
				},
				{ $autoCancel: false }
			);

			const slug = created.id;
			await locals.pb
				.collection('short_links')
				.update(created.id, { slug }, { $autoCancel: false });

			links.push({
				filename: m.storedName,
				url: longUrl,
				short: slug
			});
		}

		return json({
			success: true,
			recordId: updated.id,
			files: meta,
			links
		});
	} catch (error) {
		console.log(error, 'error');
		return json({ success: false, message: 'Upload failed' }, { status: 500 });
	}
}
