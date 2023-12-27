import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Cart } from "./Cart";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true, array: true, type: "text" })
  category: string[];

  @Column({ nullable: true })
  rating: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price: number;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  stockQuantity: number;

  @OneToMany(() => Cart, (cart) => cart.product)
  carts: Cart[];
}
