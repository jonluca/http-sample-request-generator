// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import type { CookieSerializeOptions } from "cookie";
import { serialize } from "cookie";

/**
 * This sets `cookie` using the `res` object
 */

export const setCookie = (
  res: NextApiResponse,
  name: string,
  value: unknown,
  options: CookieSerializeOptions = { httpOnly: true },
) => {
  const stringValue = typeof value === "object" ? "j:" + JSON.stringify(value) : String(value);

  if (typeof options.maxAge === "number") {
    options.expires = new Date(Date.now() + options.maxAge * 1000);
  }

  res.setHeader("Set-Cookie", serialize(name, stringValue, options));
};

interface Data {
  methodUsed: string;
  statusExpected: number;
  requestPayload: string;
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const url = (req.url || "").split("/");
  let status = 200;
  let method = req.method!;
  for (let i = 0; i < url.length; i++) {
    const component = url[i];
    const nextPartOfPath = url[i + 1];
    if (component === "status") {
      status = parseInt(nextPartOfPath, 10);
      if (Number.isNaN(status)) {
        status = 200;
      }
    }
    if (component === "method" && nextPartOfPath) {
      method = nextPartOfPath;
    }
    if (component === "set-cookie") {
      setCookie(res, "auth", "true");
    }
    if (component === "check-cookie") {
      const cookies = req.cookies;
      if (cookies.auth !== "true") {
        status = 401;
      }
      setCookie(res, "auth", "true");
    }
    if (component === "check-header") {
      const isAuthed = req.headers["x-custom-auth"] === "true";
      if (!isAuthed) {
        status = 401;
      }
    }
    if (component === "clear-cookies") {
      setCookie(res, "auth", "", { expires: new Date("1970-01-01") });
    }
  }
  res.status(status).json({ methodUsed: method, statusExpected: status, requestPayload: req.body });
}
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1mb",
    },
  },
};
