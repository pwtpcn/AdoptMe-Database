import { cart } from "@prisma/client";
import db from "./Database";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

class CartRepository {
    public async getCartByUserId(user_id: string): Promise<cart[]> {
        return await db.cart.findMany({
            where: { user_id: user_id },
            include: {
                product: true
            }
        });
    }

    public async addToCart({
        user_id,
        product_id,
        quantity
    }: {
        user_id: string;
        product_id: number;
        quantity: number;
    }): Promise<cart> {
        try {
            // Check if item already exists in cart
            const existingItem = await db.cart.findUnique({
                where: {
                    user_id_product_id: {
                        user_id: user_id,
                        product_id: product_id
                    }
                }
            });

            if (existingItem) {
                // Update quantity if item exists
                return await db.cart.update({
                    where: {
                        user_id_product_id: {
                            user_id: user_id,
                            product_id: product_id
                        }
                    },
                    data: {
                        quantity: existingItem.quantity + quantity
                    }
                });
            }

            // Create new cart item if it doesn't exist
            return await db.cart.create({
                data: {
                    user_id: user_id,
                    product_id: product_id,
                    quantity: quantity
                }
            });
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                throw JSON.stringify({error: error.message});
            }
            throw JSON.stringify({error: "Internal Server Error"});
        }
    }

    public async updateCartItem({
        user_id,
        product_id,
        quantity
    }: {
        user_id: string;
        product_id: number;
        quantity: number;
    }): Promise<cart> {
        try {
            return await db.cart.update({
                where: {
                    user_id_product_id: {
                        user_id: user_id,
                        product_id: product_id
                    }
                },
                data: {
                    quantity: quantity
                }
            });
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                throw JSON.stringify({error: error.message});
            }
            throw JSON.stringify({error: "Internal Server Error"});
        }
    }

    public async removeFromCart({
        user_id,
        product_id
    }: {
        user_id: string;
        product_id: number;
    }): Promise<cart> {
        try {
            return await db.cart.delete({
                where: {
                    user_id_product_id: {
                        user_id: user_id,
                        product_id: product_id
                    }
                }
            });
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                throw JSON.stringify({error: error.message});
            }
            throw JSON.stringify({error: "Internal Server Error"});
        }
    }

    public async clearCart(user_id: string): Promise<{ count: number }> {
        try {
            return await db.cart.deleteMany({
                where: { user_id: user_id }
            });
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                throw JSON.stringify({error: error.message});
            }
            throw JSON.stringify({error: "Internal Server Error"});
        }
    }
}

export default CartRepository; 