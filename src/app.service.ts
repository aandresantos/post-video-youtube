import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  private oAuth2Client: any;

  constructor() {}

  status(): string {
    return "ok";
  }
}
