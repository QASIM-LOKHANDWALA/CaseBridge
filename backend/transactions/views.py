from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db.models import Q, Sum
from decimal import Decimal

from .models import Transaction, LawyerProfile, GeneralUserProfile
from .serializers import TransactionSerializer

from dotenv import load_dotenv
import os

load_dotenv()
debug = os.getenv("DEBUG", "False")


class CreatePaymentRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            lawyer_profile = LawyerProfile.objects.get(user=request.user)

            client_id = request.data.get('client_id')
            amount = request.data.get('amount')
            description = request.data.get('description', '')

            if not all([client_id, amount]):
                return Response({'error': 'Client ID and amount are required'}, status=status.HTTP_400_BAD_REQUEST)

            try:
                amount = Decimal(str(amount))
                if amount <= 0:
                    return Response({'error': 'Amount must be greater than 0'}, status=status.HTTP_400_BAD_REQUEST)
            except (ValueError, TypeError):
                return Response({'error': 'Invalid amount format'}, status=status.HTTP_400_BAD_REQUEST)

            client_profile = GeneralUserProfile.objects.get(id=client_id)

            transaction = Transaction.objects.create(
                user=client_profile,
                lawyer=lawyer_profile,
                amount=amount,
                description=description,
                status='pending'
            )

            serializer = TransactionSerializer(transaction)
            return Response({'message': 'Payment request created successfully', 'transaction': serializer.data}, status=status.HTTP_201_CREATED)

        except LawyerProfile.DoesNotExist:
            return Response({'error': 'Lawyer profile not found'}, status=status.HTTP_404_NOT_FOUND)
        except GeneralUserProfile.DoesNotExist:
            return Response({'error': 'Client not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': f'An error occurred: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class DeletePaymentRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, transaction_id):
        try:
            lawyer_profile = LawyerProfile.objects.get(user=request.user)

            transaction = get_object_or_404(Transaction, id=transaction_id, lawyer=lawyer_profile)

            if transaction.status != 'pending':
                return Response({
                    'error': 'Only pending payment requests can be deleted.'
                }, status=status.HTTP_400_BAD_REQUEST)

            transaction.delete()
            return Response({
                'message': 'Payment request deleted successfully.'
            }, status=status.HTTP_204_NO_CONTENT)

        except LawyerProfile.DoesNotExist:
            return Response({
                'error': 'Lawyer profile not found.'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'error': f'An error occurred: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class LawyerTransactionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            lawyer_profile = LawyerProfile.objects.get(user=request.user)

            status_filter = request.GET.get('status')
            search = request.GET.get('search', '')

            transactions = Transaction.objects.filter(lawyer=lawyer_profile)

            if status_filter and status_filter != 'all':
                transactions = transactions.filter(status=status_filter)

            if search:
                transactions = transactions.filter(
                    Q(user__full_name__icontains=search) |
                    Q(id__icontains=search) |
                    Q(description__icontains=search)
                )

            transactions = transactions.order_by('-timestamp')
            serializer = TransactionSerializer(transactions, many=True)

            return Response({'transactions': serializer.data}, status=status.HTTP_200_OK)

        except LawyerProfile.DoesNotExist:
            return Response({'error': 'Lawyer profile not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': f'An error occurred: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class LawyerPaymentStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            lawyer_profile = LawyerProfile.objects.get(user=request.user)
            transactions = Transaction.objects.filter(lawyer=lawyer_profile)

            stats = {
                'total_transactions': transactions.count(),
                'completed_count': transactions.filter(status='completed').count(),
                'pending_count': transactions.filter(status='pending').count(),
                'failed_count': transactions.filter(status='failed').count(),
                'refunded_count': transactions.filter(status='refunded').count(),
                'total_earnings': transactions.filter(status='completed').aggregate(total=Sum('amount'))['total'] or 0,
                'pending_amount': transactions.filter(status='pending').aggregate(total=Sum('amount'))['total'] or 0,
            }

            return Response(stats, status=status.HTTP_200_OK)

        except LawyerProfile.DoesNotExist:
            return Response({'error': 'Lawyer profile not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': f'An error occurred: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UpdateTransactionStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, transaction_id):
        try:
            transaction = get_object_or_404(Transaction, pk=transaction_id)
            new_status = request.data.get('status')

            if new_status not in ['pending', 'completed', 'failed', 'refunded']:
                return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)

            transaction.status = new_status
            if new_status == 'completed' and not transaction.paid_at:
                transaction.paid_at = timezone.now()
            transaction.save()

            serializer = TransactionSerializer(transaction)
            return Response({'message': 'Transaction status updated successfully', 'transaction': serializer.data}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': f'An error occurred: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                   
        
class ClientPaymentRequestsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            client_profile = GeneralUserProfile.objects.get(user=request.user)

            status_filter = request.GET.get('status')
            transactions = Transaction.objects.filter(user=client_profile)

            if status_filter and status_filter != 'all':
                transactions = transactions.filter(status=status_filter)

            transactions = transactions.order_by('-timestamp')

            serialized_transactions = []
            for transaction in transactions:
                serialized_transactions.append({
                    'id': transaction.id,
                    'amount': float(transaction.amount),
                    'status': transaction.status,
                    'description': transaction.description,
                    'timestamp': transaction.timestamp.isoformat(),
                    'paid_at': transaction.paid_at.isoformat() if transaction.paid_at else None,
                    'lawyer': {
                        'id': transaction.lawyer.id,
                        'full_name': transaction.lawyer.full_name,
                        'email': transaction.lawyer.user.email,
                        'specialization': transaction.lawyer.specialization,
                    }
                })

            return Response({'payment_requests': serialized_transactions}, status=status.HTTP_200_OK)

        except GeneralUserProfile.DoesNotExist:
            return Response({'error': 'Client profile not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': f'An error occurred: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
 

class ProcessPaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, id):
        try:
            client_profile = GeneralUserProfile.objects.get(user=request.user)
            transaction = get_object_or_404(Transaction, id=id, user=client_profile)

            if transaction.status != 'pending':
                return Response({'error': 'Transaction is not in pending status'}, status=status.HTTP_400_BAD_REQUEST)

            transaction.status = 'completed'
            transaction.paid_at = timezone.now()
            transaction.save()

            serializer = TransactionSerializer(transaction)
            return Response({'message': 'Payment processed successfully', 'transaction': serializer.data}, status=status.HTTP_200_OK)

        except GeneralUserProfile.DoesNotExist:
            return Response({'error': 'Client profile not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': f'Payment processing failed: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ClientPaymentStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            client_profile = GeneralUserProfile.objects.get(user=request.user)
            transactions = Transaction.objects.filter(user=client_profile)

            stats = {
                'total_requests': transactions.count(),
                'completed_count': transactions.filter(status='completed').count(),
                'pending_count': transactions.filter(status='pending').count(),
                'failed_count': transactions.filter(status='failed').count(),
                'total_paid': transactions.filter(status='completed').aggregate(total=Sum('amount'))['total'] or 0,
                'total_pending': transactions.filter(status='pending').aggregate(total=Sum('amount'))['total'] or 0,
            }

            return Response(stats, status=status.HTTP_200_OK)

        except GeneralUserProfile.DoesNotExist:
            return Response({'error': 'Client profile not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': f'An error occurred: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
