import { Hrr } from "./Hrr"
import { Mrr } from "./Mrr"
import { OicyRequest, UserDevice, TargetSubMrrKeys } from "./OicyRequest"
import { OicyCommand, OicyResponse, OicyTriggerCreator, OicyTriggerSet } from "./OicyResponse"
import { OicyCommandCreator } from "./OicyCommandCreator"

export type OiCyEventParams = { [key:string]: any }

export type OicyEvent = {
  callback: string
  params?: OiCyEventParams
  mrr?: string
  hrr?: string
  targetSubMrrKeys?: string
  changedServingsForRate?: string | number
  device?: UserDevice
}

/**
 * <b>!!PACKAGE PRIVATE!! DO NOT CALL THIS.</b>
 */
export const OicyLambdaRunner = async (
  event: OicyEvent,
  commandCreator: OicyCommandCreator
): Promise<OicyTriggerSet | OicyResponse | OicyCommand> => {
  const params = event.params

  const mrr = event.mrr ? Mrr.convert(JSON.parse(event.mrr), { withNodeNormalizing: true }) : new Mrr()
  const targetSubMrrKeys = event.targetSubMrrKeys
    ? (JSON.parse(event.targetSubMrrKeys) as TargetSubMrrKeys)
    : new TargetSubMrrKeys([], [])

  const hrr = event.hrr ? Hrr.convert(JSON.parse(event.hrr)) : undefined

  const changedServingsForRate = event.changedServingsForRate ? Number(event.changedServingsForRate) : 1

  const request = OicyRequest.create(params, mrr, targetSubMrrKeys, changedServingsForRate, hrr, event.device)
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
  const method: (arg1: OicyRequest, arg2: OicyResponse) => void = Reflect.get(commandCreator, callback)
  method.call(commandCreator, request, response)

  return response
}
