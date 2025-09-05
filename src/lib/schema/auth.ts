import z from 'zod';

export const loginSchema = z.object({
	email: z.email().trim().min(1, 'Email is required'),
	password: z
		.string()
		.min(1, 'Password is required')
		.min(8, 'Password must be 12 characters')
		.max(50, 'password maximum characters exists')
		.trim()
});

export const register = z
	.object({
		name: z.string().min(1, 'Name is required').max(40, 'Name is too long'),
		email: z.email().trim().min(1, 'Email is required'),
		password: z
			.string()
			.min(1, 'Password is required')
			.min(8, { message: 'Password must be at least 12 characters' })
			.max(50, { message: 'Maximum characters exceeded' })
			.trim()
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s])[A-Za-z\d^$*.\[\]{}()?\-\"!@#%&\/\\,><':;|_~`+=\s]+$/,
				{
					message: 'Password must include a number, uppercase, lowercase and special characters'
				}
			),
		passwordConfirm: z
			.string()
			.min(1, 'Password is required')
			.min(8, { message: 'Password must be at least 12 characters' })
			.max(50, { message: 'Maximum characters exceeded' })
			.trim()
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s])[A-Za-z\d^$*.\[\]{}()?\-\"!@#%&\/\\,><':;|_~`+=\s]+$/,
				{
					message: 'Password must include a number, uppercase, lowercase and special characters'
				}
			)
	})
	.refine((data) => data.password === data.passwordConfirm, {
		message: "Password don't match",
		path: ['confirmPassword']
	});
