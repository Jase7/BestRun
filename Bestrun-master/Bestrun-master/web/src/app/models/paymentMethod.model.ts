export class PaymentMethod {
    name: String;
    ownerName: String; 
    type: String = "credit card";
    cardNumber: String;
    monthExpire: Number;
    yearExpire: Number;
    CVC: String;
}