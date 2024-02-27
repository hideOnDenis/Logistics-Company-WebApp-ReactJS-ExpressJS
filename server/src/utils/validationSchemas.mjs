export const createUserValidationSchema = {
    email: {
        isLength: {
            options: {
                min: 3,
                max: 32,
            },
            errorMessage:
                "Email must be at least 3 characters with a max of 32 characters",
        },
        notEmpty: {
            errorMessage: "Email field cannot be empty",
        },
        isString: {
            errorMessage: "Email must be a string!",
        },
    },
    password: {
        notEmpty: true,
    },
};