from rest_framework.decorators import api_view, permission_classes, parser_classes, authentication_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models import Q

from .models import CustomUser
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer
from .permissions import IsAdminUserCustom


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'access': str(refresh.access_token),
        'refresh': str(refresh),
    }


# REGISTER API

@api_view(['POST'])
@permission_classes([AllowAny])
@authentication_classes([])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        tokens = get_tokens_for_user(user)
        return Response({
            "message": "User registered successfully",
            "tokens": tokens,
            "user": UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# LOGIN API (Same for Admin & User)

@api_view(['POST'])
@permission_classes([AllowAny])
@authentication_classes([])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']

        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return Response({"error": "Invalid email or password"}, status=400)

        if not user.check_password(password):
            return Response({"error": "Invalid email or password"}, status=400)

        tokens = get_tokens_for_user(user)

        return Response({
            "message": "Login successful",
            "tokens": tokens,
            "user": UserSerializer(user).data
        }, status=200)

    return Response(serializer.errors, status=400)


# PROFILE VIEW (Protected)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    user = request.user
    serializer = UserSerializer(user)
    return Response(serializer.data)


# UPDATE PROFILE (Image Upload Supported)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def update_profile(request):
    user = request.user
    serializer = UserSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({
            "message": "Profile updated successfully",
            "user": serializer.data
        })
    return Response(serializer.errors, status=400)


# ADMIN: GET ALL USERS + SEARCH

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUserCustom])
def admin_users_list(request):
    search = request.GET.get('search', '')
    users = CustomUser.objects.filter(
        Q(email__icontains=search) | Q(username__icontains=search)
    ).order_by('-date_joined')

    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


# ADMIN: CREATE USER

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUserCustom])
def admin_create_user(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({
            "message": "User created by admin",
            "user": UserSerializer(user).data
        }, status=201)
    return Response(serializer.errors, status=400)


# ADMIN: UPDATE USER

@api_view(['PUT'])
@permission_classes([IsAuthenticated, IsAdminUserCustom])
def admin_update_user(request, user_id):
    try:
        user = CustomUser.objects.get(id=user_id)
    except CustomUser.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

    serializer = UserSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({
            "message": "User updated successfully",
            "user": serializer.data
        })
    return Response(serializer.errors, status=400)


# ADMIN: DELETE USER

@api_view(['DELETE'])
@permission_classes([IsAuthenticated, IsAdminUserCustom])
def admin_delete_user(request, user_id):
    try:
        user = CustomUser.objects.get(id=user_id)
        user.delete()
        return Response({"message": "User deleted successfully"})
    except CustomUser.DoesNotExist:
        return Response({"error": "User not found"}, status=404)
