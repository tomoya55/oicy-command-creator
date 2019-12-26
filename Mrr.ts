/**
 * <b>!!PACKAGE PRIVATE!! DO NOT CALL THIS.</b>
 */
const toS = s => {
  if (!!s) {
    return s.toString()
  }
  return ""
}

class QuantityElement {
  unitId: string
  subUnitIds: string[]
  amount: number
  amountExpression: string
  coefficient: string
  rawData: any

  /**
   * <b>!!PACKAGE PRIVATE!! DO NOT CALL THIS.</b>
   */
  static convert(obj): QuantityElement {
    const self = new QuantityElement()
    Object.keys(obj).forEach(k => (self[k] = obj[k]))
    self.rawData = obj
    return self
  }
}

class Quantity {
  elements: QuantityElement[]
  rawData: any

  /**
   * <b>!!PACKAGE PRIVATE!! DO NOT CALL THIS.</b>
   */
  static convert(obj): Quantity {
    const self = new Quantity()
    Object.keys(obj).forEach(k => {
      if (k == "elements") {
        self[k] = obj[k].map(v => QuantityElement.convert(v))
      } else {
        self[k] = obj[k]
      }
      return self
    })
    self.rawData = obj
    return self
  }
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

  /**
   * <b>!!PACKAGE PRIVATE!! DO NOT CALL THIS.</b>
   */
  static convert(obj, mrr: Mrr): MrrEdge {
    const self = new MrrEdge()
    Object.keys(obj).forEach(k => {
      if (k == "settings") {
        const set = obj[k]
        if (set.length && set.length > 0) {
          self.settings = set.map(v => {
            const setting = new Setting()
            setting.toolId = v.toolId
            setting.data = v.data
            return setting
          })
        }
      } else {
        self[k] = obj[k]
      }
    })
    self.mrr = mrr
    self.rawData = obj
    return self
  }
}
class MrrNode {
  id: string
  kind: string
  xCookpadName: string
  quantity: Quantity
  state: string
  hrrStepNo: number
  nutrition: string
  mrr: Mrr
  rawData: any

  get name() {
    return this.xCookpadName
  }

  /**
   * <b>!!PACKAGE PRIVATE!! DO NOT CALL THIS.</b>
   */
  static convert(obj, mrr: Mrr): MrrNode {
    const self = new MrrNode()
    Object.keys(obj).forEach(k => {
      if (k == "quantity") {
        self[k] = Quantity.convert(obj[k])
      } else if (k == "name" || k == "xCookpadName") {
        self.xCookpadName = obj[k]
      } else {
        self[k] = obj[k]
      }
    })
    self.kind = self.kind || "intermediate"
    self.mrr = mrr
    self.rawData = obj
    return self
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

  /**
   * <b>!!PACKAGE PRIVATE!! DO NOT CALL THIS.</b>
   */
  static convert(obj, mrr: Mrr): IngredientNode {
    const self = new IngredientNode()
    Object.keys(obj).forEach(k => {
      if (k == "quantity") {
        self[k] = Quantity.convert(obj[k])
      } else if (k == "name" || k == "xCookpadName") {
        self.xCookpadName = obj[k]
      } else {
        self[k] = obj[k]
      }
    })
    self.kind = "ingredient"
    self.mrr = mrr
    self.rawData = obj
    return self
  }
}
class IngredientGroup {
  ingredientGroupMark: String
  nodeIds: String[]
  mrr: Mrr
  rawData: any

  /**
   * <b>!!PACKAGE PRIVATE!! DO NOT CALL THIS.</b>
   */
  static convert(obj, mrr: Mrr): IngredientGroup {
    const self = new IngredientGroup()
    self.ingredientGroupMark = toS(obj.ingredientGroupMark)
    self.nodeIds = obj.nodeIds.map(i => toS(i))
    self.mrr = mrr
    self.rawData = obj
    return self
  }
}
class Mrr {
  xCookpadRecipeUrl: string
  xCookpadRecipeId: string
  formatVersion: string
  lcid: string
  authorName: string
  nodes: MrrNode[]
  edges: MrrEdge[]
  ingredientGroups: IngredientGroup[]
  subGraphs: any
  createdAt: Date
  hrrUpdatedAt: Date
  rawData: any

  _ingredients: IngredientNode[]
  _terminal: MrrNode
  _edgeById: any

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

  edge(id) {
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
    const self = new Mrr()
    self.xCookpadRecipeUrl = toS(obj.recipeUrl || obj.xCookpadRecipeUrl)
    self.xCookpadRecipeId = toS(obj.recipeId || obj.xCookpadRecipeId)
    self.formatVersion = toS(obj.formatVersion)
    self.lcid = toS(obj.lcid)
    self.authorName = toS(obj.authorName)
    self.nodes = obj.nodes.map(n => (n.kind == 'ingredient') ? IngredientNode.convert(n, self) : MrrNode.convert(n, self))
    self.edges = obj.edges.map(n => MrrEdge.convert(n, self))
    if (obj.ingredientGroups) {
      self.ingredientGroups = obj.ingredientGroups.map(g => IngredientGroup.convert(g, self))
    }
    self.subGraphs = obj.subGraphs
    self.createdAt = new Date(obj.createdAt)
    self.hrrUpdatedAt = new Date(obj.hrrUpdatedAt)
    self.rawData = obj
    return self
  }
}

export { Mrr, MrrEdge, MrrNode, Quantity }
