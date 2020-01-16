import { Hrr } from "./Hrr"
import { Mrr } from "./Mrr"
import { OicyRequest, UserDevice } from "./OicyRequest"
import { OicyCommand, OicyResponse, OicyTriggerCreator, OicyTriggerSet } from "./OicyResponse"
import { OicyCommandCreator } from "./OicyCommandCreator"

/**
 * <b>!!PACKAGE PRIVATE!! DO NOT CALL THIS.</b>
 */
export const OicyLambdaRunner =
  async (event: any, commandCreator: OicyCommandCreator): Promise<OicyTriggerSet | OicyResponse | OicyCommand> => {
  const mrr = Mrr.convert(JSON.parse(event.mrr), {withNodeNormalizing: true})
  const hrr = event.hrr ? Hrr.convert(JSON.parse(event.hrr)) : undefined
  const params = event.params
  const targetSubMrrKeys = event.targetSubMrrKeys ? JSON.parse(event.targetSubMrrKeys) : {}
  const changedServingsForRate = event.changedServingsForRate ? Number(event.changedServingsForRate) : 1
  let device: UserDevice | undefined;
  if (event.device) {
    const deviceObj: any = JSON.parse(event.device)
    device = new UserDevice(
      deviceObj.deviceId as string,
      deviceObj.deviceTypeNumber as string,
      deviceObj.deviceModelName as string,
      deviceObj.nickname as string
    )
  }
  const request = OicyRequest.create(mrr, params, targetSubMrrKeys, changedServingsForRate, hrr, device)
  const callback = event.callback

  if (callback == "triggers") {
    const triggerCreator = new OicyTriggerCreator()
    const triggerSet = commandCreator.triggers(request, triggerCreator)

    return triggerSet
  } else if (callback == "create") {
    const command = new OicyCommand()
    commandCreator.create(request, command)

    return command
  } else if (!callback) {
    throw "Undefined callback"
  }

  const response = new OicyResponse()
  const method: (arg1: OicyRequest, arg2: OicyResponse) => void =
    Reflect.get(commandCreator, callback)
  method.call(commandCreator, request, response)

  return response
}
