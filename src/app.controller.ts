import { Controller, Get, Req, Res } from "@nestjs/common";
import { AppService } from "./app.service";
import { Request, Response } from "express";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/status")
  status(): string {
    return this.appService.status();
  }

  @Get("/callbackYoutube")
  cb(@Req() req: Request, @Res() res: Response) {
    console.log("caiu aqui");
  }
}
