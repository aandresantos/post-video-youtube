import { Module } from "@nestjs/common";
import { YoutubeService } from "./youtube.service";
import { YoutubeController } from "./youtube.controller";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule, // Importe o ConfigModule aqui para que o ConfigService seja disponibilizado
  ],
  providers: [YoutubeService],
  controllers: [YoutubeController],
})
export class YoutubeModule {}
