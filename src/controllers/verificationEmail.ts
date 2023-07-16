import * as nodemailer from 'nodemailer';
import { v4 as uuidv4 } from "uuid";
import { verificationEmailUser, verificationEmailAppPass } from "../utils/config"
import Verification from "../models/Verification"
import User from "../models/User"

const users = [
    {
        name: "Seoyeon Park",
        email: "seoyeonpark1999sk@gmail.com"
    }
]

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // !!! MIGHT NEED TO CHANGE DEPENDING ON WHAT EMAIL WE USE
  port: 465, 
  secure: true, // true for 465, false for other ports
  auth: {
    user: verificationEmailUser,
    pass: verificationEmailAppPass 
  },
});


export function sendVerificationEmail(name: string, email: string): boolean {
  let verificationToken = uuidv4();

  let mailOptions = { // !!! CHANGE WORDING AND FORMAT
      from: verificationEmailUser,
      to: email,
      subject: "Verify Email YuHacks 2023",
      html: `<p>Hello, ${name}</p>
      <p>Thank you for registering an account for YuHacks 2023. Please click the following link to verify your email:</p>
      <a href="https://yuhacks.com/verifyUser/${verificationToken}">Verify Email</a>
      <p>If that doesn't work try using this link: https://yuhacks.com/verifyUser/${verificationToken}</p>`
  };

  transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        console.log("Error occurred:", error);
        return false;
      } else {
        console.log("Email sent:", info.response);
        const newVerification = new Verification({
          email: email,
          verificationToken: verificationToken,
          date: new Date()
        });
        await newVerification.save();
      }
    });

    return true;
}

export async function verifyToken(verificationToken: string): Promise<number> {
  try {
    const verification = await Verification.findOne({ verificationToken: verificationToken });
    if (!verification) return 404;

    const user = await User.findOne({ email: verification.email });
    if (!user) return 500;

    user.emailVerified = true;
    await user.save();
    await Verification.deleteOne({ verificationToken: verificationToken });
    console.log("User verified and verification entity deleted");
  } catch (err) {
    console.log(err);
    return 500;
  }
  
  return 200;
}
 


