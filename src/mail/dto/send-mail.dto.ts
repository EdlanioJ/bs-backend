type Content = {
  key: string;
  value: string;
};

export class SendMailDto {
  to: string;
  type: string;
  content: Content[];
}
