import { Mrr } from "./Mrr"
import { Hrr } from "./Hrr"

/**
 * Target nodes & edges for this DeviceAction
 */
class TargetSubMrrKeys {
  readonly nodeIds: string[]
  readonly edgeIds: string[]

  constructor(nodeIds: string[], edgeIds: string[]) {
    this.nodeIds = nodeIds || []
    this.edgeIds = edgeIds || []
  }
}

class OicyRequest {
  /**
   * Local code (e.g. ja-JP)
   */
  readonly lcid: string
  readonly params: any
  readonly mrr: Mrr
  readonly targetSubMrrKeys: TargetSubMrrKeys
  /**
   * The ServingsForRate is changed by the user. Default value is 1
   */
  readonly changedServingsForRate: number
  readonly hrr: Hrr | null

  /**
   * <b>!!PACKAGE PRIVATE!! DO NOT CALL THIS.</b>
   */
  constructor(
    mrr: Mrr,
    params: any,
    targetSubMrrKeys: TargetSubMrrKeys,
    changedServingsForRate: number,
    hrr: Hrr | null
  ) {
    this.targetSubMrrKeys = targetSubMrrKeys
    this.mrr = mrr
    this.params = params
    this.changedServingsForRate = changedServingsForRate
    this.hrr = hrr
  }

  /**
   * <b>!!PACKAGE PRIVATE!! DO NOT CALL THIS.</b>
   */
  static create(
    mrr: Mrr,
    params: any,
    targetSubMrrKeysObj: any,
    changedServingsForRate: number,
    hrr: Hrr | null
  ): OicyRequest {
    let nodeIds = []
    let edgeIds = []
    if (targetSubMrrKeysObj) {
      nodeIds = targetSubMrrKeysObj.nodeIds
      edgeIds = targetSubMrrKeysObj.edgeIds
    }
    const targetSubMrrKeys = new TargetSubMrrKeys(nodeIds, edgeIds)
    return new this(mrr, params, targetSubMrrKeys, changedServingsForRate, hrr)
  }
}
export { OicyRequest, TargetSubMrrKeys }
