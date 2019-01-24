// @flow
import * as React from 'react';
import { Component } from 'react-simplified';

class InfoPage extends Component {

    render() {
        return(
            <div>
                <h1>Velkommen!</h1>
                <p>
                    Det ser ikke ut til at du har vært her før!<br/>
                    Dette er HverdagsHelt-(en?), en plattform for å varsle kommunene rundt om i Norge om feil og mangler på kommunal infrastruktur.<br/>
                    Så er det såpeglatt utenfor mormors hus? Eller har det vært enormt snøfall og nå sitter bilen fast? <br/>
                    Eller har jordraset tatt hele blokka og nå ligger familien kalde begravet i jorden?<br/>
                </p>
                <p>
                    <strong> Da er HverdagsHelt stedet for deg!</strong>
                </p>
                <p>
                    Vi føler at de systemene og rutinene kommunene rundt om i Norge for øyeblikket bruker for å motta varsler på slike mangler er for lite brukervennlige.<br/>
                    Slik at mange velger å la være å varsle kommunen om problemet av ren frustrasjon.
                </p>
                <p>
                    <strong>Hjem</strong> viser deg sakene vi finner registrert i kommunen du for øyeblikket befinner deg i.<br/>
                    <strong>Registrer Sak</strong> tilbyr innsendingsskjema for å registrere en ny sak. For å registrere en ny sak, må du være registrert og logget inn.<br/>
                    Når du har registrert deg, vil du automatisk bli logget inn.<br/>
                    Du vil da se noen flere navigasjons-lenker i menyen øverst:<br/>
                    <strong>Abonnementer</strong> viser deg sakene du har abonnert og saker som er publisert av kommunen(e) du har abonnert på.<br/>
                    <strong>Varsler</strong> viser deg de sakene du ikke har sett de nyeste statuskommentarene enda.<br/>
                    <strong>Mine sider</strong> gir deg mulighet til å endre dine personopplysninger, kontaktinformasjon og passord,<br/>
                    og viser deg en liste over de sakene du selv har publisert, for å nevne noen ting.
                </p>
                <p>
                    Vi håper din opplevelse med oss er så smertefri som mulig og at du lett som bare det kan varsle kommunen din om ting du mener de må løse!
                </p>
            </div>
        );
    }
}
export default InfoPage;