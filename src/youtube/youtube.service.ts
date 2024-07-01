// src/youtube/youtube.service.ts
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { google } from "googleapis";
import * as fs from "fs";
import * as readline from "readline";

@Injectable()
export class YoutubeService {
  private readonly logger = new Logger(YoutubeService.name);
  private oAuth2Client: any;
  private TOKEN_PATH = "token.json";

  constructor(private configService: ConfigService) {
    const clientId = this.configService.get<string>("clientId");
    const clientSecret = this.configService.get<string>("clientSecret");
    const redirectUri = this.configService.get<string>("redirectUri");

    this.oAuth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
    this.initializeClient();
  }

  private initializeClient() {
    fs.readFile(this.TOKEN_PATH, (err, token) => {
      if (err) return this.getAccessToken();
      this.oAuth2Client.setCredentials(JSON.parse(token.toString()));
    });
  }

  private getAccessToken() {
    const authUrl = this.oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: ["https://www.googleapis.com/auth/youtube.upload"],
    });
    this.logger.log(`Authorize this app by visiting this url: ${authUrl}`);

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question("Enter the code from that page here: ", (code) => {
      rl.close();
      this.oAuth2Client.getToken(code, (err, token) => {
        if (err) return this.logger.error("Error retrieving access token", err);
        this.oAuth2Client.setCredentials(token);
        fs.writeFile(this.TOKEN_PATH, JSON.stringify(token), (err) => {
          console.log(this.TOKEN_PATH);

          if (err) return this.logger.error(err);
          this.logger.log("Token stored to", this.TOKEN_PATH);
        });
      });
    });
  }

  public async uploadVideo(
    videoFilePath: string,
    title: string,
    description: string,
    tags: string[],
    categoryId: string,
  ) {
    const youtube = google.youtube({ version: "v3", auth: this.oAuth2Client });

    const videoDetails = {
      part: ["snippet", "status"],
      requestBody: {
        snippet: {
          title,
          description,
          tags,
          categoryId,
        },
        status: {
          privacyStatus: "public", // Pode ser 'public', 'private' ou 'unlisted'
        },
      },
      media: {
        body: fs.createReadStream(videoFilePath),
      },
    };

    youtube.videos.insert(videoDetails, (err, res) => {
      if (err) {
        this.logger.error("Erro ao fazer upload do vídeo:", err);
      } else {
        this.logger.log(`Upload concluído! Video ID: ${res.data.id}`);
      }
    });
  }
}
