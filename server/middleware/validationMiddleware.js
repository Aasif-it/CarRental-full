import { body, validationResult } from 'express-validator';

export const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }
    next();
};

export const registerValidation = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    validateRequest
];

export const loginValidation = [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
    validateRequest
];

export const bookingValidation = [
    body('car').notEmpty().withMessage('Car ID is required'),
    body('pickupDate').isISO8601().withMessage('Invalid pickup date'),
    body('returnDate').isISO8601().withMessage('Invalid return date'),
    validateRequest
];

export const reviewValidation = [
    body('carId').notEmpty().withMessage('Car ID is required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').trim().notEmpty().withMessage('Comment is required'),
    validateRequest
];
