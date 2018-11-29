/**
 * <b>!!PACKAGE PRIVATE!! DO NOT CALL THIS.</b>
 */
const toS = (s) => {
  if(!!s) { return s.toString(); }
  return "";
}
class Quantity {
  unitId: string;
  amounts: number[];
  textAmount: string;
  coefficient: string;
  postUnit: boolean;
  amountPerUnit: number;
  textUnit: string;
  rawData: any;

  /**
   * <b>!!PACKAGE PRIVATE!! DO NOT CALL THIS.</b>
   */
  static convert(obj): Quantity {
    const self = new Quantity();
    Object.keys(obj).forEach(k => self[k] = obj[k]);
    self.rawData = obj;
    return self;
  }
}

class Setting {
  toolId: string;
  data: any;
}

class MrrEdge {
  id: string;
  kind: string;
  actionId: string;
  toolIds: string[];
  settings: Setting[];
  order: string;
  hrrStepNo: string;
  hrrStepTextRange: number[];
  mrr: Mrr;
  rawData: any;

  /**
   * <b>!!PACKAGE PRIVATE!! DO NOT CALL THIS.</b>
   */
  static convert(obj, mrr: Mrr): MrrEdge {
    const self = new MrrEdge();
    Object.keys(obj).forEach(k => {
      if (k == 'settings') {
        const set = obj[k];
        if(set.length && set.length > 0) {
          self.settings = set.map((v) => {
            const setting = new Setting();
            setting.toolId = v.toolId;
            setting.data = v.data;
            return setting;
          });
        }
      } else {
        self[k] = obj[k];
      }
    });
    self.mrr = mrr;
    self.rawData = obj;
    return self;
  }
}
class MrrNode {
  id: string;
  kind: string;
  xCookpadName: string;
  quantity: Quantity;
  state: string;
  ingredientId: string;
  hrrStepNo: string;
  nutrition: string;
  ingredientPosition: number;
  ingredientGroupMark: string;
  mrr: Mrr;
  rawData: any;

  get name() { return this.xCookpadName; }

  ingredientGroup() {
    if(!this.ingredientGroupMark) { return [this]; }
    return this.mrr.ingredients.filter(i => i.ingredientGroupMark == this.ingredientGroupMark);
  }

  /**
   * <b>!!PACKAGE PRIVATE!! DO NOT CALL THIS.</b>
   */
  static convert(obj, mrr: Mrr): MrrNode {
    const self = new MrrNode();
    Object.keys(obj).forEach(k => {
      if (k == 'quantity') {
        self[k] = Quantity.convert(obj[k]);
      } else if (k == 'name' || k == 'xCookpadName') {
        self.xCookpadName = obj[k];
      } else {
        self[k] = obj[k];
      }
    });
    self.kind = self.kind || "intermediate"
    self.mrr = mrr;
    self.rawData = obj;
    return self;
  }
}
class Mrr {
  xCookpadRecipeUrl: string;
  xCookpadRecipeId: string;
  formatVersion: string;
  lcid: string;
  authorName: string;
  nodes: MrrNode[];
  edges: MrrEdge[];
  subGraphs: any;
  rawData: any;

  _ingredients: MrrNode[];
  _terminal: MrrNode;
  _edgeById: any;

  get recipeUrl() { return this.xCookpadRecipeUrl; }
  get recipeId() { return this.xCookpadRecipeId; }

  get terminal() {
    if(this._terminal) { return this._terminal; }
    this._terminal =  this.nodes.filter((n) => n.kind == 'terminal')[0];
    return this._terminal;
  }
  get servingsFor() { return this.terminal.quantity; }

  get ingredients() {
    if(this._ingredients) { return this._ingredients; }
    this._ingredients = this.nodes.filter((n) => n.kind == 'ingredient');
    return this._ingredients;
  }

  edge(id) {
    if(this._edgeById && this._edgeById[id]) { return this._edgeById[id]; }
    if(!this._edgeById) { this._edgeById = {}; }
    this.edges.forEach((v) => { this._edgeById[v.id] = v; });
    if(this._edgeById[id]) { return this._edgeById[id]; }
    else { throw "Not found id=" + id; }
  }

  targetNodes(ids: string[], kind?: string) {
    return this.nodes.filter(n => ((ids.indexOf(n.id) != -1) && (!kind || n.kind == kind)));
  }

  /**
   * <b>!!PACKAGE PRIVATE!! DO NOT CALL THIS.</b>
   */
  static convert(obj): Mrr {
    const self = new Mrr();
    self.xCookpadRecipeUrl = toS(obj.recipeUrl || obj.xCookpadRecipeUrl);
    self.xCookpadRecipeId = toS(obj.recipeId || obj.xCookpadRecipeId);
    self.formatVersion = toS(obj.formatVersion);
    self.lcid = toS(obj.lcid);
    self.authorName = toS(obj.authorName);
    self.nodes = obj.nodes.map(n => MrrNode.convert(n, self));
    self.edges = obj.edges.map(n => MrrEdge.convert(n, self));
    self.subGraphs = obj.subGraphs;
    self.rawData = obj;
    return self;
  }
}

export {Mrr, MrrEdge, MrrNode, Quantity};
