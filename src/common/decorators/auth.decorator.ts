import {UseGuards, applyDecorators} from "@nestjs/common";
import {ApiBearerAuth} from "@nestjs/swagger";
import {AuthGuard} from "src/modules/auth/guards/auth.guard";
import {SupplierAuthGuard} from "src/modules/supplier/guards/supplier-auth.guard";

export function UserAuth() {
  return applyDecorators(ApiBearerAuth("Authorization"), UseGuards(AuthGuard));
}
export function SupplierAuth() {
  return applyDecorators(
    ApiBearerAuth("Authorization"),
    UseGuards(SupplierAuthGuard)
  );
}
