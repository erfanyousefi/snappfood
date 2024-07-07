import {FileInterceptor} from "@nestjs/platform-express";
import {memoryStorage} from "multer";

export function UploadFileS3(filedName: string) {
  return class UploadUtility extends FileInterceptor(filedName, {
    storage: memoryStorage(),
  }) {};
}
