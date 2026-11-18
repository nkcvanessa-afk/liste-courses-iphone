# Prototype — Liste de courses iPhone

Prototype web mobile en HTML, CSS et JavaScript. Les articles sont conservés dans le stockage local du navigateur (localStorage), sur l'appareil.

## Lancer sur ordinateur

Depuis ce dossier, lancer un serveur local :

```bash
python3 -m http.server 8000
```

Puis ouvrir `http://localhost:8000` dans un navigateur. Pour tester depuis un iPhone sur le même Wi-Fi, ouvrir `http://ADRESSE-IP-DE-L-ORDINATEUR:8000` dans Safari. Le mode écran d’accueil et le service worker exigent un contexte sécurisé : HTTPS en hébergement, ou localhost pour les essais sur l'ordinateur.

## Envoyer avec WhatsApp

Le bouton « Envoyer » ouvre WhatsApp avec la liste préremplie, sans numéro de destinataire dans le lien. Dans WhatsApp, choisis toi-même ta conversation avec toi-même, puis appuie sur « Envoyer » pour transmettre le message.

Le bouton de l’application vide la liste locale au toucher, avant d’ouvrir WhatsApp. L’envoi du message reste manuel dans WhatsApp.

## À vérifier sur iPhone

- la dictée proposée par le clavier iOS dans Safari ;
- la conservation locale après fermeture et redémarrage ;
- l’ouverture de WhatsApp avec le texte prérempli, puis le choix de ta conversation avec toi-même ;
- l’ajout à l’écran d’accueil et l’ouverture en mode application.

L'ajout à l'écran d'accueil depuis Safari nécessite une adresse HTTPS. Aucun hébergement n'est configuré ou effectué par ce prototype.
