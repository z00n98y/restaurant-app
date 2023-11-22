import { environment } from "src/environments/environment"


export class CardProperties {

    public static standardCardOptions = {
        style: environment.stripeStyle
    }

    public static standardCardNumberOptions = {
        style: environment.stripeStyle,
        showIcon: true
    }

    public static standardCardCvcOptions = {
        style: environment.stripeStyle,
    }

}