import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	if (locals.pb.authStore.isValid) {
		return { record: locals.pb.authStore.record, userIsValid: locals.pb.authStore.isValid };
	}
};
