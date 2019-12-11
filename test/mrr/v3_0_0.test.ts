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
})
