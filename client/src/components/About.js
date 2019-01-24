// @flow
import * as React from 'react';
import { Component } from 'react-simplified';

class About extends Component {
  render() {
    return (
      <section>
        <h1>Om oss</h1>
        <p>
          HverdagsHelt er et system som skal standardisere kommunikasjon med din kommune. Dette fungerer ved at alle
          kommuner benytter seg av den samme tjenesten for å kommunisere med sine borgere. Nå har det ingenting å si om
          du vil snakke med Bergen kommune eller Alta kommune, det ser helt likt ut, og det fungere også helt likt.
        </p>
        <p>
          Vi er en studentbedrift bestående av studenter ved NTNU i Trondheim. Systemet er laget som et sammarbeidsprosjekt
          mellom IT-støttet bedriftsutvikling- og Dataingeniørstudenter.
        </p>
      </section>
    );
  }
}
export default About;
