export interface Command {
  execute(): Promise<void>
}

export abstract class BaseCommand<T> implements Command {
  abstract execute(): Promise<void>

  // eslint-disable-next-line no-unused-vars
  constructor(public context: T) {}
}

// Composite Command Pattern
export class MacroCommand<T> implements Command {
  // eslint-disable-next-line no-unused-vars
  constructor(public context: T, public commands: Command[]) {}

  async execute(): Promise<void> {
    for (const cmd of this.commands) {
      // eslint-disable-next-line no-await-in-loop
      await cmd.execute()
    }
  }
}
