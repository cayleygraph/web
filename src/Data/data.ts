export type ContentType = string;

export const write = (
  serverURL: string,
  contentType: ContentType,
  value: string | File
): Promise<Response> =>
  fetch(`${serverURL}/api/v2/write`, {
    method: "POST",
    headers: {
      "Content-Type": contentType
    },
    body: value
  });

export const runDelete = (
  serverURL: string,
  contentType: ContentType,
  value: string
): Promise<Response> =>
  fetch(`${serverURL}/api/v2/delete`, {
    method: "POST",
    headers: {
      "Content-Type": contentType
    },
    body: value
  });

export const read = (
  serverURL: string,
  contentType: string
): Promise<Response> =>
  fetch(`${serverURL}/api/v2/read`, {
    headers: {
      Accept: contentType
    }
  });
