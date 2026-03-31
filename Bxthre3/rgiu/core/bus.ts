// RGIU Message Bus - File-based for simplicity
import type { MessageBus } from "./types.ts";

export class FileBus implements MessageBus {
  private listeners: Map<string, Array<(payload: unknown) => void>> = new Map();

  emit(channel: string, payload: unknown): void {
    // Write to event log
    const event = {
      channel,
      payload,
      timestamp: Date.now()
    };
    
    // Call listeners
    const handlers = this.listeners.get(channel);
    if (handlers) {
      handlers.forEach(h => h(payload));
    }

    // Also log to file for persistence
    const logPath = `./data/events/${channel}.jsonl`;
    const line = JSON.stringify(event) + "\n";
    Bun.write(logPath, line, { append: true });
  }

  on(channel: string, handler: (payload: unknown) => void): void {
    if (!this.listeners.has(channel)) {
      this.listeners.set(channel, []);
    }
    this.listeners.get(channel)!.push(handler);
  }
}
