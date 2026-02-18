from django.urls import path
from . import views

urlpatterns = [
    # Auth
    path('register/', views.register_view),
    path('login/', views.login_view),

    # Profile
    path('profile/', views.profile_view),
    path('profile/update/', views.update_profile),

    # Admin APIs
    path('admin/users/', views.admin_users_list),
    path('admin/users/create/', views.admin_create_user),
    path('admin/users/<int:user_id>/update/', views.admin_update_user),
    path('admin/users/<int:user_id>/delete/', views.admin_delete_user),
]
