Almost empty readme file.

# Hverdagshelt

Web applikasjon for å publisere og administrere vedlikeholdssaker til kommunen. 

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

For å installere og kjøre prosjektet må du ha git og npm installert. 

Gå til linken under, klikk på installasjonsfilen som er anvendelig for ditt operativsystem og følg installasjonsinstruksene.
```
https://git-scm.com/downloads
```

Gå til linken under, klikk på installasjonsfilen som er anvendelig for ditt operativsystem og følg installasjonsinstruksene.

```
https://nodejs.org/en/download/
```


### Installing

Last ned prosjektet til en lokal mappe:
```
git clone https://gitlab.stud.iie.ntnu.no/martimoa/hverdagshelt-team-6
```

Applikasjonene trenger tilgang til en SQL database. 
Miljøvariablene applikasjonen trenger for å koble seg til og kommunisere med databasen, må legges i en fil med navnet ".env" i "/server" mappen.

```
cd server
touch .env
```

Åpne .env filen i en testkeditor.
Bytt ut alle felter innpakket i stjerne med henholdsvis passord, bruker og tjener til databasen du skal bruke. 
Husk også å fjerne stjernene.
```
DB_PW = *database passord*
DB_USER = *database bruker*
DB_HOST = *database tjener*
EMAIL_USER = hverdagshelt.team6
EMAIL_PASS = j0XqIuQI9r9G
```

Deretter trenger vi kun å hente prosjektets, altså både tjenerens og klientens, avhengigheter (dependencies):
Fra rotmappa:
```
cd server
npm install
cd ./client
npm install
```

For å kjøre applikasjonen:
Tjener (fra rotmappa):

```
cd server
npm start
```
Åpne et nytt terminal-vindu og naviger til rotmappa til prosjektet.
Start klienten
```
cd client
npm start
```

For å bruke applikasjonen, åpne et nytt nettleservindu og gå til:
```
http://localhost:3000
```

