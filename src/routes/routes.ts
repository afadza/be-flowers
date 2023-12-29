import * as express from "express";
import CustomerController from "../controllers/CustomerController";
import ProductController from "../controllers/ProductController";
import CartController from "../controllers/CartController";
import AuthenticationMiddlewares from "../middleware/Customer";
import { upload } from "../middleware/UploadFile";

const router = express.Router();

router.get("/customers", CustomerController.find);
router.post("/customer", CustomerController.create);
router.patch(
  "/customer",
  AuthenticationMiddlewares.Authentication,
  CustomerController.update
);
router.post("/customer/login", CustomerController.login);
router.get(
  "/customer/check",
  AuthenticationMiddlewares.Authentication,
  CustomerController.checkLogin
);

router.get("/products", ProductController.find);
router.post("/product", upload("image"), ProductController.create);
router.get("/product/:id", ProductController.findOne);
router.patch("/product/:id", ProductController.update);

router.get("/carts", CartController.find);
router.post(
  "/cart",
  AuthenticationMiddlewares.Authentication,
  CartController.create
);
router.delete("/cart", CartController.delete);

export default router;
