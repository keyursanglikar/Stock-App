import uuid
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from common.models import UUIDModel, TimeStampedModel


class UserManager(BaseUserManager):
    def create_user(self, phone, password=None, **extra_fields):
        if not phone:
            raise ValueError("Phone number is required for registration.")
        phone = phone.strip()
        user = self.model(phone=phone, **extra_fields)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_superuser(self, phone, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(phone, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin, UUIDModel, TimeStampedModel):
    phone = models.CharField(max_length=15, unique=True, db_index=True)
    full_name = models.CharField(max_length=150, blank=True)
    email = models.EmailField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'phone'
    REQUIRED_FIELDS = []

    def __str__(self):
        return f"{self.full_name} ({self.phone})" if self.full_name else self.phone


class Business(UUIDModel, TimeStampedModel):
    BUSINESS_TYPES = [
        ('kirana', 'Kirana & Grocery'),
        ('medical', 'Medical Store & Pharmacy'),
        ('hardware', 'Hardware & Sanitary'),
        ('cafe', 'Cafe & Bakery'),
        ('restaurant', 'Restaurant & Food Outlet'),
        ('distributor', 'Wholesale & Distributor'),
        ('other', 'General Retail'),
    ]

    name = models.CharField(max_length=200)
    business_type = models.CharField(max_length=30, choices=BUSINESS_TYPES, default='kirana')
    gstin = models.CharField(max_length=15, blank=True, null=True)
    state_code = models.CharField(max_length=2, default='27', help_text="GST State Code e.g. 27 for Maharashtra")
    phone = models.CharField(max_length=15, blank=True)
    address = models.TextField(blank=True)
    logo_url = models.URLField(blank=True, null=True)
    is_active = models.BooleanField(default=True, help_text="Always True for 100% Free SaaS")
    allow_negative_stock = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class BusinessMember(UUIDModel, TimeStampedModel):
    ROLES = [
        ('OWNER', 'Owner'),
        ('MANAGER', 'Manager'),
        ('STAFF', 'Staff'),
    ]

    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name='members')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='memberships')
    role = models.CharField(max_length=10, choices=ROLES, default='STAFF')
    can_view_profit = models.BooleanField(default=False)
    can_edit_price = models.BooleanField(default=False)

    class Meta:
        unique_together = ('business', 'user')

    def __str__(self):
        return f"{self.user.phone} - {self.business.name} ({self.role})"
