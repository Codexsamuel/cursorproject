export const EMAIL_CONFIG = {
  primary: {
    address: 'sobam@daveandlucesolutions.com',
    displayName: 'Obam Samuel Davy',
  },
  business: {
    info: 'info@daveandlucesolutions.com',
    support: 'support@daveandlucesolutions.com',
    contact: 'contact@daveandlucesolutions.com',
    admin: 'admin@daveandlucesolutions.com',
  },
  smtp: {
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true,
  },
  imap: {
    host: 'imap.hostinger.com',
    port: 993,
    secure: true,
  },
  dns: {
    mx: [
      { priority: 10, host: 'mx1.hostinger.com' },
      { priority: 20, host: 'mx2.hostinger.com' },
    ],
    spf: 'v=spf1 include:_spf.hostinger.com ~all',
    dmarc: 'v=DMARC1; p=quarantine; rua=mailto:sobam@daveandlucesolutions.com',
  },
  from: {
    name: 'DL Solutions',
    address: 'contact@dlsolutions.cm',
  },
  replyTo: {
    name: 'Support DL Solutions',
    address: 'support@dlsolutions.cm',
  },
  templates: {
    contactNotification: {
      subject: 'Nouveau message de contact - {{subject}}',
      text: `
        Nouveau message de contact reçu :

        Nom : {{name}}
        Email : {{email}}
        Téléphone : {{phone}}
        Service : {{service}}
        Sujet : {{subject}}
        Message : {{message}}

        Pour répondre à ce message, utilisez l'adresse email : {{email}}
      `,
    },
    contactConfirmation: {
      subject: 'Confirmation de votre message - DL Solutions',
      text: `
        Cher(e) {{name}},

        Nous avons bien reçu votre message et nous vous en remercions.
        Notre équipe vous répondra dans les plus brefs délais.

        Récapitulatif de votre message :
        Service : {{service}}
        Sujet : {{subject}}
        Message : {{message}}

        Pour toute question supplémentaire, n'hésitez pas à nous contacter.

        Cordialement,
        L'équipe DL Solutions
      `,
    },
  },
} as const; 