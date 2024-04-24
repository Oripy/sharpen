import uuid
from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User
from django.urls import reverse

class Setter(models.Model):
    alias = models.CharField(max_length=50)
    first_name = models.CharField(max_length=50, null=True)
    last_name = models.CharField(max_length=50, null=True)

    def __str__(self):
        return self.alias

class Puzzle(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=50, null=True)
    added_date = models.DateTimeField("date added", default=timezone.now)
    rules = models.TextField(null=True)

    def __str__(self):
        return f'{self.name} {self.id}'

    def get_absolute_url(self):
        return reverse("puzzle_page", kwargs={"id": self.id})

class Type(models.Model):
    type = models.CharField(max_length=200)

    def __str__(self):
        return self.type

class PuzzleType(models.Model):
    puzzle = models.ForeignKey(Puzzle, on_delete=models.CASCADE)
    puzzle_type = models.ForeignKey(Type, on_delete=models.RESTRICT)

class Link(models.Model):
    puzzle = models.ForeignKey(Puzzle, on_delete=models.CASCADE)
    url = models.CharField(max_length=2083)

    def __str__(self):
        return self.url

class Comment(models.Model):
    puzzle = models.ForeignKey(Puzzle, on_delete=models.CASCADE)
    author = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)
    date = models.DateTimeField("date posted", auto_now_add=True)
    content = models.TextField()

    def __str__(self):
        return f'{self.author.name} {self.content}'

class PuzzleSetter(models.Model):
    puzzle = models.ForeignKey(Puzzle, on_delete=models.CASCADE)
    setter = models.ForeignKey(Setter, null=True, on_delete=models.SET_NULL)
