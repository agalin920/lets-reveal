import { atom, selector } from "recoil";

interface Tile {
  answer: string
  revealedBy: string,
}

interface LogItem {
  timestamp: string
  participant: string,
  message: string,
}

export interface RoomData {
  loaded: boolean,
  roomName: string,
  tiles: Tile[],
  log: LogItem[],
  participants: string[],
  imgUrl: string,
}

export const roomDataState = atom({
  key: 'roomDataState',
  default: {
    loaded: false,
    roomName: '',
    tiles: [],
    log: [],
    participants: [],
    imgUrl: '',
  } as RoomData,
});

export const roomLoaded = selector({
  key: 'roomLoaded',
  get: ({get}) => get(roomDataState).loaded,
});

export const roomName = selector({
  key: 'roomName',
  get: ({get}) => get(roomDataState).roomName,
});

export const roomTiles = selector({
  key: 'roomTiles',
  get: ({get}) => get(roomDataState).tiles,
});

export const roomLog = selector({
  key: 'roomLog',
  get: ({get}) => get(roomDataState).log,
});