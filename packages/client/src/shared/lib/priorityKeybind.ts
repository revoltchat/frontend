export type SchedulePriority =
  | 'user-blocking'
  | 'user-visible'
  | 'background';

type KeybindHandler = (e: KeyboardEvent) => void | Promise<void>;

const registeredHandlers = new Map<KeybindHandler, {
  priority: number;
  schedule: SchedulePriority;
  key: string;
}>();

export function registerKeybindWithPriority(key: string, handler: KeybindHandler, priority = 0, schedule: SchedulePriority = 'user-blocking') {
  registeredHandlers.set(handler, {
    priority,
    key,
    schedule
  })
}

export function unregisterKeybindWithPriority(handler: KeybindHandler) {
  registeredHandlers.delete(handler);
}

function catchAll(e: KeyboardEvent) {
  const entries = [...registeredHandlers.entries()];
  const sorted = entries.toSorted(([_, { priority: a }], [__, { priority: b }]) => b - a);
  let maxPrio = 0;

  for (const [handler, { priority, key, schedule }] of sorted) {
    maxPrio = Math.max(maxPrio, priority);
    if (e.key !== key) return;

    if (priority < maxPrio) return;

    switch (schedule) {
      case "user-blocking": {
        queueMicrotask(() => handler(e));
        break;
      }
      case "user-visible": {
        setTimeout(() => handler(e), 0);
        break;
      }
      case "background": {
        requestIdleCallback(() => handler(e));
        break;
      }
    }
  }
}

/**
 * Needs to be called if you want to register handlers on key down
 */
export function registerKeybindsWithPriority() {
  document.addEventListener('keydown', catchAll)
}

/**
 * Use whenever you need to clean up the registered handlers
 */
export function disposeKeybindsWithPriority() {
  registeredHandlers.clear();
  document.removeEventListener('keydown', catchAll)
}
