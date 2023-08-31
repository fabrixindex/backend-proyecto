import { faker } from '@faker-js/faker';

export const mockingProducts = async () => {
    try {
        const products = [];
        for (let i = 0; i < 100; i++) {
            const product = {
                _id: faker.database.mongodbObjectId(),
                title: faker.commerce.productName(),
                description: faker.commerce.productDescription(),
                code: faker.string.alpha({ length: 8, alphaNumeric: true, casing: 'upper' }),
                price: faker.commerce.price(),
                status: faker.datatype.boolean(),
                stock: faker.number.int({ min: 0, max: 100 }),
                category: faker.commerce.department(),
            };
            products.push(product);
        }
        return products;
    } catch (error) {
        throw error;
    }
};