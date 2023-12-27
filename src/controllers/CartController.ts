import { Request, Response } from "express";
import CartServices from "../services/CartServices";

export default new (class CartController {
  find(req: Request, res: Response) {
    CartServices.find(req, res);
  }

  create(req: Request, res: Response) {
    CartServices.create(req, res);
  }

  delete(req: Request, res: Response) {
    CartServices.delete(req, res);
  }
})();
