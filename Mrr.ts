import 'reflect-metadata';
import {Type, Expose, plainToClass} from "class-transformer";

class QuantityElement {
  unitId: string
  subUnitIds: string[]
  amount: number
  amountExpression: string
  coefficient: string
  rawData: any
}

class Quantity {
  elements: QuantityElement[]
  rawData: any
}

class Setting {
  toolId: string
  data: any
}

class MrrEdge {
  id: string
  kind: string
  actionId: string
  toolIds: string[]
  settings: Setting[]
  order: string
  hrrStepNo: number
  hrrStepTextRange: number[]
  mrr: Mrr
  rawData: any
}
class MrrNode {
  id: string
  kind: string = "intermediate"
  xCookpadName: string | null
  @Expose({ name: "name" })
  _name: string | null
  quantity: Quantity
  state: string
  hrrStepNo: number
  nutrition: string
  mrr: Mrr
  rawData: any

  get name() {
    return this.xCookpadName || this._name
  }
}
class IngredientNode extends MrrNode {
  foodCompositionId: string
  foodCategoryId: string
  hrrIngredientPosition: number
  ingredientPosition: number
  ingredientGroupMark: string
  alternativeFoodCompositionIds: string[]
  alternativeFoodCategoryIds: string[]
  mrr: Mrr
  rawData: any
}
class IngredientGroup {
  ingredientGroupMark: String
  nodeIds: String[]
  mrr: Mrr
  rawData: any
}
class Mrr {
  xCookpadRecipeUrl: string
  xCookpadRecipeId: string
  formatVersion: string
  lcid: string
  authorName: string
  @Type(() => MrrNode)
  nodes: MrrNode[]
  edges: MrrEdge[]
  ingredientGroups: IngredientGroup[]
  subGraphs: any

  @Type(() => Date)
  createdAt: Date
  @Type(() => Date)
  hrrUpdatedAt: Date

  rawData: any

  _ingredients: IngredientNode[]
  _terminal: MrrNode
  _edgeById: any
  _nodeById: any

  get recipeUrl() {
    return this.xCookpadRecipeUrl
  }
  get recipeId() {
    return this.xCookpadRecipeId
  }

  get terminal() {
    if (this._terminal) {
      return this._terminal
    }
    this._terminal = this.nodes.filter(n => n.kind == "terminal")[0]
    return this._terminal
  }
  get servingsFor() {
    return this.terminal.quantity
  }

  get ingredients(): IngredientNode[] {
    if (this._ingredients) {
      return this._ingredients
    }
    this._ingredients = (this.nodes.filter(n => n.kind == "ingredient") as IngredientNode[])
    return this._ingredients
  }

  node(id): MrrNode {
    if (this._nodeById && this._nodeById[id]) {
      return this._nodeById[id]
    }
    if (!this._nodeById) {
      this._nodeById = {}
    }
    this.nodes.forEach(v => {
      this._nodeById[v.id] = v
    })
    if (this._nodeById[id]) {
      return this._nodeById[id]
    } else {
      throw "Not found id=" + id
    }
  }

  edge(id): MrrEdge {
    if (this._edgeById && this._edgeById[id]) {
      return this._edgeById[id]
    }
    if (!this._edgeById) {
      this._edgeById = {}
    }
    this.edges.forEach(v => {
      this._edgeById[v.id] = v
    })
    if (this._edgeById[id]) {
      return this._edgeById[id]
    } else {
      throw "Not found id=" + id
    }
  }

  targetNodes(ids: string[], kind?: string) {
    return this.nodes.filter(n => ids.indexOf(n.id) != -1 && (!kind || n.kind == kind))
  }

  //self.xCookpadRecipeUrl = toS(obj.recipeUrl || obj.xCookpadRecipeUrl)
  //self.xCookpadRecipeId = toS(obj.recipeId || obj.xCookpadRecipeId)

  /**
   * <b>!!PACKAGE PRIVATE!! DO NOT CALL THIS.</b>
   */
  static convert(obj): Mrr {
    return plainToClass(Mrr, obj);
  }
}

export { Mrr, MrrEdge, MrrNode, Quantity }
