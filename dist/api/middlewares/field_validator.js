import { body, validationResult } from 'express-validator';
export class Validator {
    constructor() {
        this.signValidation = [
            body('name')
                .notEmpty()
                .withMessage('Name is required')
                .isLength({ min: 2 })
                .withMessage('Name must be at least 2 characters long'),
            body('email')
                .isEmail()
                .withMessage('Please provide a valid email'),
            body('password')
                .isLength({ min: 6 })
                .withMessage('Password must be at least 6 characters long'),
        ];
        this.validate = (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() }); // Respond with errors
                return;
            }
            next();
        };
    }
}
