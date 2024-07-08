import {FileFieldsInterceptor, FileInterceptor} from "@nestjs/platform-express";
import {MulterField} from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import {memoryStorage} from "multer";

export function UploadFileS3(filedName: string) {
  return class UploadUtility extends FileInterceptor(filedName, {
    storage: memoryStorage(),
  }) {};
}

export function UploadFileFieldsS3(uploadFields: MulterField[]) {
  return class UploadUtility extends FileFieldsInterceptor(uploadFields, {
    storage: memoryStorage(),
  }) {};
}
