import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Customer } from "./Customer";
import { Product } from "./Product";

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Customer, (customer) => customer.carts)
  customer: Customer;

  @ManyToOne(() => Product, (product) => product.carts)
  product: Product;

  @Column({ default: false })
  checkout: boolean;

  @Column({ default: false })
  delivered: boolean;

  @Column({ default: false })
  received: boolean;

  @Column()
  quantity: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  totalPrice: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;
}
