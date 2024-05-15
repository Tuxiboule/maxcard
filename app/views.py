from django.shortcuts import render
import requests
from .models import Card, Player
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json


def home(request):
    # refresh_db()
    cards = Card.objects.all()
    top_players = Player.objects.order_by('-score')[:10]
    return render(request,
                  'home.html',
                  {'cards': cards,
                   'top_players': top_players
                   })


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


def save_score(request):
    data = json.loads(request.body)
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        score = data.get('score')
        player = Player(username=username,
                        score=score)
        player.save()
        return JsonResponse({'message': 'Score saved successfully'})
    else:
        return JsonResponse({'message': 'Invalid request method'}, status=405)
