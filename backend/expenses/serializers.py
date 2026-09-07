from rest_framework import serializers


class CategorySerializer(serializers.Serializer):

    id = serializers.CharField(read_only=True)
    name = serializers.CharField(max_length=100)


class TransactionSerializer(serializers.Serializer):

    id = serializers.CharField(read_only=True)
    user = serializers.CharField(read_only=True)

    title = serializers.CharField(max_length=200)
    amount = serializers.FloatField()
    transaction_type = serializers.CharField(max_length=10)

    category = serializers.CharField(
        allow_null=True,
        required=False
    )

    description = serializers.CharField(
        required=False,
        allow_blank=True
    )

    date = serializers.DateField()

    created_at = serializers.CharField(
        read_only=True
    )