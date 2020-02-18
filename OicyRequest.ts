import { Mrr } from "./Mrr"
import { Hrr } from "./Hrr"

export class UserDevice {
  readonly deviceId: string
  readonly deviceTypeNumber: string
  readonly deviceModelName: string
  readonly nickname: string

  constructor(deviceId: string, deviceTypeNumber: string, deviceModelName: string, nickname: string) {
    this.deviceId = deviceId
    this.deviceTypeNumber = deviceTypeNumber
    this.deviceModelName = deviceModelName
    this.nickname = nickname
  }
}

/**
 * Target nodes & edges for this DeviceAction
 */
export class TargetSubMrrKeys {
  readonly nodeIds: string[]
  readonly edgeIds: string[]

  constructor(nodeIds: string[], edgeIds: string[]) {
    this.nodeIds = nodeIds
    this.edgeIds = edgeIds
  }
}

export class OicyRequest {
  readonly params: any
  readonly mrr?: Mrr
  readonly targetSubMrrKeys?: TargetSubMrrKeys
  /**
   * The ServingsForRate is changed by the user. Default value is 1
   */
  readonly changedServingsForRate?: number
  readonly hrr?: Hrr
  readonly device?: UserDevice

  /**
   * <b>!!PACKAGE PRIVATE!! DO NOT CALL THIS.</b>
   */
  constructor(
    params: any,
    mrr?: Mrr,
    targetSubMrrKeys?: TargetSubMrrKeys,
    changedServingsForRate?: number,
    hrr?: Hrr,
    device?: UserDevice
  ) {
    this.params = params
    this.mrr = mrr
    this.targetSubMrrKeys = targetSubMrrKeys
    this.changedServingsForRate = changedServingsForRate
    this.hrr = hrr
    this.device = device
  }

  /**
   * <b>!!PACKAGE PRIVATE!! DO NOT CALL THIS.</b>
   */
  static create(
    params: any,
    mrr?: Mrr,
    targetSubMrrKeysObj?: any,
    changedServingsForRate?: number,
    hrr?: Hrr,
    device?: UserDevice
  ): OicyRequest {
    let nodeIds = []
    let edgeIds = []
    if (targetSubMrrKeysObj) {
      nodeIds = targetSubMrrKeysObj.nodeIds
      edgeIds = targetSubMrrKeysObj.edgeIds
    }
    const targetSubMrrKeys = new TargetSubMrrKeys(nodeIds, edgeIds)
    return new this(params, mrr, targetSubMrrKeys, changedServingsForRate, hrr, device)
  }
}
