import camelcaseKeys from 'camelcase-keys'
import type Client from '../Client'
import Transactions from '../resources/Transactions'
import DataModel from './DataModel'
import Witnesses from '../resources/Witnesses'
import Rewards from '../resources/Rewards'
import Challenges from '../resources/Challenges'

export type HotspotData = Omit<Hotspot, 'client'>

export type Bucket = 'hour' | 'day' | 'week'

export type NaturalDate = `-${number} ${Bucket}`

export interface HTTPHotspotObject {
  score_update_height?: number
  score?: number
  reward_scale?: number
  owner?: string
  name?: string
  location?: string
  lng?: number
  lat?: number
  block?: number
  block_added?: number
  geocode?: HTTPGeocodeObject
  address: string
  status?: {
    gps: string
    height: number
    online: string
    listen_addrs: string[]
  }
  nonce?: number
  speculative_nonce?: number
  timestamp_added?: string
  last_poc_challenge?: number
  last_change_block?: number
  gain?: number
  elevation?: number
}

interface HTTPGeocodeObject {
  short_street: string
  short_state: string
  short_country: string
  short_city: string
  long_street: string
  long_state: string
  long_country: string
  long_city: string
  city_id: string
}

interface Geocode {
  shortStreet: string
  shortState: string
  shortCountry: string
  shortCity: string
  longStreet: string
  longState: string
  longCountry: string
  longCity: string
}

interface Status {
  gps: string
  height: number
  online: string
  listenAddrs: string[]
}

export default class Hotspot extends DataModel {
  private client: Client

  public scoreUpdateHeight?: number

  public score?: number

  public rewardScale?: number

  public owner?: string

  public name?: string

  public location?: string

  public lng?: number

  public lat?: number

  public block?: number

  public geocode?: Geocode

  public address: string

  public status?: Status

  public nonce?: number

  public speculativeNonce?: number

  public blockAdded?: number

  public timestampAdded?: string

  public lastPocChallenge?: number

  public lastChangeBlock?: number

  public gain?: number

  public elevation?: number

  constructor(client: Client, hotspot: HTTPHotspotObject) {
    super()
    this.client = client
    this.scoreUpdateHeight = hotspot.score_update_height
    this.score = hotspot.score
    this.rewardScale = hotspot.reward_scale
    this.owner = hotspot.owner
    this.name = hotspot.name
    this.location = hotspot.location
    this.lng = hotspot.lng
    this.lat = hotspot.lat
    this.block = hotspot.block
    this.status = {
      gps: hotspot.status?.gps || '',
      height: hotspot.status?.height || 0,
      online: hotspot.status?.online || '',
      listenAddrs: hotspot.status?.listen_addrs || [],
    }
    this.nonce = hotspot.nonce
    this.speculativeNonce = hotspot.speculative_nonce
    this.blockAdded = hotspot.block_added
    this.timestampAdded = hotspot.timestamp_added
    this.lastPocChallenge = hotspot.last_poc_challenge
    this.lastChangeBlock = hotspot.last_change_block
    this.gain = hotspot.gain
    this.elevation = hotspot.elevation
    if (hotspot.geocode) {
      this.geocode = camelcaseKeys(hotspot.geocode) as any
    }
    this.address = hotspot.address
  }

  public get activity(): Transactions {
    return new Transactions(this.client, this)
  }

  public get witnesses(): Witnesses {
    return new Witnesses(this.client, this)
  }

  public get rewards(): Rewards {
    return new Rewards(this.client, this)
  }

  public get challenges(): Challenges {
    return new Challenges(this.client, this)
  }

  get data(): HotspotData {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { client, ...rest } = this
    return { ...rest }
  }
}
