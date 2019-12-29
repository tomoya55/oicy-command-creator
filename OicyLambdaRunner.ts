import { Hrr } from "./Hrr"
import { Mrr } from "./Mrr"
import { OicyRequest, UserDevice } from "./OicyRequest"
import { OicyCommand, OicyResponse, OicyTriggerCreator } from "./OicyResponse"
import { OicyCommandCreator } from "./OicyCommandCreator"
import {classToPlain} from "class-transformer";

/**
 * <b>!!PACKAGE PRIVATE!! DO NOT CALL THIS.</b>
 */
const OicyLambdaRunner = async (event: any, commandCreator: OicyCommandCreator) => {
  const mrr = Mrr.convert(classToPlain(event.mrr))
  let hrr: Hrr | undefined;
  if (event.hrr) {
    hrr = Hrr.convert(classToPlain(event.hrr))
  }
  const params = event.params
  const targetSubMrrKeys = classToPlain(event.targetSubMrrKeys || {})
  const changedServingsForRate = Number(event.changedServingsForRate) || 1
  let device: UserDevice | undefined;
  if (event.device) {
    device = UserDevice.convert(classToPlain(JSON.parse(event.device)))
  }
  const request = OicyRequest.create(mrr, params, targetSubMrrKeys, changedServingsForRate, hrr, device)
  const callback = event.callback

  if (callback == "triggers") {
    const triggerCreator = new OicyTriggerCreator()
    const triggers = commandCreator.triggers(request, triggerCreator)

    if (triggers.length > 0) {
      return triggers
    } else {
      return {}
    }
  } else if (callback == "create") {
    const command = new OicyCommand()
    commandCreator.create(request, command)

    return command
  }

  const response = new OicyResponse()
  const method: (arg1: OicyCommandCreator, arg2: OicyRequest, arg3: OicyResponse) => void =
    Reflect.get(commandCreator, callback)
  method.call(commandCreator, request, response)

  return response
}

export { OicyLambdaRunner }
