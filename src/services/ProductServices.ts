import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Request, Response } from "express";
import { Product } from "../entity/Product";
const cloudinary = require("cloudinary").v2;

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
      const data = {
        name: req.body.name,
        price: parseInt(req.body.price),
        image: req.file ? req.file.path : null,
        description: req.body.description,
        category: req.body.category,
        rating: parseInt(req.body.rating),
        stockQuantity: parseInt(req.body.stockQuantity),
      };

      cloudinary.config({
        cloud_name: "dsus7hrnk",
        api_key: "758959438735139",
        api_secret: "WCLAlQ8H7kIIDDLF_imQIDJHW_Q",
      });

      if (req.file && req.file.path) {
        const cloudinaryResponse = await cloudinary.uploader.upload(
          data.image,
          { folder: "threads" }
        );
        data.image = cloudinaryResponse.secure_url;
      }

      const product = this.productRepository.create(data);

      await this.productRepository.save(product);
      return res.status(200).json(product);
    } catch (error) {
      console.log(error);
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
