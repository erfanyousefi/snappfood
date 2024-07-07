import {Column, Entity, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {SupplierEntity} from "./supplier.entity";
import {EntityNames} from "src/common/enum/entity-name.enum";

@Entity(EntityNames.SupplierOtp)
export class SupplierOtpEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column()
  code: string;
  @Column()
  expires_in: Date;
  @Column()
  supplierId: number;
  @OneToOne(() => SupplierEntity, (supplier) => supplier.otp, {
    onDelete: "CASCADE",
  })
  supplier: SupplierEntity;
}
