import { Hrr } from "./Hrr"
import { Mrr } from "./Mrr"
import { OicyRequest, Device } from "./OicyRequest"
import { OicyCommand, OicyResponse, OicyTriggerCreator } from "./OicyResponse"
import { OicyCommandCreator } from "./OicyCommandCreator"

/**
 * <b>!!PACKAGE PRIVATE!! DO NOT CALL THIS.</b>
 */
const toObj = obj => {
  if (typeof obj != "object") {
    return obj
  }
  if (Array.isArray(obj)) {
    return obj.map(v => toObj(v))
  }

  const ret = {}
  Object.keys(obj).forEach(k => {
    ret[k] = toObj(obj[k])
  })
  return ret
}

/**
 * <b>!!PACKAGE PRIVATE!! DO NOT CALL THIS.</b>
 */
const stringToObject = o => {
  if (typeof o == "string") {
    return JSON.parse(o)
  } else {
    return o
  }
}

/**
 * <b>!!PACKAGE PRIVATE!! DO NOT CALL THIS.</b>
 */
const OicyLambdaRunner = async (event, commandCreator: OicyCommandCreator) => {
  const mrr = Mrr.convert(stringToObject(event.mrr))
  let hrr: Hrr | null = null
  if (event.hrr) {
    hrr = Hrr.convert(stringToObject(event.hrr))
  }
  const params = event.params
  const targetSubMrrKeys = stringToObject(event.targetSubMrrKeys || {})
  const changedServingsForRate = Number(event.changedServingsForRate) || 1
  const device = Device.convert(event.device || {})
  const request = OicyRequest.create(mrr, params, targetSubMrrKeys, changedServingsForRate, hrr, device)
  const callback = event.callback

  if (callback == "triggers") {
    const triggerCreator = new OicyTriggerCreator()
    const triggers = commandCreator.triggers(request, triggerCreator)

    if (triggers.length > 0) {
      return toObj(triggers)
    } else {
      return {}
    }
  } else if (callback == "create") {
    const command = new OicyCommand()
    commandCreator.create(request, command)

    return toObj(command)
  }

  const response = new OicyResponse()
  commandCreator[callback].call(commandCreator, request, response)

  return toObj(response)
}

export { OicyLambdaRunner }
