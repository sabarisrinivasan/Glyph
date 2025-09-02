import { redirect, fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from '../register/$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.pb.authStore.isValid) {
		throw redirect(303, '/');
	}
};

export const actions: Actions = {
	login: async ({ locals, request }) => {
		const formData = await request.formData();
		const email = String(formData.get('email') || '');
		const password = String(formData.get('password') || '');

		if (!email || !password) {
			return fail(400, { message: 'Email and password are required' });
		}

		try {
			// authenticate with PocketBase
			await locals.pb.collection('users').authWithPassword(email, password);
		} catch (err) {
			console.error('Login failed:', err);
			return fail(400, { message: 'Invalid credentials' });
		}
		throw redirect(303, '/');
	}
};
