from rest_framework.permissions import BasePermission

class IsUser(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        u = request.user
        return bool(u and u.is_authenticated and (u.is_staff or u.is_superuser))

class IsOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        owner = getattr(obj, "user", None) or obj
        return owner == user

class IsOwnerOrAdmin(BasePermission):
    def has_object_permission(self, request, view, obj):
        return IsOwner().has_object_permission(request, view, obj) or IsAdmin().has_permission(request, view)
