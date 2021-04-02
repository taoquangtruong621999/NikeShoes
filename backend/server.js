
import express from 'express';
import path from 'path';
import bodyparser from 'body-parser';
import config from './config';
import mongoose from 'mongoose';  
import userRoute from './routes/userRoute';
import productRoute from './routes/productRoute';
import orderRoute from './routes/orderRoute';
import uploadRoute from './routes/uploadRoute';
import mailRoute from './routes/mailRoute';
import nodemailer from "nodemailer";
const mongodbUrl = config.MONGODB_URL;
mongoose
  .connect(mongodbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .catch((error) => console.log(error.reason));

const app=express();
app.use(bodyparser.json());
app.use
// app.use('/api/consultation',mailRoute)
app.use('/api/uploads', uploadRoute);
app.use('/api/users', userRoute);
app.use('/api/products', productRoute);
app.use('/api/orders', orderRoute);
app.get('/api/config/paypal', (req, res) => {
  res.send(config.PAYPAL_CLIENT_ID);
});
app.use('/uploads', express.static(path.join(__dirname, '/../uploads')));
//  app.get("/api/products/:id",(req,res,next)=>{
//     const productId=req.params.id;
//    const product=data.products.find(x=>x._id===productId);
//      if(product)
//          res.send(product);
//      else
//          res.status(404).send({msg:"Product Not Found"});
// });
//  app.get("/api/products",(req,res,next)=>{
   
//      res.send(data.products);
//  });
app.use(express.static(path.join(__dirname, '/../frontend/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(`${__dirname}/../frontend/public/index.html`));
});
app.post('/api/consultation',async (req, res) => {
  // nodemailer.createTestAccount((err, account) => {
  //     const htmlEmail = `
  //         <h3>Contact deatails </h3>
  //         <ul>

  //             <li>Name: ${req.body.name} </li>
  //             <li>Phone: ${req.body.phone} </li>
  //             <li>Email: ${req.body.email} </li>
  //         </ul>
  //         <h3> Message <h3>
  //         <p>${req.body.content}</p>

  //     `
  //     let mailerConfig = {    
  //         host: "smtpout.secureserver.net",  
  //         secure: true,
  //         secureConnection: false, // TLS requires secureConnection to be false
  //         tls: {
  //             ciphers:'SSLv3'
  //         },
  //         requireTLS:true,
  //         port: 465,
  //         debug: true,
  //         auth: {
  //             user: "taoquangtruong621999@gmail.com",
  //             pass: "123456"
  //         }
  //     };
  //     let transporter = nodemailer.createTransport(mailerConfig);

  //     let mailOptions = {
  //         from: 'taoquangtruong621999@gmail.com',
  //         to: 'tqt621999@gmail.com',
  //         replyTo: 'testemail@gmail.com',
  //         subject: 'Some Subject',
  //         text: req.body.content,
  //         html: htmlEmail
  //     };

  //     transporter.sendMail(mailOptions, (err, info) => {
  //       if (err) {
  //         // ERROR SERVER RESPONSE
  //         res.status(500).send({status: 'FAIL', msg: 'Internal error: email not sent'})
          
  //       } else {
          
  //         // SUCCESS SERVER RESPONSE
  //         res.status(200).json({status: 'OK', msg: 'Email sent'})
          
  //       }
  //     });
  // })
  nodemailer.createTestAccount((err, account) => {
    if (err) {
        console.error('Failed to create a testing account. ' + err.message);
        return process.exit(1);
    }

    console.log('Credentials obtained, sending message...');

    // Create a SMTP transporter object
    let transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
            user: account.user,
            pass: account.pass
        }
    });

    // Message object
    let message = {
        from: 'Sender Name <taoquangtruong621999@gmail.com>',
        to: 'Recipient <tqt621999@gmail.com>',
        subject: 'Nodemailer is unicode friendly ✔',
        text: 'Hello to myself!',
        html: '<p><b>Hello</b> to myself!</p>'
    };

    transporter.sendMail(message, (err, info) => {
        if (err) {
            console.log('Error occurred. ' + err.message);
            return process.exit(1);
        }

        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
});
}
)

app.listen(config.PORT,()=>{console.log("Server started at http://localhost:5000")});