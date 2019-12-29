import 'reflect-metadata';
import {Type, Expose, plainToClass} from "class-transformer";

class QuantityElement {
  unitId: string
  subUnitIds: string[]
  amount: number
  amountExpression: string
  coefficient: string
}

class Quantity {
  @Type(() => QuantityElement)
  elements: QuantityElement[]
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
  @Type(() => Setting)
  settings: Setting[]
  order: string
  hrrStepNo: number
  hrrStepTextRange: number[]
  mrr: Mrr
}
class MrrNode {
  id: string
  kind: string = "intermediate"
  xCookpadName?: string
  @Expose({ name: "name" })
  _name?: string
  @Type(() => Quantity)
  quantity: Quantity
  state: string
  hrrStepNo: number
  nutrition: string
  mrr: Mrr

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
}
class IngredientGroup {
  ingredientGroupMark: String
  nodeIds: String[]
  mrr: Mrr
}
class Mrr {
  xCookpadRecipeUrl?: string
  @Expose({ name: "recipeUrl" })
  _recipeUrl?: string

  xCookpadRecipeId?: string
  @Expose({ name: "recipeId" })
  _recipeId?: string

  formatVersion: string
  lcid: string
  authorName: string

  @Type(() => MrrNode)
  nodes: MrrNode[]
  @Type(() => MrrEdge)
  edges: MrrEdge[]
  @Type(() => IngredientGroup)
  ingredientGroups: IngredientGroup[]
  subGraphs: any

  @Type(() => Date)
  createdAt: Date
  @Type(() => Date)
  hrrUpdatedAt: Date

  _ingredients: IngredientNode[]
  _terminal: MrrNode
  _edgeById: any
  _nodeById: any

  get recipeUrl() {
    return this.xCookpadRecipeUrl || this._recipeUrl
  }
  get recipeId() {
    return this.xCookpadRecipeId || this._recipeId
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

  /**
   * <b>!!PACKAGE PRIVATE!! DO NOT CALL THIS.</b>
   */
  static convert(obj): Mrr {
    const mrr = plainToClass(Mrr, obj)
    for (let index in mrr.nodes) {
      if(obj.nodes[index].kind == 'ingredient') {
        if(mrr.nodes[index].kind == 'ingredient') {
          mrr.nodes[index] = plainToClass(IngredientNode, obj.nodes[index])
        } else {
          throw "Unmutch type of ingredient"
        }
      }
    }
    return mrr
  }
}

export { Mrr, MrrEdge, MrrNode, Quantity }
