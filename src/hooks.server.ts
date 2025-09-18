import PocketBase from 'pocketbase';
import { env } from '$env/dynamic/private';
import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

export const authentication: Handle = async ({ event, resolve }) => {
	event.locals.pb = new PocketBase(env.PB_URL);
	event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');
	try {
		event.locals.pb.authStore.isValid && (await event.locals.pb.collection('users').authRefresh());
	} catch (_) {
		event.locals.pb.authStore.clear();
	}
	const response = await resolve(event);
	response.headers.append('set-cookie', event.locals.pb.authStore.exportToCookie());
	return response;
};
const unprotectedPrefix = ['/login', '/register'];

export const authorization: Handle = async ({ event, resolve }) => {
	const isUnprotected =
		unprotectedPrefix.some((p) => event.url.pathname.startsWith(p)) || event.url.pathname === '/';
	console.log(event.locals.pb.authStore.isValid);
	if (!isUnprotected && !event.locals.pb.authStore.isValid) {
		throw redirect(303, '/login');
	}

	return resolve(event);
};

export const handle = sequence(authentication, authorization);
