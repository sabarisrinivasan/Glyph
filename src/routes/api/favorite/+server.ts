import { json } from '@sveltejs/kit';

export async function POST({ locals, request }) {
	try {
		const data = await request.json();
		const record = await locals.pb.collection('short_links').getOne(data.id);
		const prev = Boolean(record?.imageDetails?.favorite);
		const imageDetails = record.imageDetails;
		const updateRecord = await locals.pb.collection('short_links').update(data.id, {
			imageDetails: {
				...imageDetails,
				favorite: !prev
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
