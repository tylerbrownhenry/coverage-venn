export interface ComponentLog {
  id: string;
  timestamp: number;
  context: string;
}

export class LogTracker {
  private static logs: ComponentLog[] = [];

  static track(componentId: string) {
    this.logs.push({
      id: componentId,
      timestamp: Date.now(),
      context: this.getCurrentContext()
    });
  }

  private static getCurrentContext(): string {
    return process.env.TEST_CONTEXT || 'runtime';
  }
}
