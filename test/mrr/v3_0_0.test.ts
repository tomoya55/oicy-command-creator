import { describe, it } from "mocha"
import assert = require("assert")

import { Mrr } from "../../Mrr"
import json4351780 from "../../test_data/mrrs/v3.0.0/4351780"

describe("Mrr V3 4351780", () => {
  const mrr = Mrr.convert(json4351780)
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
    assert.equal(mrr.ingredients[0].foodCompositionId, "11119")
    assert.deepEqual(mrr.ingredients[0].quantity.unitIds, ["9"])
    assert.deepEqual(mrr.ingredients[0].quantity.amounts, [100.0])
    assert.equal(mrr.ingredients[9].id, "11")
    assert.equal(mrr.ingredients[9].foodCompositionId, "16023")
    assert.equal(mrr.ingredients[9].ingredientGroupMark, "☆")
  })
})
