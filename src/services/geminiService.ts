import {GoogleGenerativeAI} from '@google/generative-ai';
import AppEventEmitter from './eventEmitter';
import fs from 'fs';

class GeminiService {
  private static instance: GeminiService;
  private eventEmitter: AppEventEmitter;
  private model: any; // Model nesnesini saklayacak

  private constructor() {
    this.eventEmitter = AppEventEmitter.getInstance();
    this.initializeEventListeners();
    this.initializeModel(); // Modelin başlatılmasını buraya taşıdık
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

    // Model oluşturulduktan sonra sistem mesajını gönderiyoruz.
    const categoryList = `["travel","food","fashion","beauty","fitness","lifestyle","art","photography","music","books","movies","gaming","diy","crafts","quotes","motivation","inspiration","nature","animals","architecture","technology","business","marketing","entrepreneurship","health","wellness","mindfulness","parenting","family","friendship","love","relationships","comedy","memes","events","celebrations","holidays","interiors","gardening","minimalism","vintage","streetstyle","outfits","makeup","hair","skincare","reviews","tutorials","behindthescenes"]`;

    const systemPrompt = `You are an expert image categorizer. Given an image, your task is to categorize it using predefined categories. You will receive an array of categories. You must only use the categories given. The categories are : ${categoryList}. Your responses MUST BE ONLY in the specified JSON array format. You will analyze an image and return a JSON array of objects, where each object represents an image and the categories assigned to it. The JSON format must be exactly like this example [ { id: 1, categories: ["travel", "food"] }, { id: 2, categories: ["nature", "animals", "lifestyle"] } ]. Do not add any text before or after the JSON format. Do not explain anything else about your response.`;

    try {
      const dummyResponse = await this.model.generateContent([systemPrompt]);
      await dummyResponse.response;
      console.log('System message initialized successfully.');
    } catch (err) {
      console.error(
        'An error occurred during system message initialization',
        err
      );
      this.model = null;
    }
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
      const prompt = `Categorize the given images and return the response in specified json format.`;

      const imageParts = data.files.map(item =>
        this.fileToGenerativePart(item.path, item.mimeType)
      );
      const result = await this.model.generateContent([prompt, ...imageParts]);
      const response = await result.response;
      console.log(response.text());
    } catch (err) {
      console.log('An error occurred while creating categories.', err);
    }
  }
}

export default GeminiService;
