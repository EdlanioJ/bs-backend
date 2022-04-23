import { Template } from '@prisma/client';

export class TemplateModel {
  id: string;
  body: string;
  subject: string;
  type: string;
  createdBy: string;
  createdAt: Date;

  static map(template: Template): TemplateModel {
    return {
      ...template,
      createdBy: template.userId,
    };
  }

  static mapCollection(templates: Template[]): TemplateModel[] {
    return templates.map(TemplateModel.map);
  }
}
