import fetch from 'node-fetch';

export interface BrowserStackConfig {
  enabled: boolean;
  username: string;
  accessKey: string;
  projectName: string;
}

export interface BrowserStackSession {
  id: string;
  name: string;
  status: 'passed' | 'failed';
  browser: string;
  duration: number;
  tags: string[];
  buildId: string; // Add buildId to interface
  build_id?: string; // Some APIs return build_id instead
}

interface BrowserStackBuild {
  id: string;
  name: string;
  status: string;
  project: string;
  buildId?: string;
  build_id?: string;
  browser?: string;
  duration?: number;
  automation_session?: {
    browser: string;
    duration: number;
    tags?: string[];
  };
}

export class BrowserStackService {
  private baseUrl = 'https://api.browserstack.com/automate';
  private auth: string;

  constructor(private config: BrowserStackConfig) {
    this.auth = Buffer.from(
      `${config.username}:${config.accessKey}`
    ).toString('base64');
  }

  async getSessions(): Promise<BrowserStackSession[]> {
    const response = await this.request<BrowserStackBuild[]>('GET', '/builds.json');
    return response
      .filter((build: BrowserStackBuild) => build.project === this.config.projectName)
      .map((build): BrowserStackSession => ({
        id: build.id,
        name: build.name,
        status: build.status === 'passed' ? 'passed' : 'failed',
        browser: build.browser || build.automation_session?.browser || 'unknown',
        duration: build.duration || build.automation_session?.duration || 0,
        tags: build.automation_session?.tags || [],
        buildId: build.buildId || build.build_id || build.id
      }));
  }

  async updateSession(sessionId: string, data: Partial<BrowserStackSession>): Promise<void> {
    await this.request('PUT', `/sessions/${sessionId}.json`, data);
  }

  async addTags(sessionId: string, tags: string[]): Promise<void> {
    await this.updateSession(sessionId, { tags });
  }

  private async request<T>(method: string, path: string, body?: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: {
        'Authorization': `Basic ${this.auth}`,
        'Content-Type': 'application/json'
      },
      body: body ? JSON.stringify(body) : undefined
    });

    if (!response.ok) {
      throw new Error(`BrowserStack API error: ${response.statusText}`);
    }

    return response.json();
  }
}
