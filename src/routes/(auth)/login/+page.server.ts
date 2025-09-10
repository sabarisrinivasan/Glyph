import { redirect, fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from '../register/$types';
import { loginSchema } from '$lib/schema/auth';
import z from 'zod';

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
		const validated = loginSchema.safeParse({ email, password });
		if (!validated.success) {
			const errors = z.treeifyError(validated.error).properties;
			console.log(errors, 'error');
			return fail(400, { error: errors, data: { email: email, password: password } });
		}
		try {
			await locals.pb.collection('users').authWithPassword(email, password);
		} catch (err) {
			return fail(400, {
				message: 'Invalid credentials',
				data: { email: email, password: password }
			});
		}
		throw redirect(303, '/');
	}
};
