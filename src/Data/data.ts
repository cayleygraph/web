import * as mime from "../mime";

export const write = (
  serverURL: string,
  value: string | File
): Promise<Response> =>
  fetch(`${serverURL}/api/v2/write`, {
    method: "POST",
    body: value
  });

export const runDelete = (
  serverURL: string,
  value: string
): Promise<Response> =>
  fetch(`${serverURL}/api/v2/delete`, {
    method: "POST",
    body: value
  });

export const read = (serverURL: string): Promise<Response> =>
  fetch(`${serverURL}/api/v2/read`, {
    headers: {
      Accept: mime.N_QUADS
    }
  });
