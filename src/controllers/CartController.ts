import { Request, Response } from "express";
import CartServices from "../services/CartServices";

export default new (class CartController {
  find(req: Request, res: Response) {
    CartServices.find(req, res);
  }

  create(req: Request, res: Response) {
    CartServices.create(req, res);
  }

  checkout(req: Request, res: Response) {
    CartServices.checkout(req, res);
  }
  deliver(req: Request, res: Response) {
    CartServices.delivered(req, res);
  }

  delete(req: Request, res: Response) {
    CartServices.delete(req, res);
  }
})();
