from django.db import models

class Connection(models.Model):
    type = models.CharField(max_length=50)
    connection_string = models.TextField()

class UploadedFile(models.Model):
    file = models.FileField(upload_to='uploads/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
