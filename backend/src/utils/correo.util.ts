import * as nodemailer from 'nodemailer';
import * as QRCode from 'qrcode';

export async function enviarCorreoCreacion(
  destinatario: string,
  enlace: string,
) {
  try {
    const mailUser = process.env.MAIL_USER;
    const mailPass = process.env.MAIL_PASS;

    if (!mailUser || !mailPass) {
      throw new Error(
        'Faltan credenciales MAIL_USER o MAIL_PASS en las variables de entorno',
      );
    }

    const qrBuffer = await QRCode.toBuffer(enlace);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: mailUser,
        pass: mailPass,
      },
    });

    const html = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>🎉 ¡Tu encuesta ha sido creada!</h2>
        <p>Puedes compartir el siguiente enlace para que otras personas participen:</p>
        <p><a href="${enlace}" target="_blank">${enlace}</a></p>
        <p>Escanea este código QR para participar:</p>
        <img src="cid:qr-image" alt="Código QR" style="max-width: 200px;" />
        <p>Gracias por utilizar nuestra plataforma.</p>
      </div>
    `;

    await transporter.sendMail({
      from: `"Sistema de Encuestas" <${mailUser}>`,
      to: destinatario,
      subject: 'Tu encuesta ha sido creada',
      html,
      attachments: [
        {
          filename: 'qr.png',
          content: qrBuffer,
          cid: 'qr-image',
        },
      ],
    });

    console.log('📧 Correo enviado con QR');
  } catch (error) {
    console.error('❌ Error al enviar correo con QR:', error.message || error);
  }
}
