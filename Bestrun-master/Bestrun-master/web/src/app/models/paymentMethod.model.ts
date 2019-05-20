export class PaymentMethod {
    name: String;
    type: String = "credit card";
    cardNumber: String;
    monthExpire: Number;
    yearExpire: Number;
    CVC: String;
}