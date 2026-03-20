import { json } from '@sveltejs/kit';

export async function POST({ locals, request }) {
	// Must be authenticated
	if (!locals.pb.authStore.isValid) {
		return json({ success: false, message: 'Unauthorized' }, { status: 401 });
	}

	const userId = locals.pb.authStore.record!.id;

	try {
		const data = await request.json();

		if (!data.id || !data.name || typeof data.name !== 'string' || !data.name.trim()) {
			return json({ success: false, message: 'Missing id or name' }, { status: 400 });
		}

		// Ownership check: only allow renaming your own records
		let record;
		try {
			record = await locals.pb
				.collection('short_links')
				.getFirstListItem(`id="${data.id}" && user="${userId}"`);
		} catch {
			return json({ success: false, message: 'Not found or not yours' }, { status: 403 });
		}

		// Update originalName (the display name) — storedName is the PocketBase filename and cannot be changed after upload
		const imageDetails = record.imageDetails;
		const updateRecord = await locals.pb.collection('short_links').update(data.id, {
			imageDetails: {
				...imageDetails,
				originalName: data.name.trim()
			}
		});
		return json({
			success: true,
			record: updateRecord
		});
	} catch (e) {
		return json({
			error: e,
			success: false
		});
	}
}
