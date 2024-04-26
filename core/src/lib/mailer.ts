import nodemailer from 'nodemailer';

export async function sendTestMail() {
  // create reusable transporter object using the default SMTP transport
  // const transporter = nodemailer.createTransport({
  //   host: process.env.EMAIL_SERVER_HOST,
  //   port: process.env.EMAIL_SERVER_PORT,
  //   auth: {
  //     user: process.env.EMAIL_SERVER_USER, // generated ethereal user
  //     pass: process.env.EMAIL_SERVER_PASSWORD, // generated ethereal password
  //   },
  // });
  const transporter = nodemailer.createTransport(process.env.EMAIL_SERVER);

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Best To-Do" <' + process.env.EMAIL_FROM + '>', // sender address
    to: 'furkanalan@hotmail.com', // list of receivers
    subject: 'Email Testing', // Subject line
    text: 'Testing', // plain text body
    html: '<b>Testing</b>', // html body
  });

  console.log(info);
  return info;
}
