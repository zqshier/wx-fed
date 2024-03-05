import { ISubmitParams, ISurveyList } from '@/dto/survey';
import { get, post } from '@/utils/http';
enum Api {
  info = '/api/questionnaire',
  submit = '/api/questionnaire/submit',
}

export function getQuestionnaire(questionnaireId: number): Promise<any> {
  return get<ISurveyList>({ url: `${Api.info}/${questionnaireId}` });
}

export const submitQuestionnaire = async (data: ISubmitParams) => post({ url: `${Api.submit}`, data });
