import { describe, it } from "mocha"
import assert from "power-assert"

import { OicyLambdaRunner } from "../OicyLambdaRunner"
import { OicyCommandCreator } from "../OicyCommandCreator"
import { OicyRequest } from "../OicyRequest"
import { OicyTrigger, OicyCommand, OicyTriggerCreator } from "../OicyResponse"

class TestCommandCreator implements OicyCommandCreator {
  triggers(request: OicyRequest, oicyTriggerCreator: OicyTriggerCreator): OicyTrigger[] {
    return []
  }

  create(request: OicyRequest, oicyCommand: OicyCommand): void {
    if (request.device) {
      oicyCommand.data = `t=${request.device.typeNumber}`
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
      device: JSON.stringify({ typeNumber: "OCY-001" }),
      mrr: { nodes: [], edges: [] },
    }

    const ret = await OicyLambdaRunner(event, new TestCommandCreator())
    assert.deepEqual(ret.view, {})
    assert.equal(ret.data, "t=OCY-001")
  })
})
