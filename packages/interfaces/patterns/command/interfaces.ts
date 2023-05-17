export interface Command<T> {
  // eslint-disable-next-line no-unused-vars
  execute(context: T): Promise<void>
}

export abstract class BaseCommand<T> implements Command<T> {
  // eslint-disable-next-line no-unused-vars
  abstract execute(context: T): Promise<void>
}

// Composite Command Pattern
export class MacroCommand<T> implements Command<T> {
  // eslint-disable-next-line no-unused-vars
  constructor(public context: T, public commands: Command<T>[]) {}

  async execute(): Promise<void> {
    for (const cmd of this.commands) {
      // eslint-disable-next-line no-await-in-loop
      await cmd.execute(this.context)
    }
  }
}
