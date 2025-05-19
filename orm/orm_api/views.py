from django.shortcuts import render

# Create your views here.
# api/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from .serializers import ConnectionSerializer, UploadedFileSerializer


@method_decorator(csrf_exempt, name="dispatch")  # exempt CSRF for testing
class ConnectionView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ConnectionSerializer(data=request.data)
        print(serializer)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name="dispatch")  # exempt CSRF for testing
class FileUploadView(APIView):
    def post(self, request):
        serializer = UploadedFileSerializer(data=request.data)
        print(serializer)
        uploaded_file = request.FILES.get("file")
        if not uploaded_file:
            return Response({"error": "No file uploaded"}, status=400)
        file_content = uploaded_file.read()
        try:
            file_text = file_content
        except UnicodeDecodeError:
            file_text = None

        print("File content as text:", file_text)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
