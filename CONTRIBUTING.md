SpawnKill - Quelques conventions
=========

Fonctionnement des branches
---------------------------

- La branche `master` est la branche stable. C'est cette version qui est releasée.
- La branche `dev` est la branche de développement. Si possible c'est de celle-ci que vous devez partir. Les modifications effectuées sur `dev` sont ensuite mergées dans `master` quand elles sont assez matures.
- Parfois, il est nécessaire d'effectuer une correction rapide alors qu'un développement est déjà en cours sur `dev` et que la branche ne peut pas être mergée maintenant avec `master`. Dans ce cas, la branche `hotfix` est utilisée. Le code d'`hotfix` est tiré de `master` est une fois la correction effectuée, elle est directement mergée dans `master` et `dev`.

Conventions de code
-------------------

### Conventions de nommage

- Les modules, variables et fonctions sont nommés en anglais. Vous pouvez vous inspirez des noms existants.

### Indentation

- L'indentation se fait avec des espaces et pas des tabulations. Un niveau d'indentation correspond à quatre espaces. La plupart des éditeurs permettent de remplacer les tabulations par des espaces à la saisie.

### Longueur des lignes

- Autant que possible, essayez de maintenir la longueur de vos lignes de code sous 80 caractères. Lorsque vous coupez une ligne trop longue, indentez la ligne suivante avec 8 espaces.

### Commentaires

- Commentez votre code pour faciliter sa lecture par ceux qui vont travailler dessus (il y a de grandes chances que ce soit moi :smile: ). Utilisez `//` pour commenter à l'intérieur des fonctions et `/** ... */` pour commenter les modules ou fonctions.

### Chaînes de caractères

- Utilisez toujours les double-quotes `"` pour délimiter vos chaînes de caractères.

### Déclarations de variables

- Déclarez toutes vos variables avant de les utiliser pour faciliter la compréhension du code.

---

D'autres règles suivront au fur-et-à-mesure du développement de l'application. Pensez à passer relire ce fichier de temps à autres :+1: