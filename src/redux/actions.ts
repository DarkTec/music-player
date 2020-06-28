/*
 * action types
 */

export const CHANGE_SONG = 'CHANGE_SONG';

/*
 * action creators
 */

export function changeSong(text, playing) {
  return { type: CHANGE_SONG, text, playing }
}