export interface ISubmitParams {
  questionnaireId: number; //问卷id
  content: ISubmitContent[]; //回答的内容
}

export interface ISubmitContent {
  questionId: number; //问题id
  answer: {
    ext: string;
    key: number;
    value: string;
  }[]; //用户选项或回答
}

export interface IQuestions {
  id: number; //主键ID
  questionnaireId: number; //问卷id
  title: string; //题目
  type: number; //类型 0:单选 1: 多选
  image: string; //图片
  options: [
    {
      ext: string;
      key: number;
      value: string;
    },
  ]; //选项
  sort: number; //排序
  createdAt: string; //创建时间
}

export interface ISurveyList {
  title: string; //问卷标题
  questions: IQuestions[];
  isCan: boolean; //是否可以问卷答题
  isComplete: boolean; //用户是否完成过答题
}
