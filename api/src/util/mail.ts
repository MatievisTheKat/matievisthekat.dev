import { createTransport, SendMailOptions, SentMessageInfo } from "nodemailer";

namespace mail {
  export const transporter = createTransport({
    host: process.env["mail.host"],
    secure: process.env["mail.secure"] === "true" ? true : false,
    auth: {
      user: process.env["mail.user"],
      pass: process.env["mail.password"],
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  export async function send(options: SendMailOptions): Promise<SentMessageInfo> {
    if (!options.from) options.from = `matievisthekat.dev <${process.env["mail.user"]}>`;
    return await transporter.sendMail(options);
  }
}

export default mail;
