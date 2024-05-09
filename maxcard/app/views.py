from django.shortcuts import render
import requests
from .models import Card


def home(request):
    # refresh_db()
    cards = Card.objects.all()
    return render(request, 'home.html', {'cards': cards})


def refresh_db():
    print("delete database")
    Card.objects.all().delete()
    print("refresh database")
    URL = "https://db.ygoprodeck.com/api/v7/cardinfo.php"
    # URL = "https://db.ygoprodeck.com/api/v7/cardinfo.php?fname=Wizard&attribute=light&race=spellcaster"
    response = requests.get(url=URL)
    for data in response.json()["data"]:
        card = Card(APIID=data["id"],
                    NAME=data["name"], TYPE=data["type"],
                    FRAMETYPE=data["frameType"],
                    DESC=data["desc"],
                    IMG=data["card_images"][0]["image_url_small"])
        card.save()
    return Card.objects.all()
