import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Request, Response } from "express";
import { Customer } from "../entity/Customer";
import { Cart } from "../entity/Cart";
import * as jwt from "jsonwebtoken";

export default new (class CustomerServices {
  private readonly customerRepository: Repository<Customer> =
    AppDataSource.getRepository(Customer);

  private readonly cartRepository: Repository<Cart> =
    AppDataSource.getRepository(Cart);

  async find(req: Request, res: Response) {
    try {
      const customers = await this.customerRepository.find({
        relations: {
          carts: true,
        },
      });
      return res.status(200).json(customers);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;
  
      if (!email || !password || !name) { 
        return res.status(400).json({ message: "Please provide email, password, and name" });
      }
  
      const existingCustomer = await this.customerRepository.findOne({
        where: { email: email },
      });
  
      if (existingCustomer) {
        return res.status(400).json({ message: "Email already exists" });
      }
  
      const data = { name, email, password };
      const customer = this.customerRepository.create(data);
      await this.customerRepository.save(customer);
      return res.status(200).json(customer);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  

  async update(req: Request, res: Response) {
    try {
      const id = res.locals.loginSession.customer.id;
      const { email } = req.body;
  
      const customer = await this.customerRepository.findOne({
        where: { id: id },
      });
  
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
  
      if (email && email !== customer.email) {
        const existingCustomer = await this.customerRepository.findOne({
          where: { email: email },
        });
  
        if (existingCustomer) {
          return res.status(400).json({ message: "Email already exists" });
        }
      }
  
      this.customerRepository.merge(customer, req.body);
      await this.customerRepository.save(customer);
      
      return res.status(200).json({
        message: "Customer updated",
        customer: customer,
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const customer = await this.customerRepository.findOne({
        where: { email: email },
      });
      if (customer && customer.password === password) {
        const token = jwt.sign({ customer: customer }, "secret", {
          expiresIn: "30d",
        });
        return res
          .status(200)
          .json({ message: "you are login", customer: customer, token: token });
      } else {
        return res.status(404).json({
          message: "Customer not found",
        });
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async checkLogin(req: Request, res: Response) {
    try {
      const loginSession = res.locals.loginSession;
      const carts = await this.cartRepository.find({
        relations: ["customer", "product"],
      });
      const cartUser = carts.filter(
        (cart) => cart.customer.id === loginSession.customer.id
      );
      const customer = await this.customerRepository.findOne({
        where: {
          id: loginSession.customer.id,
        },
      });

      return res.status(200).json({
        message: "you are login",
        customer,
        cartUser,
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  }
})();
