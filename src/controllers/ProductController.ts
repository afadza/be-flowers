import { Request, Response } from "express";
import ProductServices from "../services/ProductServices";

export default new (class ProductController {
  find(req: Request, res: Response) {
    ProductServices.find(req, res);
  }

  create(req: Request, res: Response) {
    ProductServices.create(req, res);
  }

  findOne(req: Request, res: Response) {
    ProductServices.findOne(req, res);
  }

  update(req: Request, res: Response) {
    ProductServices.update(req, res);
  }
})();
