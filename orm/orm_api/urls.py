from django.urls import path
from .views import ConnectionView, FileUploadView

urlpatterns = [
    path('connection', ConnectionView.as_view(), name='connection'),
    path('upload-file', FileUploadView.as_view(), name='upload-file'),
]