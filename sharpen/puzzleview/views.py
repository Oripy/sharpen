from django.http import HttpResponse
from django.shortcuts import get_object_or_404, render
from django.template import loader

from .models import Puzzle

def index(request):
    puzzle_list = Puzzle.objects.order_by("-added_date")[:5]
    context = {
        "puzzle_list": puzzle_list,
    }
    return render(request, "puzzleview/index.html", context)

def puzzle(request, id):
    puzzle = get_object_or_404(Puzzle, id=id)
    authors = ', '.join([setter.setter.alias for setter in puzzle.puzzlesetter_set.all()])
    context = {
        "puzzle": puzzle,
        "authors": authors,
    }
    return render(request, "puzzleview/puzzle_page.html", context)