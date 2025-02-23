import nodemailer from "nodemailer";

async function sendAppointmentEmail(fullName, email, doctorName, slotDate, slotTime) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Appointment Confirmation",
        text: `Hello ${fullName},\n\nYour appointment with Dr. ${doctorName} on ${slotDate} at ${slotTime} has been confirmed.\n\nThank you for choosing our service!\n\nBest Regards,\nYour Clinic Team`,
    };

    return transporter.sendMail(mailOptions);
}

export default sendAppointmentEmail;
