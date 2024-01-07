"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path
from .views import register_user, user_login, user_logout, QuizQuestionList, QuizHistoryListCreateView, QuizHistoryRetrieveView


urlpatterns = [
    path('register/', register_user, name='register'),
    path('login/', user_login, name='login'),
    path('logout/', user_logout, name='logout'),
    path('questions/', QuizQuestionList.as_view(),name='questions'),
    path('quizhistories/', QuizHistoryListCreateView.as_view(), name='quizhistory-list-create'),
    path('quizhistories/<int:pk>/', QuizHistoryRetrieveView.as_view(), name='quizhistory-retrieve'),

]