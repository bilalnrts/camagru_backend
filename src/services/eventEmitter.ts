import {EventEmitter} from 'events';

class AppEventEmitter {
  private static instance: AppEventEmitter;
  private emitter: EventEmitter;

  private constructor() {
    this.emitter = new EventEmitter();
  }

  public static getInstance(): AppEventEmitter {
    if (!AppEventEmitter.instance) {
      AppEventEmitter.instance = new AppEventEmitter();
    }
    return AppEventEmitter.instance;
  }

  public emit(event: string, data: any) {
    this.emitter.emit(event, data);
  }

  public on(event: string, listener: (...args: any[]) => void) {
    this.emitter.on(event, listener);
  }
}

export default AppEventEmitter;
