#!/bin/bash

set -e

NAMESPACE="medvault"

echo "========================================="
echo "       MEDVAULT KUBERNETES DEPLOYMENT"
echo "========================================="

echo
echo "1. Creating Namespace..."
kubectl apply -f namespace.yaml
sleep 3

echo
echo "2. Creating Secret..."
kubectl apply -f secret.yaml
sleep 3

echo
echo "3. Creating ConfigMap..."
kubectl apply -f configmap.yaml
sleep 3

echo
echo "4. Creating MongoDB PVC..."
kubectl apply -f mongodb-pvc.yaml
sleep 3

echo
echo "5. Creating MongoDB StatefulSet..."
kubectl apply -f mongodb-statefulset.yaml
sleep 5

echo
echo "6. Creating MongoDB Service..."
kubectl apply -f mongodb-service.yaml
sleep 3

echo
echo "7. Creating Backend Deployment..."
kubectl apply -f backend-deployment.yaml
sleep 5

echo
echo "8. Creating Backend Service..."
kubectl apply -f backend-service.yaml
sleep 3

echo
echo "9. Creating Frontend Deployment..."
kubectl apply -f frontend-deployment.yaml
sleep 5

echo
echo "10. Creating Frontend Service..."
kubectl apply -f frontend-service.yaml
sleep 5

echo
echo "11. Creating Ingress..."
kubectl apply -f ingress.yaml
sleep 5

echo
echo "========================================="
echo "       WAITING FOR APPLICATION"
echo "========================================="

echo
echo "Waiting for MongoDB..."
kubectl rollout status statefulset/mongodb \
  -n $NAMESPACE \
  --timeout=180s

echo
echo "Waiting for Backend..."
kubectl rollout status deployment/backend \
  -n $NAMESPACE \
  --timeout=180s

echo
echo "Waiting for Frontend..."
kubectl rollout status deployment/frontend \
  -n $NAMESPACE \
  --timeout=180s

echo
echo "========================================="
echo "       WAITING FOR INGRESS"
echo "========================================="

echo
echo "Checking NGINX Ingress Controller..."

if kubectl get namespace ingress-nginx >/dev/null 2>&1; then

    kubectl wait \
      --namespace ingress-nginx \
      --for=condition=Ready pod \
      --selector=app.kubernetes.io/component=controller \
      --timeout=180s || true

else

    echo
    echo "WARNING: ingress-nginx namespace not found."
    echo "Install NGINX Ingress Controller first."
    echo

fi

echo
echo "Waiting for LoadBalancer address..."

URL=""

for i in {1..60}
do

    ADDRESS=$(kubectl get ingress medvault-ingress \
      -n $NAMESPACE \
      -o jsonpath='{.status.loadBalancer.ingress[0].hostname}' 2>/dev/null || true)

    if [ -z "$ADDRESS" ]; then
        ADDRESS=$(kubectl get ingress medvault-ingress \
          -n $NAMESPACE \
          -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || true)
    fi

    if [ -n "$ADDRESS" ]; then
        URL="http://$ADDRESS"
        break
    fi

    echo "Waiting for LoadBalancer... ($i/60)"
    sleep 5

done

echo
echo "========================================="
echo "          MEDVAULT STATUS"
echo "========================================="

echo
echo "Pods:"
kubectl get pods -n $NAMESPACE

echo
echo "Services:"
kubectl get svc -n $NAMESPACE

echo
echo "PVC:"
kubectl get pvc -n $NAMESPACE

echo
echo "Ingress:"
kubectl get ingress -n $NAMESPACE

echo
echo "========================================="

if [ -n "$URL" ]; then

    echo
    echo "        MEDVAULT APPLICATION URL"
    echo
    echo "        $URL"
    echo
    echo "========================================="
    echo
    echo "Open this URL in your browser:"
    echo
    echo "$URL"
    echo

else

    echo
    echo "LoadBalancer URL is not available yet."
    echo
    echo "Run:"
    echo "kubectl get ingress -n $NAMESPACE"
    echo
    echo "and wait for ADDRESS."
    echo

fi

echo "========================================="
