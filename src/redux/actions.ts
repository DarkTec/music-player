/*
 * action types
 */

export const CHANGE_SONG = 'CHANGE_SONG';

/*
 * action creators
 */

export function changeSong(tags, playing) {
  return { type: CHANGE_SONG, tags, playing }
}