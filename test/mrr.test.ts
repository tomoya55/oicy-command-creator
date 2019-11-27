import { describe, it } from "mocha"
import assert = require("assert")

import { Mrr } from "../Mrr"
import json726271 from "../test_data/mrrs/726271"

describe("Mrr 726271", () => {
  const mrr = Mrr.convert(json726271)
  it("x4 has settings", () => {
    const e = mrr.edges.find(x => x.actionId == "ah9")
    if (!e) {
      throw "error"
    }
    assert.equal(e.id, "x4")

    const s = e.settings[0]
    assert.equal(s.toolId, "microwave")
    assert.deepEqual(s.data, { type: "manual" })
  })

  it("x12 has settings", () => {
    const s = mrr.edge("x12").settings[0]
    assert.equal(s.toolId, "microwaveOven")
    assert.deepEqual(s.data, {
      time: [1140],
      type: "manual",
      heating: [170, "c"],
    })
  })

  it("ingredients are 4", () => {
    const ingredients = mrr.ingredients
    assert.equal(ingredients.length, 4)

    const i = ingredients.find(x => x.ingredientId == "1015")
    if (!i) {
      throw "error"
    }
    assert.equal(i.ingredientPosition, 0)
    assert.deepEqual(i.quantity.amounts, [120])
    assert.deepEqual(i.quantity.unitId, "u101")

    assert.deepEqual(i.quantity.rawData, {
      unitId: "u101",
      amounts: [120],
      postUnit: true,
      textAmount: "120g",
      amountPerUnit: 1,
    })

    assert.equal(mrr.targetNodes(["1", "2"], "ingredient").length, 2)
  })

  it("terminal", () => {
    assert.equal(mrr.terminal.name, "バター３０★簡単クッキー")
    assert.deepEqual(mrr.servingsFor.amounts, [1])
    assert.equal(mrr.recipeId, "726271")
    assert.equal(mrr.recipeUrl, "https://cookpad.com/recipe/726271")
  })
})
