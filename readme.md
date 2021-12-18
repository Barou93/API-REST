Exemple-NodeJS-api

Un exemple d'API node js pour un backend Réseau social , creation d'utilisateur, messages et Likes.

PARTIE I : Télécharger et développer en local
Méthode 1 : Depuis github

1. Clonez le référentiel, installez les packages de nœuds et vérifiez les routes localement

npm install
npm start
Créer une base de donnée MySql avec WorkBrench et Sequelize.

Ensuite ajouter le mot de passe de votre base de donnée dans le fichier config.js et ajouter votre signature Token dans le fichier jwt.utlis.js. ensuite tester l'API à l'aide de POSTMAN ou POSTWOMAN
Ouvrez votre navigateur local et vérifiez que fonctionne en accédant à :
Routes POST
POUR CREER DES USERS
http://localhost:8080/api/users/register/
http://localhost:8080/api/users/login/
CREATE NEW MESSAGE
http://localhost:8080/api/messages/new/

ADD LIKE AND DISLIKE
http://localhost:8080/api/messages/:messageId/vote/like
http://localhost:8080/api/messages/:messageId/vote/dislike

ROUTES GET
GET MESSAGE
http://localhost:8080/api/messages/
GET USER PROFILE
http://localhost:8080/api/users/me/

ROUTE PUT
UPDATE USER PROFILE
http://localhost:8080/api/users/me/
