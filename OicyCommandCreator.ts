import { OicyTriggerSet, OicyCommand, OicyTriggerCreator } from "./OicyResponse"
import { OicyRequest } from "./OicyRequest"

export interface OicyCommandCreator {
  /**
   * Setup triggers.
   * @param oicyTriggerCreator Creator for Trigger. You must generate triggers from only this.
   */
  triggers(request: OicyRequest, oicyTriggerCreator: OicyTriggerCreator): OicyTriggerSet
  /**
   * Create command.
   * @param oicyCommand You shoud setup this.
   */
  create(request: OicyRequest, oicyCommand: OicyCommand): void
}
