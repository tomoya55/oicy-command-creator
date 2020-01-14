import 'reflect-metadata';
import {Type, Expose, plainToClass} from "class-transformer";

type Coefficient = "c1" | "c2" | undefined;
class QuantityElement {
  unitId?: string
  subUnitIds?: string[]
  amount?: number
  amountExpression?: string
  coefficient: Coefficient
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

type Kind = "terminal" | "disuse" | "ambiguous" | "intermediate" | "ingredient";
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
  abstract get kind(): Kind;

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
  get kind(): Kind {
    return "ingredient"
  }
}
class TerminalNode extends MrrNode {
  @Type(() => Quantity)
  quantity!: Quantity
  get kind(): Kind {
    return "terminal"
  }
}
class DisuseNode extends MrrNode {
  @Type(() => Quantity)
  quantity?: Quantity
  get kind(): Kind {
    return "disuse"
  }
}
class IntermediateNode extends MrrNode {
  @Type(() => Quantity)
  quantity?: Quantity
  get kind(): Kind {
    return "intermediate"
  }
}
class AmbiguousNode extends MrrNode {
  @Type(() => Quantity)
  quantity?: Quantity
  get kind(): Kind {
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
   * withNodeNormalizing: when this is true, convert method will change input obj.
   *   e.g., filling kind property of node (intermediate).
   */
  static convert(obj: any, {withNodeNormalizing}: {withNodeNormalizing: boolean}): Mrr {
    if (withNodeNormalizing) {
      obj.nodes.forEach((v: any) => {
        if (!v.kind) {
          v.kind = "intermediate"
        }
      })
    }
    const mrr = plainToClass(Mrr, obj)
    mrr.nodes.forEach(v => v.setMrr(mrr))
    mrr.edges.forEach(v => v.setMrr(mrr))
    return mrr
  }
}

export { Mrr, MrrEdge, MrrNode, Quantity }
