import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import {isJWT} from "class-validator";
import {Request} from "express";
import {SupplierService} from "../supplier.service";
import {SKIP_AUTH} from "src/common/decorators/skip-auth.decorator";
import {Reflector} from "@nestjs/core";

@Injectable()
export class SupplierAuthGuard implements CanActivate {
  constructor(
    private supplierService: SupplierService,
    private reflector: Reflector
  ) {}
  async canActivate(context: ExecutionContext) {
    const isSkippedAuth = this.reflector.get<boolean>(
      SKIP_AUTH,
      context.getHandler()
    );
    if (isSkippedAuth) return true;
    const httpContext = context.switchToHttp();
    const request: Request = httpContext.getRequest<Request>();
    const token = this.extractToken(request);
    request.user = await this.supplierService.validateAccessToken(token);
    return true;
  }
  protected extractToken(request: Request) {
    const {authorization} = request.headers;
    if (!authorization || authorization?.trim() == "") {
      throw new UnauthorizedException("Login on your account");
    }
    const [bearer, token] = authorization?.split(" ");
    if (bearer?.toLowerCase() !== "bearer" || !token || !isJWT(token))
      throw new UnauthorizedException("Login on your account");
    return token;
  }
}
