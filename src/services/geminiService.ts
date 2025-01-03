import {GenerativeModel, GoogleGenerativeAI} from '@google/generative-ai';
import AppEventEmitter from './eventEmitter';
import fs from 'fs';

class GeminiService {
  private static instance: GeminiService;
  private eventEmitter: AppEventEmitter;
  private model: GenerativeModel | null = null;

  private constructor() {
    this.eventEmitter = AppEventEmitter.getInstance();
    this.initializeEventListeners();
    this.initializeModel();
  }

  public static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
    }

    return GeminiService.instance;
  }

  private async initializeModel() {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error('API_KEY is missing in environment variables.');
      return;
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    this.model = genAI.getGenerativeModel({model: 'gemini-1.5-flash'});
  }

  private initializeEventListeners() {
    this.eventEmitter.on('post:created', this.handlePostCreated.bind(this));
  }

  private fileToGenerativePart(path: string, mimeType: string) {
    return {
      inlineData: {
        data: Buffer.from(fs.readFileSync(path)).toString('base64'),
        mimeType,
      },
    };
  }

  // TODO: Json'a cevirirken bir hata olusursa diye bir hata tablosu olustur ve postId ile gelen response'un text halini tut tabloda.
  private async handlePostCreated(data: {
    postId: string;
    userId: string;
    files: {
      path: string;
      mimeType: string;
    }[];
  }) {
    if (!this.model) {
      console.error(
        'Model not initialized, cannot proceed with categorizing images.'
      );
      return;
    }
    try {
      const prompt = `Categorize the given images and return the response in specified json format. The json format must be: 
        {
          id: number;
          categories: string[]
        }[]
      `;

      const imageParts = data.files.map(item =>
        this.fileToGenerativePart(item.path, item.mimeType)
      );
      const result = await this.model.generateContent([prompt, ...imageParts]);
      const response = await result.response;
      const text = response.text();
      const cleanedText = text.replace(/`{1,3}json?\s*/g, '').replace(/`{1,3}/g, '').trim();
      const jsonResponse = JSON.parse(cleanedText);
      this.eventEmitter.emit("post:categories:analyzed", {
        postId: data.postId,
        categories: jsonResponse
      })
      console.log(jsonResponse);
    } catch (err) {
      console.log('An error occurred while creating categories.', err);
    }
  }
}

export default GeminiService;
