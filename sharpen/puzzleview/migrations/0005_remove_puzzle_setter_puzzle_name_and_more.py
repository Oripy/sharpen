# Generated by Django 5.0.4 on 2024-04-12 09:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('puzzleview', '0004_setter_puzzle_rules_puzzlesetter_puzzle_setter'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='puzzle',
            name='setter',
        ),
        migrations.AddField(
            model_name='puzzle',
            name='name',
            field=models.CharField(max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='setter',
            name='first_name',
            field=models.CharField(max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='setter',
            name='last_name',
            field=models.CharField(max_length=50, null=True),
        ),
    ]
