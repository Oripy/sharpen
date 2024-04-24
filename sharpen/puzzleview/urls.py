from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("<id>/", views.puzzle, name="puzzle_page"),
]