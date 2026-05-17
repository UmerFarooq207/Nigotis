import { sendMail } from "./sendMail";


export async function sendWhatsappFeatureDeactivated(email, name) {
  try {
    const message = `
      <br>Dear ${name},
      <br>This is to inform you that the WhatsApp feature has been deactivated for your account.
      <br>If this was done in error or you would like to reactivate the feature, please contact our support team.
      <br><br>Regards,
      <br><b>Nigotis</b>`;

    await sendMail(
      email,
      `WhatsApp Feature Deactivated | Nigotis`,
      message
    );
  } catch (error) {
    console.error(error);
  }
}


export async function sendWhatsappFeatureActivated(email, name) {
  try {
    const message = `
      <br>Dear ${name},
      <br>Good news! The WhatsApp feature has been successfully activated for your account.
      <br>You can now start using it to enhance your communication with customers.
      <br><br>Regards,
      <br><b>Nigotis</b>`;

    await sendMail(
      email,
      `WhatsApp Feature Activated | Nigotis`,
      message
    );
  } catch (error) {
    console.error(error);
  }
}


export async function sendWhatsappFeatureRequestAcknowledgement(email, name) {
  try {
    const message = `
      <br>Dear ${name},
      <br>We have received your request to activate the WhatsApp feature for your account.
      <br>Our team is currently reviewing your request. We will notify you once the feature is activated.
      <br>Thank you for your patience.
      <br><br>Regards,
      <br><b>Nigotis</b>`;

    await sendMail(
      email,
      `WhatsApp Feature Request Received | Nigotis`,
      message
    );
  } catch (error) {
    console.error(error);
  }
}
