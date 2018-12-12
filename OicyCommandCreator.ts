import { OicyTrigger, OicyCommand, OicyTriggerCreator } from "./OicyResponse"
import { OicyRequest } from "./OicyRequest"

interface OicyCommandCreator {
  /**
   * Setup triggers.
   * @param oicyTriggerCreator Creator for Trigger. You must generate triggers from only this.
   */
  triggers(request: OicyRequest, oicyTriggerCreator: OicyTriggerCreator): OicyTrigger[]
  /**
   * Create command.
   * @param oicyCommand You shoud setup this.
   */
  create(request: OicyRequest, oicyCommand: OicyCommand): void
}
export { OicyCommandCreator }
