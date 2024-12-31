import AppEventEmitter from './eventEmitter';

class FeedService {
  private static instance: FeedService;
  private eventEmitter: AppEventEmitter;

  private constructor() {
    this.eventEmitter = AppEventEmitter.getInstance();
    this.initializeEventListeners();
  }

  public static getInstance(): FeedService {
    if (!FeedService.instance) {
      FeedService.instance = new FeedService();
    }
    return FeedService.instance;
  }

  private initializeEventListeners() {
    this.eventEmitter.on('post:created', this.handlePostCreated.bind(this));
    this.eventEmitter.on('post:archived', this.handlePostArchived.bind(this));
  }

  private async handlePostCreated(data: {
    postId: string;
    userId: string;
  }): Promise<void> {
    console.log(`created: ${data.postId} ${data.userId}`);
  }

  private async handlePostArchived(data: {
    postId: string;
    userId: string;
  }): Promise<void> {
    console.log(`archived: ${data.postId} ${data.userId}`);
  }
}

export default FeedService;
