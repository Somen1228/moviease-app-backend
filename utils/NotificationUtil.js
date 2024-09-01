const nodeMailer = require("nodemailer");


const sendEmail = (emails, subject, html, text) => {
    const emailIds = emails.join(', ')
    let transporter = nodeMailer.createTransport({
        service: "gmail",
        auth: {
            user: "somen1228@gmail.com",
            pass: "wkxccpuhoznxwbov"
        }
    });

    let mailDetails = {
        from: "somen1228@gmail.com",
        to: emailIds,
        subject
    }

    if(html) {
        mailDetails.html = html;
    }

    if(text) {
        mailDetails.text = text;
    }

    transporter.sendMail(mailDetails, function(err, data){
        if(err) {
            console.log("Unable to send email", err);
        } else {
            console.log(`Email sent successfully to ${emailIds}`);
        }
    })
}

module.exports = {
    sendEmail
}