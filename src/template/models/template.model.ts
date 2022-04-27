import { ApiProperty } from '@nestjs/swagger';
import { Template } from '@prisma/client';

export class TemplateModel {
  @ApiProperty()
  id: string;

  @ApiProperty()
  body: string;

  @ApiProperty()
  subject: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  createdBy: string;

  @ApiProperty()
  createdAt: Date;

  static map(template: Template): TemplateModel {
    return {
      id: template.id,
      body: template.body,
      subject: template.subject,
      type: template.type,
      createdAt: template.createdAt,
      createdBy: template.userId,
    };
  }

  static mapCollection(templates: Template[]): TemplateModel[] {
    return templates.map((template) => TemplateModel.map(template));
  }
}
