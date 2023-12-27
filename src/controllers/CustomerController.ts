import { Request, Response } from "express";
import CustomerServices from "../services/CustomerServices";

export default new (class CustomerController {
  find(req: Request, res: Response) {
    CustomerServices.find(req, res);
  }

  create(req: Request, res: Response) {
    CustomerServices.create(req, res);
  }

  update(req: Request, res: Response) {
    CustomerServices.update(req, res);
  }

  login(req: Request, res: Response) {
    CustomerServices.login(req, res);
  }

  checkLogin(req: Request, res: Response) {
    CustomerServices.checkLogin(req, res);
  }
})();
