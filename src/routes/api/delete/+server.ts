import { json } from '@sveltejs/kit';

export async function POST({ locals, request }) {
	try {
		const data = await request.json();
		// Try to remove the file metadata from the images collection if possible.
		try {
			const shortRec = await locals.pb.collection('short_links').getOne(data.id);
			const imageDetails = shortRec?.imageDetails;
			if (imageDetails?.url && imageDetails?.storedName) {
				const urlStr: string = imageDetails.url;
				// Expecting a PocketBase files URL like: /api/files/<collectionName>/<recordId>/<filename>
				const apiIndex = urlStr.indexOf('/api/files/');
				if (apiIndex !== -1) {
					const parts = urlStr.substring(apiIndex + '/api/files/'.length).split('/');
					// parts[0] = collectionName, parts[1] = recordId
					const collectionName = parts[0];
					const recordId = parts[1];
					if (collectionName === 'images' && recordId) {
						// Fetch the images record and remove the storedName and its meta entry
						const imgRec = await locals.pb.collection('images').getOne(recordId);
						if (imgRec) {
							const documents: string[] = Array.isArray(imgRec.documents)
								? imgRec.documents.slice()
								: [];
							const docsMeta: any[] = Array.isArray(imgRec.documents_meta)
								? imgRec.documents_meta.slice()
								: [];
							const stored = imageDetails.storedName;
							// remove storedName from documents
							const newDocuments = documents.filter((d) => d !== stored);
							// remove meta entry
							const newMeta = docsMeta.filter((m) => m?.storedName !== stored);
							await locals.pb.collection('images').update(recordId, {
								documents: newDocuments,
								documents_meta: newMeta
							});
						}
					}
				}
			}
		} catch (err) {
			// Non-fatal: if anything goes wrong while cleaning up images collection,
			// continue to delete the short link. Logging for debugging.
			console.log('images cleanup failed', err);
		}

		// finally delete the short link record
		await locals.pb.collection('short_links').delete(data.id);
		return json({
			success: true
		});
	} catch (e) {
		return json({
			error: e,
			success: false
		});
	}
}
