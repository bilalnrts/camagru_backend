import AppEventEmitter from './eventEmitter';

class NotificationService {
  private static instance: NotificationService;
  private eventEmitter: AppEventEmitter;

  private constructor() {
    this.eventEmitter = AppEventEmitter.getInstance();
    this.initializeEventListeners();
  }

  public static getInstance(): NotificationService {
    if (!this.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private initializeEventListeners() {
    this.eventEmitter.on('like:created', this.handleLikeCreated.bind(this));
    this.eventEmitter.on(
      'comment:created',
      this.handleCommentCreated.bind(this)
    );
  }

  private handleLikeCreated(data: {
    likeId: string;
    userId: string;
    postId: string;
    commentId: string;
  }) {
    console.log(
      `created: post:${data.postId} comment:${data.commentId} user:${data.userId}`
    );
  }

  private handleCommentCreated(data: {
    commentId: string;
    userId: string;
    postId: string;
    parentComment: string;
    content: string;
  }) {
    console.log('Comment created: ', data);
  }
}

export default NotificationService;
