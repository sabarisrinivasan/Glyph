import { json } from '@sveltejs/kit';

function genSlug(len = 8) {
	const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let s = '';
	for (let i = 0; i < len; i++) s += alphabet[Math.floor(Math.random() * alphabet.length)];
	return s;
}

export async function POST({ request, locals }) {
	try {
		const formData = await request.formData();

		// All files uploaded under 'documents'
		const files = formData.getAll('documents').filter((f) => f instanceof File) as File[];
		if (files.length === 0) {
			return json({ success: false, message: 'No files found' }, { status: 400 });
		}

		// Create the record with the files
		const record = await locals.pb.collection('images').create({
			title: 'Uploaded Files',
			documents: files
		});

		// PocketBase returns stored filenames (may differ from original names)
		const filenames: string[] = Array.isArray(record.documents)
			? record.documents
			: record.documents
				? [record.documents]
				: [];

		// Build per-file metadata (index mapping is preserved by PB)
		const meta = filenames.map((storedName, idx) => {
			const f = files[idx];
			return {
				storedName, // filename stored in PB
				originalName: f.name, // original client filename
				size: f.size, // bytes
				type: f.type, // MIME
				url: locals.pb.files.getURL(record, storedName)
			};
		});

		// Persist metadata back to the same record
		const updated = await locals.pb.collection('images').update(record.id, {
			documents_meta: meta
		});

		// Optional: create short links for each file
		const results = [];
		for (let i = 0; i < filenames.length; i++) {
			const name = filenames[i];
			const longUrl = locals.pb.files.getURL(updated, name);
			let slug = genSlug(8);

			for (let t = 0; t < 5; t++) {
				try {
					await locals.pb
						.collection('short_links')
						.create({ slug, target: longUrl, imageDetails: JSON.stringify(meta[i]) });
					break;
				} catch {
					slug = genSlug(8);
					if (t === 4) throw new Error('Failed to create short link after retries');
				}
			}

			results.push({
				filename: name,
				url: longUrl,
				short: slug
			});
		}

		return json({
			success: true,
			recordId: updated.id,
			files: meta,
			links: results
		});
	} catch (error) {
		console.error('Upload error:', error);
		return json({ success: false, message: 'Upload failed' }, { status: 500 });
	}
}
