from django.contrib import admin

from .models import Puzzle, Type, PuzzleType, Link, Setter, Comment, PuzzleSetter

# admin.site.register(Puzzle)
admin.site.register(Type)
# admin.site.register(PuzzleType)
# admin.site.register(Link)
admin.site.register(Setter)
admin.site.register(Comment)
# admin.site.register(PuzzleSetter)

class TypeInline(admin.StackedInline):
    model = PuzzleType

class SetterInline(admin.StackedInline):
    model = PuzzleSetter

class LinkInline(admin.StackedInline):
    model = Link

class PuzzleAdmin(admin.ModelAdmin):
    fieldsets = [
        (None, {"fields": ["title", "added_date", "rules"]}),
        # ("Date information", {"fields": ["pub_date"], "classes": ["collapse"]}),
    ]
    inlines = [SetterInline, LinkInline, TypeInline]


admin.site.register(Puzzle, PuzzleAdmin)