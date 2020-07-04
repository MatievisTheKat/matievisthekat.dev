const mailer = require("nodemailer");

async function send(to, subject, body, customTransport = { user, pass }) {
  const transporter = mailer.createTransport({
    host: "webmail.matievisthekat.dev",
    port: 465,
    secure: true,
    auth: {
      user: customTransport ? user : "no-reply@matievisthekat.dev",
      pass: customTransport ? pass : process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const info = await transporter.sendMail({
    from: `"MatievisTheKat" <${from || "no-reply@matievisthekat.dev"}>`,
    to,
    subject,
    text: body,
    html: body,
  });

  return info;
}

module.exports = send;
