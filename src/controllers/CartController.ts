import Elysia, { t } from "elysia";
import CartRepository from "../repositories/CartRepository";

const CartController = new Elysia({
    prefix: "/api/cart",
    tags: ["Cart"],
})

CartController.get(
    "/getCart/:user_id",
    async ({ params: { user_id } }) => {
        const cartRepository = new CartRepository();
        const cart = await cartRepository.getCartByUserId(user_id);
        return cart ?? { error: "Cart not found" };
    },
    {
        params: t.Object({
            user_id: t.String(),
        }),
        detail: {
            summary: "Get user's cart",
            description: "Get all items in user's cart",
        }
    }
)

CartController.post(
    "/addToCart",
    async ({ body: { user_id, product_id, quantity } }) => {
        const cartRepository = new CartRepository();
        const cartItem = await cartRepository.addToCart({
            user_id,
            product_id,
            quantity
        });
        return cartItem;
    },
    {
        body: t.Object({
            user_id: t.String(),
            product_id: t.Number(),
            quantity: t.Number(),
        }),
        detail: {
            summary: "Add item to cart",
            description: "Add a product to user's cart",
        }
    }
)

CartController.patch(
    "/updateCartItem",
    async ({ body: { user_id, product_id, quantity } }) => {
        const cartRepository = new CartRepository();
        const cartItem = await cartRepository.updateCartItem({
            user_id,
            product_id,
            quantity
        });
        return cartItem;
    },
    {
        body: t.Object({
            user_id: t.String(),
            product_id: t.Number(),
            quantity: t.Number(),
        }),
        detail: {
            summary: "Update cart item",
            description: "Update quantity of an item in cart",
        }
    }
)

CartController.delete(
    "/removeFromCart",
    async ({ body: { user_id, product_id } }) => {
        const cartRepository = new CartRepository();
        const cartItem = await cartRepository.removeFromCart({
            user_id,
            product_id
        });
        return cartItem;
    },
    {
        body: t.Object({
            user_id: t.String(),
            product_id: t.Number(),
        }),
        detail: {
            summary: "Remove item from cart",
            description: "Remove a product from user's cart",
        }
    }
)

CartController.delete(
    "/clearCart/:user_id",
    async ({ params: { user_id } }) => {
        const cartRepository = new CartRepository();
        const result = await cartRepository.clearCart(user_id);
        return result;
    },
    {
        params: t.Object({
            user_id: t.String(),
        }),
        detail: {
            summary: "Clear cart",
            description: "Remove all items from user's cart",
        }
    }
)

export default CartController; 