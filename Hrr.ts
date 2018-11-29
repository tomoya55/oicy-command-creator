class HrrIngredient {
  ingredientPosition: number;
  name: string;
  quantity: string;
}

class HrrStep {
  stepNo: number;
  text: string;
}

class Hrr {
  id: string;
  url: string;
  name: string;
  description: string;
  /** quantity of recipe */
  serving: string;
  created: string;
  updated: string;
  tips: string;
  userHistory: string;
  /** name of author */
  author: string;

  ingredients: HrrIngredient[];
  steps: HrrStep[];

  /**
   * <b>!!PACKAGE PRIVATE!! DO NOT CALL THIS.</b>
   */
  static convert(obj) {
    const self = new Hrr();
    self.id = obj.id.toString();
    self.url = obj.url;
    self.name = obj.name;
    self.description = obj.description;
    self.serving = obj.serving;
    self.created = obj.created;
    self.updated = obj.updated;
    self.tips = obj.service_data['cookpad.com'].tips;
    self.userHistory = obj.service_data['cookpad.com'].user_history;
    self.author = obj.user.name;

    self.ingredients = obj.ingredients.map((v, index) => {
      const ingredient = new HrrIngredient();
      ingredient.ingredientPosition = index;
      ingredient.name = v.name;
      ingredient.quantity = v.quantity;
      return ingredient;
    });

    self.steps = obj.steps.map((v, index) => {
      const step = new HrrStep();
      step.stepNo = index + 1;
      step.text = v.text;
      return step;
    });

    return self;
  }
}

export {Hrr, HrrIngredient, HrrStep};
