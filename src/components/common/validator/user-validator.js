import Yup from 'yup';

const equalTo = (ref, msg) => Yup.mixed().test({
    name: 'equalTo',
    message: msg || '${path} must be the same as ${reference}',
    params: {
        reference: ref.path,
    },
    test(value) {
        return value === this.resolve(ref);
    },
});

Yup.addMethod(Yup.string, 'equalTo', equalTo);

export const usernameValidator = () => Yup.string()
    .required('Username is required.')
    .min(6, 'Username must have at least ${min} characters.')
    .max(12, 'Username must have up to ${max} characters.');

export const emailValidator = () => Yup.string()
    .email('Invalid email address.')
    .required('Email is required.');

export const passwordValidator = () => Yup.string()
    .required('Password is required.')
    .min(6, 'Password must have at least ${min} characters.')
    .max(12, 'Password must have up to ${max} characters.');

export const passwordConfirmationValidator = passwordRef => Yup.string()
    .equalTo(passwordRef, 'Passwords must match.');

