const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const sendEmailCreateOrder = async (email, orderItems) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: process.env.MAIL_ACCOUNT,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  let listItem = "";
  const attachImage = [];
  orderItems.forEach((order) => {
    listItem += `<div>
     <p>Bạn Đã đặt hàng tại shop với : </p>
     <div>Tên Sản Phẩm : ${order.name}</div>
     <b>Số Lượng : ${order.amount}</b>
     <div>Giá : ${order.price} VND</div>
     <p>Bên dưới là ảnh đính kèm : </p>
     </div>
    `;
    attachImage.push({ path: order.image });
  });

  const info = await transporter.sendMail({
    from: process.env.MAIL_ACCOUNT, // sender address
    to: "caohuy128@gmail.com", // list of receivers
    subject: "Bạn đã đặt hàng thành công tại Shop ✔", // Subject line
    text: "Hello world?", // plain text body
    html: `<div><b>Bạn đã đặt hàng thành công tại Shop</b></div> ${listItem} `,
    attachments: attachImage, // html body
  });
};

module.exports = { sendEmailCreateOrder };
