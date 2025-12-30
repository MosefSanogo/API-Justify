# Text Justification API
## Description
Cette application est une API REST développée en Node.js avec TypeScript permettant de justifier un texte selon les règles typographiques classiques.
Chaque ligne du texte retourné contient exactement 80 caractères, sauf la dernière ligne.

L’API implémente :

1. une authentification par token 
2. un rate limiting par token (80 000 mots par jour) 
3. une gestion stricte des types de contenu 
4. aucune bibliothèque externe pour l’algorithme de justification 

## Technologies utilisées
1. Node.js 
2. TypeScript 
3. Express.js 
4. Stockage en mémoire (Map) 
5. Aucun framework ou librairie externe pour la justification du texte 

## Structure du projet
src/ \
├── app.ts          # Configuration Express \
├── server.ts             # Lancement du serveur \
├── routes/ \
│   ├── token.route.ts    # Génération de token \
│   └── justify.route.ts  # Justification du texte \
├── middlewares/ \
│   ├── auth.middleware.ts \
│   └── rateLimit.middleware.ts \
├── services/ \
│   ├── token.service.ts \
│   └── justify.service.ts \
└── storage/ \
    └── memory.store.ts   # Stockage en mémoire 

## Authentification
### Génération d’un token
Endpoint : 
``` 
POST /api/token
``` 
Body (JSON) : 
```
{
email : "user@gmail.com"
}
```
Réponse :
```
{
token: "abacdsz"
}
```
Le token doit ensuite être envoyé dans le header Authorization. 

## Justification du texte
Endpoint
```
{
POST /api/justify
}
```
Headers requis
```
{
Authorization: Bearer <token>
Content-Type: text/plain
}
```
Body\
Texte brut (text/plain).\
Réponse\
Texte justifié avec :
1. 80 caractères par ligne
2. Espaces répartis uniformément
3. Dernière ligne non justifiée

## Rate limiting
1. 80 000 mots maximum par token et par jour
2. Au-delà de cette limite, l’API retourne :
```
HTTP 402 - Payment Required
```
Le compteur est automatiquement réinitialisé chaque jour.

## Installation et lancement
### Prérequis
1. Node.js ≥ 18
2. npm

### Installation
```
npm install
```
### Mode développement
```
npm start
````
Le serveur démarre par défaut sur :
```
http://localhost:3000
```
## Exemple avec curl
```
curl -X POST http://localhost:3000/api/justify \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: text/plain" \
  --data "Votre texte à justifier ici"
```
## Contraintes respectées
Justification à 80 caractères\
✔️ Endpoint ```/api/justify``` en POST\
✔️ Authentification par token\
✔️ Rate limit 80 000 mots / jour\
✔️ TypeScript\
✔️ Aucune librairie externe pour la justification\
✔️ Déployable sur une IP ou URL publique\
## Auteur
Mohamed Sanogo \
Étudiant en Master Informatique – Le Havre Normandie \
Développement Full Stack
