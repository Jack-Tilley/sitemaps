# Generated by Django 3.1.3 on 2020-11-13 16:51

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_node_iconvalue'),
    ]

    operations = [
        migrations.AddField(
            model_name='node',
            name='created',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='node',
            name='modified',
            field=models.DateTimeField(auto_now=True),
        ),
    ]
