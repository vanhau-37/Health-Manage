import EventEmitter from 'events';

const _emitter = new EventEmitter()
_emitter.setMaxListeners(0); // khong gioi han nguoi nghe

export const emitter = _emitter;