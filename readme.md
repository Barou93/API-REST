Exemple-NodeJS-api<br>

Un exemple d'API node js pour un backend Réseau social , creation d'utilisateur, messages et Likes.<br><br>

PARTIE I : Télécharger et développer en local
Méthode 1 : Depuis github

1. Clonez le référentiel, installez les packages de nœuds et vérifiez les routes localement<br><br>

npm install<br>
npm start<br>
Créer une base de donnée MySql avec WorkBrench et Sequelize.

Ensuite ajouter le mot de passe de votre base de donnée dans le fichier config.js et ajouter votre signature Token dans le fichier jwt.utlis.js. ensuite tester l'API à l'aide de POSTMAN ou POSTWOMAN<br>
Ouvrez votre navigateur local et vérifiez que fonctionne en accédant à : <br>

Routes POST<br>
POUR CREER DES USERS . <br><br>

http://localhost:8080/api/users/register/<br><br>

http://localhost:8080/api/users/login/<br><br>
CREATE NEW MESSAGE<br><br>
http://localhost:8080/api/messages/new/<br><br>

ADD LIKE AND DISLIKE<br><br>
http://localhost:8080/api/messages/:messageId/vote/like<br><br>
http://localhost:8080/api/messages/:messageId/vote/dislike<br><br>

ROUTES GET<br><br>
GET MESSAGE<br><br>
http://localhost:8080/api/messages/<br><br>
GET USER PROFILE<br>
http://localhost:8080/api/users/me/<br><br>

ROUTE PUT<br><br>
UPDATE USER PROFILE<br>
http://localhost:8080/api/users/me/
