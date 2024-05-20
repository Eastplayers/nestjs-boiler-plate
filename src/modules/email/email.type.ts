export type EmailAttachmentPayload = {
  file: any;
  name: string;
  type: string;
};

export type EmailType = {
  to?: string | string[];
  from?: string;
  subject: string;
  cc?: string;
  bcc?: string;
  template?: string;
  html?: string;
  text?: string;
};
