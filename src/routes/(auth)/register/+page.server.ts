// +page.server.ts
import { redirect, type Actions, fail, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { register } from '$lib/schema/auth';
import z from 'zod';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.pb.authStore.isValid) {
		throw redirect(303, '/');
	}
};

export const actions: Actions = {
	register: async ({ locals, request }) => {
		const formData = await request.formData();
		const name = String(formData.get('name') || '');
		const email = String(formData.get('email') || '');
		const password = String(formData.get('password') || '');
		const passwordConfirm = String(formData.get('passwordConfirm') || '');

		const validated = register.safeParse({ name, email, password, passwordConfirm });
		if (!validated.success) {
			const errors = z.treeifyError(validated.error).properties;
			console.log(errors, 'error');
			return fail(400, {
				error: errors,
				data: { email: email, password: password, confirmPassword: passwordConfirm, name: name }
			});
		}
		try {
			// 1) create user in the auth collection
			const user = await locals.pb.collection('users').create({
				email,
				password,
				passwordConfirm
			});

			// 2) login as the new user (optional but common)
			const { record } = await locals.pb.collection('users').authWithPassword(email, password);

			// 3) If you have a profile collection, create it and link to user
			//    (Assuming profiles has a relation field 'user')
			//   await locals.pb.collection('profiles').create({ user: record.id });

			// 4) If you *must* update the user record itself:
			//   await locals.pb.collection('users').update(record.id, { profiles: 'profiles' });

			// 5) Optional: immediately log them out if you prefer forcing login flow
			locals.pb.authStore.clear();
		} catch (e) {
			console.error(e, error);
			return fail(400, { message: 'Registration failed' });
		}
		throw redirect(303, '/login');
	}
};
