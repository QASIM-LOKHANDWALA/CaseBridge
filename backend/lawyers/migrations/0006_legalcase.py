# Generated by Django 5.2.3 on 2025-07-13 04:36

import django.db.models.deletion
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('clients', '0002_initial'),
        ('lawyers', '0005_lawyerprofile_cases_won_lawyerprofile_clients_served'),
    ]

    operations = [
        migrations.CreateModel(
            name='LegalCase',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('court', models.CharField(max_length=255)),
                ('case_number', models.CharField(max_length=50, unique=True)),
                ('next_hearing', models.DateField()),
                ('status', models.CharField(choices=[('active', 'Active'), ('closed', 'Closed'), ('pending', 'Pending'), ('on_hold', 'On Hold')], default='active', max_length=50)),
                ('priority', models.CharField(choices=[('low', 'Low'), ('medium', 'Medium'), ('high', 'High'), ('urgent', 'Urgent')], default='medium', max_length=50)),
                ('last_update', models.DateTimeField(default=django.utils.timezone.now)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('client', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='legal_cases', to='clients.generaluserprofile')),
                ('lawyer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='legal_cases', to='lawyers.lawyerprofile')),
            ],
        ),
    ]
