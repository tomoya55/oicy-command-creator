import { describe, it } from "mocha"
import assert = require("assert")

import { Hrr } from "../Hrr"
import json3663183 from "../test_data/hrrs/3663183"

describe("Hrr 3663183", () => {
  const hrr = Hrr.convert(json3663183)
  it("props", () => {
    assert.equal(hrr.id, "3663183")
    assert.equal(hrr.name, "全粒粉と豆乳の栄養たっぷりクランペット")
    assert.equal(hrr.serving, "2人分（小さめ6枚）")
    assert.equal(hrr.author, "かなこまり")
    assert.equal(
      hrr.tips,
      "簡単すぎて特になし(*^^*)\n小さめクランペット6枚なので、一回り大きくして中サイズ4枚でも良いかもしれません。"
    )
    assert.equal(
      hrr.userHistory,
      "美味しいクランペットが食べたいけど、欲張って栄養もプラスしたかったので全粒粉＆豆乳をブレンド。甜菜糖でゆるマクロビチックに(*^^*) \n前日の仕込みも簡単＆翌日焼くだけの楽チンレシピ。"
    )
  })

  it("ingredients", () => {
    assert.equal(hrr.ingredients.length, 8)
    assert.equal(hrr.ingredients[0].ingredientPosition, 0)
    assert.equal(hrr.ingredients[0].quantity, "100g")
    assert.equal(hrr.ingredients[0].name, "強力粉")
  })

  it("steps", () => {
    assert.equal(hrr.steps.length, 10)
    assert.equal(hrr.steps[0].stepNo, 1)
    assert.equal(hrr.steps[0].text, "ボウルに強力粉を振るい全粒粉、砂糖、ドライイースト、塩を加える。")
  })
})
