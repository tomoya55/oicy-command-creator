import { TargetSubMrrKeys } from "./OicyRequest"

class View {
  name!: string
  props!: any
}
class OicyResponse {
  view: View = new View()
}
class OicyTrigger extends OicyResponse {
  position?: string
  linkText?: string
  readonly targetSubMrrKeys: TargetSubMrrKeys
  callback?: string

  /**
   * <b>!!PACKAGE PRIVATE!! DO NOT CALL THIS.</b>
   */
  constructor(nodeIds: string[], edgeIds: string[]) {
    super()
    this.targetSubMrrKeys = new TargetSubMrrKeys(nodeIds, edgeIds)
  }

  /**
   * @param range Number Array
   */
  setStepPosition(stepIndex: number, range: string[]) {
    this.position = `-device-view-step${stepIndex} ${range.join(",")}`
  }

  setIngredientBeforePosition(ingredientIndex: number) {
    this.position = `-device-view-ingredient${ingredientIndex}-before`
  }
}
enum HttpMethod {
  GET = 1,
  POST = 2,
  PUT = 3,
  DELETE = 4,
  PATCH = 5,
}
enum URLSchema {
  HTTP = 1,
  HTTPS = 2,
}
class OicyCommand extends OicyResponse {
  urlSchema?: URLSchema
  httpMethod?: HttpMethod
  domain?: string
  path?: string
  data?: string
}

class OicyTriggerCreator {
  create(nodeIds: string[], edgeIds: string[]): OicyTrigger {
    return new OicyTrigger(nodeIds, edgeIds)
  }
}

export { OicyResponse, OicyTrigger, OicyCommand, OicyTriggerCreator, HttpMethod, URLSchema }
