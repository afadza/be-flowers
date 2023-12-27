import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Request, Response } from "express";
import { Product } from "../entity/Product";

export default new (class ProductServices {
  private readonly productRepository: Repository<Product> =
    AppDataSource.getRepository(Product);

  async find(req: Request, res: Response) {
    try {
      const products = await this.productRepository.find();
      return res.status(200).json(products);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async create(req: Request, res: Response) {
    try {
      const product = this.productRepository.create(req.body);

      await this.productRepository.save(product);
      return res.status(200).json(product);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async findOne(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const product = await this.productRepository.findOne({
        where: { id: id },
      });
      return res.status(200).json(product);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const product = await this.productRepository.findOne({
        where: { id: id },
      });
      if (product) {
        this.productRepository.merge(product, req.body);
        await this.productRepository.save(product);
        return res.status(200).json(product);
      } else {
        return res.status(404).json({
          message: "Product not found",
        });
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  }
})();
