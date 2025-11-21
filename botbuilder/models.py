from django.db import models

class Bot(models.Model):
    name = models.CharField(max_length=100)
    configuration = models.TextField()  # Store the bot configuration as a JSON string

class Trade(models.Model):
    bot = models.ForeignKey(Bot, on_delete=models.CASCADE)
    trade_id = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    profit = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=50)
