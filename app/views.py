from email.mime import image
from django.shortcuts import render
import requests, os
from .models import Card, Player
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from maxcard import settings


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


def save_card_image(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        card_name = data.get('cardName')
        image_url = data.get('imageUrl')
        
        if not card_name or not image_url:
            return JsonResponse({'success': False, 'message': 'Missing card name or image URL.'}, status=400)
        
        try:
            # Download the image
            response = requests.get(image_url)
            if response.status_code == 200:
                # Parse the image URL to get the file name
                file_name = image_url.split('/')[-1]
                local_path = os.path.join(settings.MEDIA_ROOT,
                                          file_name)
                # Save the image to the local filesystem
                with open(local_path, 'wb') as f:
                    f.write(response.content)
        
                local_url = os.path.join(settings.MEDIA_URL,
                                         file_name)
                card_updated = Card.objects.get(NAME=card_name)
                card_updated.IMG = local_url
                card_updated.save()

                return JsonResponse({'success': True, 'localUrl': local_url})
            else:
                return JsonResponse({'success': False, 'message': 'Failed to download image.'}, status=500)
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)}, status=500)
    else:
        return JsonResponse({'success': False, 'message': 'Invalid request method.'}, status=405)
