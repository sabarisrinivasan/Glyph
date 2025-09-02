import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	if (locals.pb.authStore.record) {
		return locals.pb.authStore.record;
	}
};
