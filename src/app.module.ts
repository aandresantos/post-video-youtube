import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { YoutubeModule } from "./youtube/youtube.module";
import configuration from "./config/configuration";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    YoutubeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
