#!/bin/bash

KEY_ID=$(aws ssm get-parameters --profile $1 --region $2 --names "/prifina/aws_key_id" --query 'Parameters[0].Value' --output text)

KEY_ACCESS=$(aws ssm get-parameters --profile $1 --region $2 --names "/prifina/aws_secret_key" --query 'Parameters[0].Value' --output text)

REGION=$(aws ssm get-parameters --profile $1 --region $2 --names "/prifina/region" --query 'Parameters[0].Value' --output text)

echo $REGION

export AWS_ACCESS_KEY_ID=$KEY_ID
export AWS_SECRET_ACCESS_KEY=$KEY_ACCESS
export AWS_DEFAULT_REGION=$REGION

# prifina source user...
export userID=4ffab59558a21401b6c1e9e560da28e3fd4a

# prifina test user...
export testUserID = x4ffab59558a21401b6c1e9e560da28e3fd4a