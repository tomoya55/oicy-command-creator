import { describe, it } from "mocha"
import assert = require("assert")

import { OicyLambdaRunner } from "../OicyLambdaRunner"
import { OicyCommandCreator } from "../OicyCommandCreator"
import { OicyRequest } from "../OicyRequest"
import { OicyTriggerSet, OicyCommand, OicyTriggerCreator } from "../OicyResponse"

class TestCommandCreator implements OicyCommandCreator {
  triggers(_request: OicyRequest, triggerCreator: OicyTriggerCreator): OicyTriggerSet {
    const triggerSet = new OicyTriggerSet()
    const oicyTrigger = triggerCreator.create([], []);
    oicyTrigger.callback = 'confrim';
    triggerSet.triggers.push(oicyTrigger);
    return triggerSet
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
      mrr: JSON.stringify({ nodes: [], edges: [] }),
    }

    const ret = await OicyLambdaRunner(event, new TestCommandCreator())
    if (ret instanceof OicyCommand) {
      assert.deepEqual(ret.view, {})
      assert.equal(ret.data, undefined)
    } else {
      assert.fail("ret is not OicyCommand")
    }
  })

  it("OiCyRequest has the device info", async () => {
    const event = {
      callback: "create",
      device: JSON.stringify({ deviceTypeNumber: "OCY-001", deviceModelName: "OiCyDevice" }),
      mrr: JSON.stringify({ nodes: [], edges: [] }),
    }

    const ret = await OicyLambdaRunner(event, new TestCommandCreator())
    if (ret instanceof OicyCommand) {
      assert.deepEqual(ret.view, {})
      assert.equal(ret.data, "t=OCY-001&m=OiCyDevice")
    } else {
      assert.fail("ret is not OicyCommand")
    }
  })

  it("OiCyRequest has triggers", async () => {
    const event = {
      callback: "triggers",
      device: JSON.stringify({ deviceTypeNumber: "OCY-001", deviceModelName: "OiCyDevice" }),
      mrr: JSON.stringify({ nodes: [], edges: [] }),
    }

    const ret = await OicyLambdaRunner(event, new TestCommandCreator())
    if (ret instanceof OicyTriggerSet) {
      assert.equal(ret.triggers.length, 1)
      assert.equal(ret.triggers[0].callback, "confrim")
    } else {
      assert.fail("ret is not OicyTriggerSet")
    }
  })
})
