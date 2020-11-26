# Generated by Django 3.1.3 on 2020-11-25 16:40

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0017_team'),
    ]

    operations = [
        migrations.AddField(
            model_name='historicalnode',
            name='team',
            field=models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to='api.team'),
        ),
        migrations.AddField(
            model_name='node',
            name='team',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='api.team'),
        ),
    ]