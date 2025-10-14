import type { ImageUrlCollection } from '../../app';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	const pb = locals.pb;
	if (!pb?.authStore?.isValid) throw redirect(303, '/login');

	const userId = pb.authStore.record!.id;

	const images = (await pb.collection('short_links').getFullList({
		filter: `user = "${userId}"`,
		sort: '-created'
	})) as ImageUrlCollection[];

	return { images };
};
