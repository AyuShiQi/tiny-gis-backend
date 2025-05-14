export interface ListProject {
  id: string;
  updateTime: string;
  createTime: string;
  title: string;
  modelsArr: any[]; // ModuleJSON[]
  globalObj: any;   // GlobalObj 类型也可以单独声明
  url: string;
  coordinates: [number, number];
  radius: number;
  layers: boolean;
}

export type GetProjsRes = {
  code: number;
  message: string;
  data: ListProject[];
};
