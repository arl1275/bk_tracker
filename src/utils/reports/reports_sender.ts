import nodemailer, { Transporter } from 'nodemailer';

// Configura el transportador
const transporter: Transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'tucorreo@gmail.com', // Tu dirección de correo electrónico
    pass: 'tupassword' // Tu contraseña de correo electrónico
  }
});

// Define la función para enviar el correo electrónico
const sendEmail = async (to: string, subject: string, htmlBody: string): Promise<void> => {
  try {
    // Configura el objeto de opciones para enviar el correo electrónico
    const mailOptions = {
      from: 'Tu Nombre <tucorreo@gmail.com>',
      to: to,
      subject: subject,
      html: htmlBody // Utiliza el cuerpo HTML
    };

    // Envía el correo electrónico
    const info = await transporter.sendMail(mailOptions);
    console.log('Correo electrónico enviado:', info.response);
  } catch (error) {
    console.error('Error al enviar el correo electrónico:', error);
    throw error;
  }
};

export default sendEmail;

