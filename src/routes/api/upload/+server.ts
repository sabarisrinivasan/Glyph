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

		const record = await locals.pb.collection('images').create({
			title: 'Uploaded Files',
			documents: files
		});

		const filenames: string[] = Array.isArray(record.documents)
			? record.documents
			: record.documents
				? [record.documents]
				: [];

		const getUrl = (name: string) => {
			return locals.pb.files.getURL(record, name);
		};

		const urls = filenames.map((name) => getUrl(name));
		const baseURL = 'http://localhost:5174';
		const results = [];
		for (const name of filenames) {
			const longUrl = getUrl(name); // e.g. https://files.xxx.co/api/files/example/<id>.
			let slug = genSlug(8);

			// try a couple times to avoid collision
			for (let i = 0; i < 5; i++) {
				try {
					await locals.pb.collection('short_links').create({ slug, target: longUrl });
					break;
				} catch (e) {
					slug = genSlug(8);
					if (i === 4) throw e;
				}
			}

			results.push({
				filename: name,
				url: longUrl,
				short: slug
			});
		}

		return json({ success: true, recordId: record.id, links: results });
	} catch (error) {
		console.error('Upload error:', error);
		return json({ success: false, message: 'Upload failed' }, { status: 500 });
	}
}
