from django.db import models


class Card(models.Model):
    APIID = models.CharField(max_length=10000, blank=True)
    NAME = models.CharField(max_length=10000, blank=True)
    TYPE = models.CharField(max_length=10000, blank=True)
    FRAMETYPE = models.CharField(max_length=10000, blank=True)
    DESC = models.CharField(max_length=10000, blank=True)
    IMG = models.URLField(blank=True)
