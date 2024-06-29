import {Injectable} from "@nestjs/common";
import {S3} from "aws-sdk";

@Injectable()
export class S3Service {
  private readonly s3: S3;
  constructor() {
    this.s3 = new S3({
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_KEY,
      },
      endpoint: process.env.S3_ENDPOINT,
      region: "default",
    });
  }
  async uploadFile(file: any, folderName: string){
    
  }
}
