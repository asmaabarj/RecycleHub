# 🌱 RecycleHub

## 📋 Table des matières
- [À propos du projet](#-à-propos-du-projet)
- [Technologies utilisées](#-technologies-utilisées)
- [Fonctionnalités](#-fonctionnalités)
- [Installation](#-installation)
- [Structure du projet](#-structure-du-projet)
- [Captures d'écran](#-captures-décran)

## 🌟 À propos du projet
RecycleHub est une application web moderne de gestion de recyclage qui facilite la mise en relation entre particuliers et collecteurs agréés. Cette Single Page Application (SPA) vise à automatiser et simplifier le processus de recyclage.

## 🛠 Technologies utilisées
- ![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white) Angular 17
- ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) TypeScript
- ![NgRx](https://img.shields.io/badge/NgRx-BA2BD2?style=for-the-badge&logo=redux&logoColor=white) NgRx pour la gestion d'état
- ![RxJS](https://img.shields.io/badge/RxJS-B7178C?style=for-the-badge&logo=reactivex&logoColor=white) RxJS
- ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) Tailwind CSS

## ✨ Fonctionnalités

### 👤 Authentification
- Inscription (particuliers)
- Connexion sécurisée
- Gestion de profil
- Suppression de compte

### 📦 Gestion des collectes
- Soumission de demandes de collecte
- Suivi des statuts en temps réel
- Modification/suppression des demandes en attente
- Limite de 3 demandes simultanées
- Maximum 10kg par collecte

### 🚛 Interface collecteur
- Visualisation des demandes par ville
- Gestion des statuts de collecte
- Validation des matériaux sur place
- Prise de photos

### 💰 Système de points
- Attribution automatique selon barème :
  - Plastique : 2 pts/kg
  - Verre : 1 pt/kg
  - Papier : 1 pt/kg
  - Métal : 5 pts/kg
- Conversion en bons d'achat :
  - 100 pts ➡️ 50 Dh
  - 200 pts ➡️ 120 Dh
  - 500 pts ➡️ 350 Dh

## 🚀 Installation
```bash
# Cloner le projet
git clone https://github.com/asmaabarj/recyclehub.git

# Installer les dépendances
cd recyclehub
npm install

# Lancer le serveur de développement
ng serve

# Accéder à l'application
http://localhost:4200
```

## 📁 Structure du projet
```
recyclehub/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── guards/
│   │   │   ├── interceptors/
│   │   │   ├── models/
│   │   │   ├── services/
│   │   │   └── state/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   ├── collection/
│   │   │   └── profile/
│   │   └── shared/
│   │       ├── components/
│   │       ├── directives/
│   │       └── pipes/
│   ├── assets/
│   └── environments/
```

## 📸 Captures d'écran

<p align="center">
  <img src="image-1.png" width="300">
  <img src="image-2.png" width="300">
  <img src="image-3.png" width="300">
  <img src="image-4.png" width="300">
</p>

<p align="center">
  <img src="image-5.png" width="300">
  <img src="image-6.png" width="300">
  <img src="image-7.png" width="300">
  <img src="image-8.png" width="300">
</p>

## 🔒 Sécurité
- Authentification sécurisée
- Protection des routes avec Guards
- Validation des formulaires
- Gestion des erreurs

## 🌐 État de l'application
Gestion centralisée avec NgRx :
- Actions
- Reducers
- Effects
- Selectors


