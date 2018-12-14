import { describe, it } from "mocha"
import assert from "power-assert"

import { OicyLambdaRunner } from "../OicyLambdaRunner"
import { OicyCommandCreator } from "../OicyCommandCreator"
import { OicyRequest } from "../OicyRequest"
import { OicyTrigger, OicyCommand, OicyTriggerCreator } from "../OicyResponse"

class TestCommandCreator implements OicyCommandCreator {
  triggers(request: OicyRequest, triggerCreator: OicyTriggerCreator): OicyTrigger[] {
    return []
  }

  create(request: OicyRequest, command: OicyCommand): void {
    if (request.device) {
      let data: String[] = []
      if (request.device.deviceTypeNumber) {
        data.push(`t=${request.device.deviceTypeNumber}`)
      }
      if (request.device.deviceModelName) {
        data.push(`m=${request.device.deviceModelName}`)
      }
      command.data = data.join("&")
    }
  }
}

describe("OicyLambdaRunner", () => {
  it("OiCyRequest does not have any device info", async () => {
    const event = {
      callback: "create",
      mrr: { nodes: [], edges: [] },
    }

    const ret = await OicyLambdaRunner(event, new TestCommandCreator())
    assert.deepEqual(ret.view, {})
    assert.equal(ret.data, undefined)
  })

  it("OiCyRequest has the device info", async () => {
    const event = {
      callback: "create",
      device: JSON.stringify({ deviceTypeNumber: "OCY-001", deviceModelName: "OiCyDevice" }),
      mrr: { nodes: [], edges: [] },
    }

    const ret = await OicyLambdaRunner(event, new TestCommandCreator())
    assert.deepEqual(ret.view, {})
    assert.equal(ret.data, "t=OCY-001&m=OiCyDevice")
  })
})
