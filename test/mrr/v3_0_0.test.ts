import { describe, it } from "mocha"
import assert = require("assert")

import { Mrr } from "../../Mrr"
import json4351780 from "../../test_data/mrrs/v3.0.0/4351780"
import json726271 from "../../test_data/mrrs/v3.0.0/726271"

describe("Mrr V3 726271", () => {
  const terminal = json726271.nodes.filter(n => n.kind == 'terminal')[0]
  const t_id = terminal.id
  let n: any = {"id": t_id, "kind": "ambiguous"}
  json726271.nodes.push(n)
  n = {"id": "n1", "kind": "ambiguous"}
  json726271.nodes.push(n)
  n = {"id": "n2", "kind": "ambiguous"}
  json726271.nodes.push(n)
  terminal.id = "n0"

  let edge: any = {"id": "e1", "to": "n1", "from": t_id, "toolIds": ["microwave"], "actionId": "ah9",
    "settings": [{"data": {"type": "manual"}, "toolId": "microwave"}],
    "hrrStepNo": 1, "hrrStepTextRange": [0, 13]}
  json726271.edges.push(edge)
  edge = {"id": "e2", "to": "n2", "from": "n1", "toolIds": ["microwaveOven"], "actionId": "ah6-6",
    "settings":
      [{"data": {"time": [1140], "type": "manual", "heating": [170], "heatingUnit": "c"},
        "toolId": "microwaveOven"}],
    "hrrStepNo": 3, "hrrStepTextRange": [15, 28]}
  json726271.edges.push(edge)
  edge = {"id": "e3", "to": "n0", "from": "n2", "actionId": "aa1"}
  json726271.edges.push(edge)
  json726271.subGraphs[0].nodeIds.push("n0")
  json726271.subGraphs[0].nodeIds.push("n1")
  json726271.subGraphs[0].nodeIds.push("n2")
  json726271.subGraphs[0].edgeIds.push("e1")
  json726271.subGraphs[0].edgeIds.push("e2")
  json726271.subGraphs[0].edgeIds.push("e3")

  const mrr = Mrr.convert(json726271)

  it("e1 has settings", () => {
    const e = mrr.edges.find(x => x.actionId == "ah9")
    if (!e) {
      throw "error"
    }
    assert.equal(e.id, "e1")

    const s = e.settings[0]
    assert.equal(s.toolId, "microwave")
    assert.deepEqual(s.data, { type: "manual" })
  })

  it("e2 has settings", () => {
    const s = mrr.edge("e2").settings[0]
    assert.equal(s.toolId, "microwaveOven")
    assert.deepEqual(s.data, {
      time: [1140],
      type: "manual",
      heating: [170],
      heatingUnit: "c"
    })
  })
})
describe("Mrr V3 4351780", () => {
  const mrr = Mrr.convert(json4351780)
  it("having terminal", () => {
    assert.equal(mrr.terminal.id, "1")
    assert.equal(mrr.terminal.name, "《ストウブで作る》肉じゃが☆")
    assert.deepEqual(mrr.terminal.quantity.unitIds, ["15"])
    assert.equal(mrr.terminal.hrrStepNo, null)
  })

  it("having ingredientGroups", () => {
    assert.equal(mrr.ingredientGroups.length, 1)
    assert.equal(mrr.ingredientGroups[0].ingredientGroupMark, "☆")
    assert.deepEqual(mrr.ingredientGroups[0].nodeIds, ["8","9","10","11"])
  })

  it("having servingsFor", () => {
    assert.deepEqual(mrr.servingsFor.unitIds, ["15"])
    assert.deepEqual(mrr.servingsFor.amounts, [2.0])
    assert.equal(mrr.servingsFor.subUnitIds, null)
  })

  it("having ingredients", () => {
    assert.equal(mrr.ingredients.length, 10)
    assert.equal(mrr.ingredients[0].id, "2")
    assert.equal(mrr.ingredients[0].hrrStepNo, 0)
    assert.equal(mrr.ingredients[0].hrrIngredientPosition, 0)
    assert.equal(mrr.ingredients[0].ingredientPosition, 0)
    assert.equal(mrr.ingredients[0].foodCompositionId, "11119")
    assert.deepEqual(mrr.ingredients[0].quantity.unitIds, ["9"])
    assert.deepEqual(mrr.ingredients[0].quantity.amounts, [100.0])
    assert.equal(mrr.ingredients[9].id, "11")
    assert.equal(mrr.ingredients[9].hrrIngredientPosition, 9)
    assert.equal(mrr.ingredients[9].ingredientPosition, 9)
    assert.equal(mrr.ingredients[9].foodCompositionId, "16023")
    assert.equal(mrr.ingredients[9].ingredientGroupMark, "☆")
  })
})
