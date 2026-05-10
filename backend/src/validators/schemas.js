const { z } = require('zod');

// 1. Auth Login Schema
const loginSchema = z.object({
    body: z.object({
        email: z.string().email('Invalid email address'),
        password: z.string().min(6, 'Password must be at least 6 characters long'),
        role: z.enum(['CUSTOMER', 'DESIGNER', 'TAILOR', 'VENDOR', 'ADMIN']).optional()
    })
});

// 2. Design Upload (Create) Schema
const createDesignSchema = z.object({
    body: z.object({
        title: z.string().min(3, 'Title is too short').optional(),
        name: z.string().min(3, 'Name is too short').optional(),
        description: z.string().optional(),
        price: z.preprocess((val) => Number(val), z.number().min(0, 'Price must be positive')),
        category: z.string().optional(),
        occasion: z.string().optional(),
        neck_type: z.union([z.string(), z.array(z.string())]).optional(),
        sleeve_type: z.union([z.string(), z.array(z.string())]).optional(),
        back_type: z.union([z.string(), z.array(z.string())]).optional(),
        work_type: z.string().optional(),
        fabric: z.union([z.string(), z.array(z.string())]).optional(),
        tags: z.array(z.any()).optional(),
        images: z.union([z.string(), z.array(z.string())]).optional(),
        image: z.union([z.string(), z.array(z.string())]).optional()
    }).refine(data => data.title || data.name, {
        message: "Design must have a name or title",
        path: ["name"]
    })
});

// 3. Order Placement Schema
const createOrderSchema = z.object({
    body: z.object({
        designId: z.string({ required_error: 'Design ID is required' }),
        config: z.object({
            neck_tweak: z.string().optional(),
            sleeve_length: z.string().optional(),
            lining: z.string().optional()
        }).optional(),
        measurements: z.object({
            bust: z.number().optional(),
            waist: z.number().optional(),
            armhole: z.number().optional(),
            shoulder: z.number().optional()
        }).optional(),
        total_amount: z.number().positive('Total amount must be positive')
    })
});

// 4. Tailor Update Schema
const tailorUpdateSchema = z.object({
    body: z.object({
        status: z.enum(['STITCHING_STARTED', 'IN_PROGRESS', 'QUALITY_CHECK', 'COMPLETED', 'SHIPPED']),
        notes: z.string().optional()
    })
});

const submitOrderSchema = z.object({
    body: z.object({
        orderDetails: z.any(),
        customerName: z.string().min(1, 'Customer name is required')
    })
});

const uploadSchema = z.object({
    body: z.object({
        folder: z.enum(['designs', 'fabrics', 'profiles']).optional()
    })
});

module.exports = {
    loginSchema,
    createDesignSchema,
    createOrderSchema,
    tailorUpdateSchema,
    submitOrderSchema,
    uploadSchema
};
