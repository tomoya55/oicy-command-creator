import "reflect-metadata"
import { Type, Expose, plainToClass } from "class-transformer"

export class HrrIngredient {
  ingredientPosition!: number
  name!: string
  quantity?: string
}

export class HrrStep {
  stepNo!: number
  text!: string
}

export class User {
  name!: string
}

export class Hrr {
  id!: string
  url!: string
  name!: string
  description?: string
  /** quantity of recipe */
  serving?: string
  created!: string
  updated!: string
  tips?: string
  userHistory?: string
  /** name of author */
  @Expose({ name: "user" })
  author!: User

  @Type(() => HrrIngredient)
  ingredients!: HrrIngredient[]
  @Type(() => HrrStep)
  steps!: HrrStep[]

  get authorName(): string {
    return this.author.name
  }

  /**
   * <b>!!PACKAGE PRIVATE!! DO NOT CALL THIS.</b>
   */
  static convert(obj: any): Hrr {
    const hrr = plainToClass(Hrr, obj)
    hrr.tips = obj.service_data["cookpad.com"].tips
    hrr.userHistory = obj.service_data["cookpad.com"].user_history
    hrr.ingredients.forEach((v, i) => {
      v.ingredientPosition = i
    })
    hrr.steps.forEach((v, i) => {
      v.stepNo = i + 1
    })
    return hrr
  }
}
