import { describe, it } from "mocha"
import assert = require("assert")

import { Mrr } from "../../Mrr"
import json4351780 from "../../test_data/mrrs/v3.0.0/4351780"
import json2048398 from "../../test_data/mrrs/v3.0.0/2048398"

describe("Mrr V3 2048398", () => {
  const terminal = json2048398.nodes.filter(n => n.kind == 'terminal')[0]
  const t_id = terminal.id
  let n: any = {"id": t_id, "kind": "ambiguous"}
  json2048398.nodes.push(n)
  n = {"id": "n1", "kind": "ambiguous"}
  json2048398.nodes.push(n)
  n = {"id": "n2", "kind": "ambiguous"}
  json2048398.nodes.push(n)
  terminal.id = "n0"

  let edge: any = {"id": "e1", "to": "n1", "from": t_id, "toolIds": ["microwave"], "actionId": "ah9",
    "settings": [{"data": {"type": "manual"}, "toolId": "microwave"}],
    "hrrStepNo": 1, "hrrStepTextRange": [0, 13]}
  json2048398.edges.push(edge)
  edge = {"id": "e2", "to": "n2", "from": "n1", "toolIds": ["microwaveOven"], "actionId": "ah6-6",
    "settings":
      [{"data": {"time": [1140], "type": "manual", "heating": [170], "heatingUnit": "c"},
        "toolId": "microwaveOven"}],
    "hrrStepNo": 3, "hrrStepTextRange": [15, 28]}
  json2048398.edges.push(edge)
  edge = {"id": "e3", "to": "n0", "from": "n2", "actionId": "aa1"}
  json2048398.edges.push(edge)
  json2048398.subGraphs[0].nodeIds.push("n0")
  json2048398.subGraphs[0].nodeIds.push("n1")
  json2048398.subGraphs[0].nodeIds.push("n2")
  json2048398.subGraphs[0].edgeIds.push("e1")
  json2048398.subGraphs[0].edgeIds.push("e2")
  json2048398.subGraphs[0].edgeIds.push("e3")

  const mrr = Mrr.convert(json2048398)

  it("e1 has settings", () => {
    const e = mrr.edges.find(x => x.actionId == "ah9")
    if (!e) {
      throw "error"
    }
    assert.equal(e.id, "e1")

    const s = e.settings[0]
    assert.equal(s.toolId, "microwave")
    assert.deepEqual(s.data, { type: "manual" })

    assert.equal(s.constructor.name, "Setting")
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

  it("intermediate has kind", () => {
    const intermediate: any = {"id": "n100"}
    json2048398.nodes.push(intermediate)
    const mrr_with_intermediate = Mrr.convert(json2048398)
    const n = mrr_with_intermediate.node('n100')
    assert.equal(n.kind, "intermediate")
  })
})
describe("Mrr V3 4351780", () => {
  const mrr = Mrr.convert(json4351780)
  it("has correct types", () => {
    assert.equal(mrr.constructor.name, "Mrr")
    assert.equal(mrr.terminal.constructor.name, "MrrNode")
    assert.equal(mrr.terminal.quantity.constructor.name, "Quantity")
    assert.equal(mrr.terminal.quantity.elements[0].constructor.name, "QuantityElement")
    assert.equal(mrr.ingredientGroups[0].constructor.name, "IngredientGroup")
  })
  it("having terminal", () => {
    assert.equal(mrr.terminal.id, "1")
    assert.equal(mrr.terminal.name, "《ストウブで作る》肉じゃが☆")
    assert.deepEqual(mrr.terminal.quantity.elements.length, 1)
    assert.deepEqual(mrr.terminal.quantity.elements[0].unitId, "15")
    assert.equal(mrr.terminal.hrrStepNo, null)
  })

  it("having ingredientGroups", () => {
    assert.equal(mrr.ingredientGroups.length, 1)
    assert.equal(mrr.ingredientGroups[0].ingredientGroupMark, "☆")
    assert.deepEqual(mrr.ingredientGroups[0].nodeIds, ["8","9","10","11"])
  })

  it("having servingsFor", () => {
    assert.deepEqual(mrr.servingsFor.elements.length, 1)
    assert.deepEqual(mrr.servingsFor.elements[0].unitId, "15")
    assert.deepEqual(mrr.servingsFor.elements[0].amount, 2.0)
    assert.equal(mrr.servingsFor.elements[0].subUnitIds, null)
  })

  it("having ingredients", () => {
    assert.equal(mrr.ingredients.length, 10)
    assert.equal(mrr.ingredients[0].id, "2")
    assert.equal(mrr.ingredients[0].hrrStepNo, 0)
    assert.equal(mrr.ingredients[0].hrrIngredientPosition, 0)
    assert.equal(mrr.ingredients[0].ingredientPosition, 0)
    assert.equal(mrr.ingredients[0].foodCompositionId, "11119")
    assert.deepEqual(mrr.terminal.quantity.elements.length, 1)
    assert.deepEqual(mrr.ingredients[0].quantity.elements[0].unitId, "9")
    assert.deepEqual(mrr.ingredients[0].quantity.elements[0].amount, 100.0)
    assert.equal(mrr.ingredients[9].id, "11")
    assert.equal(mrr.ingredients[9].hrrIngredientPosition, 9)
    assert.equal(mrr.ingredients[9].ingredientPosition, 9)
    assert.equal(mrr.ingredients[9].foodCompositionId, "16023")
    assert.equal(mrr.ingredients[9].ingredientGroupMark, "☆")
  })

  it("having hrrUpdatedAt", () => {
    assert.deepEqual(mrr.hrrUpdatedAt.getFullYear(), Number(json4351780['hrrUpdatedAt'].split('-')[0]))
  })
})
