import {
  ALL_STATUS_CODES,
  GET_METHOD,
  KNOWN_METHODS,
  MOST_COMMON_HTTP_STATUS_CODES,
  POST_METHOD,
  TEST_METHOD_NOT_IN_SPEC,
} from "./constants";
import { faker } from "@faker-js/faker";

export function createRandomData() {
  return {
    userId: faker.datatype.uuid(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    avatar: faker.image.avatar(),
    password: faker.internet.password(),
    birthdate: faker.date.birthdate().toISOString(),
    registeredAt: faker.date.past().toISOString(),
  };
}
export interface IResult {
  id: string;
  status: number;
  path: string;
}
interface IOptions {
  full: boolean;
  auth: boolean;
  addResult: (result: IResult) => void;
}
function getFormData(object: Record<string, string>) {
  const formData = new FormData();
  Object.keys(object).forEach((key) => formData.append(key, object[key]));
  return formData;
}
const getFetch = (addResult: (result: IResult) => void) => async (url: string, options: RequestInit) => {
  try {
    const resp = await fetch(url, options);
    const respUrl = new URL(resp.url);
    addResult({ id: faker.datatype.uuid(), status: resp.status, path: respUrl.pathname });
  } catch (error) {
    return error;
  }
};
export const generateRequests = async ({ full, auth, addResult }: IOptions) => {
  const safeFetch = getFetch(addResult);
  for (const method of KNOWN_METHODS) {
    await safeFetch(`/api/methods/${method.toLowerCase()}`, { method });
  }

  const statuses = full ? ALL_STATUS_CODES : MOST_COMMON_HTTP_STATUS_CODES;
  for (const status of statuses) {
    const value = createRandomData();
    const params = new URLSearchParams(value);
    const formData = getFormData(value);

    await safeFetch(`/api/status/${status}`, { method: GET_METHOD });
    await safeFetch(`/api/status/${status}/query-params?${params.toString()}`, { method: GET_METHOD });
    await safeFetch(`/api/status/${status}/json-body`, { method: POST_METHOD, body: JSON.stringify(value) });
    await safeFetch(`/api/status/${status}/form-data`, { method: POST_METHOD, body: formData });
  }

  if (auth) {
    await safeFetch(`/api/clear-cookies`, { method: POST_METHOD });
    await safeFetch(`/api/check-cookie`, { method: POST_METHOD });
    await safeFetch(`/api/set-cookie`, { method: POST_METHOD });
    await safeFetch(`/api/check-cookie`, { method: POST_METHOD });
    await safeFetch(`/api/check-header`, { method: POST_METHOD });
    await safeFetch(`/api/check-header`, { method: POST_METHOD, headers: { "X-Custom-Auth": "true" } });
  }

  await safeFetch(`/api/methods/${TEST_METHOD_NOT_IN_SPEC.toLowerCase()}`, { method: TEST_METHOD_NOT_IN_SPEC });
};

export default generateRequests;
