# Maxcard
![](icon.png)

## About
Maxcard is an interactive web application that allows users to guess a maximum if Yu-Gi-Oh! cards ion a limited time. The project is made in python/js, containerized with Docker and the files are served by Nginx.

## Features
Validated Card Addition: Users can enter the names of Yu-Gi-Oh! cards and add them to a validated list.
Card Validation and Display: Validated cards are displayed with their images.
Image Download and Save: Card images are downloaded and saved locally if they come from specific sources.
Time Management: A timer is displayed to limit the game time.
Import and Export: Users can import a list of validated cards from a file and export their validated cards to a file.
Scores and Leaderboard: Displays scores and top players.

## Usage
Clone the Repository:


    git clone https://github.com/Tuxiboule/Maxcard.git
    cd Maxcard

Run Docker Compose:

    docker-compose up --build

Access the Application:
Open your web browser and go to http://localhost:8000.

## Context - 
I was looking for new projects and came up with this idea upon discovering that there is a public API with Yu-Gi-Oh! cards. This project combines my interest in web development and my love for the Yu-Gi-Oh! game.

## Skills

- Django: Front/back
- JavaScript: Front
- Fetch API: js => django
- Docker
- Nginx

## Credits
[Tuxiboule](https://github.com/Tuxiboule)
