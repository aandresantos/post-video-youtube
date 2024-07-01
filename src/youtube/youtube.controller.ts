// src/youtube/youtube.controller.ts
import { Controller, Post, Body } from "@nestjs/common";
import { YoutubeService } from "./youtube.service";

@Controller("youtube")
export class YoutubeController {
  constructor(private readonly youtubeService: YoutubeService) {}

  @Post("upload")
  uploadVideo(
    @Body("videoFilePath") videoFilePath: string,
    @Body("title") title: string,
    @Body("description") description: string,
    @Body("tags") tags: string[],
    @Body("categoryId") categoryId: string,
  ) {
    console.log("bateu aq");

    this.youtubeService.uploadVideo(videoFilePath, title, description, tags, categoryId);
  }
}
