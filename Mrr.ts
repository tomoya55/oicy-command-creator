import 'reflect-metadata';
import {Type, Expose, plainToClass} from "class-transformer";

class QuantityElement {
  unitId?: string
  subUnitIds?: string[]
  amount?: number
  amountExpression?: string
  coefficient?: string
}

class Quantity {
  @Type(() => QuantityElement)
  elements!: QuantityElement[]
}

class Setting {
  toolId!: string
  data!: any
}

class MrrEdge {
  id!: string
  kind!: string
  actionId!: string
  toolIds?: string[]
  @Type(() => Setting)
  settings?: Setting[]
  order?: string
  hrrStepNo?: number
  hrrStepTextRange?: number[]
  mrr!: Mrr

  setMrr(mrr: Mrr): void {
    this.mrr = mrr
  }
}
abstract class MrrNode {
  id!: string
  xCookpadName?: string
  @Expose({ name: "name" })
  _name?: string
  state?: string
  hrrStepNo?: number
  nutrition?: string
  mrr!: Mrr

  get name(): string {
    return this.xCookpadName || this._name || ""
  }
  get kind(): string {
    return "intermediate"
  }

  setMrr(mrr: Mrr): void {
    this.mrr = mrr
  }
}
class IngredientNode extends MrrNode {
  @Type(() => Quantity)
  quantity!: Quantity
  foodCompositionId?: string
  foodCategoryId?: string
  hrrIngredientPosition?: number
  ingredientPosition?: number
  ingredientGroupMark?: string
  alternativeFoodCompositionIds?: string[]
  alternativeFoodCategoryIds?: string[]
  get kind(): string {
    return "ingredient"
  }
}
class TerminalNode extends MrrNode {
  @Type(() => Quantity)
  quantity!: Quantity
  get kind(): string {
    return "terminal"
  }
}
class DisuseNode extends MrrNode {
  @Type(() => Quantity)
  quantity?: Quantity
  get kind(): string {
    return "disuse"
  }
}
class IntermediateNode extends MrrNode {
  @Type(() => Quantity)
  quantity?: Quantity
}
class AmbiguousNode extends MrrNode {
  @Type(() => Quantity)
  quantity?: Quantity
  get kind(): string {
    return "ambiguous"
  }
}
type NodeType = IngredientNode | TerminalNode | DisuseNode | IntermediateNode | AmbiguousNode
class IngredientGroup {
  ingredientGroupMark!: String
  nodeIds!: String[]
}
class SubGraph {
  kind!: string
  nodeIds!: string[]
  edgeIds!: string[]
}
class Mrr {
  xCookpadRecipeUrl?: string
  @Expose({ name: "recipeUrl" })
  _recipeUrl?: string

  xCookpadRecipeId?: string
  @Expose({ name: "recipeId" })
  _recipeId?: string

  formatVersion!: string
  lcid!: string
  authorName!: string

  @Type(() => MrrNode, {
      discriminator: {
        property: "kind",
        subTypes: [
          { value: IngredientNode, name: "ingredient" },
          { value: TerminalNode, name: "terminal" },
          { value: DisuseNode, name: "disuse" },
          { value: AmbiguousNode, name: "ambiguous" },
          { value: IntermediateNode, name: "intermediate" }
        ]
      },
      keepDiscriminatorProperty: true
    })
  nodes!: NodeType[]
  @Type(() => MrrEdge)
  edges!: MrrEdge[]
  @Type(() => IngredientGroup)
  ingredientGroups?: IngredientGroup[]
  @Type(() => SubGraph)
  subGraphs!: SubGraph[]

  @Type(() => Date)
  createdAt!: Date
  @Type(() => Date)
  hrrUpdatedAt!: Date

  _ingredients!: IngredientNode[]
  _terminal!: TerminalNode
  _edgeById!: any
  _nodeById!: any

  get recipeUrl() {
    return this.xCookpadRecipeUrl || this._recipeUrl
  }
  get recipeId() {
    return this.xCookpadRecipeId || this._recipeId
  }

  get terminal(): TerminalNode {
    if (this._terminal) {
      return this._terminal
    }
    this._terminal = this.nodes.filter(n => n.kind == "terminal")[0] as TerminalNode
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

  node(id: string): NodeType {
    if (this._nodeById && this._nodeById[id]) {
      return this._nodeById[id]
    }
    if (!this._nodeById) {
      this._nodeById = {}
    }
    this.nodes.forEach(v => this._nodeById[v.id] = v)
    if (this._nodeById[id]) {
      return this._nodeById[id]
    } else {
      throw "Not found id=" + id
    }
  }

  edge(id: string): MrrEdge {
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
  static convert(obj: any): Mrr {
    const mrr = plainToClass(Mrr, obj)
    mrr.nodes.forEach(v => v.setMrr(mrr))
    mrr.edges.forEach(v => v.setMrr(mrr))
    return mrr
  }
}

export { Mrr, MrrEdge, MrrNode, Quantity }
