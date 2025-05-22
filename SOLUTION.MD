# Solution Mise à Jour

## Objectif
Créer un chatbot interactif qui permet :
- De sélectionner une question.
- D'ajouter des lieux et des items.
- De construire un message clair et structuré.
- De filtrer les lieux par type et les items par catégorie.

## Étapes principales

1. **Sélection de question**
   - Ajout du composant `QuestionSelector` pour choisir une question.
   - La question sélectionnée est insérée automatiquement dans le champ de saisie.
   - Lors de l'envoi d'un message, le `QuestionSelector` est réinitialisé à son état par défaut pour permettre une nouvelle sélection.
   - Les lieux et items sont réinitialisés uniquement si la nouvelle question est différente de la précédente.

2. **Ajout de lieux et d'items**
   - Composants `LocationSelector` et `ItemSelector` pour choisir des lieux et des items.
   - Les noms des lieux et items sont ajoutés dynamiquement au message.
   - Les lieux et items peuvent être filtrés respectivement par type et par catégorie.

3. **Mise à jour en temps réel**
   - Le message se met à jour automatiquement lorsque des lieux ou items sont sélectionnés.
   - Les mots-clés `x` et `y` dans le message sont remplacés dynamiquement par les items et lieux sélectionnés.

4. **Améliorations visuelles**
   - Utilisation de Tailwind CSS pour une interface claire et moderne.
   - Réorganisation de l'interface pour afficher la génération de questions dans une barre latérale, laissant plus d'espace pour le chat.

5. **Gestion des données dynamiques**
   - Les données (questions, lieux, items) sont récupérées via des API.
   - L'utilisateur est guidé pour formuler des requêtes avec les termes exacts présents dans la base de données.

## Résultat
- Une interface simple et intuitive.
- Un message structuré avec les sélections de l'utilisateur.
- Une meilleure visibilité grâce à une interface réorganisée.
- Une expérience utilisateur améliorée avec des réinitialisations automatiques et des mises à jour dynamiques.

## Prochaines étapes
- Ajouter des tests pour valider les fonctionnalités.
- Améliorer la gestion des erreurs.
- Rendre le chatbot plus interactif.