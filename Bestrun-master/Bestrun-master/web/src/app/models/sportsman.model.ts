export class Sportsman {
  _id:string;
  name: string = "";
  surnames: string = "";
  email: string = "";
  mobileNumber: string = "";
  photo: string;
  password: string = "";
  role: string = 'Admin';
  active: boolean = true;
  createdAt:String = new Date().toISOString();
  address: String = "";
  shirtsize: String = "";
  poblation: String; 
  county: String;
  sex: String = "hombre";
  zipcode : String = "";
  dni : String = "";
  club : String  = "";
}
