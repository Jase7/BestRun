export class Sportsman {
  id:string;
  name: string = "";
  surnames: string = "";
  email: string = "";
  mobileNumber: string = "";
  photo: string;
  password: string = "";
  role: string = 'Admin';
  active: boolean = true;
  createdAt:String = new Date().toISOString();
}
