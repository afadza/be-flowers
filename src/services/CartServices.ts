import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Request, Response } from "express";
import { Cart } from "../entity/Cart";
import { Product } from "../entity/Product";

export default new (class CartServices {
  private readonly cartRepository: Repository<Cart> =
    AppDataSource.getRepository(Cart);

  private readonly productRepository: Repository<Product> =
    AppDataSource.getRepository(Product);

  async find(req: Request, res: Response) {
    try {
      const carts = await this.cartRepository.find({
        relations: ["customer", "product"],
        order: { updatedAt: "DESC" },
      });
      return res.status(200).json(carts);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async create(req: Request, res: Response) {
    try {
      const customerId = res.locals.loginSession;
      const productId = Number(req.body.productId);
      const quantity = Number(req.body.quantity);
      const product = await this.productRepository.findOne({
        where: { id: productId },
      });

      if (!product) {
        return res.status(404).json({ error: "Produk tidak ditemukan" });
      }

      const total_price = quantity * product.price;

      const cart = new Cart();
      cart.customer = customerId.customer.id;
      cart.product = product;
      cart.quantity = quantity;
      cart.totalPrice = total_price;

      await this.cartRepository.save(cart);
      return res.status(200).json({
        message: "Keranjang berhasil dibuat",
        cart: cart,
      });
    } catch (error) {
      return res.status(500).json({
        error: error,
        message: "Terjadi kesalahan saat membuat keranjang",
      });
    }
  }

  async delivered(req: Request, res: Response) {
    try {
      const cartIds: number[] = req.body.cartIds;

      const cartsToDeliver: Cart[] = await this.cartRepository.findByIds(
        cartIds
      );

      if (cartsToDeliver.length === 0) {
        return res.status(404).json({
          message: "Keranjang tidak ditemukan",
        });
      }

      cartsToDeliver.forEach((cart) => {
        cart.delivered = true;
      });
      
      await this.cartRepository.save(cartsToDeliver);

      return res.status(200).json({
        message: "Pesanan berhasil dikirim",
        carts: cartsToDeliver,
      });
    } catch (error) {
      return res.status(500).json({
        error: error,
        message: "Terjadi kesalahan saat melakukan checkout",
      });
    }
  }
  async checkout(req: Request, res: Response) {
    try {
      const cartIds: number[] = req.body.cartIds;

      const cartsToCheckout: Cart[] = await this.cartRepository.findByIds(
        cartIds
      );

      if (cartsToCheckout.length === 0) {
        return res.status(404).json({
          message: "Keranjang tidak ditemukan",
        });
      }

      cartsToCheckout.forEach((cart) => {
        cart.checkout = true;
      });
      
      await this.cartRepository.save(cartsToCheckout);

      return res.status(200).json({
        message: "Keranjang berhasil checkout",
        carts: cartsToCheckout,
      });
    } catch (error) {
      return res.status(500).json({
        error: error,
        message: "Terjadi kesalahan saat melakukan checkout",
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const cartIds: number[] = req.body.cartIds;

      const cartsToDelete: Cart[] = await this.cartRepository.findByIds(
        cartIds
      );

      if (cartsToDelete.length === 0) {
        return res.status(404).json({
          message: "Keranjang tidak ditemukan",
        });
      }

      await this.cartRepository.remove(cartsToDelete);

      return res.status(200).json({
        message: "Keranjang berhasil dihapus",
        carts: cartsToDelete,
      });
    } catch (error) {
      return res.status(500).json({
        error: error,
        message: "Terjadi kesalahan saat menghapus keranjang",
      });
    }
  }

})();
